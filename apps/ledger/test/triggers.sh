#!/usr/bin/env bash
# Proves the ledger's database rules against a local D1 (same SQLite engine as
# production). Every "expect_fail" case must be rejected by a trigger or
# constraint; every "expect_ok" case must succeed.
#
#   bash apps/ledger/test/triggers.sh
set -uo pipefail
cd "$(dirname "$0")/.."

STATE="$(mktemp -d)"
trap 'rm -rf "$STATE"' EXIT
export WRANGLER_SEND_METRICS=false
W=(npx wrangler d1 execute b4es-ledger --local --persist-to "$STATE" --json)

pass=0; fail=0
run() { "${W[@]}" --command "$1" >/tmp/ledger-sql.out 2>&1; }
expect_ok()   { if run "$2"; then pass=$((pass+1)); else fail=$((fail+1)); echo "FAIL (should succeed): $1"; tail -5 /tmp/ledger-sql.out; fi; }
expect_fail() { if run "$2"; then fail=$((fail+1)); echo "FAIL (should be rejected): $1"; else
                  if grep -q "${3:-ledger:}" /tmp/ledger-sql.out; then pass=$((pass+1)); else fail=$((fail+1)); echo "FAIL (wrong error): $1"; tail -5 /tmp/ledger-sql.out; fi; fi; }

npx wrangler d1 migrations apply b4es-ledger --local --persist-to "$STATE" >/dev/null 2>&1 || { echo "migrations failed"; npx wrangler d1 migrations apply b4es-ledger --local --persist-to "$STATE"; exit 1; }

# ---- fixtures
expect_ok "fixtures" "
INSERT INTO entities (id, name) VALUES (1, 'B4ES LLP'), (2, 'Client Ltd');
INSERT INTO principals (id, email, role) VALUES (1, 'a@example.com', 'admin'), (2, 'b@example.com', 'partner');
INSERT INTO accounts (id, entity_id, code, name, type, is_bank, cf_class) VALUES
  (1, 1, '1200', 'Bank', 'asset', 1, 'cash'),
  (2, 1, '4000', 'Fees', 'income', 0, NULL),
  (3, 1, '6200', 'Software', 'expense', 0, NULL),
  (4, 2, '1200', 'Client bank', 'asset', 1, 'cash'),
  (5, 1, '6999', 'Old', 'expense', 0, NULL);
UPDATE accounts SET active = 0 WHERE id = 5;
INSERT INTO fiscal_years (entity_id, start_date, end_date, status) VALUES (1, '2025-01-01', '2025-12-31', 'locked'), (1, '2026-01-01', '2026-12-31', 'open');"

