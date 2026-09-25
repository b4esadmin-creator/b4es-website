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


  /* ============================================================ motion
   *
   * The animation vocabulary mirrors what B4ES does: ascending bars (the
   * mark), capacity moving off a practice's plate, and a process that draws
   * itself as you move through it.
   *
   * Reveals use a single drain-list sweep rather than IntersectionObserver.
   * IO only reports elements that are intersecting when it samples, so a fast
   * flick or an anchor jump can carry an element past the viewport without a
   * callback ever firing — leaving it hidden forever. A sweep that reveals
   * anything at or above the trigger line is correct at any scroll speed, and
   * it costs nothing once the list has drained.
   * ============================================================ */

  var reduced = false;
  try {
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  if (!reduced) {
    var pending = [];

    var easeOut = function (t) {
      return 1 - Math.pow(1 - t, 3);
    };

    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      var prefix = el.getAttribute("data-count-prefix") || "";
      var suffix = el.getAttribute("data-count-suffix") || "";
      var duration = parseInt(el.getAttribute("data-count-duration") || "1500", 10);
      var start = null;

      var frame = function (now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        el.textContent = prefix + (target * easeOut(t)).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    var activate = function (item) {
      var el = item.el;
      if (item.kind === "count") {
        runCount(el);
        return;
      }
      if (item.kind === "tz") {
        Array.prototype.forEach.call(el.querySelectorAll(".tz-hand"), function (hand) {
          hand.style.transform = "rotate(" + (hand.getAttribute("data-deg") || 0) + "deg)";
        });
        return;
      }
      el.classList.add("is-in");
      window.setTimeout(function () {
        el.classList.add("is-done");
      }, 1600);
    };

    var collect = function (selector, kind) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
        if (kind === "count") {
          // Preserve the true value for assistive tech before zeroing the
          // visible text, so the number is never announced as 0.
          el.setAttribute("aria-label", el.textContent.trim());
          el.textContent =
            (el.getAttribute("data-count-prefix") || "") +
            "0" +
            (el.getAttribute("data-count-suffix") || "");
        }
        pending.push({ el: el, kind: kind });
      });
    };

    collect("[data-reveal], .rule-wipe, .cap-track[data-cap]", "reveal");
    collect("[data-count]", "count");
    collect("[data-tz]", "tz");

    var sweep = function (vh) {
      if (!pending.length) return;
      var line = vh * 0.9; // reveal once the element's top crosses 90% of the viewport
      var still = [];
      for (var i = 0; i < pending.length; i++) {
        var item = pending[i];
        if (item.el.getBoundingClientRect().top < line) activate(item);
        else still.push(item);
      }
      pending = still;
    };

    /* ---------- scroll-linked: progress rail, drawn lines, drift ---------- */

    var rail = document.querySelector("[data-progress]");
    var drawers = Array.prototype.slice.call(document.querySelectorAll("[data-draw]"));
    var drifters = Array.prototype.slice.call(document.querySelectorAll(".drift"));
    var ticking = false;

    var onFrame = function () {
      ticking = false;
      var vh = window.innerHeight;

      sweep(vh);

      if (rail) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - vh;
        var p = max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0;
        rail.style.setProperty("--p", p.toFixed(4));
      }

      drawers.forEach(function (wrap) {
        var line = wrap.querySelector(".draw-line");
        if (!line) return;
        var r = wrap.getBoundingClientRect();
        // 0 as the block's top reaches 75% of the viewport, 1 once it has passed.
        var span = r.height + vh * 0.2;
        var p = Math.min(Math.max((vh * 0.75 - r.top) / span, 0), 1);
        line.style.setProperty("--p", p.toFixed(4));

        var dots = wrap.querySelectorAll(".step-dot");
        var lit = Math.round(p * dots.length);
        Array.prototype.forEach.call(dots, function (dot, i) {
          dot.classList.toggle("is-lit", i < lit);
        });
      });

      drifters.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var offset = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
        var strength = parseFloat(el.getAttribute("data-drift") || "18");
        el.style.setProperty("--drift", (-offset * strength).toFixed(2) + "px");
      });
    };

    var request = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onFrame);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    // Images and late layout shifts move things; re-check when the page settles.
    window.addEventListener("load", request);
    request();
  }

  /* ------------------------------------------------------------ contact form
   *
   * Progressive enhancement. Without JavaScript the form posts normally to
   * /api/enquiry and the Worker redirects to /thank-you/. With JavaScript we
   * submit in the background so the reader keeps their place and gets inline
   * feedback.
   */

  var form = document.getElementById("enquiryForm");
  if (!form) return; // motion is already wired above; nothing else to do here

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
        ? "border-gold/40 bg-gold-wash text-gold-deep"
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
