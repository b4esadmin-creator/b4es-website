/**
 * B4ES — contact form handler.
 *
 * Runs only for /api/* (see `run_worker_first` in wrangler.jsonc). Every other
 * request on the site is served straight from static assets and never invokes
 * this Worker.
 *
 * Design notes
 * ------------
 * - Same origin as the site, so the strict CSP needs no third-party entry and
 *   the privacy notice gains no external processor.
 * - D1 is the source of truth. The row is written BEFORE the notification is
 *   attempted, so an email outage can never lose an enquiry — it just leaves
 *   `notified = 0`, which is queryable and replayable.
 * - Works without JavaScript: a plain form POST gets a 303 to /thank-you/.
 *   With JavaScript, the same endpoint returns JSON.
 * - Email goes through Resend when the RESEND_API_KEY secret is set: enquiries
 *   to ENQUIRY_TO_RESEND (info@b4es.co.uk), newsletter confirmations to the
 *   subscriber. Without the key, enquiries fall back to the Cloudflare
 *   send_email binding and the newsletter reports itself as unavailable.
 * - Newsletter sign-up is double opt-in: /api/subscribe stores a pending row
 *   and emails a link; only the confirm POST adds the address to Resend
 *   Contacts. The confirm step is a POST from a page, not a GET link, so mail
 *   scanners that open every link cannot subscribe anyone.
 */

const MAX = {
  name: 120,
  company: 160,
  email: 254, // RFC 5321
  phone: 40,
  reason: 40,
  service: 80,
  message: 5000,
};

// Per-IP submissions allowed per hour.
const RATE_LIMIT = 5;

// Bot heuristic: a genuine reader takes longer than this to fill the form.
const MIN_FILL_SECONDS = 3;

/* ------------------------------------------------------------------ utils */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

/**
 * Trim, cap length, and strip control characters. Newlines survive only where
 * they are meaningful (the message body); everywhere else they are collapsed to
 * spaces so a value can never be smuggled into an email header.
 */
const clean = (v, max, { multiline = false } = {}) => {
  if (typeof v !== "string") return "";
  const stripped = multiline
    ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    : v.replace(/[\u0000-\u001F\u007F]/g, " ");
  return stripped.trim().slice(0, max);
};

// Deliberately permissive: the point is to catch typos, not to police the RFC.
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v);

/** Non-reversible IP identifier for rate limiting — never store a raw IP. */
async function hashIp(ip, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);

/** Strip CR/LF so user input can never inject extra email headers. */
const headerSafe = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

/* ------------------------------------------------------------- parse body */

async function readSubmission(request) {
  const type = request.headers.get("content-type") || "";
  let raw;

  if (type.includes("application/json")) {
    raw = await request.json();
  } else if (
    type.includes("application/x-www-form-urlencoded") ||
    type.includes("multipart/form-data")
  ) {
    raw = Object.fromEntries(await request.formData());
  } else {
    return null;
  }

  return {
    name: clean(raw.name, MAX.name),
    company: clean(raw.company, MAX.company),
    email: clean(raw.email, MAX.email).toLowerCase(),
    phone: clean(raw.phone, MAX.phone),
    reason: clean(raw.reason, MAX.reason),
    service: clean(raw.service, MAX.service),
    message: clean(raw.message, MAX.message, { multiline: true }),
    consent: raw.consent === "on" || raw.consent === true || raw.consent === "true",
    // Honeypot: a real browser leaves this empty because it is visually hidden
    // and marked aria-hidden + tabindex="-1".
    website: clean(raw.website, 100),
    startedAt: Number(raw.started_at) || 0,
  };
}

function validate(s) {
  const errors = {};
  if (!s.name) errors.name = "Please tell us your name.";
  if (!s.email) errors.email = "Please give us an email address.";
  else if (!looksLikeEmail(s.email)) errors.email = "That email address does not look right.";
  if (!s.message) errors.message = "Please tell us what you are dealing with.";
  else if (s.message.length < 15) errors.message = "A little more detail would help us reply usefully.";
  if (!s.consent) errors.consent = "We need your consent before we can reply.";
  return errors;
}

/* ----------------------------------------------------------- notification */

