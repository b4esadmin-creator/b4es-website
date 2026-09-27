#!/usr/bin/env node
// B4ES Ledger command line for Claude Code. Reads the books and sends entries
// for approval; it cannot post, approve or change anything else (the ledger
// enforces that for the service token).
//
// Needs, in the Claude environment (never in the repo):
//   LEDGER_CLIENT_ID      Cloudflare Access service token Client ID
//   LEDGER_CLIENT_SECRET  Cloudflare Access service token Client Secret
//   LEDGER_URL            optional, default https://ledger.b4es.co.uk
//
// Usage:
//   node apps/ledger/cli/ledger.mjs check
//   node apps/ledger/cli/ledger.mjs entities
//   node apps/ledger/cli/ledger.mjs accounts [--entity ID]
//   node apps/ledger/cli/ledger.mjs contacts [--entity ID]
//   node apps/ledger/cli/ledger.mjs journals [--entity ID] [--status pending] [--q text] [--from D] [--to D]
//   node apps/ledger/cli/ledger.mjs show JOURNAL_ID [--entity ID]
//   node apps/ledger/cli/ledger.mjs propose FILE.json|- [--entity ID] [--dry-run]
//
// Proposal JSON (amounts in pounds as strings, accounts by code):
//   { "date": "2026-09-26", "narrative": "Xero subscription, September",
//     "reference": "INV-123", "requested_by": "Faisal via Claude Code",
//     "approver": "partner@example.com",
//     "lines": [ { "account": "6200", "debit": "30.00" },
//                { "account": "1200", "credit": "30.00", "contact": "Xero" } ] }

import { readFileSync } from "node:fs";

const BASE = (process.env.LEDGER_URL || "https://ledger.b4es.co.uk").replace(/\/+$/, "");
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(`--${name}`);

function die(msg) {
  console.error(`ledger: ${msg}`);
  process.exit(1);
}

