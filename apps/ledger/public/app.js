/* B4ES Ledger app. Plain JavaScript, no dependencies, CSP-safe (no inline
 * scripts or styles, no innerHTML with data). Talks to /api on the same
 * origin; Cloudflare Access handles sign-in. */
(function () {
  "use strict";

  /* ============================================================ helpers */

  const $ = (sel, root = document) => root.querySelector(sel);

  // Build DOM nodes: h("div", { class: "x", onclick: fn }, "text", child)
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "class") el.className = v;
        else if (k === "value") el.value = v;
        else if (k === "checked") el.checked = !!v;
        else if (k === "selected") el.selected = !!v;
        else el.setAttribute(k, v === true ? "" : String(v));
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  const svgNS = "http://www.w3.org/2000/svg";
  function s(tag, attrs, ...children) {
    const el = document.createElementNS(svgNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, String(v));
    for (const c of children) el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    return el;
  }

  // Money: pence integers only.
  function fmt(p, { blankZero = false } = {}) {
    if (p === null || p === undefined) return "";
    if (blankZero && !p) return "";
    const neg = p < 0;
    const v = Math.abs(p);
    const pounds = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const pence = String(v % 100).padStart(2, "0");
    return (neg ? "(" : "") + "£" + pounds + "." + pence + (neg ? ")" : "");
  }
  // "1,234.5" -> 123450. Returns NaN if not a valid amount.
  function parsePence(str) {
    const t = String(str || "").replace(/[£,\s]/g, "");
    if (t === "") return 0;
    if (!/^\d+(\.\d{0,2})?$/.test(t)) return NaN;
    const [a, b = ""] = t.split(".");
    return Number(a) * 100 + Number((b + "00").slice(0, 2));
  }
  const toInput = (p) => (p ? (p / 100).toFixed(2) : "");

  const today = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  function prettyDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  const who = (name, email) => name || (email ? email.split("@")[0] : "someone");

  let toastTimer;
  function toast(msg, isError = false) {
    const t = $("#toast");
    t.textContent = msg;
    t.className = "toast" + (isError ? " error" : "");
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), isError ? 6000 : 3000);
  }

  class ApiError extends Error {}

  async function api(path, { method = "GET", body } = {}) {
    let res;
    try {
      res = await fetch("/api" + path, {
        method,
        credentials: "same-origin",
        redirect: "manual",
        headers: body !== undefined ? { "Content-Type": "application/json" } : {},
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new ApiError("You appear to be offline. Nothing was saved.");
    }
    // Access session expired: fetch gets an opaque redirect to the login page.
    if (res.type === "opaqueredirect" || res.status === 401) {
      sessionExpired();
      throw new ApiError("Your session has expired. Nothing was saved.");
    }
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* not JSON */
    }
    if (!res.ok) throw new ApiError((data && data.error) || `Request failed (${res.status})`);
    return data;
  }

  function sessionExpired() {
    const v = $("#view");
    v.replaceChildren(
      h("div", { class: "card" }, h("h2", null, "Please sign in again"),
        h("p", null, "Your sign-in has expired. Reload to sign in; anything you had not saved will need re-entering."),
        h("button", { class: "btn primary", type: "button", onclick: () => location.reload() }, "Reload and sign in"))
    );
  }

  function downloadCsv(filename, rows) {
    const esc = (v) => {
      const t = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
    };
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const a = h("a", { href: URL.createObjectURL(blob), download: filename });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  }
  const pounds = (p) => (p / 100).toFixed(2);

  /* ============================================================ state */

  const state = {
    me: null,
    partners: [],
    entities: [],
    entityId: null,
    accounts: null, // cache for current entity
    contacts: null,
  };
  const E = () => state.entities.find((e) => e.id === state.entityId) || null;
  const base = () => `/entities/${state.entityId}`;

  async function loadMe() {
    const d = await api("/me");
    state.me = d.me;
    state.partners = d.partners;
    state.entities = d.entities;
    let saved = null;
    try {
      saved = Number(localStorage.getItem("ledger.entity"));
    } catch {}
    state.entityId = state.entities.some((e) => e.id === saved) ? saved : state.entities[0] ? state.entities[0].id : null;
    renderChrome();
  }

  async function accounts(force = false) {
    if (!state.accounts || force) state.accounts = (await api(`${base()}/accounts`)).accounts;
    return state.accounts;
  }
  async function contacts(force = false) {
    if (!state.contacts || force) state.contacts = (await api(`${base()}/contacts`)).contacts;
    return state.contacts;
  }

  function setEntity(id) {
    state.entityId = id;
    state.accounts = null;
    state.contacts = null;
    try {
      localStorage.setItem("ledger.entity", String(id));
    } catch {}
    renderChrome();
  }

  function renderChrome() {
    const sel = $("#entitySelect");
    sel.replaceChildren(
      ...state.entities.map((e) => h("option", { value: e.id, selected: e.id === state.entityId }, e.name)),
      h("option", { value: "new" }, "+ Add a company")
    );
    const me = state.me;
    if (me) {
      $("#userBtn").textContent = (me.display_name || me.email).slice(0, 1).toUpperCase();
      $("#userBtn").setAttribute("aria-label", "Account: " + me.email);
      $("#userEmail").textContent = `${me.email} (${me.role})`;
    }
    const e = E();
    const badge = $("#pendingBadge");
    if (e && e.pending) {
      badge.textContent = e.pending;
      badge.hidden = false;
    } else badge.hidden = true;
    $("#fab").hidden = !e || (me && me.role === "viewer");
  }

  async function refreshEntities() {
    state.entities = (await api("/entities")).entities;
    renderChrome();
  }

  /* ============================================================ router */

  const routes = [
    [/^\/?$/, () => go("#/dashboard")],
    [/^\/dashboard$/, viewDashboard],
    [/^\/entries$/, viewEntries],
    [/^\/entries\/new$/, () => viewEditor(null)],
    [/^\/entries\/([A-Z0-9]{26})$/, (m) => viewEntry(m[1])],
    [/^\/entries\/([A-Z0-9]{26})\/edit$/, (m) => viewEditor(m[1])],
    [/^\/approvals$/, viewApprovals],
    [/^\/accounts$/, viewAccounts],
    [/^\/reports\/(trial-balance|pnl|balance-sheet|cash-flow|ledger)$/, (m) => viewReport(m[1])],
    [/^\/settings$/, viewSettings],
    [/^\/new-company$/, viewNewCompany],
  ];

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  async function render() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const params = new URLSearchParams(qs || "");
    const section = path.split("/")[1] || "dashboard";
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === section) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#userMenu").hidden = true;
    const view = $("#view");
    if (!state.entityId && !["/new-company", "/settings"].includes(path)) {
      return viewWelcome();
    }
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (m) {
        view.replaceChildren(h("p", { class: "loading" }, "Loading…"));
        try {
          await fn(m, params);
        } catch (e) {
          if (!(e instanceof ApiError) || !/session has expired/.test(e.message)) {
            view.replaceChildren(h("div", { class: "notice error" }, e.message || "Something went wrong"));
          }
        }
        view.focus({ preventScroll: true });
        return;
      }
    }
    view.replaceChildren(h("div", { class: "empty" }, "Page not found. ", h("a", { href: "#/dashboard" }, "Go to the dashboard")));
  }

  const setView = (...nodes) => $("#view").replaceChildren(...nodes.flat(Infinity).filter((n) => n !== null && n !== undefined && n !== false));
  const pageHead = (title, sub, ...actions) =>
    h("div", { class: "page-head" }, h("div", null, h("h1", null, title), sub ? h("p", { class: "muted" }, sub) : null), actions.length ? h("div", { class: "row" }, ...actions) : null);

  function statusPill(j) {
    if (j.status === "posted" && j.reversed_by) return h("span", { class: "pill reversed" }, "Reversed");
    const label = { posted: "Posted", pending: "Awaiting approval", draft: "Draft", rejected: "Rejected" }[j.status] || j.status;
    return h("span", { class: "pill " + j.status }, label);
  }

  /* ============================================================ welcome */

  function viewWelcome() {
    const isAdmin = state.me && state.me.role !== "viewer";
    setView(
      pageHead("Welcome to the B4ES Ledger", `Signed in as ${state.me ? state.me.email : ""}`),
      h("div", { class: "card" },
        h("h2", null, "Set up your first set of books"),
        h("p", null, "Start with B4ES LLP. The UK chart of accounts is added for you, and you can change it at any time."),
        isAdmin ? h("a", { class: "btn primary", href: "#/new-company" }, "Add B4ES LLP") : h("p", { class: "muted" }, "Ask a partner to add the first company."))
    );
  }

  /* ============================================================ new company */

  function viewNewCompany() {
    const isFirst = state.entities.length === 0;
    const yearStart = new Date().getFullYear() + "-01-01";
    const f = {
      name: h("input", { required: true, value: isFirst ? "Better 4 Enterprise Solutions LLP" : "" }),
      legal_form: h("select", null,
        [["llp", "LLP"], ["ltd", "Limited company"], ["sole_trader", "Sole trader"], ["partnership", "Partnership"], ["charity", "Charity"], ["other", "Other"]].map(([v, t]) => h("option", { value: v }, t))),
      company_number: h("input", { placeholder: "Once incorporated" }),
      fy_end: h("input", { type: "date", value: new Date().getFullYear() + "-12-31" }),
      first_start: h("input", { type: "date", value: yearStart }),
      vat: h("input", { type: "checkbox" }),
      template: h("input", { type: "checkbox", checked: true }),
    };
    const submit = h("button", { class: "btn primary", type: "submit" }, "Create company");
    const form = h("form", { class: "card", onsubmit: async (ev) => {
      ev.preventDefault();
      submit.disabled = true;
      try {
        const [, mm, dd] = f.fy_end.value.split("-").map(Number);
        const r = await api("/entities", { method: "POST", body: {
          name: f.name.value, legal_form: f.legal_form.value, company_number: f.company_number.value,
          fy_end_month: mm, fy_end_day: dd, vat_registered: f.vat.checked, template: f.template.checked,
          first_year_start: f.first_start.value, first_year_end: f.fy_end.value,
        } });
        await refreshEntities();
        setEntity(r.entity.id);
        toast("Company created");
        go("#/dashboard");
      } catch (e) {
        toast(e.message, true);
        submit.disabled = false;
      }
    } },
      h("div", { class: "form-grid" },
        h("label", { class: "field wide" }, "Company name", f.name),
        h("label", { class: "field" }, "Legal form", f.legal_form),
        h("label", { class: "field" }, "Company number", f.company_number),
        h("label", { class: "field" }, "First year starts", f.first_start),
        h("label", { class: "field" }, "First year ends (year end)", f.fy_end),
        h("label", { class: "check wide" }, f.vat, "VAT registered"),
        h("label", { class: "check wide" }, f.template, "Add the UK chart of accounts")),
      h("div", { class: "row end" }, h("a", { class: "btn outline", href: "#/dashboard" }, "Cancel"), submit));
    setView(pageHead("Add a company", "Each company keeps completely separate books."), form);
  }

  /* ============================================================ dashboard */

  async function viewDashboard() {
    const d = await api(`${base()}/reports/dashboard`);
    const e = E();
    const kpi = (label, value, sub, href) => {
      const inner = h("div", { class: "card kpi" }, h("div", { class: "label" }, label), h("div", { class: "value" + (value < 0 ? " neg" : "") }, fmt(value)), sub ? h("div", { class: "sub" }, sub) : null);
      return href ? h("a", { class: "kpi-link", href }, inner) : inner;
    };
    const nodes = [pageHead(e.name, `Financial year from ${prettyDate(d.yearStart)} · today ${prettyDate(d.today)}`)];
    if (!d.accountsCount) {
      nodes.push(h("div", { class: "notice warn" }, "This company has no chart of accounts yet. ",
        h("button", { class: "linkish", type: "button", onclick: async () => {
          await api(`${base()}/accounts/template`, { method: "POST", body: {} });
          toast("UK chart of accounts added");
          render();
        } }, "Add the UK chart of accounts")));
    }
    if (!d.balanced) nodes.push(h("div", { class: "notice error" }, "Warning: the trial balance does not balance. Please tell the admin."));
    if (d.pending) nodes.push(h("div", { class: "notice warn" }, `${d.pending} ${d.pending === 1 ? "entry is" : "entries are"} awaiting approval. `, h("a", { href: "#/approvals" }, "Review")));

    nodes.push(h("div", { class: "grid kpis" },
      kpi("Cash and bank", d.cashTotal, d.cash.length ? d.cash.filter((c) => c.balance).map((c) => c.name).join(", ") || "No balances yet" : null, "#/reports/balance-sheet"),
      kpi("Income this year", d.ytd.income, `This month ${fmt(d.mtd.income)}`, "#/reports/pnl"),
      kpi("Expenses this year", d.ytd.expenses, `This month ${fmt(d.mtd.expenses)}`, "#/reports/pnl"),
      kpi("Profit this year", d.ytd.profit, `This month ${fmt(d.mtd.profit)}`, "#/reports/pnl")));

    nodes.push(h("div", { class: "two-col" },
      h("div", { class: "card" }, h("h2", null, "Income and expenses, last 12 months"), chart(d.months), h("div", { class: "legend" }, h("span", { class: "l-inc" }, "Income"), h("span", { class: "l-exp" }, "Expenses"))),
      h("div", { class: "card" }, h("h2", null, "Recent entries"),
        d.recent.length ? h("div", { class: "list" }, d.recent.map((j) =>
          h("a", { class: "list-item", href: `#/entries/${j.id}` },
            h("div", null, h("div", { class: "title" }, j.narrative), h("div", { class: "small muted" }, `#${j.number} · ${prettyDate(j.date)}`)),
            h("div", { class: "num" }, fmt(j.total_p))))) : h("p", { class: "empty" }, "No posted entries yet."),
        h("p", null, h("a", { href: "#/entries" }, "All entries")))));
    setView(...nodes);
  }

  function chart(months) {
    const W = 600, H = 220, pad = 28, bw = (W - pad * 2) / months.length;
    const max = Math.max(1, ...months.map((m) => Math.max(m.income, m.expense)));
    const y = (v) => H - pad - (Math.max(0, v) / max) * (H - pad * 2);
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart", role: "img", "aria-label": "Income and expenses by month" });
    svg.appendChild(s("line", { x1: pad, x2: W - pad, y1: H - pad, y2: H - pad, class: "axis" }));
    months.forEach((m, i) => {
      const x = pad + i * bw;
      const w = Math.max(2, bw / 2 - 3);
      const ih = H - pad - y(m.income), eh = H - pad - y(m.expense);
      const r1 = s("rect", { x: x + 2, y: y(m.income), width: w, height: Math.max(0, ih), class: "inc" });
      r1.appendChild(s("title", {}, `${m.month} income ${fmt(m.income)}`));
      const r2 = s("rect", { x: x + 2 + w + 2, y: y(m.expense), width: w, height: Math.max(0, eh), class: "exp" });
      r2.appendChild(s("title", {}, `${m.month} expenses ${fmt(m.expense)}`));
      svg.appendChild(r1);
      svg.appendChild(r2);
      const [yy, mm] = m.month.split("-");
      const label = new Date(Date.UTC(+yy, +mm - 1, 1)).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
      svg.appendChild(s("text", { x: x + bw / 2, y: H - 8, "text-anchor": "middle" }, label));
    });
    return svg;
  }

  /* ============================================================ entries */

  async function viewEntries(m, params) {
    const status = params.get("status") || "";
    const q = params.get("q") || "";
    const account = params.get("account") || "";
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (q) qs.set("q", q);
    if (account) qs.set("account", account);
    qs.set("limit", "300");
    const { journals } = await api(`${base()}/journals?${qs}`);
    const accs = await accounts();
    const accName = account ? (accs.find((a) => String(a.id) === account) || {}).name : null;

    const statusSeg = h("div", { class: "seg" }, [["", "All"], ["posted", "Posted"], ["pending", "Awaiting"], ["draft", "Drafts"], ["rejected", "Rejected"]].map(([v, t]) => {
      const p = new URLSearchParams(params); if (v) p.set("status", v); else p.delete("status");
      return h("a", { href: `#/entries?${p}`, "aria-current": status === v ? "page" : null }, t);
    }));
    const search = h("input", { type: "search", placeholder: "Search description, reference or #number", value: q });
    const searchForm = h("form", { class: "row", onsubmit: (ev) => {
      ev.preventDefault();
      const p = new URLSearchParams(params); if (search.value.trim()) p.set("q", search.value.trim()); else p.delete("q");
      go(`#/entries?${p}`);
    } }, search);

    const rows = journals.map((j) => h("tr", { class: "clickable", tabindex: "0", onclick: () => go(`#/entries/${j.id}`), onkeydown: (ev) => ev.key === "Enter" && go(`#/entries/${j.id}`) },
      h("td", null, prettyDate(j.date)),
      h("td", { class: "num" }, j.number ? "#" + j.number : ""),
      h("td", null, j.narrative, j.reference ? h("div", { class: "small muted" }, j.reference) : null),
      h("td", null, statusPill(j)),
      h("td", { class: "num" }, fmt(j.total_p))));

    setView(
      pageHead("Entries", accName ? `Showing entries on ${accName}` : null, h("a", { class: "btn primary", href: "#/entries/new" }, "New entry")),
      h("div", { class: "card" },
        h("div", { class: "row" }, statusSeg, h("div", { class: "spacer" }), searchForm),
        journals.length
          ? h("div", { class: "table-wrap" }, h("table", null, h("thead", null, h("tr", null, h("th", null, "Date"), h("th", { class: "num" }, "No."), h("th", null, "Description"), h("th", null, "Status"), h("th", { class: "num" }, "Amount"))), h("tbody", null, rows)))
          : h("p", { class: "empty" }, "No entries match.")),
      account ? h("p", null, h("a", { href: `#/reports/ledger?account=${account}` }, "Open this account's ledger")) : null
    );
  }

  async function viewEntry(id) {
    const { journal: j } = await api(`${base()}/journals/${id}`);
    const me = state.me;
    const mine = j.created_by === me.id;
    const canWrite = me.role !== "viewer";
    const actions = [];
    const doAction = async (path, body, msg) => {
      try {
        const r = await api(`${base()}/journals/${id}${path}`, { method: "POST", body: body || {} });
        toast(msg);
        await refreshEntities();
        // A reversal is a new entry: open it. Everything else re-renders this one.
        if (r && r.journal && r.journal.id !== id) go(`#/entries/${r.journal.id}`);
        else render();
      } catch (e) {
        toast(e.message, true);
      }
    };
    if (canWrite) {
      if (j.status === "draft" && (mine || me.role === "admin")) {
        actions.push(h("a", { class: "btn outline", href: `#/entries/${id}/edit` }, "Edit"));
        if (!j.requires_second) actions.push(h("button", { class: "btn primary", type: "button", onclick: () => doAction("/post", {}, "Posted") }, "Post now"));
        actions.push(approverPicker((approver) => doAction("/submit", { approver_id: approver }, "Sent for approval"), "Send for approval"));
        actions.push(h("button", { class: "btn danger", type: "button", onclick: async () => {
          if (!confirm("Delete this draft?")) return;
          try { await api(`${base()}/journals/${id}`, { method: "DELETE" }); toast("Draft deleted"); go("#/entries"); } catch (e) { toast(e.message, true); }
        } }, "Delete"));
      }
      if (j.status === "pending") {
        if (!mine) {
          const note = h("input", { placeholder: "Note (required to reject)" });
          actions.push(h("div", { class: "card decision" },
            h("h3", null, "Your decision"),
            note,
            h("div", { class: "row end" },
              h("button", { class: "btn danger", type: "button", onclick: () => doAction("/reject", { note: note.value }, "Rejected") }, "Reject"),
              h("button", { class: "btn primary", type: "button", onclick: () => doAction("/approve", { note: note.value }, "Approved and posted") }, "Approve and post"))));
        } else {
          actions.push(h("p", { class: "muted small" }, "Waiting for another partner to approve."));
          actions.push(h("button", { class: "btn outline", type: "button", onclick: () => doAction("/withdraw", {}, "Withdrawn to draft") }, "Withdraw to edit"));
        }
      }
      if (j.status === "rejected" && (mine || me.role === "admin")) {
        actions.push(h("a", { class: "btn primary", href: `#/entries/${id}/edit` }, "Edit and resend"));
        actions.push(h("button", { class: "btn danger", type: "button", onclick: async () => {
          if (!confirm("Delete this rejected entry?")) return;
          try { await api(`${base()}/journals/${id}`, { method: "DELETE" }); toast("Deleted"); go("#/entries"); } catch (e) { toast(e.message, true); }
        } }, "Delete"));
      }
      if (j.status === "posted" && !j.reversed_by) {
        const date = h("input", { type: "date", value: today() });
        const reason = h("input", { placeholder: "Reason (optional)" });
        actions.push(h("details", { class: "card" }, h("summary", null, "Reverse this entry"),
          h("p", { class: "small muted" }, "Posted entries are never edited. A reversal posts the opposite entry so the effect cancels out; then post a corrected entry."),
          h("div", { class: "form-grid" }, h("label", { class: "field" }, "Reversal date", date), h("label", { class: "field" }, "Reason", reason)),
          h("div", { class: "row end" }, h("button", { class: "btn danger", type: "button", onclick: () => doAction("/reverse", { date: date.value, note: reason.value }, "Reversal posted") }, "Post reversal"))));
      }
      actions.push(h("button", { class: "btn outline", type: "button", onclick: () => {
        sessionStorage.setItem("ledger.copy", JSON.stringify({ narrative: j.narrative, reference: j.reference, lines: j.lines }));
        go("#/entries/new");
      } }, "Copy as new"));
    }

    const hasDesc = j.lines.some((l) => l.description);
    const lines = j.lines.map((l) => h("tr", null,
      h("td", null, h("a", { href: `#/reports/ledger?account=${l.account_id}` }, `${l.account_code} ${l.account_name}`), l.contact_name ? h("div", { class: "small muted" }, l.contact_name) : null),
      hasDesc ? h("td", null, l.description || "") : null,
      h("td", { class: "num" }, fmt(l.debit_p, { blankZero: true })),
      h("td", { class: "num" }, fmt(l.credit_p, { blankZero: true }))));

    const meta = [
      ["Date", prettyDate(j.date)],
      ["Reference", j.reference || "None"],
      ["Made by", `${who(j.created_by_name, j.created_by_email)} on ${prettyDate(j.created_at)}`],
      j.requires_second ? ["Second approval", j.requested_approver_name ? `Requested from ${j.requested_approver_name}` : "Any other partner"] : null,
      j.decided_by ? [j.status === "rejected" ? "Rejected by" : "Approved by", `${j.decided_by_name || ""} on ${prettyDate(j.decided_at)}${j.decision_note ? `: ${j.decision_note}` : ""}`] : null,
      j.posted_at ? ["Posted by", `${j.posted_by_name || ""} on ${prettyDate(j.posted_at)}`] : null,
      j.reversal_of ? ["Reverses", h("a", { href: `#/entries/${j.reversal_of}` }, "the original entry")] : null,
      j.reversed_by ? ["Reversed by", h("a", { href: `#/entries/${j.reversed_by}` }, "the reversal")] : null,
    ].filter(Boolean);

    setView(
      pageHead(j.number ? `Entry #${j.number}` : "Entry", null, statusPill(j)),
      h("div", { class: "card" }, h("h2", null, j.narrative),
        h("dl", { class: "meta" }, meta.map(([k, v]) => [h("dt", null, k), h("dd", null, v)])),
        h("div", { class: "table-wrap" }, h("table", null,
          h("thead", null, h("tr", null, h("th", null, "Account"), hasDesc ? h("th", null, "Line description") : null, h("th", { class: "num" }, "Debit"), h("th", { class: "num" }, "Credit"))),
          h("tbody", null, lines, h("tr", { class: "total" }, h("td", null, "Total"), hasDesc ? h("td") : null, h("td", { class: "num" }, fmt(j.total_p)), h("td", { class: "num" }, fmt(j.total_p))))))),
      h("div", { class: "row" }, actions)
    );
  }

  function approverPicker(onChoose, label) {
    const sel = h("select", { "aria-label": "Approver" }, h("option", { value: "" }, "Any other partner"),
      state.partners.filter((p) => p.id !== state.me.id).map((p) => h("option", { value: p.id }, who(p.display_name, p.email))));
    return h("span", { class: "row" }, sel, h("button", { class: "btn gold", type: "button", onclick: () => onChoose(sel.value ? Number(sel.value) : null) }, label));
  }

  /* ============================================================ entry editor */

  async function viewEditor(id) {
    const accs = (await accounts()).filter((a) => a.active);
    if (!accs.length) {
      setView(pageHead("New entry"), h("div", { class: "notice warn" }, "Add a chart of accounts first. ", h("a", { href: "#/accounts" }, "Accounts")));
      return;
    }
    const cts = await contacts();
    let existing = null;
    if (id) existing = (await api(`${base()}/journals/${id}`)).journal;
    let copy = null;
    if (!id) {
      try { copy = JSON.parse(sessionStorage.getItem("ledger.copy") || "null"); } catch {}
      sessionStorage.removeItem("ledger.copy");
    }
    const src = existing || copy;
    const mode = { value: src ? "journal" : "quick" };

    const acctOptions = (selected, filter = () => true) => [
      h("option", { value: "" }, "Choose account…"),
      ...["asset", "liability", "equity", "income", "expense"].map((type) =>
        h("optgroup", { label: type[0].toUpperCase() + type.slice(1) },
          accs.filter((a) => a.type === type && filter(a)).map((a) => h("option", { value: a.id, selected: a.id === selected }, `${a.code} ${a.name}`)))),
    ];
    const contactOptions = (selected) => [h("option", { value: "" }, "No contact"), ...cts.map((c) => h("option", { value: c.id, selected: c.id === selected }, c.name))];

    const date = h("input", { type: "date", required: true, value: existing ? existing.date : today() });
    const reference = h("input", { placeholder: "Invoice or receipt number", value: src ? src.reference || "" : "" });
    const narrative = h("input", { required: true, placeholder: "What happened, e.g. Paid Xero subscription", value: src ? src.narrative || "" : "" });

    /* ---- quick mode: money in / out ---- */
    const banks = accs.filter((a) => a.is_bank || a.cf_class === "cash");
    const qDir = { value: "out" };
    const qBank = h("select", null, banks.map((a) => h("option", { value: a.id }, `${a.code} ${a.name}`)));
    const qAmount = h("input", { class: "amount", inputmode: "decimal", placeholder: "0.00" });
    const qCategory = h("select", null, acctOptions(null, (a) => !(a.is_bank || a.cf_class === "cash")));
    const qContact = h("select", null, contactOptions(null));
    const dirSeg = h("div", { class: "seg" });
    const setDir = (d) => {
      qDir.value = d;
      dirSeg.replaceChildren(...[["out", "Money out"], ["in", "Money in"]].map(([v, t]) => h("button", { type: "button", "aria-pressed": String(v === d), onclick: () => setDir(v) }, t)));
    };
    setDir("out");
    const quick = h("div", { class: "form-grid" },
      h("div", { class: "wide" }, dirSeg),
      h("label", { class: "field" }, "Bank or cash account", qBank),
      h("label", { class: "field" }, "Amount (£)", qAmount),
      h("label", { class: "field wide" }, "Category (what it was for)", qCategory),
      h("label", { class: "field" }, "Contact", qContact));

    /* ---- journal mode: free lines ---- */
    const linesBox = h("div", { class: "lines" });
    const totals = h("div", { class: "totals" });
    function addLine(l = {}) {
      const acct = h("select", { "aria-label": "Account" }, acctOptions(l.account_id));
      const desc = h("input", { placeholder: "Line description (optional)", value: l.description || "", "aria-label": "Line description" });
      const dr = h("input", { class: "amount", inputmode: "decimal", placeholder: "Debit", value: toInput(l.debit_p), "aria-label": "Debit" });
      const cr = h("input", { class: "amount", inputmode: "decimal", placeholder: "Credit", value: toInput(l.credit_p), "aria-label": "Credit" });
      const row = h("div", { class: "line" },
        h("div", { class: "acct" }, acct),
        h("div", { class: "desc" }, desc),
        dr, cr,
        h("button", { class: "icon-btn remove", type: "button", "aria-label": "Remove line", onclick: () => { row.remove(); recalc(); } }, "✕"));
      row._get = () => ({ account_id: acct.value ? Number(acct.value) : null, description: desc.value, debit_p: parsePence(dr.value), credit_p: parsePence(cr.value), contact_id: l.contact_id || null });
      dr.addEventListener("input", () => { if (dr.value) cr.value = ""; recalc(); });
      cr.addEventListener("input", () => { if (cr.value) dr.value = ""; recalc(); });
      linesBox.appendChild(row);
      recalc();
    }
    function recalc() {
      let d = 0, c = 0, bad = false;
      for (const row of linesBox.children) {
        const l = row._get();
        if (Number.isNaN(l.debit_p) || Number.isNaN(l.credit_p)) bad = true;
        else { d += l.debit_p; c += l.credit_p; }
      }
      const diff = d - c;
      totals.replaceChildren(
        h("span", null, "Debits ", h("strong", null, fmt(d))),
        h("span", null, "Credits ", h("strong", null, fmt(c))),
        bad ? h("span", { class: "off" }, "Check the amounts") : diff === 0 && d > 0 ? h("span", { class: "ok" }, "Balanced ✓") : h("span", { class: "off" }, `Out by ${fmt(Math.abs(diff))}`));
    }
    const srcLines = src && src.lines && src.lines.length ? src.lines : [{}, {}];
    srcLines.forEach((l) => addLine(l));
    const journal = h("div", null,
      h("div", { class: "lines-head" }, h("span", null, "Account"), h("span", null, "Description"), h("span", { class: "num" }, "Debit"), h("span", { class: "num" }, "Credit"), h("span")),
      linesBox,
      h("div", { class: "row" }, h("button", { class: "btn outline small", type: "button", onclick: () => addLine() }, "+ Add line"), h("div", { class: "spacer" }), totals));

    const modeSeg = h("div", { class: "seg" });
    const modeBox = h("div");
    const setMode = (v) => {
      mode.value = v;
      modeSeg.replaceChildren(...[["quick", "Quick"], ["journal", "Journal (debit and credit)"]].map(([k, t]) => h("button", { type: "button", "aria-pressed": String(k === v), onclick: () => setMode(k) }, t)));
      modeBox.replaceChildren(v === "quick" ? quick : journal);
    };
    setMode(mode.value);

    function collect() {
      const base = { date: date.value, reference: reference.value, narrative: narrative.value };
      if (mode.value === "quick") {
        const amount = parsePence(qAmount.value);
        if (!amount || Number.isNaN(amount)) throw new Error("Enter the amount");
        if (!qCategory.value) throw new Error("Choose a category");
        if (!qBank.value) throw new Error("Choose the bank or cash account");
        const bank = Number(qBank.value), cat = Number(qCategory.value);
        const contact = qContact.value ? Number(qContact.value) : null;
        const lines = qDir.value === "out"
          ? [{ account_id: cat, debit_p: amount, contact_id: contact }, { account_id: bank, credit_p: amount, contact_id: contact }]
          : [{ account_id: bank, debit_p: amount, contact_id: contact }, { account_id: cat, credit_p: amount, contact_id: contact }];
        return { ...base, lines, source: "quick" };
      }
      const lines = [...linesBox.children].map((r) => r._get()).filter((l) => l.account_id || l.debit_p || l.credit_p);
      if (lines.some((l) => Number.isNaN(l.debit_p) || Number.isNaN(l.credit_p))) throw new Error("Amounts must be numbers with up to 2 decimal places");
      return { ...base, lines, source: "manual" };
    }

    const busy = (b) => form.querySelectorAll("button[type=submit], .act").forEach((x) => (x.disabled = b));
    async function save(action, approverId) {
      let payload;
      try {
        payload = collect();
      } catch (e) {
        toast(e.message, true);
        return;
      }
      busy(true);
      try {
        const body = { ...payload, action, approver_id: approverId || null };
        const r = id
          ? await api(`${base()}/journals/${id}`, { method: "PUT", body })
          : await api(`${base()}/journals`, { method: "POST", body });
        toast(action === "post" ? `Posted as entry #${r.journal.number}` : action === "submit" ? "Sent for approval" : "Draft saved");
        state.accounts = null;
        await refreshEntities();
        go(`#/entries/${r.journal.id}`);
      } catch (e) {
        toast(e.message, true);
        busy(false);
      }
    }

    const approver = h("select", { "aria-label": "Approver" }, h("option", { value: "" }, "Any other partner"),
      state.partners.filter((p) => p.id !== state.me.id).map((p) => h("option", { value: p.id }, who(p.display_name, p.email))));
    const wasRejected = existing && existing.status === "rejected";
    const form = h("form", { class: "card", onsubmit: (ev) => { ev.preventDefault(); save(wasRejected ? "submit" : "post"); } },
      existing && existing.decision_note ? h("div", { class: "notice warn" }, `Rejected: ${existing.decision_note}`) : null,
      h("div", { class: "form-grid" },
        h("label", { class: "field" }, "Date", date),
        h("label", { class: "field" }, "Reference", reference),
        h("label", { class: "field wide" }, "Description", narrative)),
      h("div", { class: "row" }, modeSeg),
      modeBox,
      h("div", { class: "card" },
        h("h3", null, "How should this be recorded?"),
        h("div", { class: "row" },
          wasRejected ? null : h("button", { class: "btn primary act", type: "submit" }, "Post now"),
          h("span", { class: "row" }, approver, h("button", { class: "btn gold act", type: "button", onclick: () => save("submit", approver.value ? Number(approver.value) : null) }, "Send for second approval")),
          h("button", { class: "btn outline act", type: "button", onclick: () => save("draft") }, "Save draft")),
        h("p", { class: "small muted" }, "Post now records it straight away. Send for second approval waits until another partner approves it.")));

    setView(pageHead(id ? "Edit entry" : "New entry", E().name), form);
    narrative.focus();
  }

  /* ============================================================ approvals */

  async function viewApprovals() {
    const { journals } = await api(`${base()}/approvals`);
    const mineCount = journals.filter((j) => j.created_by === state.me.id).length;
    setView(
      pageHead("Awaiting approval", journals.length ? `${journals.length} waiting${mineCount ? `, ${mineCount} made by you (another partner must approve those)` : ""}` : null),
      journals.length
        ? h("div", { class: "list" }, journals.map((j) => h("a", { class: "list-item", href: `#/entries/${j.id}` },
          h("div", null, h("div", { class: "title" }, j.narrative), h("div", { class: "small muted" }, `${prettyDate(j.date)} · by ${who(j.created_by_name, j.created_by_email)}${j.created_by === state.me.id ? " (you)" : ""}`)),
          h("div", { class: "num" }, fmt(j.total_p)))))
        : h("div", { class: "card empty" }, "Nothing is waiting for approval.")
    );
  }

  /* ============================================================ accounts */

  const FS_LINES = {
    asset: [["tangible_assets", "Tangible fixed assets"], ["intangible_assets", "Intangible fixed assets"], ["stock", "Stocks"], ["debtors", "Debtors"], ["cash", "Cash at bank and in hand"]],
    liability: [["creditors_within_one_year", "Creditors: due within one year"], ["creditors_after_one_year", "Creditors: due after one year"]],
    equity: [["members_capital", "Members' capital"], ["share_capital", "Share capital"], ["other_reserves", "Other reserves"]],
    income: [["turnover", "Turnover"], ["other_operating_income", "Other operating income"], ["interest_receivable", "Interest receivable"]],
    expense: [["cost_of_sales", "Cost of sales"], ["admin_expenses", "Administrative expenses"], ["interest_payable", "Interest payable"], ["tax", "Tax on profit"]],
  };
  const CF_CLASSES = [["", "Not set"], ["cash", "Cash"], ["working_capital", "Working capital"], ["non_cash", "Non-cash (e.g. depreciation)"], ["investing", "Investing"], ["financing", "Financing"]];

  async function viewAccounts() {
    const accs = await accounts(true);
    const canWrite = state.me.role !== "viewer";
    const groups = ["asset", "liability", "equity", "income", "expense"].map((type) => {
      const list = accs.filter((a) => a.type === type);
      if (!list.length) return null;
      const sign = type === "asset" || type === "expense" ? 1 : -1;
      return h("div", { class: "card" },
        h("h2", null, { asset: "Assets", liability: "Liabilities", equity: "Equity", income: "Income", expense: "Expenses" }[type]),
        h("div", { class: "table-wrap" }, h("table", null,
          h("thead", null, h("tr", null, h("th", null, "Code"), h("th", null, "Name"), h("th", { class: "num" }, "Balance"), h("th"))),
          h("tbody", null, list.map((a) => h("tr", { class: a.active ? "" : "muted" },
            h("td", null, a.code),
            h("td", null, h("a", { href: `#/reports/ledger?account=${a.id}` }, a.name), a.active ? null : " (inactive)"),
            h("td", { class: "num" }, fmt(sign * a.balance_p)),
            h("td", { class: "num" }, canWrite ? h("button", { class: "linkish", type: "button", onclick: () => accountForm(a) }, "Edit") : null)))))));
    });
    setView(
      pageHead("Chart of accounts", `Balances as at ${prettyDate(today())}`, canWrite ? h("button", { class: "btn primary", type: "button", onclick: () => accountForm(null) }, "Add account") : null),
      h("div", { id: "acctForm" }),
      accs.length ? groups : h("div", { class: "card empty" }, "No accounts yet. ",
        canWrite ? h("button", { class: "btn primary", type: "button", onclick: async () => { await api(`${base()}/accounts/template`, { method: "POST", body: {} }); toast("UK chart added"); render(); } }, "Add the UK chart of accounts") : null)
    );
  }

  function accountForm(a) {
    const box = $("#acctForm");
    const used = a && a.line_count > 0;
    const type = h("select", { disabled: used || null }, ["asset", "liability", "equity", "income", "expense"].map((t) => h("option", { value: t, selected: a && a.type === t }, t[0].toUpperCase() + t.slice(1))));
    const code = h("input", { value: a ? a.code : "", required: true });
    const name = h("input", { value: a ? a.name : "", required: true });
    const fs = h("select");
    const cf = h("select", null, CF_CLASSES.map(([v, t]) => h("option", { value: v, selected: a && (a.cf_class || "") === v }, t)));
    const bank = h("input", { type: "checkbox", checked: a && a.is_bank });
    const active = h("input", { type: "checkbox", checked: !a || a.active });
    const fillFs = () => fs.replaceChildren(...FS_LINES[type.value].map(([v, t]) => h("option", { value: v, selected: a && a.fs_line === v }, t)));
    type.addEventListener("change", fillFs);
    fillFs();
    const form = h("form", { class: "card", onsubmit: async (ev) => {
      ev.preventDefault();
      const body = { code: code.value, name: name.value, type: type.value, fs_line: fs.value, cf_class: cf.value || null, is_bank: bank.checked, active: active.checked, subtype: a ? a.subtype : null };
      try {
        if (a) await api(`${base()}/accounts/${a.id}`, { method: "PATCH", body });
        else await api(`${base()}/accounts`, { method: "POST", body });
        toast("Account saved");
        state.accounts = null;
        render();
      } catch (e) { toast(e.message, true); }
    } },
      h("h2", null, a ? `Edit ${a.code} ${a.name}` : "Add account"),
      used ? h("p", { class: "small muted" }, "This account has entries, so its type is fixed.") : null,
      h("div", { class: "form-grid" },
        h("label", { class: "field" }, "Code", code),
        h("label", { class: "field" }, "Name", name),
        h("label", { class: "field" }, "Type", type),
        h("label", { class: "field" }, "Shows on statements as", fs),
        h("label", { class: "field" }, "Cash-flow class (balance sheet accounts)", cf),
        h("label", { class: "check" }, bank, "Bank or cash account"),
        h("label", { class: "check" }, active, "Active")),
      h("div", { class: "row end" }, h("button", { class: "btn outline", type: "button", onclick: () => box.replaceChildren() }, "Cancel"), h("button", { class: "btn primary", type: "submit" }, "Save")));
    box.replaceChildren(form);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    code.focus();
  }

  /* ============================================================ reports */

  const REPORTS = [["pnl", "Profit and loss"], ["balance-sheet", "Balance sheet"], ["cash-flow", "Cash flow"], ["trial-balance", "Trial balance"], ["ledger", "Account ledger"]];

  async function viewReport(kind, params) {
    params = params || new URLSearchParams(location.hash.split("?")[1] || "");
    const e = E();
    const needsRange = ["pnl", "cash-flow", "ledger"].includes(kind);
    const qs = new URLSearchParams();
    for (const k of ["from", "to", "asOf", "account"]) if (params.get(k)) qs.set(k, params.get(k));
    const accs = kind === "ledger" ? await accounts() : null;
    if (kind === "ledger" && !qs.get("account")) {
      setView(reportHead(kind, null), h("div", { class: "card" }, h("label", { class: "field" }, "Account", accountPicker(accs, null, (id) => go(`#/reports/ledger?account=${id}`)))));
      return;
    }
    const d = await api(`${base()}/reports/${kind}?${qs}`);

    const from = h("input", { type: "date", value: d.from || "" });
    const to = h("input", { type: "date", value: d.to || "" });
    const asOf = h("input", { type: "date", value: d.asOf || "" });
    const controls = h("form", { class: "row no-print", onsubmit: (ev) => {
      ev.preventDefault();
      const p = new URLSearchParams();
      if (needsRange) { p.set("from", from.value); p.set("to", to.value); } else p.set("asOf", asOf.value);
      if (qs.get("account")) p.set("account", qs.get("account"));
      go(`#/reports/${kind}?${p}`);
    } },
      needsRange ? [h("label", { class: "field" }, "From", from), h("label", { class: "field" }, "To", to)] : h("label", { class: "field" }, "As at", asOf),
      h("button", { class: "btn outline", type: "submit" }, "Update"),
      h("div", { class: "spacer" }),
      h("button", { class: "btn outline", type: "button", onclick: () => window.print() }, "Print or PDF"));

    const period = needsRange ? `${prettyDate(d.from)} to ${prettyDate(d.to)}` : `As at ${prettyDate(d.asOf)}`;
    let body, csv;
    if (kind === "trial-balance") [body, csv] = tbTable(d);
    if (kind === "pnl") [body, csv] = pnlTable(d);
    if (kind === "balance-sheet") [body, csv] = bsTable(d, e);
    if (kind === "cash-flow") [body, csv] = cfTable(d);
    if (kind === "ledger") [body, csv] = ledgerTable(d, accs);

    setView(
      reportHead(kind, csv && (() => downloadCsv(`${kind}-${e.name.replace(/\W+/g, "-")}-${d.to || d.asOf}.csv`, csv))),
      h("div", { class: "card" },
        h("div", { class: "print-only" }, h("h2", null, e.name)),
        h("h2", null, (REPORTS.find((r) => r[0] === kind) || [])[1] + (kind === "ledger" ? `: ${d.account.code} ${d.account.name}` : "")),
        h("p", { class: "muted" }, period),
        controls,
        body)
    );
  }

  function reportHead(kind, onCsv) {
    return h("div", null,
      h("div", { class: "page-head no-print" }, h("h1", null, "Reports"), onCsv ? h("button", { class: "btn outline", type: "button", onclick: onCsv }, "Download CSV") : null),
      h("div", { class: "seg no-print" }, REPORTS.map(([k, t]) => h("a", { href: `#/reports/${k}`, "aria-current": k === kind ? "page" : null }, t))),
      h("div", { class: "no-print" }, " "));
  }

  function accountPicker(accs, selected, onChange) {
    const sel = h("select", { onchange: () => sel.value && onChange(sel.value) }, h("option", { value: "" }, "Choose an account…"),
      accs.map((a) => h("option", { value: a.id, selected: a.id === selected }, `${a.code} ${a.name}`)));
    return sel;
  }

  const table = (head, rows) => h("div", { class: "table-wrap" }, h("table", null, head ? h("thead", null, h("tr", null, head.map((c, i) => h("th", { class: i ? "num" : "" }, c)))) : null, h("tbody", null, rows)));
  const tr = (cls, label, ...vals) => h("tr", { class: cls || null }, h("td", null, label), vals.map((v) => h("td", { class: "num" + (typeof v === "number" && v < 0 ? " neg" : "") }, typeof v === "number" ? fmt(v) : v || "")));

  function tbTable(d) {
    const rows = d.rows.map((r) => tr("", `${r.code} ${r.name}`, r.debit || "", r.credit || ""));
    rows.push(tr("total", "Total", d.debit, d.credit));
    if (!d.balanced) rows.push(tr("warn", "The trial balance does not balance", d.debit - d.credit, ""));
    const csv = [["Code", "Account", "Debit", "Credit"], ...d.rows.map((r) => [r.code, r.name, pounds(r.debit), pounds(r.credit)]), ["", "Total", pounds(d.debit), pounds(d.credit)]];
    return [d.rows.length ? table(["Account", "Debit", "Credit"], rows) : h("p", { class: "empty" }, "No posted entries up to this date."), csv];
  }

  function pnlTable(d) {
    const s = d.sections;
    const rows = [], csv = [["Line", "Amount"]];
    const section = (sec, negative) => {
      if (!sec.lines.length) return;
      rows.push(tr("section", sec.label));
      sec.lines.forEach((l) => { rows.push(tr("indent", `${l.code} ${l.name}`, negative ? -l.amount : l.amount)); csv.push([`${l.code} ${l.name}`, pounds(negative ? -l.amount : l.amount)]); });
      rows.push(tr("subtotal", `Total ${sec.label.toLowerCase()}`, negative ? -sec.total : sec.total));
    };
    const line = (cls, label, v) => { rows.push(tr(cls, label, v)); csv.push([label, pounds(v)]); };
    section(s.turnover);
    section(s.cost_of_sales, true);
    line("subtotal", "Gross profit", d.grossProfit);
    section(s.other_operating_income);
    section(s.admin_expenses, true);
    line("subtotal", "Operating profit", d.operatingProfit);
    section(s.interest_receivable);
    section(s.interest_payable, true);
    if (s.tax.lines.length) { line("subtotal", "Profit before tax", d.profitBeforeTax); section(s.tax, true); }
    line("total", d.profitLabel, d.profit);
    if (!d.reconciles) rows.push(tr("warn", "Some income or expense accounts are on an unexpected line; check account settings", ""));
    return [table(null, rows), csv];
  }

  function bsTable(d, e) {
    const rows = [], csv = [["Line", "Amount"]];
    const grp = (g, negative) => {
      if (!g.lines.length) return;
      rows.push(tr("section", g.label));
      g.lines.forEach((l) => { const v = negative ? -l.amount : l.amount; rows.push(tr("indent", `${l.code ? l.code + " " : ""}${l.name}`, v)); csv.push([l.name, pounds(v)]); });
    };
    const line = (cls, label, v) => { rows.push(tr(cls, label, v)); csv.push([label, pounds(v)]); };
    if (d.fixedTotal) { d.fixed.forEach((g) => grp(g)); line("subtotal", "Fixed assets", d.fixedTotal); }
    d.current.forEach((g) => grp(g));
    if (d.otherCurrent.length) grp({ label: "Other assets", lines: d.otherCurrent });
    line("subtotal", "Current assets", d.currentTotal);
    grp(d.crWithin, true);
    line("subtotal", "Net current assets", d.netCurrent);
    line("subtotal", "Total assets less current liabilities", d.totalLessCurrent);
    grp(d.crAfter, true);
    line("total", d.netAssetsLabel, d.netAssets);
    rows.push(tr("section", d.equityLabel));
    d.equity.capital.lines.forEach((l) => rows.push(tr("indent", `${l.code} ${l.name}`, l.amount)));
    d.equity.reserves.lines.forEach((l) => rows.push(tr("indent", `${l.code ? l.code + " " : ""}${l.name}`, l.amount)));
    line("total", e.legal_form === "ltd" ? "Total equity" : "Total members' other interests", d.equity.total);
    if (!d.balanced) rows.push(tr("warn", "Balance sheet difference (please tell the admin)", d.difference));
    return [table(null, rows), csv];
  }

  function cfTable(d) {
    const rows = [], csv = [["Line", "Amount"]];
    const line = (cls, label, v) => { rows.push(tr(cls, label, v)); csv.push([label, pounds(v)]); };
    const items = (list, fallback) => list.forEach((l) => line("indent", fallback(l), l.amount));
    rows.push(tr("section", "Operating activities"));
    line("indent", "Profit for the period", d.profit);
    items(d.nonCash, (l) => `Add back: ${l.name}`);
    items(d.workingCapital, (l) => `Movement in ${l.name.toLowerCase()}`);
    line("subtotal", "Net cash from operating activities", d.operatingTotal);
    rows.push(tr("section", "Investing activities"));
    items(d.investing, (l) => l.name);
    line("subtotal", "Net cash from investing activities", d.investingTotal);
    rows.push(tr("section", "Financing activities"));
    items(d.financing, (l) => l.name);
    line("subtotal", "Net cash from financing activities", d.financingTotal);
    line("total", "Net change in cash", d.netChange);
    line("", "Cash at the start of the period", d.openingCash);
    line("total", "Cash at the end of the period", d.closingCash);
    if (!d.reconciles) rows.push(tr("warn", "Unclassified difference; check cash-flow classes on accounts", d.difference));
    return [h("div", null, h("p", { class: "small muted" }, "Management cash flow, indirect method."), table(null, rows)), csv];
  }

  function ledgerTable(d, accs) {
    const debitNormal = ["asset", "expense"].includes(d.account.type);
    const shown = (b) => (debitNormal ? b : -b);
    const rows = [tr("subtotal", "Opening balance", "", "", shown(d.opening))];
    d.rows.forEach((r) => rows.push(h("tr", { class: "clickable", onclick: () => go(`#/entries/${r.journal_id}`) },
      h("td", null, prettyDate(r.date), h("div", { class: "small muted" }, `#${r.number} ${r.narrative}${r.description ? " · " + r.description : ""}${r.contact_name ? " · " + r.contact_name : ""}`)),
      h("td", { class: "num" }, fmt(r.debit_p, { blankZero: true })),
      h("td", { class: "num" }, fmt(r.credit_p, { blankZero: true })),
      h("td", { class: "num" }, fmt(shown(r.balance))))));
    rows.push(tr("total", "Closing balance", "", "", shown(d.closing)));
    const csv = [["Date", "Number", "Description", "Debit", "Credit", "Balance"], ...d.rows.map((r) => [r.date, r.number, r.narrative, pounds(r.debit_p), pounds(r.credit_p), pounds(shown(r.balance))])];
    return [h("div", null,
      h("div", { class: "row no-print" }, h("label", { class: "field" }, "Account", accountPicker(accs, d.account.id, (id) => go(`#/reports/ledger?account=${id}&from=${d.from}&to=${d.to}`)))),
      table(["Date and entry", "Debit", "Credit", "Balance"], rows)), csv];
  }

  /* ============================================================ settings */

  async function viewSettings() {
    const e = E();
    const me = state.me;
    const isAdmin = me.role === "admin";
    const canWrite = me.role !== "viewer";
    const sections = [pageHead("Settings")];

    // Profile
    const name = h("input", { value: me.display_name || "" });
    sections.push(h("form", { class: "card", onsubmit: async (ev) => {
      ev.preventDefault();
      try { const d = await api("/me", { method: "PATCH", body: { display_name: name.value } }); state.me = d.me; state.partners = d.partners; renderChrome(); toast("Name saved"); } catch (err) { toast(err.message, true); }
    } }, h("h2", null, "Your profile"), h("p", { class: "muted small" }, `${me.email} · ${me.role}`),
      h("div", { class: "row" }, h("label", { class: "field" }, "Name shown to partners", name), h("button", { class: "btn outline", type: "submit" }, "Save"))));

    if (e) {
      // Company
      const f = {
        name: h("input", { value: e.name }),
        company_number: h("input", { value: e.company_number || "" }),
        vat: h("input", { type: "checkbox", checked: !!e.vat_registered }),
        fy_end: h("input", { type: "text", value: `${String(e.fy_end_day).padStart(2, "0")}/${String(e.fy_end_month).padStart(2, "0")}`, placeholder: "DD/MM" }),
      };
      sections.push(h("form", { class: "card", onsubmit: async (ev) => {
        ev.preventDefault();
        const [dd, mm] = f.fy_end.value.split("/").map(Number);
        try {
          await api(base(), { method: "PATCH", body: { name: f.name.value, company_number: f.company_number.value, vat_registered: f.vat.checked, fy_end_day: dd, fy_end_month: mm } });
          await refreshEntities(); toast("Company saved");
        } catch (err) { toast(err.message, true); }
      } }, h("h2", null, "Company"), h("div", { class: "form-grid" },
        h("label", { class: "field" }, "Name", f.name),
        h("label", { class: "field" }, "Company number", f.company_number),
        h("label", { class: "field" }, "Year end (DD/MM)", f.fy_end),
        h("label", { class: "check" }, f.vat, "VAT registered")),
        canWrite ? h("div", { class: "row end" }, h("a", { class: "btn outline", href: "#/new-company" }, "Add another company"), h("button", { class: "btn primary", type: "submit" }, "Save")) : null));

      // Financial years
      const { years } = await api(`${base()}/fiscal-years`);
      const ys = h("input", { type: "date" }), ye = h("input", { type: "date" });
      sections.push(h("div", { class: "card" }, h("h2", null, "Financial years"),
        h("p", { class: "small muted" }, "Locking a year stops any posting into it. Only an admin can unlock."),
        years.length ? table(["Year", "Entries", "Status"], years.map((y) => h("tr", null,
          h("td", null, `${prettyDate(y.start_date)} to ${prettyDate(y.end_date)}`),
          h("td", { class: "num" }, y.posted),
          h("td", { class: "num" }, y.status === "locked" ? `Locked${y.locked_by_name ? " by " + y.locked_by_name : ""} ` : "Open ",
            canWrite && y.status === "open" ? h("button", { class: "btn small outline", type: "button", onclick: async () => { if (!confirm("Lock this year? No more entries can be posted into it.")) return; try { await api(`${base()}/fiscal-years/${y.id}/lock`, { method: "POST", body: {} }); toast("Year locked"); render(); } catch (err) { toast(err.message, true); } } }, "Lock") : null,
            isAdmin && y.status === "locked" ? h("button", { class: "btn small danger", type: "button", onclick: async () => { if (!confirm("Unlock this year?")) return; try { await api(`${base()}/fiscal-years/${y.id}/unlock`, { method: "POST", body: {} }); toast("Year unlocked"); render(); } catch (err) { toast(err.message, true); } } }, "Unlock") : null)))) : h("p", { class: "muted" }, "No financial years yet."),
        canWrite ? h("form", { class: "row", onsubmit: async (ev) => { ev.preventDefault(); try { await api(`${base()}/fiscal-years`, { method: "POST", body: { start_date: ys.value, end_date: ye.value } }); toast("Year added"); render(); } catch (err) { toast(err.message, true); } } },
          h("label", { class: "field" }, "Start", ys), h("label", { class: "field" }, "End", ye), h("button", { class: "btn outline", type: "submit" }, "Add year")) : null));

      // Contacts
      const cts = await contacts(true);
      const cn = h("input", { placeholder: "Name" });
      const ck = h("select", null, [["customer", "Customer"], ["supplier", "Supplier"], ["member", "Member"], ["employee", "Employee"], ["other", "Other"]].map(([v, t]) => h("option", { value: v }, t)));
      sections.push(h("div", { class: "card" }, h("h2", null, "Customers and suppliers"),
        cts.length ? h("p", null, cts.map((c) => `${c.name} (${c.kind})`).join(" · ")) : h("p", { class: "muted" }, "None yet."),
        canWrite ? h("form", { class: "row", onsubmit: async (ev) => { ev.preventDefault(); try { await api(`${base()}/contacts`, { method: "POST", body: { name: cn.value, kind: ck.value } }); toast("Contact added"); state.contacts = null; render(); } catch (err) { toast(err.message, true); } } },
          h("label", { class: "field" }, "Name", cn), h("label", { class: "field" }, "Type", ck), h("button", { class: "btn outline", type: "submit" }, "Add")) : null));
    }

    // Partners
    const { principals } = await api("/principals");
    sections.push(h("div", { class: "card" }, h("h2", null, "Partners"),
      h("p", { class: "small muted" }, "Anyone allowed through the Cloudflare Access sign-in appears here after their first visit."),
      table(["Partner", "Role", "Last seen"], principals.map((p) => h("tr", null,
        h("td", null, who(p.display_name, p.email), h("div", { class: "small muted" }, p.email)),
        h("td", { class: "num" }, isAdmin && p.id !== me.id
          ? h("select", { "aria-label": "Role", onchange: async (ev) => { try { await api(`/principals/${p.id}`, { method: "PATCH", body: { role: ev.target.value } }); toast("Role updated"); } catch (err) { toast(err.message, true); render(); } } },
            [["admin", "Admin"], ["partner", "Partner"], ["viewer", "View only"]].map(([v, t]) => h("option", { value: v, selected: p.role === v }, t)))
          : p.role + (p.active ? "" : " (off)"),
          isAdmin && p.id !== me.id ? h("button", { class: "btn small outline", type: "button", onclick: async () => { try { await api(`/principals/${p.id}`, { method: "PATCH", body: { active: !p.active } }); toast(p.active ? "Access switched off" : "Access restored"); render(); } catch (err) { toast(err.message, true); } } }, p.active ? "Switch off" : "Restore") : null),
        h("td", { class: "num small" }, p.last_seen_at ? prettyDate(p.last_seen_at) : ""))))));

    if (e) {
      // Audit and export
      const { audit } = await api(`${base()}/audit?limit=50`);
      sections.push(h("div", { class: "card" }, h("h2", null, "Activity log"),
        h("p", { class: "small muted" }, "Every change is recorded and cannot be edited."),
        audit.length ? table(["When and who", "Action"], audit.map((a) => h("tr", null,
          h("td", null, `${prettyDate(a.at)} ${a.at.slice(11, 16)}`, h("div", { class: "small muted" }, who(a.display_name, a.email))),
          h("td", { class: "num small" }, a.action.replace(/\./g, " "))))) : h("p", { class: "muted" }, "No activity yet."),
        h("div", { class: "row" }, h("a", { class: "btn outline", href: `/api${base()}/export` }, "Download a full backup (JSON)"))));
    }
    setView(...sections);
  }

  /* ============================================================ boot */

  document.addEventListener("DOMContentLoaded", async () => {
    $("#entitySelect").addEventListener("change", (ev) => {
      if (ev.target.value === "new") { renderChrome(); go("#/new-company"); return; }
      setEntity(Number(ev.target.value));
      render();
    });
    const userBtn = $("#userBtn"), menu = $("#userMenu");
    userBtn.addEventListener("click", () => { menu.hidden = !menu.hidden; userBtn.setAttribute("aria-expanded", String(!menu.hidden)); });
    document.addEventListener("click", (ev) => { if (!menu.hidden && !menu.contains(ev.target) && ev.target !== userBtn) menu.hidden = true; });
    $("#signOut").addEventListener("click", () => { try { localStorage.removeItem("ledger.entity"); sessionStorage.clear(); } catch {} });
    window.addEventListener("hashchange", render);

    try {
      await loadMe();
    } catch (e) {
      if (!/session has expired/.test(e.message)) setView(h("div", { class: "notice error" }, e.message));
      return;
    }
    render();

    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
})();
