// Scroll-reveal: one fade/slide per section, no stacking, respects reduced-motion
(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
})();

// Sticky utility bar: appears once the hero has scrolled past
(function () {
  var bar = document.querySelector(".utility-bar");
  var hero = document.querySelector(".hero");
  if (!bar || !hero) return;

  var trigger = document.createElement("div");
  hero.appendChild(trigger);

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        bar.classList.toggle("is-visible", !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );
  observer.observe(hero);
})();

// Call Now click tracking — the one lead metric for this site
(function () {
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (typeof window.va === "function") {
        window.va("event", { name: "call_now_click", location: link.dataset.trackLocation || "unknown" });
      }
    });
  });
})();