function buildEmail(s, meta) {
  const rows = [
    ["Name", s.name],
    ["Firm or company", s.company || "—"],
    ["Email", s.email],
    ["Phone", s.phone || "—"],
    ["Reason", s.reason || "—"],
    ["Service of interest", s.service || "Not specified"],
    ["Country", meta.country || "—"],
    ["Received", meta.receivedAt],
    ["Reference", `#${meta.id}`],
  ];

  const text =
    `New enquiry from the B4ES website\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n--- Message ---\n\n${s.message}\n\n` +
    `Reply directly to this email to respond to ${s.name}.\n`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8f6f1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0d2431">
<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #dfe6e8;border-radius:12px;overflow:hidden">
  <div style="background:#08161f;padding:20px 24px">
    <p style="margin:0;color:#35b5a5;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600">New website enquiry</p>
    <p style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:600">${escapeHtml(s.name)}${
      s.company ? ` &middot; ${escapeHtml(s.company)}` : ""
    }</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:10px 24px;border-bottom:1px solid #eef2f3;color:#6a8794;width:38%">${escapeHtml(k)}</td>
      <td style="padding:10px 24px;border-bottom:1px solid #eef2f3;color:#0d2431;font-weight:500">${escapeHtml(v)}</td>
    </tr>`
      )
      .join("")}
  </table>
  <div style="padding:20px 24px">
    <p style="margin:0 0 8px;color:#6a8794;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600">Message</p>
    <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:15px">${escapeHtml(s.message)}</p>
  </div>
  <div style="padding:16px 24px;background:#f8f6f1;border-top:1px solid #dfe6e8">
    <p style="margin:0;font-size:13px;color:#6a8794">Reply directly to this email to respond to ${escapeHtml(s.name)}.</p>
  </div>
</div></body></html>`;

  return { text, html };
}

const RESEND_API = "https://api.resend.com";

