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
      if (window.matchMedia("(max-width:1280px)").matches && !li.classList.contains("open")) {
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
  autoTargets.forEach(function (el) { el.classList.add("reveal"); });
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
      if (b.dataset.busy) return;
      b.dataset.busy = "1";
      var done = function (ok) {
        var old = b.getAttribute("data-label") || b.innerHTML;
        b.setAttribute("data-label", old);
        b.classList.toggle("copied", ok);
        b.innerHTML = ok ? "&#10003; Copied" : "&#10007; Press Ctrl+C";
        setTimeout(function () {
          b.classList.remove("copied");
          b.innerHTML = old;
          b.removeAttribute("data-busy");
          b.removeAttribute("data-label");
        }, 2000);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed"; ta.style.top = "-9999px";
        document.body.appendChild(ta); ta.focus(); ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---- Preselect contact form topic from ?topic= ---- */
  var topicParam = new URLSearchParams(window.location.search).get("topic");
  if (topicParam) {
    var topicSel = document.querySelector('.contact-form select[name="topic"]');
    if (topicSel) {
      for (var i = 0; i < topicSel.options.length; i++) {
        if (topicSel.options[i].text.toLowerCase() === topicParam.toLowerCase()) {
          topicSel.selectedIndex = i; break;
        }
      }
    }
  }

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

  /* ---- Contact form: dynamic email subject ---- */
  var cform = document.querySelector(".contact-form");
  if (cform) {
    cform.addEventListener("submit", function () {
      var subj = cform.querySelector('input[name="subject"]');
      var topic = cform.querySelector('select[name="topic"]');
      var nameF = cform.querySelector('input[name="name"]');
      if (subj) {
        subj.value = "Bethesda website — " + (topic ? topic.value : "Enquiry") +
          (nameF && nameF.value ? " from " + nameF.value : "");
      }
    });
  }

  /* ---- Nav shadow on scroll ---- */
  var nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  /* ---- "We're live" banner (Sunday 08:45–10:30 SAST) ---- */
  (function () {
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 120) * 60000); // SAST = UTC+2
    var mins = now.getHours() * 60 + now.getMinutes();
    if (now.getDay() === 0 && mins >= 525 && mins <= 630) {
      var bar = document.createElement("a");
      bar.className = "live-banner";
      bar.href = "https://www.youtube.com/@BethesdaMethodistMission902/streams";
      bar.target = "_blank";
      bar.rel = "noopener";
      bar.innerHTML = '<span class="live-dot"></span> We are LIVE right now — join the 09:00 Family Service &rarr;';
      var navEl = document.querySelector("nav");
      if (navEl) navEl.insertAdjacentElement("afterend", bar);
    }
  })();

  /* ---- Daily verse (homepage hero) ---- */
  var verseEl = document.getElementById("dailyVerse");
  if (verseEl) {
    var verses = [
      ["Now there is in Jerusalem near the Sheep Gate a pool… called Bethesda… Here a great number of disabled people used to lie.", "John 5:2–3"],
      ["He heals the brokenhearted and binds up their wounds.", "Psalm 147:3"],
      ["Come to me, all you who are weary and burdened, and I will give you rest.", "Matthew 11:28"],
      ["The Lord is my shepherd, I lack nothing.", "Psalm 23:1"],
      ["I can do all this through him who gives me strength.", "Philippians 4:13"],
      ["Trust in the Lord with all your heart and lean not on your own understanding.", "Proverbs 3:5"],
      ["Be strong and courageous… for the Lord your God will be with you wherever you go.", "Joshua 1:9"],
      ["And we know that in all things God works for the good of those who love him.", "Romans 8:28"],
      ["The Lord bless you and keep you; the Lord make his face shine on you.", "Numbers 6:24–25"],
      ["Let all that you do be done in love.", "1 Corinthians 16:14"],
      ["This is the day that the Lord has made; let us rejoice and be glad in it.", "Psalm 118:24"],
      ["Cast all your anxiety on him because he cares for you.", "1 Peter 5:7"],
      ["For where two or three gather in my name, there am I with them.", "Matthew 18:20"],
      ["Your word is a lamp for my feet, a light on my path.", "Psalm 119:105"]
    ];
    var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    var v = verses[dayOfYear % verses.length];
    verseEl.innerHTML = "&ldquo;" + v[0] + "&rdquo; <cite>&mdash; " + v[1] + "</cite>";
    verseEl.hidden = false;
  }
})();
