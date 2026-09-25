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

async function notify(env, s, meta) {
  if (!env.ENQUIRY_EMAIL) return { ok: false, error: "send_email binding not configured" };

  const { text, html } = buildEmail(s, meta);
  const subject = headerSafe(
    `Website enquiry — ${s.company || s.name}${s.service ? ` (${s.service})` : ""}`
  );

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
        .bind(r.ok ? 1 : 0, r.ok ? null : String(r.error).slice(0, 400), id)
        .run()
        .catch((e) => console.error("notify status update failed", e))
    )
  );

  return wantsJson
    ? json({ ok: true, id })
    : Response.redirect(new URL("/thank-you/", request.url).toString(), 303);
}

/* ---------------------------------------------------------------- router */

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/enquiry") return handleEnquiry(request, env, ctx);

    if (pathname === "/api/health") {
      return json({ ok: true, service: "b4es-website", time: new Date().toISOString() });
    }

    // Any other /api/* path.
    return json({ ok: false, error: "Not found" }, 404);
  },
};
