/* Bethesda Methodist Mission — shared site scripts */
(function () {
  "use strict";

  /* ---- Mobile nav: hamburger + tap-to-open dropdowns ---- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("navLinks");
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", navLinks.classList.contains("open"));
    });
  }
  // On small screens, first tap on a parent item opens its dropdown instead of navigating
  document.querySelectorAll(".nav-links > li").forEach(function (li) {
    var link = li.querySelector(":scope > a");
    var dd = li.querySelector(":scope > .dropdown");
    if (!link || !dd) return;
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width:1080px)").matches && !li.classList.contains("open")) {
        e.preventDefault();
        document.querySelectorAll(".nav-links > li.open").forEach(function (o) { o.classList.remove("open"); });
        li.classList.add("open");
      }
    });
  });

  /* ---- Reveal on scroll ---- */
  var autoTargets = document.querySelectorAll(
    ".card, .event-card, .detail-card, .service-card, .section-title, .section-sub, .notice-list li"
  );
  autoTargets.forEach(function (el, i) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Back to top ---- */
  var btn = document.createElement("button");
  btn.id = "backTop";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "&#8679;";
  document.body.appendChild(btn);
  btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  /* ---- Copy to clipboard (giving page) ---- */
  document.querySelectorAll(".copy-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy") || "";
      var done = function () {
        var old = b.innerHTML;
        b.classList.add("copied");
        b.innerHTML = "&#10003; Copied";
        setTimeout(function () { b.classList.remove("copied"); b.innerHTML = old; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---- Event countdown (homepage) ---- */
  var cd = document.getElementById("countdown");
  if (cd) {
    var target = new Date(cd.getAttribute("data-date")).getTime();
    var ids = ["cdD", "cdH", "cdM", "cdS"];
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        var wrap = document.getElementById("countdownWrap");
        if (wrap) wrap.style.display = "none";
        return;
      }
      var d = Math.floor(diff / 864e5);
      var h = Math.floor(diff % 864e5 / 36e5);
      var m = Math.floor(diff % 36e5 / 6e4);
      var s = Math.floor(diff % 6e4 / 1e3);
      [d, h, m, s].forEach(function (v, i) {
        var el = document.getElementById(ids[i]);
        if (el) el.textContent = String(v).padStart(2, "0");
      });
      setTimeout(tick, 1000);
    };
    tick();
  }
})();
