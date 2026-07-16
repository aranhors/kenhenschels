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

// Interactive Neural Noise Canvas Background
(function () {
  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: null, y: null, radius: 160 };

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    particles = [];
    var density = Math.min(Math.floor((canvas.width * canvas.height) / 7500), 75);
    for (var i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        baseRadius: Math.random() * 2 + 1
      });
    }
  }

  function bindEvents() {
    window.addEventListener("resize", function () {
      resize();
      init();
    });

    var parent = canvas.parentElement;
    parent.addEventListener("mousemove", function (e) {
      var rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    parent.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse interaction: pull particles gently
      if (mouse.x !== null) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          p.x += dx * 0.008;
          p.y += dy * 0.008;
          p.radius = p.baseRadius * 1.4;
        } else {
          p.radius = p.baseRadius;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(102, 168, 139, 0.28)"; // --color-sage-on-dark at 28% opacity
      ctx.fill();
    });

    // Draw lines
    for (var i = 0; i < particles.length; i++) {
      var p1 = particles[i];
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          var alpha = (1 - dist / 100) * 0.15;
          ctx.strokeStyle = "rgba(102, 168, 139, " + alpha + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Mouse connection
      if (mouse.x !== null) {
        var dx = p1.x - mouse.x;
        var dy = p1.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          var alpha = (1 - dist / mouse.radius) * 0.22;
          ctx.strokeStyle = "rgba(102, 168, 139, " + alpha + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  init();
  bindEvents();
  animate();
})();
