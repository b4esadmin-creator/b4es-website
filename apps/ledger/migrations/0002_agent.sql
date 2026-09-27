-- B4ES Ledger: Claude as a proposing agent (phase 2).
-- An agent principal (role 'agent', signed in with a Cloudflare Access service
-- token) may only put entries into the approval queue. These triggers make
-- that true whatever the Worker does.

-- Free-text note on who asked Claude for the entry, e.g. "Faisal via Claude Code".
ALTER TABLE journals ADD COLUMN origin_note TEXT;

-- Entries made by an agent must arrive as pending, needing a second approval,
-- and marked as coming from Claude.
CREATE TRIGGER trg_agent_insert_pending_only
BEFORE INSERT ON journals
WHEN (SELECT role FROM principals WHERE id = NEW.created_by) = 'agent'
 AND (NEW.status <> 'pending' OR NEW.requires_second <> 1 OR NEW.source <> 'claude')
BEGIN
  SELECT RAISE(ABORT, 'ledger: Claude can only send entries for approval');
END;

-- An agent never posts, approves or rejects.
CREATE TRIGGER trg_agent_never_decides
BEFORE UPDATE ON journals
WHEN (NEW.posted_by  IS NOT NULL AND NEW.posted_by  IS NOT OLD.posted_by  AND (SELECT role FROM principals WHERE id = NEW.posted_by)  = 'agent')
  OR (NEW.decided_by IS NOT NULL AND NEW.decided_by IS NOT OLD.decided_by AND (SELECT role FROM principals WHERE id = NEW.decided_by) = 'agent')
BEGIN
  SELECT RAISE(ABORT, 'ledger: Claude cannot post, approve or reject entries');
END;

-- An agent's entry reaches the books only by a person approving it from the
-- queue, never by being turned back into a draft and posted directly.
CREATE TRIGGER trg_agent_entries_need_approval
BEFORE UPDATE OF status ON journals
WHEN NEW.status = 'posted' AND OLD.status <> 'posted'
 AND (SELECT role FROM principals WHERE id = OLD.created_by) = 'agent'
 AND NOT (OLD.status = 'pending' AND NEW.decided_by IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT, 'ledger: entries proposed by Claude are posted by approving them');
END;