async function api(path, { method = "GET", body } = {}) {
  const id = process.env.LEDGER_CLIENT_ID;
  const secret = process.env.LEDGER_CLIENT_SECRET;
  if (!id || !secret) die("LEDGER_CLIENT_ID and LEDGER_CLIENT_SECRET must be set in the Claude environment");
  const res = await fetch(BASE + "/api" + path, {
    method,
    redirect: "manual",
    headers: {
      "CF-Access-Client-Id": id,
      "CF-Access-Client-Secret": secret,
      Origin: BASE,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status >= 300 && res.status < 400) die("Cloudflare Access refused the service token (check the ID, secret and the Service Auth policy)");
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) die((data && data.error) || `request failed (${res.status})`);
  return data;
}

// "1,234.5" -> 123450 pence; NaN if invalid.
function pence(v) {
  if (v === undefined || v === null || v === "") return 0;
  const t = String(v).replace(/[£,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
  const [a, b = ""] = t.split(".");
  return Number(a) * 100 + Number((b + "00").slice(0, 2));
}
const gbp = (p) => (p < 0 ? "-" : "") + "£" + (Math.abs(p) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const pad = (s, n) => String(s ?? "").padEnd(n).slice(0, n);
const lpad = (s, n) => String(s ?? "").padStart(n);

async function entityId() {
  const given = flag("entity");
  const { entities } = await api("/entities");
  if (!entities.length) die("no companies in the ledger yet; add one in the app first");
  if (given) {
    const e = entities.find((x) => String(x.id) === given || x.name.toLowerCase() === given.toLowerCase());
    if (!e) die(`unknown company "${given}"; run: ledger entities`);
    return e;
  }
  if (entities.length > 1) die(`several companies; pass --entity ID (${entities.map((e) => `${e.id} ${e.name}`).join(", ")})`);
  return entities[0];
}

async function main() {
  switch (cmd) {
    case "check": {
      const { me } = await api("/me");
      console.log(`Connected to ${BASE} as ${me.display_name} (${me.role}).`);
      return;
    }
    case "entities": {
      const { entities } = await api("/entities");
      for (const e of entities)
        console.log(`${e.id}\t${e.name}\t${e.legal_form}\tyear end ${String(e.fy_end_day).padStart(2, "0")}/${String(e.fy_end_month).padStart(2, "0")}\tVAT ${e.vat_registered ? "yes" : "no"}\tpending ${e.pending}`);
      return;
    }
    case "accounts": {
      const e = await entityId();
      const { accounts, asOf } = await api(`/entities/${e.id}/accounts`);
      console.log(`${e.name}: chart of accounts, balances at ${asOf} (debit positive)`);
      for (const a of accounts.filter((x) => x.active))
        console.log(`${pad(a.code, 6)}${pad(a.name, 48)}${pad(a.type, 10)}${a.is_bank ? "bank " : "     "}${lpad(gbp(a.balance_p), 14)}`);
      return;
    }
    case "contacts": {
      const e = await entityId();
      const { contacts } = await api(`/entities/${e.id}/contacts`);
      for (const c of contacts) console.log(`${c.id}\t${c.name}\t${c.kind}`);
      if (!contacts.length) console.log("No contacts yet (partners add them in Settings).");
      return;
    }
    case "journals": {
      const e = await entityId();
      const qs = new URLSearchParams({ limit: "50" });
      for (const k of ["status", "q", "from", "to"]) if (flag(k)) qs.set(k, flag(k));
      const { journals } = await api(`/entities/${e.id}/journals?${qs}`);
      for (const j of journals)
        console.log(`${j.date}  ${pad(j.number ? "#" + j.number : "", 6)}${pad(j.status, 9)}${lpad(gbp(j.total_p), 12)}  ${j.narrative}${j.source === "claude" ? "  [Claude]" : ""}  (${j.id})`);
      if (!journals.length) console.log("No entries match.");
      return;
    }
    case "show": {
      const id = args[1];
      if (!id) die("usage: ledger show JOURNAL_ID");
      const e = await entityId();
      const { journal: j } = await api(`/entities/${e.id}/journals/${id}`);
      if (!j) die("entry not found");
      console.log(`${j.date}  ${j.status}${j.number ? " #" + j.number : ""}  ${j.narrative}`);
      for (const l of j.lines) console.log(`  ${pad(l.account_code + " " + l.account_name, 50)}${lpad(l.debit_p ? gbp(l.debit_p) : "", 12)}${lpad(l.credit_p ? gbp(l.credit_p) : "", 12)}`);
      if (j.decision_note) console.log(`Note: ${j.decision_note}`);
      console.log(`${BASE}/#/entries/${j.id}`);
      return;
    }
    case "propose": {
      const src = args[1];
      if (!src) die("usage: ledger propose FILE.json|- [--dry-run]");
      let p;
      try {
        p = JSON.parse(readFileSync(src === "-" ? 0 : src, "utf8"));
      } catch (err) {
        die(`could not read the proposal JSON: ${err.message}`);
      }
      const e = await entityId();
      const [{ accounts }, { contacts }, me] = await Promise.all([
        api(`/entities/${e.id}/accounts`),
        api(`/entities/${e.id}/contacts`),
        api("/me"),
      ]);
      const byCode = new Map(accounts.filter((a) => a.active).map((a) => [a.code, a]));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || "")) die("date must be YYYY-MM-DD");
      if (!p.narrative) die("narrative is required");
      if (!Array.isArray(p.lines) || p.lines.length < 2) die("at least two lines are needed");

      const lines = p.lines.map((l, i) => {
        const a = byCode.get(String(l.account));
        if (!a) die(`line ${i + 1}: no active account with code ${l.account}; run: ledger accounts`);
        const debit_p = pence(l.debit);
        const credit_p = pence(l.credit);
        if (Number.isNaN(debit_p) || Number.isNaN(credit_p)) die(`line ${i + 1}: amounts must be numbers with up to 2 decimals`);
        if ((debit_p > 0) === (credit_p > 0)) die(`line ${i + 1}: give either a debit or a credit`);
        let contact_id = null;
        if (l.contact) {
          const c = contacts.find((x) => x.name.toLowerCase() === String(l.contact).toLowerCase());
          if (!c) die(`line ${i + 1}: unknown contact "${l.contact}"; leave it out or ask a partner to add it`);
          contact_id = c.id;
        }
        return { account: a, account_id: a.id, debit_p, credit_p, description: l.description || "", contact_id, contact: l.contact || "" };
      });
      const dr = lines.reduce((t, l) => t + l.debit_p, 0);
      const cr = lines.reduce((t, l) => t + l.credit_p, 0);
      if (dr !== cr) die(`debits ${gbp(dr)} and credits ${gbp(cr)} are not equal`);

      let approver_id = null;
      if (p.approver) {
        const a = me.partners.find((x) => x.email.toLowerCase() === String(p.approver).toLowerCase() || (x.display_name || "").toLowerCase() === String(p.approver).toLowerCase());
        if (!a) die(`approver "${p.approver}" is not an active partner`);
        approver_id = a.id;
      }

      // Possible duplicates: same total within 7 days either side.
      const d = new Date(p.date + "T00:00:00Z");
      const around = (n) => new Date(d.getTime() + n * 86400000).toISOString().slice(0, 10);
      const { journals: near } = await api(`/entities/${e.id}/journals?from=${around(-7)}&to=${around(7)}&limit=200`);
      const dupes = near.filter((j) => j.total_p === dr && j.status !== "rejected");

      console.log(`${e.name}: proposed entry for approval`);
      console.log(`${p.date}  ${p.narrative}${p.reference ? `  (ref ${p.reference})` : ""}`);
      for (const l of lines)
        console.log(`  ${pad(l.account.code + " " + l.account.name, 50)}${lpad(l.debit_p ? gbp(l.debit_p) : "", 12)}${lpad(l.credit_p ? gbp(l.credit_p) : "", 12)}${l.contact ? "  " + l.contact : ""}`);
      console.log(`  ${pad("Total", 50)}${lpad(gbp(dr), 12)}${lpad(gbp(cr), 12)}`);
      if (dupes.length) {
        console.log("Possible duplicates (same amount within a week):");
        for (const j of dupes) console.log(`  ${j.date} ${j.status} ${gbp(j.total_p)} ${j.narrative} (${j.id})`);
      }
      if (has("dry-run")) {
        console.log("Dry run: nothing was sent.");
        return;
      }
      const r = await api(`/entities/${e.id}/journals`, {
        method: "POST",
        body: {
          date: p.date,
          narrative: p.narrative,
          reference: p.reference || "",
          requested_by: p.requested_by || "",
          approver_id,
          lines: lines.map(({ account_id, debit_p, credit_p, description, contact_id }) => ({ account_id, debit_p, credit_p, description, contact_id })),
        },
      });
      console.log(`Sent for approval (status: ${r.journal.status}). A partner must approve it in the app:`);
      console.log(`${BASE}/#/entries/${r.journal.id}`);
      return;
    }
    default:
      die("commands: check, entities, accounts, contacts, journals, show, propose (see the top of this file)");
  }
}

main().catch((err) => die(err.message));
