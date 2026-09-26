-- Newsletter subscribers (double opt-in).
-- A row starts as 'pending' with a one-time token; the emailed link sets it to
-- 'confirmed' and adds the address to Resend Contacts. Apply to production with
-- `wrangler d1 execute b4es-enquiries --remote --file migrations/0002_create_subscribers.sql`.

CREATE TABLE IF NOT EXISTS subscribers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  email         TEXT    NOT NULL UNIQUE,
  status        TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed')),
  token         TEXT,                       -- cleared once confirmed
  token_sent_at TEXT,
  confirmed_at  TEXT,
  source        TEXT,                       -- page the form was on
  ip_hash       TEXT,                       -- salted SHA-256; never a raw IP
  country       TEXT,
  synced        INTEGER NOT NULL DEFAULT 0, -- 1 = in Resend Contacts
  sync_error    TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(token);
CREATE INDEX IF NOT EXISTS idx_subscribers_rate  ON subscribers(ip_hash, token_sent_at);