# ---- happy path: draft -> posted
expect_ok "post balanced journal" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('J1', 1, '2026-03-01', 'Invoice paid', 12000, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('J1', 1, 1, 12000);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('J1', 2, 2, 12000);
UPDATE journals SET status='posted', number=1, posted_by=1, posted_at=datetime('now') WHERE id='J1';"

# ---- posting rules
expect_fail "insert already posted" "INSERT INTO journals (id, entity_id, date, narrative, status, number, created_by) VALUES ('X1', 1, '2026-03-01', 'x', 'posted', 99, 1);" "must be posted from draft"
expect_fail "unbalanced" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X2', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X2', 1, 1, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X2', 2, 2, 90);
UPDATE journals SET status='posted', number=2 WHERE id='X2';" "must be equal"
expect_fail "single line" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X3', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X3', 1, 1, 100);
UPDATE journals SET status='posted', number=3 WHERE id='X3';" "at least two lines"
expect_fail "line with both debit and credit" "
INSERT INTO journals (id, entity_id, date, narrative, created_by) VALUES ('X4', 1, '2026-03-02', 'x', 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p, credit_p) VALUES ('X4', 1, 1, 100, 100);" "CHECK constraint"
expect_fail "negative amount" "
INSERT INTO journals (id, entity_id, date, narrative, created_by) VALUES ('X5', 1, '2026-03-02', 'x', 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X5', 1, 1, -100);" "CHECK constraint"
expect_fail "fractional pence" "
INSERT INTO journals (id, entity_id, date, narrative, created_by) VALUES ('X6', 1, '2026-03-02', 'x', 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X6', 1, 1, 10.5);" "CHECK constraint"
expect_fail "account from another entity" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X7', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X7', 1, 4, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X7', 2, 2, 100);
UPDATE journals SET status='posted', number=7 WHERE id='X7';" "belong to this entity"
expect_fail "inactive account" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X8', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X8', 1, 5, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X8', 2, 1, 100);
UPDATE journals SET status='posted', number=8 WHERE id='X8';" "active"
expect_fail "locked year" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X9', 1, '2025-06-01', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X9', 1, 3, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X9', 2, 1, 100);
UPDATE journals SET status='posted', number=9 WHERE id='X9';" "locked financial year"
expect_fail "total mismatch" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X10', 1, '2026-03-02', 'x', 999, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X10', 1, 3, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X10', 2, 1, 100);
UPDATE journals SET status='posted', number=10 WHERE id='X10';" "total_p must match"
expect_fail "no number" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X11', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X11', 1, 3, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X11', 2, 1, 100);
UPDATE journals SET status='posted' WHERE id='X11';" "needs a number"
expect_fail "duplicate number" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, created_by) VALUES ('X12', 1, '2026-03-02', 'x', 100, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('X12', 1, 3, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('X12', 2, 1, 100);
UPDATE journals SET status='posted', number=1 WHERE id='X12';" "UNIQUE constraint"

# ---- immutability
expect_fail "edit posted journal" "UPDATE journals SET narrative='changed' WHERE id='J1';" "cannot be changed"
expect_fail "unpost journal" "UPDATE journals SET status='draft' WHERE id='J1';" "cannot be changed"
expect_fail "delete posted journal" "DELETE FROM journals WHERE id='J1';" "cannot be deleted"
expect_fail "edit posted line" "UPDATE journal_lines SET debit_p=1 WHERE journal_id='J1' AND line_no=1;" "cannot change lines"
expect_fail "add line to posted" "INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('J1', 3, 3, 5);" "cannot add lines"
expect_fail "delete posted line" "DELETE FROM journal_lines WHERE journal_id='J1';" "cannot remove lines"
expect_fail "delete used account" "DELETE FROM accounts WHERE id=1;" "has entries"
expect_fail "retype used account" "UPDATE accounts SET type='liability' WHERE id=1;" "cannot change the type"
expect_fail "delete entity" "DELETE FROM entities WHERE id=2;" "cannot be deleted"
expect_fail "edit audit" "INSERT INTO audit_log (action) VALUES ('x'); UPDATE audit_log SET action='y';" "audit log"
expect_fail "delete used fiscal year" "DELETE FROM fiscal_years WHERE start_date='2026-01-01' AND entity_id=1;" "posted entries"

# ---- reversal: reversed_by may be set once
expect_ok "reverse J1" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, source, reversal_of, created_by) VALUES ('R1', 1, '2026-03-05', 'Reversal of #1', 12000, 'reversal', 'J1', 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('R1', 1, 1, 12000);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('R1', 2, 2, 12000);
UPDATE journals SET status='posted', number=2, posted_by=1, posted_at=datetime('now') WHERE id='R1';
UPDATE journals SET reversed_by='R1' WHERE id='J1';"
expect_fail "reverse twice" "UPDATE journals SET reversed_by='R1' WHERE id='J1';" "cannot be changed"

# ---- second approval
expect_ok "pending entry" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, status, requires_second, created_by) VALUES ('P1', 1, '2026-04-01', 'Needs approval', 5000, 'pending', 1, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('P1', 1, 3, 5000);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('P1', 2, 1, 5000);"
expect_fail "self-approve" "UPDATE journals SET status='posted', number=3, decided_by=1 WHERE id='P1';" "different partner"
expect_fail "approve without approver" "UPDATE journals SET status='posted', number=3 WHERE id='P1';" "different partner"
expect_ok "approved by other partner" "UPDATE journals SET status='posted', number=3, decided_by=2, posted_by=2, posted_at=datetime('now') WHERE id='P1';"
expect_fail "draft flagged for approval posted directly" "
INSERT INTO journals (id, entity_id, date, narrative, total_p, requires_second, created_by) VALUES ('P2', 1, '2026-04-02', 'x', 100, 1, 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('P2', 1, 3, 100);
INSERT INTO journal_lines (journal_id, line_no, account_id, credit_p) VALUES ('P2', 2, 1, 100);
UPDATE journals SET status='posted', number=4, decided_by=2 WHERE id='P2';" "cannot be posted directly"

# ---- drafts stay editable
expect_ok "edit and delete a draft" "
INSERT INTO journals (id, entity_id, date, narrative, created_by) VALUES ('D1', 1, '2026-05-01', 'draft', 1);
INSERT INTO journal_lines (journal_id, line_no, account_id, debit_p) VALUES ('D1', 1, 3, 100);
UPDATE journal_lines SET debit_p=200 WHERE journal_id='D1';
DELETE FROM journal_lines WHERE journal_id='D1';
DELETE FROM journals WHERE id='D1';"

# ---- trial balance still balances
run "SELECT SUM(l.debit_p) - SUM(l.credit_p) AS diff FROM journal_lines l JOIN journals j ON j.id=l.journal_id WHERE j.status='posted';"
if grep -q '"diff": 0' /tmp/ledger-sql.out; then pass=$((pass+1)); else fail=$((fail+1)); echo "FAIL: trial balance does not balance"; cat /tmp/ledger-sql.out; fi

echo "database rules: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
