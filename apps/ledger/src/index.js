// B4ES Ledger Worker.
//
// Every request is checked against Cloudflare Access before anything is
// served. The API lives under /api/; everything else is the app shell from
// ./public. Posting rules are enforced twice: here (for friendly errors) and
// by database triggers (so nothing can bypass them).

import { verifyAccess } from "./auth.js";
import { chartTemplate } from "./coa.js";
import { trialBalance, profitAndLoss, balanceSheet, cashFlow, fyStartFor, dayBefore } from "./reports.js";

/* ------------------------------------------------------------------ utils */

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

function withHeaders(res, extra = {}) {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...extra })) h.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

const json = (data, status = 200) =>
  withHeaders(new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } }), {
    "Cache-Control": "no-store",
  });

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const bad = (msg) => new HttpError(422, msg);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);
function isDate(s) {
  if (!ISO.test(s || "")) return false;
  const d = new Date(s + "T00:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
}

// Monotonic-ish ULID (time-sortable ids for journals).
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function ulid() {
  let t = Date.now();
  let time = "";
  for (let i = 0; i < 10; i++) {
    time = B32[t % 32] + time;
    t = Math.floor(t / 32);
  }
  const rnd = crypto.getRandomValues(new Uint8Array(16));
  let r = "";
  for (let i = 0; i < 16; i++) r += B32[rnd[i] % 32];
  return time + r;
}

function dbMessage(e) {
  const m = String(e && e.message ? e.message : e);
  const i = m.indexOf("ledger:");
  if (i >= 0) return m.slice(i + 7).trim().replace(/:\s*SQLITE_CONSTRAINT.*$/, "");
  if (m.includes("UNIQUE constraint failed: accounts.entity_id, accounts.code")) return "That account code is already used";
  if (m.includes("UNIQUE constraint failed: journals.entity_id, journals.number")) return "Two entries were posted at once; please try again";
  if (m.includes("UNIQUE constraint failed: fiscal_years")) return "A financial year already starts on that date";
  if (m.includes("UNIQUE constraint failed: contacts")) return "A contact with that name already exists";
  return null;
}

async function body(request) {
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("application/json")) throw new HttpError(415, "Expected JSON");
  try {
    return await request.json();
  } catch {
    throw bad("Invalid JSON");
  }
}

const int = (v) => (v === undefined || v === null || v === "" ? null : Number.isSafeInteger(Number(v)) ? Number(v) : NaN);

/* ------------------------------------------------------------------- pages */

function setupPendingPage() {
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B4ES Ledger</title><link rel="stylesheet" href="/app.css"></head>
<body class="gate"><main class="gate-card"><img src="/icons/icon-192.png" alt="" width="64" height="64"><h1>B4ES Ledger</h1><p>This private app is locked while its sign-in is being set up.</p><p class="muted">If you are a B4ES partner, ask the admin to finish the Cloudflare Access set-up.</p></main></body></html>`;
  return withHeaders(new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }));
}

function deniedPage(status, message) {
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B4ES Ledger</title><link rel="stylesheet" href="/app.css"></head>
<body class="gate"><main class="gate-card"><h1>Access denied</h1><p>${message}</p><p><a href="/cdn-cgi/access/logout">Sign out</a></p></main></body></html>`;
  return withHeaders(new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }));
}

// Files that may load before sign-in so the gate pages can render.
const PUBLIC_FILES = new Set(["/app.css", "/icons/icon-192.png", "/favicon.svg"]);

/* ------------------------------------------------------------------ worker */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isApi = url.pathname.startsWith("/api/");

    if (!isApi && PUBLIC_FILES.has(url.pathname)) {
      return withHeaders(await env.ASSETS.fetch(request), { "Cache-Control": "public, max-age=3600" });
    }

    // ---- identity
    let email;
    const local = (url.hostname === "localhost" || url.hostname === "127.0.0.1") && env.DEV_EMAIL;
    if (local) {
      email = String(env.DEV_EMAIL).toLowerCase();
    } else {
      if (!env.TEAM_DOMAIN || !env.POLICY_AUD) {
        return isApi ? json({ error: "The ledger's sign-in is not set up yet" }, 503) : setupPendingPage();
      }
      try {
        ({ email } = await verifyAccess(request, env.TEAM_DOMAIN, env.POLICY_AUD));
      } catch (e) {
        return isApi ? json({ error: "Not signed in" }, 401) : deniedPage(401, "You are not signed in to the B4ES Ledger.");
      }
    }

    let me;
    try {
      me = await principalFor(env, email);
    } catch (e) {
      return isApi ? json({ error: "Could not load your account" }, 500) : deniedPage(500, "Could not load your account.");
    }
    if (!me.active) return isApi ? json({ error: "Your access has been switched off" }, 403) : deniedPage(403, "Your access to the ledger has been switched off by an admin.");

    if (!isApi) {
      const res = await env.ASSETS.fetch(request);
      const noStore = url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname === "/sw.js";
      return withHeaders(res, noStore ? { "Cache-Control": "no-store" } : { "Cache-Control": "private, max-age=300" });
    }

    // ---- API
    try {
      if (request.method !== "GET") {
        // Cross-site request forgery guard: writes must come from this origin.
        const origin = request.headers.get("Origin");
        if (origin !== url.origin) throw new HttpError(403, "Cross-origin request refused");
        if (me.role === "viewer" && !(url.pathname === "/api/me" && request.method === "PATCH")) {
          throw new HttpError(403, "Your role is view-only");
        }
      }
      return await route(request, env, url, me);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      const friendly = dbMessage(e);
      if (friendly) return json({ error: friendly }, 422);
      console.error("ledger error", e && e.stack ? e.stack : e);
      return json({ error: "Something went wrong" }, 500);
    }
  },
};