/** Call the Resend REST API. Returns { ok, status, data, error }. */
async function resend(env, path, body, { idempotencyKey } = {}) {
  const headers = {
    authorization: `Bearer ${env.RESEND_API_KEY}`,
    "content-type": "application/json",
  };
  if (idempotencyKey) headers["idempotency-key"] = idempotencyKey;
  try {
    const res = await fetch(`${RESEND_API}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok
      ? { ok: true, status: res.status, data }
      : { ok: false, status: res.status, data, error: `Resend ${res.status}: ${data.message || data.name || "error"}` };
  } catch (err) {
    return { ok: false, status: 0, error: `Resend unreachable: ${String(err && err.message ? err.message : err)}` };
  }
}

const fromAddress = (env) => `B4ES website <${env.ENQUIRY_FROM || "website@b4es.co.uk"}>`;

async function notifyViaResend(env, s, meta, { text, html, subject }) {
  return resend(
    env,
    "/emails",
    {
      from: fromAddress(env),
      to: [env.ENQUIRY_TO_RESEND || "info@b4es.co.uk"],
      subject,
      text,
      html,
      // Bare address only, so an attacker-controlled name cannot break parsing.
      reply_to: s.email,
    },
    // One email per enquiry row, even if waitUntil runs twice.
    { idempotencyKey: `enquiry-${meta.id}` }
  );
}

async function notifyViaBinding(env, s, { text, html, subject }) {
  if (!env.ENQUIRY_EMAIL) return { ok: false, error: "send_email binding not configured" };
  try {
    await env.ENQUIRY_EMAIL.send({
      from: { email: env.ENQUIRY_FROM || "website@b4es.co.uk", name: "B4ES website" },
      // Passed explicitly for clarity and so local dev works. The binding's
      // `destination_address` still constrains where mail can actually go, so
      // this cannot be redirected by changing code alone.
      to: env.ENQUIRY_TO || "b4es.admin@gmail.com",
      subject,
      text,
      html,
      // Dedicated API field, not a custom header: Email Service rejects a
      // custom Reply-To. Using the structured form means the platform handles
      // quoting, so an attacker-controlled display name cannot break the
      // address parser.
      replyTo: { email: s.email, name: s.name },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
}

/**
 * Resend first (straight to info@b4es.co.uk), then the Cloudflare binding as a
 * fallback, so a Resend outage or an unverified domain still reaches the inbox.
 */
async function notify(env, s, meta) {
  const { text, html } = buildEmail(s, meta);
  const subject = headerSafe(
    `Website enquiry: ${s.company || s.name}${s.service ? ` (${s.service})` : ""}`
  );
  const mail = { text, html, subject };

  const errors = [];
  if (env.RESEND_API_KEY) {
    const r = await notifyViaResend(env, s, meta, mail);
    if (r.ok) return { ok: true };
    errors.push(r.error);
  }
  const b = await notifyViaBinding(env, s, mail);
  if (b.ok) return { ok: true, error: errors.join("; ") || null };
  errors.push(b.error);
  return { ok: false, error: errors.join("; ") };
}

/* -------------------------------------------------------------- endpoint */

async function handleEnquiry(request, env, ctx) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const fail = (status, body, redirect) =>
    wantsJson
      ? json(body, status)
      : Response.redirect(new URL(redirect, request.url).toString(), 303);

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  // Same-origin only. Blocks trivial cross-site posting of the endpoint.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: "Cross-origin submissions are not accepted" }, 403);
  }

  let s;
  try {
    s = await readSubmission(request);
  } catch {
    return json({ ok: false, error: "Could not read the submission" }, 400);
  }
  if (!s) return json({ ok: false, error: "Unsupported content type" }, 415);

  // Bot traps. Both respond as success so a bot gets no signal to adapt.
  const tooFast = s.startedAt > 0 && Date.now() - s.startedAt < MIN_FILL_SECONDS * 1000;
  if (s.website || tooFast) {
    return wantsJson
      ? json({ ok: true, id: null })
      : Response.redirect(new URL("/thank-you/", request.url).toString(), 303);
  }

  const errors = validate(s);
  if (Object.keys(errors).length) {
    return fail(422, { ok: false, errors }, "/contact/?error=validation#form");
  }

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const ipHash = await hashIp(ip, env.IP_SALT || "b4es-default-salt");
  const country = request.cf?.country || request.headers.get("cf-ipcountry") || "";

  // Rate limit off the same table — no extra store to provision or pay for.
  try {
    const recent = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM enquiries
        WHERE ip_hash = ?1 AND created_at > datetime('now', '-1 hour')`
    )
      .bind(ipHash)
      .first();
    if (recent && recent.n >= RATE_LIMIT) {
      return fail(
        429,
        { ok: false, error: "That is a lot of enquiries in one hour. Please email us directly." },
        "/contact/?error=rate#form"
      );
    }
  } catch (err) {
    // A rate-limit read failure must not block a genuine enquiry.
    console.error("rate limit check failed", err);
  }

  let id;
  try {
    const res = await env.DB.prepare(
      `INSERT INTO enquiries
         (name, company, email, phone, reason, service, message, ip_hash, country, user_agent, referer)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
    )
      .bind(
        s.name, s.company, s.email, s.phone, s.reason, s.service, s.message,
        ipHash, country,
        clean(request.headers.get("user-agent"), 400),
        clean(request.headers.get("referer"), 400)
      )
      .run();
    id = res.meta.last_row_id;
  } catch (err) {
    console.error("d1 insert failed", err);
    return fail(
      500,
      { ok: false, error: "We could not record your enquiry. Please email us directly." },
      "/contact/?error=server#form"
    );
  }

  // The enquiry is safely stored. Notification is best-effort and must never
  // delay the response or fail the request.
  const meta = { id, country, receivedAt: new Date().toUTCString() };
  ctx.waitUntil(
    notify(env, s, meta).then((r) =>
      env.DB.prepare(`UPDATE enquiries SET notified = ?1, notify_error = ?2 WHERE id = ?3`)
        .bind(r.ok ? 1 : 0, r.error ? String(r.error).slice(0, 400) : null, id)
        .run()
        .catch((e) => console.error("notify status update failed", e))
    )
  );

  return wantsJson
    ? json({ ok: true, id })
    : Response.redirect(new URL("/thank-you/", request.url).toString(), 303);
}

/* ------------------------------------------------------------- newsletter */

// Confirmation links stop working after this long.
const TOKEN_TTL_DAYS = 7;
// Do not resend a confirmation to the same address more often than this.
const RESEND_COOLDOWN_MINUTES = 10;

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return request.json();
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    return Object.fromEntries(await request.formData());
  }
  return null;
}

const sameOrigin = (request) => {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === new URL(request.url).host;
};

function confirmationEmail(link) {
  const text =
    `Please confirm your subscription to B4ES insights.\n\n` +
    `Open this link and press "Confirm subscription":\n${link}\n\n` +
    `The link works for ${TOKEN_TTL_DAYS} days. If you did not ask for this, ignore this email and you will not hear from us.\n\n` +
    `Better 4 Enterprise Solutions (B4ES)\nhttps://b4es.co.uk\n`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8f6f1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0d2431">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #dfe6e8;border-radius:12px;overflow:hidden">
  <div style="background:#022454;padding:20px 24px">
    <p style="margin:0;color:#E1B76D;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:600">B4ES insights</p>
    <p style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:600">Please confirm your subscription</p>
  </div>
  <div style="padding:24px">
    <p style="margin:0 0 20px;line-height:1.6;font-size:15px">Thanks for signing up. Press the button below to confirm that you want to receive B4ES insights by email.</p>
    <p style="margin:0 0 24px"><a href="${escapeHtml(link)}" style="display:inline-block;background:#05527A;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">Confirm subscription</a></p>
    <p style="margin:0;line-height:1.6;font-size:13px;color:#51606a">The link works for ${TOKEN_TTL_DAYS} days. If you did not ask for this, ignore this email and you will not hear from us.</p>
  </div>
</div></body></html>`;
  return { text, html };
}

/** GET /api/subscribe: lets the page hide the sign-up until email is set up. */
function subscribeStatus(env) {
  return json({ ok: true, enabled: Boolean(env.RESEND_API_KEY) });
}

async function handleSubscribe(request, env) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const done = (status, body, redirect) =>
    wantsJson ? json(body, status) : Response.redirect(new URL(redirect, request.url).toString(), 303);
  const checkInbox = () => done(200, { ok: true }, "/newsletter/check-your-email/");

  if (!sameOrigin(request)) {
    return json({ ok: false, error: "Cross-origin submissions are not accepted" }, 403);
  }
  if (!env.RESEND_API_KEY) {
    return done(503, { ok: false, error: "The newsletter is not open yet. Please try again soon." }, "/");
  }

  let raw;
  try {
    raw = await readBody(request);
  } catch {
    return json({ ok: false, error: "Could not read the submission" }, 400);
  }
  if (!raw) return json({ ok: false, error: "Unsupported content type" }, 415);

  const email = clean(raw.email, MAX.email).toLowerCase();
  const source = clean(raw.source, 200);
  const startedAt = Number(raw.started_at) || 0;

  // Same bot traps as the contact form, answered as success.
  if (clean(raw.website, 100) || (startedAt > 0 && Date.now() - startedAt < 1500)) {
    return checkInbox();
  }
  if (!looksLikeEmail(email)) {
    return done(422, { ok: false, error: "That email address does not look right." }, "/?newsletter=invalid");
  }

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const ipHash = await hashIp(ip, env.IP_SALT || "b4es-default-salt");
  const country = request.cf?.country || request.headers.get("cf-ipcountry") || "";

  try {
    // Housekeeping promised in the privacy notice: unconfirmed sign-ups go
    // after 30 days. Cheap enough to run on every sign-up.
    await env.DB.prepare(
      `DELETE FROM subscribers WHERE status = 'pending' AND created_at < datetime('now', '-30 days')`
    ).run();

    const recent = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM subscribers
        WHERE ip_hash = ?1 AND token_sent_at > datetime('now', '-1 hour')`
    ).bind(ipHash).first();
    if (recent && recent.n >= RATE_LIMIT) {
      return done(429, { ok: false, error: "Too many sign-ups from here in the last hour. Please try again later." }, "/");
    }

    const existing = await env.DB.prepare(
      `SELECT status, token_sent_at > datetime('now', ?2) AS fresh FROM subscribers WHERE email = ?1`
    ).bind(email, `-${RESEND_COOLDOWN_MINUTES} minutes`).first();

    // Same answer either way, so the form cannot be used to test who is subscribed.
    if (existing && (existing.status === "confirmed" || existing.fresh)) return checkInbox();

    const token = newToken();
    await env.DB.prepare(
      `INSERT INTO subscribers (email, token, token_sent_at, source, ip_hash, country)
         VALUES (?1, ?2, datetime('now'), ?3, ?4, ?5)
       ON CONFLICT(email) DO UPDATE SET
         token = excluded.token, token_sent_at = excluded.token_sent_at,
         source = excluded.source, ip_hash = excluded.ip_hash, country = excluded.country`
    ).bind(email, token, source, ipHash, country).run();

    const link = new URL(`/newsletter/confirm/?token=${token}`, request.url).toString();
    const { text, html } = confirmationEmail(link);
    const sent = await resend(env, "/emails", {
      from: fromAddress(env),
      to: [email],
      subject: "Confirm your B4ES insights subscription",
      text,
      html,
    });
    if (!sent.ok) {
      console.error("confirmation email failed", sent.error);
      // Let the reader retry straight away instead of hitting the cooldown.
      await env.DB.prepare(`UPDATE subscribers SET token_sent_at = NULL WHERE email = ?1`).bind(email).run();
      return done(502, { ok: false, error: `We could not send the confirmation email. Please try again later.` }, "/");
    }
  } catch (err) {
    console.error("subscribe failed", err);
    return done(500, { ok: false, error: "Something went wrong. Please try again later." }, "/");
  }

  return checkInbox();
}

