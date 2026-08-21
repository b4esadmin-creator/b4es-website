-- Contact form enquiries.
-- Applied to the production database already; kept here so the schema is
-- version-controlled and reproducible (`wrangler d1 migrations apply`).

CREATE TABLE IF NOT EXISTS enquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  name         TEXT    NOT NULL,
  company      TEXT,
  email        TEXT    NOT NULL,
  phone        TEXT,
  reason       TEXT,
  service      TEXT,
  message      TEXT    NOT NULL,
  ip_hash      TEXT,                       -- salted SHA-256; never a raw IP
  country      TEXT,
  user_agent   TEXT,
  referer      TEXT,
  notified     INTEGER NOT NULL DEFAULT 0, -- 0 = email not yet delivered
  notify_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created  ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_rate     ON enquiries(ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_notified ON enquiries(notified) WHERE notified = 0;
