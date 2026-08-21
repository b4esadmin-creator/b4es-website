/* B4ES — site behaviour.
 *
 * Kept in an external file (rather than inline) so the site can ship a strict
 * Content-Security-Policy without needing 'unsafe-inline' for scripts.
 * See public/_headers.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------- mobile nav */

  var btn = document.getElementById("navToggle");
  var nav = document.getElementById("mobileNav");

  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
    });

    // Close on Escape, and return focus to the toggle.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (btn.getAttribute("aria-expanded") !== "true") return;
      btn.setAttribute("aria-expanded", "false");
      nav.hidden = true;
      btn.focus();
    });
  }

  /* ------------------------------------------------------------ contact form
   *
   * Progressive enhancement. Without JavaScript the form posts normally to
   * /api/enquiry and the Worker redirects to /thank-you/. With JavaScript we
   * submit in the background so the reader keeps their place and gets inline
   * feedback.
   */

  var form = document.getElementById("enquiryForm");
  if (!form) return;

  var statusBox = document.getElementById("formStatus");
  var submit = document.getElementById("formSubmit");
  var started = document.getElementById("started_at");

  // Lets the Worker discard submissions completed implausibly fast.
  if (started) started.value = String(Date.now());

  var FIELDS = ["name", "company", "email", "phone", "reason", "service", "message"];

  function setStatus(kind, html) {
    if (!statusBox) return;
    var tone =
      kind === "error"
        ? "border-[#b8894a]/40 bg-[#f6efe3] text-[#7a5628]"
        : "border-teal/30 bg-teal-wash text-teal-dark";
    statusBox.innerHTML =
      '<div class="rounded-lg border ' + tone + ' px-4 py-3 text-[0.9375rem] leading-relaxed">' +
      html +
      "</div>";
  }

  function clearStatus() {
    if (statusBox) statusBox.innerHTML = "";
  }

  function pending(on) {
    if (!submit) return;
    var label = submit.querySelector("[data-label]");
    submit.disabled = on;
    submit.setAttribute("aria-busy", String(on));
    if (label) label.textContent = on ? "Sending…" : "Send enquiry";
    submit.style.opacity = on ? "0.65" : "";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  form.addEventListener("submit", function (e) {
    // No fetch support: let the browser post the form normally.
    if (typeof window.fetch !== "function") return;

    e.preventDefault();
    clearStatus();

    var payload = { consent: form.consent && form.consent.checked };
    FIELDS.forEach(function (f) {
      var el = document.getElementById(f);
      if (el) payload[f] = el.value;
    });
    var hp = document.getElementById("website");
    if (hp) payload.website = hp.value;
    if (started) payload.started_at = Number(started.value) || 0;

    pending(true);

    fetch(form.getAttribute("action"), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (r) {
        if (r.status === 200 && r.data.ok) {
          form.reset();
          if (started) started.value = String(Date.now());
          setStatus(
            "ok",
            "<strong>Thank you — that has reached us.</strong><br>" +
              "We reply to every enquiry within one working day." +
              (r.data.id ? " Your reference is #" + escapeHtml(r.data.id) + "." : "")
          );
          if (statusBox) statusBox.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }

        if (r.status === 422 && r.data.errors) {
          var msgs = Object.keys(r.data.errors).map(function (k) {
            return "<li>" + escapeHtml(r.data.errors[k]) + "</li>";
          });
          setStatus(
            "error",
            "<strong>Please check the form.</strong><ul class=\"mt-1.5 list-disc pl-5\">" +
              msgs.join("") +
              "</ul>"
          );
          return;
        }

        setStatus(
          "error",
          "<strong>That did not send.</strong><br>" +
            escapeHtml(r.data.error || "Please try again, or email us directly at ") +
            (r.data.error ? "" : escapeHtml(form.getAttribute("data-fallback-email") || "") + ".")
        );
      })
      .catch(function () {
        var to = form.getAttribute("data-fallback-email") || "";
        setStatus(
          "error",
          "<strong>We could not reach the server.</strong><br>Please try again, or email us at " +
            '<a class="font-semibold underline" href="mailto:' + escapeHtml(to) + '">' +
            escapeHtml(to) + "</a>."
        );
      })
      .then(function () {
        pending(false);
      });
  });
})();
