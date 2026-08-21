/* B4ES — site behaviour.
 *
 * Kept in an external file (rather than inline) so the site can ship a strict
 * Content-Security-Policy without needing 'unsafe-inline' for scripts.
 * See _headers.
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

    // Close the menu on Escape, and return focus to the toggle.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (btn.getAttribute("aria-expanded") !== "true") return;
      btn.setAttribute("aria-expanded", "false");
      nav.hidden = true;
      btn.focus();
    });
  }

  /* ------------------------------------------------- contact form fallback
   *
   * If the form has no action attribute, no handler is wired up yet, so we
   * compose a pre-filled email instead of silently losing the enquiry.
   * Once a real endpoint is set on the form's action, this does nothing.
   */

  var form = document.getElementById("enquiryForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    if (form.getAttribute("action")) return; // a real handler is configured

    var to = form.getAttribute("data-fallback-email");
    if (!to) return;

    e.preventDefault();

    var val = function (id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    };

    var subject = "Website enquiry — " + (val("company") || val("name") || "New enquiry");
    var body = [
      "Name: " + val("name"),
      "Firm or company: " + val("company"),
      "Email: " + val("email"),
      "Phone: " + val("phone"),
      "Reason: " + val("reason"),
      "Service of interest: " + val("service"),
      "",
      val("message"),
    ].join("\n");

    window.location.href =
      "mailto:" + to +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