async function principalFor(env, email) {
  const now = new Date().toISOString();
  let p = await env.DB.prepare("SELECT * FROM principals WHERE email = ?").bind(email).first();
  if (!p) {
    const admins = String(env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM principals WHERE role <> 'agent'").first();
    // The first person ever, or anyone listed in ADMIN_EMAILS, becomes admin.
    const role = admins.includes(email) || !count || count.n === 0 ? "admin" : "partner";
    await env.DB.batch([
      env.DB.prepare("INSERT OR IGNORE INTO principals (email, role, display_name, last_seen_at) VALUES (?, ?, ?, ?)").bind(
        email,
        role,
        email.split("@")[0],
        now
      ),
      env.DB.prepare(
        "INSERT INTO audit_log (principal_id, action, object_type, object_id, detail_json) SELECT id, 'principal.first_sign_in', 'principal', id, json_object('email', email, 'role', role) FROM principals WHERE email = ?"
      ).bind(email),
    ]);
    p = await env.DB.prepare("SELECT * FROM principals WHERE email = ?").bind(email).first();
  } else if (!p.last_seen_at || now.slice(0, 13) !== String(p.last_seen_at).slice(0, 13)) {
    await env.DB.prepare("UPDATE principals SET last_seen_at = ? WHERE id = ?").bind(now, p.id).run();
  }
  return p;
}

/* ------------------------------------------------------------------ router */

async function route(request, env, url, me) {
  const m = request.method;
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const q = url.searchParams;
  const db = env.DB;

  // /api/me
  if (parts[0] === "me" && parts.length === 1) {
    if (m === "GET") return json(await mePayload(db, me));
    if (m === "PATCH") {
      const b = await body(request);
      const name = String(b.display_name || "").trim().slice(0, 80);
      if (!name) throw bad("Name is required");
      await db.prepare("UPDATE principals SET display_name = ? WHERE id = ?").bind(name, me.id).run();
      return json(await mePayload(db, { ...me, display_name: name }));
    }
  }

  // /api/principals (admin)
  if (parts[0] === "principals") {
    if (m === "GET" && parts.length === 1) {
      const { results } = await db.prepare("SELECT id, email, display_name, role, active, created_at, last_seen_at FROM principals ORDER BY created_at").all();
      return json({ principals: results });
    }
    if (m === "PATCH" && parts.length === 2) {
      requireRole(me, "admin");
      const id = int(parts[1]);
      const b = await body(request);
      const target = await db.prepare("SELECT * FROM principals WHERE id = ?").bind(id).first();
      if (!target) throw new HttpError(404, "Not found");
      const role = b.role ?? target.role;
      const active = b.active === undefined ? target.active : b.active ? 1 : 0;
      if (!["admin", "partner", "viewer"].includes(role)) throw bad("Unknown role");
      if (target.id === me.id && (role !== "admin" || !active)) throw bad("You cannot remove your own admin access");
      await db.batch([
        db.prepare("UPDATE principals SET role = ?, active = ? WHERE id = ?").bind(role, active, id),
        audit(db, me, "principal.update", null, "principal", id, { role, active }),
      ]);
      return json({ ok: true });
    }
  }

  // /api/entities
  if (parts[0] === "entities" && parts.length === 1) {
    if (m === "GET") return json({ entities: await listEntities(db) });
    if (m === "POST") return json(await createEntity(db, me, await body(request)), 201);
  }

  if (parts[0] === "entities" && parts.length >= 2) {
    const entityId = int(parts[1]);
    const entity = await db.prepare("SELECT * FROM entities WHERE id = ?").bind(entityId).first();
    if (!entity) throw new HttpError(404, "Company not found");
    const rest = parts.slice(2);

    if (rest.length === 0) {
      if (m === "GET") return json({ entity });
      if (m === "PATCH") return json(await updateEntity(db, me, entity, await body(request)));
    }

    switch (rest[0]) {
      case "accounts":
        return accountsRoute(request, db, me, entity, rest, q);
      case "contacts":
        return contactsRoute(request, db, me, entity, rest);
      case "journals":
        return journalsRoute(request, db, me, entity, rest, q);
      case "approvals":
        if (m === "GET") return json({ journals: await listJournals(db, entity.id, { status: "pending", limit: 200 }) });
        break;
      case "fiscal-years":
        return fiscalYearsRoute(request, db, me, entity, rest);
      case "reports":
        return reportsRoute(db, entity, rest, q);
      case "audit":
        if (m === "GET") {
          const limit = Math.min(int(q.get("limit")) || 200, 1000);
          const { results } = await db
            .prepare(
              "SELECT a.*, p.email, p.display_name FROM audit_log a LEFT JOIN principals p ON p.id = a.principal_id WHERE a.entity_id = ? OR (a.entity_id IS NULL AND a.object_type = 'principal') ORDER BY a.id DESC LIMIT ?"
            )
            .bind(entity.id, limit)
            .all();
          return json({ audit: results });
        }
        break;
      case "export":
        if (m === "GET") return exportEntity(db, entity);
        break;
    }
  }

  throw new HttpError(404, "Not found");
}

function requireRole(me, role) {
  if (role === "admin" && me.role !== "admin") throw new HttpError(403, "Admins only");
}

function audit(db, me, action, entityId, objectType, objectId, detail) {
  return db
    .prepare("INSERT INTO audit_log (principal_id, action, entity_id, object_type, object_id, detail_json) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(me.id, action, entityId, objectType, objectId === null || objectId === undefined ? null : String(objectId), detail ? JSON.stringify(detail) : null);
}

async function mePayload(db, me) {
  const { results: people } = await db
    .prepare("SELECT id, email, display_name, role FROM principals WHERE active = 1 AND role IN ('admin','partner') ORDER BY display_name")
    .all();
  return {
    me: { id: me.id, email: me.email, display_name: me.display_name, role: me.role },
    partners: people,
    entities: await listEntities(db),
  };
}

/* ---------------------------------------------------------------- entities */

async function listEntities(db) {
  const { results } = await db
    .prepare(
      `SELECT e.*, (SELECT COUNT(*) FROM journals j WHERE j.entity_id = e.id AND j.status = 'pending') AS pending
         FROM entities e WHERE e.status = 'active' ORDER BY e.id`
    )
    .all();
  return results;
}

function validEntity(b, current = {}) {
  const e = {
    name: String(b.name ?? current.name ?? "").trim().slice(0, 120),
    legal_form: b.legal_form ?? current.legal_form ?? "llp",
    company_number: (b.company_number ?? current.company_number ?? "") || null,
    fy_end_month: int(b.fy_end_month ?? current.fy_end_month ?? 12),
    fy_end_day: int(b.fy_end_day ?? current.fy_end_day ?? 31),
    vat_registered: (b.vat_registered ?? current.vat_registered) ? 1 : 0,
    notes: (b.notes ?? current.notes ?? "") || null,
  };
  if (!e.name) throw bad("Company name is required");
  if (!["llp", "ltd", "sole_trader", "partnership", "charity", "other"].includes(e.legal_form)) throw bad("Unknown legal form");
  if (!(e.fy_end_month >= 1 && e.fy_end_month <= 12)) throw bad("Year-end month must be 1 to 12");
  if (!(e.fy_end_day >= 1 && e.fy_end_day <= 31)) throw bad("Year-end day must be 1 to 31");
  if (e.company_number) e.company_number = String(e.company_number).trim().slice(0, 20);
  return e;
}

async function createEntity(db, me, b) {
  const e = validEntity(b);
  const res = await db
    .prepare(
      "INSERT INTO entities (name, legal_form, company_number, fy_end_month, fy_end_day, vat_registered, notes) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id"
    )
    .bind(e.name, e.legal_form, e.company_number, e.fy_end_month, e.fy_end_day, e.vat_registered, e.notes)
    .first();
  const id = res.id;
  const stmts = [audit(db, me, "entity.create", id, "entity", id, e)];

  // Optional first financial year.
  const fyStart = b.first_year_start && isDate(b.first_year_start) ? b.first_year_start : null;
  const fyEnd = b.first_year_end && isDate(b.first_year_end) ? b.first_year_end : null;
  if (fyStart && fyEnd) {
    if (fyEnd < fyStart) throw bad("The first year cannot end before it starts");
    stmts.push(db.prepare("INSERT INTO fiscal_years (entity_id, start_date, end_date) VALUES (?, ?, ?)").bind(id, fyStart, fyEnd));
  }
  if (b.template !== false) stmts.push(...seedChart(db, id, e.legal_form), audit(db, me, "accounts.template", id, "entity", id, { legal_form: e.legal_form }));
  await db.batch(stmts);
  return { entity: await db.prepare("SELECT * FROM entities WHERE id = ?").bind(id).first() };
}

function seedChart(db, entityId, legalForm) {
  return chartTemplate(legalForm).map((a) =>
    db
      .prepare(
        "INSERT OR IGNORE INTO accounts (entity_id, code, name, type, subtype, fs_line, cf_class, is_bank) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(entityId, a.code, a.name, a.type, a.subtype, a.fs_line, a.cf_class, a.is_bank)
  );
}

async function updateEntity(db, me, entity, b) {
  const e = validEntity(b, entity);
  const status = b.status === "archived" ? "archived" : "active";
  if (status === "archived") requireRole(me, "admin");
  await db.batch([
    db
      .prepare(
        "UPDATE entities SET name=?, legal_form=?, company_number=?, fy_end_month=?, fy_end_day=?, vat_registered=?, notes=?, status=? WHERE id=?"
      )
      .bind(e.name, e.legal_form, e.company_number, e.fy_end_month, e.fy_end_day, e.vat_registered, e.notes, status, entity.id),
    audit(db, me, "entity.update", entity.id, "entity", entity.id, { ...e, status }),
  ]);
  return { entity: await db.prepare("SELECT * FROM entities WHERE id = ?").bind(entity.id).first() };
}

/* ---------------------------------------------------------------- accounts */

const TYPES = ["asset", "liability", "equity", "income", "expense"];
const CF = [null, "cash", "working_capital", "non_cash", "investing", "financing"];

async function accountsRoute(request, db, me, entity, rest, q) {
  const m = request.method;
  if (rest.length === 1 && m === "GET") {
    const asOf = isDate(q.get("asOf")) ? q.get("asOf") : today();
    const { results } = await db
      .prepare(
        `SELECT a.*,
                COALESCE((SELECT SUM(l.debit_p) - SUM(l.credit_p) FROM journal_lines l JOIN journals j ON j.id = l.journal_id
                           WHERE l.account_id = a.id AND j.status = 'posted' AND j.date <= ?), 0) AS balance_p,
                (SELECT COUNT(*) FROM journal_lines l WHERE l.account_id = a.id) AS line_count
           FROM accounts a WHERE a.entity_id = ? ORDER BY a.code`
      )
      .bind(asOf, entity.id)
      .all();
    return json({ accounts: results, asOf });
  }
  if (rest.length === 2 && rest[1] === "template" && m === "POST") {
    await db.batch([...seedChart(db, entity.id, entity.legal_form), audit(db, me, "accounts.template", entity.id, "entity", entity.id, {})]);
    return json({ ok: true });
  }
  if (rest.length === 1 && m === "POST") {
    const a = validAccount(await body(request));
    const r = await db
      .prepare(
        "INSERT INTO accounts (entity_id, code, name, type, subtype, fs_line, cf_class, is_bank) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id"
      )
      .bind(entity.id, a.code, a.name, a.type, a.subtype, a.fs_line, a.cf_class, a.is_bank)
      .first();
    await audit(db, me, "account.create", entity.id, "account", r.id, a).run();
    return json({ id: r.id }, 201);
  }
  if (rest.length === 2 && m === "PATCH") {
    const id = int(rest[1]);
    const cur = await db.prepare("SELECT * FROM accounts WHERE id = ? AND entity_id = ?").bind(id, entity.id).first();
    if (!cur) throw new HttpError(404, "Account not found");
    const b = await body(request);
    const a = validAccount({ ...cur, ...b });
    const active = b.active === undefined ? cur.active : b.active ? 1 : 0;
    await db.batch([
      db
        .prepare("UPDATE accounts SET code=?, name=?, type=?, subtype=?, fs_line=?, cf_class=?, is_bank=?, active=? WHERE id=?")
        .bind(a.code, a.name, a.type, a.subtype, a.fs_line, a.cf_class, a.is_bank, active, id),
      audit(db, me, "account.update", entity.id, "account", id, { before: cur, after: { ...a, active } }),
    ]);
    return json({ ok: true });
  }
  throw new HttpError(404, "Not found");
}

function validAccount(b) {
  const a = {
    code: String(b.code || "").trim().slice(0, 12),
    name: String(b.name || "").trim().slice(0, 120),
    type: b.type,
    subtype: (b.subtype || "").trim() || null,
    fs_line: (b.fs_line || "").trim() || null,
    cf_class: b.cf_class || null,
    is_bank: b.is_bank ? 1 : 0,
  };
  if (!/^[A-Za-z0-9._-]{1,12}$/.test(a.code)) throw bad("Account code: letters, numbers, dot, dash (max 12)");
  if (!a.name) throw bad("Account name is required");
  if (!TYPES.includes(a.type)) throw bad("Account type must be asset, liability, equity, income or expense");
  if (!CF.includes(a.cf_class)) throw bad("Unknown cash-flow class");
  if ((a.type === "income" || a.type === "expense") && a.cf_class) a.cf_class = null;
  if (a.is_bank) a.cf_class = "cash";
  return a;
}

/* ---------------------------------------------------------------- contacts */

async function contactsRoute(request, db, me, entity, rest) {
  const m = request.method;
  if (rest.length === 1 && m === "GET") {
    const { results } = await db.prepare("SELECT * FROM contacts WHERE entity_id = ? ORDER BY name").bind(entity.id).all();
    return json({ contacts: results });
  }
  if (rest.length === 1 && m === "POST") {
    const b = await body(request);
    const name = String(b.name || "").trim().slice(0, 120);
    const kind = ["customer", "supplier", "member", "employee", "other"].includes(b.kind) ? b.kind : "other";
    if (!name) throw bad("Contact name is required");
    const r = await db.prepare("INSERT INTO contacts (entity_id, name, kind) VALUES (?, ?, ?) RETURNING id").bind(entity.id, name, kind).first();
    await audit(db, me, "contact.create", entity.id, "contact", r.id, { name, kind }).run();
    return json({ id: r.id }, 201);
  }
  throw new HttpError(404, "Not found");
}

/* ---------------------------------------------------------------- journals */

async function listJournals(db, entityId, { status, from, to, account, q, limit = 100, offset = 0 } = {}) {
  const where = ["j.entity_id = ?"];
  const args = [entityId];
  if (status) {
    where.push("j.status = ?");
    args.push(status);
  }
  if (from) {
    where.push("j.date >= ?");
    args.push(from);
  }
  if (to) {
    where.push("j.date <= ?");
    args.push(to);
  }
  if (account) {
    where.push("EXISTS (SELECT 1 FROM journal_lines l WHERE l.journal_id = j.id AND l.account_id = ?)");
    args.push(account);
  }
  if (q) {
    where.push("(j.narrative LIKE ? OR j.reference LIKE ? OR CAST(j.number AS TEXT) = ?)");
    args.push(`%${q}%`, `%${q}%`, q);
  }
  args.push(limit, offset);
  const { results } = await db
    .prepare(
      `SELECT j.id, j.number, j.date, j.reference, j.narrative, j.status, j.source, j.total_p, j.requires_second,
              j.created_at, j.reversal_of, j.reversed_by, j.requested_approver_id,
              c.display_name AS created_by_name, c.email AS created_by_email, j.created_by
         FROM journals j JOIN principals c ON c.id = j.created_by
        WHERE ${where.join(" AND ")}
        ORDER BY j.date DESC, j.created_at DESC LIMIT ? OFFSET ?`
    )
    .bind(...args)
    .all();
  return results;
}

async function getJournal(db, entityId, id) {
  const j = await db
    .prepare(
      `SELECT j.*, c.display_name AS created_by_name, c.email AS created_by_email,
              d.display_name AS decided_by_name, p.display_name AS posted_by_name, r.display_name AS requested_approver_name
         FROM journals j
         JOIN principals c ON c.id = j.created_by
    LEFT JOIN principals d ON d.id = j.decided_by
    LEFT JOIN principals p ON p.id = j.posted_by
    LEFT JOIN principals r ON r.id = j.requested_approver_id
        WHERE j.id = ? AND j.entity_id = ?`
    )
    .bind(id, entityId)
    .first();
  if (!j) return null;
  const { results: lines } = await db
    .prepare(
      `SELECT l.*, a.code AS account_code, a.name AS account_name, a.type AS account_type, ct.name AS contact_name
         FROM journal_lines l JOIN accounts a ON a.id = l.account_id LEFT JOIN contacts ct ON ct.id = l.contact_id
        WHERE l.journal_id = ? ORDER BY l.line_no`
    )
    .bind(id)
    .all();
  return { ...j, lines };
}

/** Validates a journal body. Returns cleaned fields and lines. */
async function validJournal(db, entity, b) {
  const date = b.date;
  if (!isDate(date)) throw bad("Enter a valid date");
  const narrative = String(b.narrative || "").trim().slice(0, 500);
  if (!narrative) throw bad("Add a description of the entry");
  const reference = String(b.reference || "").trim().slice(0, 80) || null;
  if (!Array.isArray(b.lines)) throw bad("Add the entry lines");

  const lines = b.lines
    .map((l) => ({
      account_id: int(l.account_id),
      debit_p: int(l.debit_p) || 0,
      credit_p: int(l.credit_p) || 0,
      description: String(l.description || "").trim().slice(0, 300) || null,
      contact_id: int(l.contact_id),
      vat_code: (l.vat_code || "").trim() || null,
    }))
    .filter((l) => l.account_id || l.debit_p || l.credit_p);

  if (lines.length < 2) throw bad("An entry needs at least two lines");
  if (lines.length > 200) throw bad("Too many lines in one entry");
  let dr = 0,
    cr = 0;
  lines.forEach((l, i) => {
    if (!l.account_id) throw bad(`Line ${i + 1}: choose an account`);
    if (!Number.isSafeInteger(l.debit_p) || !Number.isSafeInteger(l.credit_p) || l.debit_p < 0 || l.credit_p < 0)
      throw bad(`Line ${i + 1}: amounts must be positive`);
    if ((l.debit_p > 0) === (l.credit_p > 0)) throw bad(`Line ${i + 1}: enter either a debit or a credit`);
    dr += l.debit_p;
    cr += l.credit_p;
  });
  if (dr !== cr) throw bad(`Debits (${fmt(dr)}) and credits (${fmt(cr)}) must be equal`);

  const ids = [...new Set(lines.map((l) => l.account_id))];
  const { results: accs } = await db
    .prepare(`SELECT id, active FROM accounts WHERE entity_id = ? AND id IN (${ids.map(() => "?").join(",")})`)
    .bind(entity.id, ...ids)
    .all();
  const ok = new Map(accs.map((a) => [a.id, a.active]));
  for (const id of ids) {
    if (!ok.has(id)) throw bad("An account on this entry does not belong to this company");
    if (!ok.get(id)) throw bad("An account on this entry has been deactivated");
  }
  const cids = [...new Set(lines.map((l) => l.contact_id).filter(Boolean))];
  if (cids.length) {
    const { results: cs } = await db
      .prepare(`SELECT id FROM contacts WHERE entity_id = ? AND id IN (${cids.map(() => "?").join(",")})`)
      .bind(entity.id, ...cids)
      .all();
    if (cs.length !== cids.length) throw bad("A contact on this entry does not belong to this company");
  }
  const locked = await db
    .prepare("SELECT 1 FROM fiscal_years WHERE entity_id = ? AND status = 'locked' AND ? BETWEEN start_date AND end_date")
    .bind(entity.id, date)
    .first();
  if (locked) throw bad("That date is in a locked financial year");

  return { date, narrative, reference, lines, total_p: dr };
}

function fmt(p) {
  const s = (Math.abs(p) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (p < 0 ? "-£" : "£") + s;
}

function lineStmts(db, journalId, lines) {
  return lines.map((l, i) =>
    db
      .prepare(
        "INSERT INTO journal_lines (journal_id, line_no, account_id, contact_id, description, debit_p, credit_p, vat_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(journalId, i + 1, l.account_id, l.contact_id, l.description, l.debit_p, l.credit_p, l.vat_code)
  );
}

function postStmt(db, entityId, journalId, me, approval = null) {
  // The number is assigned inside the same statement that posts, so numbers
  // stay gap-free; the UNIQUE constraint catches a simultaneous post.
  const now = new Date().toISOString();
  if (approval) {
    return db
      .prepare(
        `UPDATE journals SET status = 'posted',
                number = (SELECT COALESCE(MAX(number), 0) + 1 FROM journals WHERE entity_id = ?),
                posted_by = ?, posted_at = ?, updated_at = ?, decided_by = ?, decided_at = ?, decision_note = ?
          WHERE id = ?`
      )
      .bind(entityId, me.id, now, now, me.id, now, approval.note, journalId);
  }
  return db
    .prepare(
      `UPDATE journals SET status = 'posted',
              number = (SELECT COALESCE(MAX(number), 0) + 1 FROM journals WHERE entity_id = ?),
              posted_by = ?, posted_at = ?, updated_at = ?
        WHERE id = ?`
    )
    .bind(entityId, me.id, now, now, journalId);
}

async function journalsRoute(request, db, me, entity, rest, q) {
  const m = request.method;
  const now = new Date().toISOString();

  if (rest.length === 1 && m === "GET") {
    const journals = await listJournals(db, entity.id, {
      status: ["draft", "pending", "posted", "rejected"].includes(q.get("status")) ? q.get("status") : null,
      from: isDate(q.get("from")) ? q.get("from") : null,
      to: isDate(q.get("to")) ? q.get("to") : null,
      account: int(q.get("account")) || null,
      q: (q.get("q") || "").trim().slice(0, 80) || null,
      limit: Math.min(int(q.get("limit")) || 100, 500),
      offset: Math.max(int(q.get("offset")) || 0, 0),
    });
    return json({ journals });
  }

  // Create: action = draft | post | submit
  if (rest.length === 1 && m === "POST") {
    const b = await body(request);
    const action = b.action || "draft";
    if (!["draft", "post", "submit"].includes(action)) throw bad("Unknown action");
    const j = await validJournal(db, entity, b);
    const id = ulid();
    const approver = action === "submit" ? await validApprover(db, me, b.approver_id) : null;
    const status = action === "submit" ? "pending" : "draft";
    const source = ["manual", "quick", "opening"].includes(b.source) ? b.source : "manual";
    const stmts = [
      db
        .prepare(
          `INSERT INTO journals (id, entity_id, date, reference, narrative, status, source, requires_second, requested_approver_id, total_p, created_by, submitted_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(id, entity.id, j.date, j.reference, j.narrative, status, source, action === "submit" ? 1 : 0, approver, j.total_p, me.id, action === "submit" ? now : null),
      ...lineStmts(db, id, j.lines),
    ];
    if (action === "post") stmts.push(postStmt(db, entity.id, id, me));
    stmts.push(audit(db, me, `journal.${action === "post" ? "post" : action === "submit" ? "submit" : "draft"}`, entity.id, "journal", id, { date: j.date, total_p: j.total_p }));
    await db.batch(stmts);
    return json({ journal: await getJournal(db, entity.id, id) }, 201);
  }

  const id = rest[1];
  const cur = id ? await db.prepare("SELECT * FROM journals WHERE id = ? AND entity_id = ?").bind(id, entity.id).first() : null;
  if (rest.length >= 2 && !cur) throw new HttpError(404, "Entry not found");

  if (rest.length === 2 && m === "GET") return json({ journal: await getJournal(db, entity.id, id) });

  // Edit a draft, pending or rejected entry (creator or admin).
  if (rest.length === 2 && m === "PUT") {
    if (cur.status === "posted") throw bad("Posted entries cannot be edited; reverse it instead");
    if (cur.created_by !== me.id && me.role !== "admin") throw new HttpError(403, "Only the person who made this entry can edit it");
    const b = await body(request);
    const action = b.action || "draft";
    if (!["draft", "post", "submit"].includes(action)) throw bad("Unknown action");
    if (action === "post" && cur.status === "rejected") throw bad("A rejected entry must be sent for approval again");
    const j = await validJournal(db, entity, b);
    const approver = action === "submit" ? await validApprover(db, me, b.approver_id) : null;
    const stmts = [
      // Back to draft while the lines are replaced.
      db
        .prepare(
          `UPDATE journals SET date=?, reference=?, narrative=?, total_p=?, status='draft', requires_second=?, requested_approver_id=?,
                  submitted_at=?, decided_by=NULL, decided_at=NULL, decision_note=NULL, updated_at=? WHERE id=?`
        )
        .bind(j.date, j.reference, j.narrative, j.total_p, action === "submit" ? 1 : 0, approver, action === "submit" ? now : null, now, id),
      db.prepare("DELETE FROM journal_lines WHERE journal_id = ?").bind(id),
      ...lineStmts(db, id, j.lines),
    ];
    if (action === "submit") stmts.push(db.prepare("UPDATE journals SET status='pending' WHERE id=?").bind(id));
    if (action === "post") stmts.push(postStmt(db, entity.id, id, me));
    stmts.push(audit(db, me, `journal.edit.${action}`, entity.id, "journal", id, { date: j.date, total_p: j.total_p }));
    await db.batch(stmts);
    return json({ journal: await getJournal(db, entity.id, id) });
  }

  if (rest.length === 2 && m === "DELETE") {
    if (!["draft", "rejected"].includes(cur.status)) throw bad("Only drafts and rejected entries can be deleted");
    if (cur.created_by !== me.id && me.role !== "admin") throw new HttpError(403, "Only the person who made this entry can delete it");
    await db.batch([
      db.prepare("DELETE FROM journal_lines WHERE journal_id = ?").bind(id),
      db.prepare("DELETE FROM journals WHERE id = ?").bind(id),
      audit(db, me, "journal.delete", entity.id, "journal", id, { status: cur.status, total_p: cur.total_p }),
    ]);
    return json({ ok: true });
  }

  if (rest.length === 3 && m === "POST") {
    const action = rest[2];
    const b = request.headers.get("Content-Type")?.includes("json") ? await body(request) : {};
    const note = String(b.note || "").trim().slice(0, 500) || null;

    if (action === "post") {
      if (cur.status !== "draft") throw bad("Only drafts can be posted");
      if (cur.requires_second) throw bad("This entry needs a second approval");
      if (cur.created_by !== me.id && me.role !== "admin") throw new HttpError(403, "Only the person who made this entry can post it");
      await db.batch([postStmt(db, entity.id, id, me), audit(db, me, "journal.post", entity.id, "journal", id, {})]);
      return json({ journal: await getJournal(db, entity.id, id) });
    }

    if (action === "submit") {
      if (cur.status !== "draft") throw bad("Only drafts can be sent for approval");
      const approver = await validApprover(db, me, b.approver_id);
      await db.batch([
        db.prepare("UPDATE journals SET status='pending', requires_second=1, requested_approver_id=?, submitted_at=?, updated_at=? WHERE id=?").bind(approver, now, now, id),
        audit(db, me, "journal.submit", entity.id, "journal", id, { approver }),
      ]);
      return json({ journal: await getJournal(db, entity.id, id) });
    }

    if (action === "withdraw") {
      if (cur.status !== "pending") throw bad("Only entries awaiting approval can be withdrawn");
      if (cur.created_by !== me.id && me.role !== "admin") throw new HttpError(403, "Only the person who made this entry can withdraw it");
      await db.batch([
        db.prepare("UPDATE journals SET status='draft', updated_at=? WHERE id=?").bind(now, id),
        audit(db, me, "journal.withdraw", entity.id, "journal", id, {}),
      ]);
      return json({ journal: await getJournal(db, entity.id, id) });
    }

    if (action === "approve" || action === "reject") {
      if (cur.status !== "pending") throw bad("This entry is not awaiting approval");
      if (cur.created_by === me.id) throw bad("A second approval must be by a different partner");
      if (action === "approve") {
        await db.batch([
          postStmt(db, entity.id, id, me, { note }),
          audit(db, me, "journal.approve", entity.id, "journal", id, { note }),
        ]);
      } else {
        if (!note) throw bad("Say why the entry is rejected");
        await db.batch([
          db.prepare("UPDATE journals SET status='rejected', decided_by=?, decided_at=?, decision_note=?, updated_at=? WHERE id=?").bind(me.id, now, note, now, id),
          audit(db, me, "journal.reject", entity.id, "journal", id, { note }),
        ]);
      }
      return json({ journal: await getJournal(db, entity.id, id) });
    }

    if (action === "reverse") {
      if (cur.status !== "posted") throw bad("Only posted entries can be reversed");
      if (cur.reversed_by) throw bad("This entry has already been reversed");
      const date = isDate(b.date) ? b.date : today();
      if (date < cur.date) throw bad("A reversal cannot be dated before the original entry");
      const locked = await db
        .prepare("SELECT 1 FROM fiscal_years WHERE entity_id = ? AND status = 'locked' AND ? BETWEEN start_date AND end_date")
        .bind(entity.id, date)
        .first();
      if (locked) throw bad("That date is in a locked financial year");
      const { results: lines } = await db.prepare("SELECT * FROM journal_lines WHERE journal_id = ? ORDER BY line_no").bind(id).all();
      const rid = ulid();
      const swapped = lines.map((l) => ({ ...l, debit_p: l.credit_p, credit_p: l.debit_p, description: l.description }));
      await db.batch([
        db
          .prepare(
            `INSERT INTO journals (id, entity_id, date, reference, narrative, status, source, total_p, created_by, reversal_of)
             VALUES (?, ?, ?, ?, ?, 'draft', 'reversal', ?, ?, ?)`
          )
          .bind(rid, entity.id, date, cur.reference, `Reversal of entry #${cur.number}: ${cur.narrative}`.slice(0, 500) + (note ? ` (${note})`.slice(0, 200) : ""), cur.total_p, me.id, id),
        ...lineStmts(db, rid, swapped),
        postStmt(db, entity.id, rid, me),
        db.prepare("UPDATE journals SET reversed_by = ? WHERE id = ?").bind(rid, id),
        audit(db, me, "journal.reverse", entity.id, "journal", id, { reversal: rid, date, note }),
      ]);
      return json({ journal: await getJournal(db, entity.id, rid) });
    }
  }

  throw new HttpError(404, "Not found");
}

async function validApprover(db, me, approverId) {
  const id = int(approverId);
  if (!id) return null; // any other partner
  if (id === me.id) throw bad("Choose a different partner as the approver");
  const p = await db.prepare("SELECT id FROM principals WHERE id = ? AND active = 1 AND role IN ('admin','partner')").bind(id).first();
  if (!p) throw bad("That approver is not an active partner");
  return id;
}

/* ------------------------------------------------------------ fiscal years */

async function fiscalYearsRoute(request, db, me, entity, rest) {
  const m = request.method;
  if (rest.length === 1 && m === "GET") {
    const { results } = await db
      .prepare(
        `SELECT f.*, p.display_name AS locked_by_name,
                (SELECT COUNT(*) FROM journals j WHERE j.entity_id = f.entity_id AND j.status='posted' AND j.date BETWEEN f.start_date AND f.end_date) AS posted
           FROM fiscal_years f LEFT JOIN principals p ON p.id = f.locked_by WHERE f.entity_id = ? ORDER BY f.start_date DESC`
      )
      .bind(entity.id)
      .all();
    return json({ years: results });
  }
  if (rest.length === 1 && m === "POST") {
    const b = await body(request);
    if (!isDate(b.start_date) || !isDate(b.end_date) || b.end_date < b.start_date) throw bad("Enter a valid start and end date");
    const overlap = await db
      .prepare("SELECT 1 FROM fiscal_years WHERE entity_id = ? AND NOT (end_date < ? OR start_date > ?)")
      .bind(entity.id, b.start_date, b.end_date)
      .first();
    if (overlap) throw bad("That overlaps another financial year");
    const r = await db
      .prepare("INSERT INTO fiscal_years (entity_id, start_date, end_date) VALUES (?, ?, ?) RETURNING id")
      .bind(entity.id, b.start_date, b.end_date)
      .first();
    await audit(db, me, "year.create", entity.id, "fiscal_year", r.id, b).run();
    return json({ id: r.id }, 201);
  }
  if (rest.length === 3 && m === "POST" && (rest[2] === "lock" || rest[2] === "unlock")) {
    const id = int(rest[1]);
    const fy = await db.prepare("SELECT * FROM fiscal_years WHERE id = ? AND entity_id = ?").bind(id, entity.id).first();
    if (!fy) throw new HttpError(404, "Year not found");
    if (rest[2] === "unlock") requireRole(me, "admin");
    if (rest[2] === "lock") {
      const pending = await db
        .prepare("SELECT COUNT(*) AS n FROM journals WHERE entity_id = ? AND status IN ('draft','pending') AND date BETWEEN ? AND ?")
        .bind(entity.id, fy.start_date, fy.end_date)
        .first();
      if (pending.n) throw bad(`Finish or delete the ${pending.n} draft or pending entries in this year first`);
      const suspense = await db
        .prepare(
          `SELECT COALESCE(SUM(l.debit_p) - SUM(l.credit_p), 0) AS bal FROM journal_lines l JOIN journals j ON j.id = l.journal_id
            JOIN accounts a ON a.id = l.account_id WHERE a.entity_id = ? AND a.code = '9998' AND j.status = 'posted' AND j.date <= ?`
        )
        .bind(entity.id, fy.end_date)
        .first();
      if (suspense.bal) throw bad(`Clear the suspense account (balance ${fmt(suspense.bal)}) before locking`);
    }
    const locking = rest[2] === "lock";
    await db.batch([
      db
        .prepare("UPDATE fiscal_years SET status = ?, locked_by = ?, locked_at = ? WHERE id = ?")
        .bind(locking ? "locked" : "open", locking ? me.id : null, locking ? new Date().toISOString() : null, id),
      audit(db, me, `year.${rest[2]}`, entity.id, "fiscal_year", id, { start: fy.start_date, end: fy.end_date }),
    ]);
    return json({ ok: true });
  }
  throw new HttpError(404, "Not found");
}

/* ----------------------------------------------------------------- reports */

async function accountsFor(db, entityId) {
  const { results } = await db.prepare("SELECT * FROM accounts WHERE entity_id = ? ORDER BY code").bind(entityId).all();
  return results;
}

async function netMap(db, entityId, { from = null, to }) {
  const args = [entityId, to];
  let sql = `SELECT l.account_id, SUM(l.debit_p) - SUM(l.credit_p) AS net FROM journal_lines l JOIN journals j ON j.id = l.journal_id
              WHERE j.entity_id = ? AND j.status = 'posted' AND j.date <= ?`;
  if (from) {
    sql += " AND j.date >= ?";
    args.push(from);
  }
  sql += " GROUP BY l.account_id";
  const { results } = await db.prepare(sql).bind(...args).all();
  return new Map(results.map((r) => [r.account_id, r.net]));
}

async function reportsRoute(db, entity, rest, q) {
  const kind = rest[1];
  const asOf = isDate(q.get("asOf")) ? q.get("asOf") : today();
  const fyStart = fyStartFor(asOf, entity.fy_end_month, entity.fy_end_day);
  const from = isDate(q.get("from")) ? q.get("from") : fyStartFor(isDate(q.get("to")) ? q.get("to") : today(), entity.fy_end_month, entity.fy_end_day);
  const to = isDate(q.get("to")) ? q.get("to") : today();
  if (from > to) throw bad("The start date is after the end date");
  const accounts = await accountsFor(db, entity.id);
  const lf = entity.legal_form;

  switch (kind) {
    case "trial-balance":
      return json({ asOf, ...trialBalance(accounts, await netMap(db, entity.id, { to: asOf })) });

    case "pnl":
      return json({ from, to, ...profitAndLoss(accounts, await netMap(db, entity.id, { from, to }), { legalForm: lf }) });

    case "balance-sheet": {
      const net = await netMap(db, entity.id, { to: asOf });
      const cy = profitAndLoss(accounts, await netMap(db, entity.id, { from: fyStart, to: asOf }), { legalForm: lf }).profit;
      const prior = profitAndLoss(accounts, await netMap(db, entity.id, { to: dayBefore(fyStart) }), { legalForm: lf }).profit;
      return json({ asOf, fyStart, ...balanceSheet(accounts, net, { profitCY: cy, profitPrior: prior, legalForm: lf }) });
    }

    case "cash-flow": {
      const mv = await netMap(db, entity.id, { from, to });
      const profit = profitAndLoss(accounts, mv, { legalForm: lf }).profit;
      const opening = await netMap(db, entity.id, { to: dayBefore(from) });
      const cashIds = accounts.filter((a) => a.cf_class === "cash" || a.is_bank).map((a) => a.id);
      const openingCash = cashIds.reduce((t, id) => t + (opening.get(id) || 0), 0);
      const cf = cashFlow(accounts, mv, { profit });
      return json({ from, to, openingCash, closingCash: openingCash + cf.cashMovement, ...cf });
    }

    case "ledger": {
      const accountId = int(q.get("account"));
      const acc = accounts.find((a) => a.id === accountId);
      if (!acc) throw bad("Choose an account");
      const opening = await db
        .prepare(
          `SELECT COALESCE(SUM(l.debit_p) - SUM(l.credit_p), 0) AS bal FROM journal_lines l JOIN journals j ON j.id = l.journal_id
            WHERE l.account_id = ? AND j.status = 'posted' AND j.date < ?`
        )
        .bind(accountId, from)
        .first();
      const { results } = await db
        .prepare(
          `SELECT j.id AS journal_id, j.number, j.date, j.reference, j.narrative, l.description, l.debit_p, l.credit_p, ct.name AS contact_name
             FROM journal_lines l JOIN journals j ON j.id = l.journal_id LEFT JOIN contacts ct ON ct.id = l.contact_id
            WHERE l.account_id = ? AND j.status = 'posted' AND j.date BETWEEN ? AND ?
            ORDER BY j.date, j.number, l.line_no`
        )
        .bind(accountId, from, to)
        .all();
      let bal = opening.bal;
      const rows = results.map((r) => ({ ...r, balance: (bal += r.debit_p - r.credit_p) }));
      return json({ from, to, account: acc, opening: opening.bal, closing: bal, rows });
    }

    case "dashboard": {
      const t = today();
      const yStart = fyStartFor(t, entity.fy_end_month, entity.fy_end_day);
      const mStart = t.slice(0, 8) + "01";
      const all = await netMap(db, entity.id, { to: t });
      const cashAccounts = accounts.filter((a) => a.cf_class === "cash" || a.is_bank);
      const cash = cashAccounts.map((a) => ({ id: a.id, code: a.code, name: a.name, balance: all.get(a.id) || 0 }));
      const ytd = profitAndLoss(accounts, await netMap(db, entity.id, { from: yStart, to: t }), { legalForm: lf });
      const mtd = profitAndLoss(accounts, await netMap(db, entity.id, { from: mStart, to: t }), { legalForm: lf });
      const incomeOf = (p) => p.sections.turnover.total + p.sections.other_operating_income.total + p.sections.interest_receivable.total;
      const expenseOf = (p) => p.sections.cost_of_sales.total + p.sections.admin_expenses.total + p.sections.interest_payable.total + p.sections.tax.total;

      // Last 12 months of income and expenses.
      const [y, mo] = t.split("-").map(Number);
      const start12 = new Date(Date.UTC(y, mo - 12, 1)).toISOString().slice(0, 10);
      const { results: monthly } = await db
        .prepare(
          `SELECT substr(j.date, 1, 7) AS month, a.type, SUM(l.debit_p) - SUM(l.credit_p) AS net
             FROM journal_lines l JOIN journals j ON j.id = l.journal_id JOIN accounts a ON a.id = l.account_id
            WHERE j.entity_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND a.type IN ('income','expense')
            GROUP BY month, a.type`
        )
        .bind(entity.id, start12, t)
        .all();
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(Date.UTC(y, mo - 1 - i, 1));
        const key = d.toISOString().slice(0, 7);
        const inc = monthly.find((r) => r.month === key && r.type === "income");
        const exp = monthly.find((r) => r.month === key && r.type === "expense");
        months.push({ month: key, income: inc ? -inc.net : 0, expense: exp ? exp.net : 0 });
      }
      const tb = trialBalance(accounts, all);
      const pending = await db.prepare("SELECT COUNT(*) AS n FROM journals WHERE entity_id = ? AND status = 'pending'").bind(entity.id).first();
      const drafts = await db.prepare("SELECT COUNT(*) AS n FROM journals WHERE entity_id = ? AND status = 'draft'").bind(entity.id).first();
      const recent = await listJournals(db, entity.id, { status: "posted", limit: 8 });
      return json({
        today: t,
        yearStart: yStart,
        cash,
        cashTotal: cash.reduce((s, c) => s + c.balance, 0),
        ytd: { income: incomeOf(ytd), expenses: expenseOf(ytd), profit: ytd.profit },
        mtd: { income: incomeOf(mtd), expenses: expenseOf(mtd), profit: mtd.profit },
        months,
        pending: pending.n,
        drafts: drafts.n,
        balanced: tb.balanced,
        accountsCount: accounts.length,
        recent,
      });
    }
  }
  throw new HttpError(404, "Unknown report");
}

/* ------------------------------------------------------------------ export */

async function exportEntity(db, entity) {
  const [accounts, years, contacts, journals, lines] = await db.batch([
    db.prepare("SELECT * FROM accounts WHERE entity_id = ? ORDER BY code").bind(entity.id),
    db.prepare("SELECT * FROM fiscal_years WHERE entity_id = ? ORDER BY start_date").bind(entity.id),
    db.prepare("SELECT * FROM contacts WHERE entity_id = ? ORDER BY name").bind(entity.id),
    db.prepare("SELECT * FROM journals WHERE entity_id = ? ORDER BY date, number").bind(entity.id),
    db.prepare("SELECT l.* FROM journal_lines l JOIN journals j ON j.id = l.journal_id WHERE j.entity_id = ? ORDER BY l.journal_id, l.line_no").bind(entity.id),
  ]);
  const data = {
    exported_at: new Date().toISOString(),
    entity,
    accounts: accounts.results,
    fiscal_years: years.results,
    contacts: contacts.results,
    journals: journals.results,
    journal_lines: lines.results,
  };
  const name = `b4es-ledger-${entity.name.replace(/[^A-Za-z0-9]+/g, "-").toLowerCase()}-${today()}.json`;
  return withHeaders(new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="${name}"` },
  }), { "Cache-Control": "no-store" });
}