async function handleConfirm(request, env, ctx) {
  const go = (path) => Response.redirect(new URL(path, request.url).toString(), 303);
  if (!sameOrigin(request)) return go("/newsletter/link-expired/");

  let raw;
  try {
    raw = await readBody(request);
  } catch {
    raw = null;
  }
  const token = raw ? clean(raw.token, 64) : "";
  if (!/^[0-9a-f]{48}$/.test(token)) return go("/newsletter/link-expired/");

  const row = await env.DB.prepare(
    `UPDATE subscribers
        SET status = 'confirmed', confirmed_at = datetime('now'), token = NULL
      WHERE token = ?1 AND status = 'pending'
        AND token_sent_at > datetime('now', ?2)
      RETURNING id, email`
  ).bind(token, `-${TOKEN_TTL_DAYS} days`).first();
  if (!row) return go("/newsletter/link-expired/");

  // Add to Resend Contacts (optionally into a segment). Best-effort: the
  // confirmed row in D1 is the record of consent, and unsynced rows can be
  // found with `WHERE status = 'confirmed' AND synced = 0`.
  if (env.RESEND_API_KEY) {
    const contact = { email: row.email, unsubscribed: false };
    if (env.RESEND_SEGMENT_ID) contact.segments = [{ id: env.RESEND_SEGMENT_ID }];
    ctx.waitUntil(
      resend(env, "/contacts", contact).then((r) => {
        const ok = r.ok || r.status === 409 || /already exists/i.test(r.error || "");
        return env.DB.prepare(`UPDATE subscribers SET synced = ?1, sync_error = ?2 WHERE id = ?3`)
          .bind(ok ? 1 : 0, ok ? null : String(r.error).slice(0, 400), row.id)
          .run()
          .catch((e) => console.error("sync status update failed", e));
      })
    );
  }

  return go("/newsletter/confirmed/");
}

/* ---------------------------------------------------------------- router */

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/enquiry") return handleEnquiry(request, env, ctx);

    if (pathname === "/api/subscribe") {
      if (request.method === "GET") return subscribeStatus(env);
      if (request.method === "POST") return handleSubscribe(request, env);
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    if (pathname === "/api/subscribe/confirm") {
      if (request.method === "POST") return handleConfirm(request, env, ctx);
      // A GET here (an old or pasted link) goes to the page with the button.
      if (request.method === "GET") {
        const url = new URL(request.url);
        const t = (url.searchParams.get("token") || "").replace(/[^0-9a-f]/g, "");
        return Response.redirect(new URL(`/newsletter/confirm/?token=${t}`, request.url).toString(), 303);
      }
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    if (pathname === "/api/health") {
      return json({ ok: true, service: "b4es-website", time: new Date().toISOString() });
    }

    // Any other /api/* path.
    return json({ ok: false, error: "Not found" }, 404);
  },
};
