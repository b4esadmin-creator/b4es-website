-- B4ES Ledger: Claude may set up the books and manage its own proposals
-- (agreed by the partners, 27 Sep 2026). It still never posts, approves or
-- rejects (0002_agent.sql). These triggers keep that true when Claude edits,
-- withdraws and resends its entries, and stop it locking a financial year.

-- An entry Claude made stays Claude's and, whenever it is awaiting approval,
-- still needs a second approval.
CREATE TRIGGER trg_agent_entries_stay_claude
BEFORE UPDATE ON journals
WHEN (SELECT role FROM principals WHERE id = OLD.created_by) = 'agent'
 AND (NEW.created_by IS NOT OLD.created_by
   OR NEW.source <> 'claude'
   OR (NEW.status = 'pending' AND NEW.requires_second <> 1))
BEGIN
  SELECT RAISE(ABORT, 'ledger: entries made by Claude always go for approval');
END;

-- Locking a year is a partner's sign-off.
CREATE TRIGGER trg_agent_never_locks
BEFORE UPDATE OF status, locked_by ON fiscal_years
WHEN NEW.locked_by IS NOT NULL
 AND (SELECT role FROM principals WHERE id = NEW.locked_by) = 'agent'
BEGIN
  SELECT RAISE(ABORT, 'ledger: Claude cannot lock financial years');
END;
