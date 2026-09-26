// Cloudflare Access JWT verification (RS256) using WebCrypto, no dependencies.
//
// Access puts a signed JWT in the Cf-Access-Jwt-Assertion header (and the
// CF_Authorization cookie) of every request it lets through. We verify the
// signature against the team's public keys, then check issuer, audience,
// expiry and token type. Anything missing or wrong fails closed.

const JWKS_TTL_MS = 60 * 60 * 1000;
let jwksCache = { url: "", at: 0, keys: new Map() };

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function decodeJson(part) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(part)));
}

async function loadKeys(certsUrl, force = false) {
  const fresh = jwksCache.url === certsUrl && Date.now() - jwksCache.at < JWKS_TTL_MS;
  if (fresh && !force) return jwksCache.keys;
  const res = await fetch(certsUrl, { cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error(`certs fetch failed: ${res.status}`);
  const body = await res.json();
  const keys = new Map();
  for (const jwk of body.keys || []) {
    if (jwk.kty !== "RSA" || !jwk.kid) continue;
    const key = await crypto.subtle.importKey(
      "jwk",
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    keys.set(jwk.kid, key);
  }
  jwksCache = { url: certsUrl, at: Date.now(), keys };
  return keys;
}

function tokenFrom(request) {
  const h = request.headers.get("Cf-Access-Jwt-Assertion");
  if (h) return h;
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return m ? m[1] : null;
}

/**
 * Returns { email } for a valid Access token, or throws.
 * teamDomain: "https://<team>.cloudflareaccess.com"; aud: the app's AUD tag.
 */
export async function verifyAccess(request, teamDomain, aud) {
  if (!teamDomain || !aud) throw new Error("access not configured");
  const token = tokenFrom(request);
  if (!token) throw new Error("no access token");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  const header = decodeJson(parts[0]);
  const claims = decodeJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("unexpected token algorithm");

  const issuer = teamDomain.replace(/\/+$/, "");
  const certsUrl = `${issuer}/cdn-cgi/access/certs`;
  let keys = await loadKeys(certsUrl);
  let key = keys.get(header.kid);
  if (!key) {
    keys = await loadKeys(certsUrl, true); // keys rotate; refresh once
    key = keys.get(header.kid);
  }
  if (!key) throw new Error("unknown signing key");

  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!ok) throw new Error("bad signature");

  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== issuer) throw new Error("wrong issuer");
  const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!auds.includes(aud)) throw new Error("wrong audience");
  if (typeof claims.exp !== "number" || claims.exp < now - 30) throw new Error("expired");
  if (typeof claims.nbf === "number" && claims.nbf > now + 30) throw new Error("not yet valid");
  if (claims.type && claims.type !== "app") throw new Error("wrong token type");

  // People sign in with an email. Service tokens (for Claude, phase 2) carry
  // common_name instead and an empty sub; they are not accepted yet.
  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  if (!email) throw new Error("token has no email");
  return { email };
}
