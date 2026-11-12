/* ==========================================================================
   红途 · 公共脚本
   负责：导航、滚动进度、进入视口动效、轻量视差与首屏余烬
   ========================================================================== */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  /* ---------- 顶部导航 ---------- */

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航");
    document.body.classList.remove("is-locked");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
      document.body.classList.toggle("is-locked", isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- 滚动进度 ---------- */

  function setProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      setHeaderState();
      setProgress();
      updateParallax();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  setHeaderState();
  setProgress();

  /* ---------- 进入视口 ---------- */

  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- 轻量视差 ---------- */

  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));

  function updateParallax() {
    if (reducedMotion || parallaxItems.length === 0) return;
    const viewportH = window.innerHeight;
    parallaxItems.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportH) return;
      const strength = parseFloat(item.dataset.parallax) || 0.04;
      const offset = (rect.top - viewportH / 2) * strength;
      item.style.setProperty("--parallax-y", offset.toFixed(1) + "px");
      item.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0) rotate(3.2deg)";
    });
  }

  updateParallax();

  /* ---------- 首屏余烬 ---------- */

  const canvas = document.getElementById("embers");

  if (canvas && !reducedMotion) {
    const context = canvas.getContext("2d");
    const hero = canvas.closest(".hero");
    let particles = [];
    let animationId = null;
    let width = 0;
    let height = 0;
    let isVisible = true;

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero ? hero.clientWidth : window.innerWidth;
      height = hero ? hero.clientHeight : window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    }

    function createParticles() {
      const count = Math.min(38, Math.max(16, Math.floor(width / 48)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.4,
          speed: Math.random() * 0.32 + 0.08,
          drift: (Math.random() - 0.5) * 0.18,
          alpha: Math.random() * 0.5 + 0.12,
          phase: Math.random() * Math.PI * 2
        };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(particle.phase) * 0.08;
        particle.phase += 0.008;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        const flicker = 0.45 + Math.sin(particle.phase * 2.2) * 0.35;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(239, 75, 51, " + (particle.alpha * flicker).toFixed(3) + ")";
        context.fill();
      });
      animationId = window.requestAnimationFrame(draw);
    }

    function start() {
      if (animationId !== null) return;
      draw();
    }

    function stop() {
      if (animationId === null) return;
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    resizeCanvas();
    start();

    window.addEventListener("resize", resizeCanvas);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
          if (isVisible) start();
          else stop();
        },
        { threshold: 0.02 }
      ).observe(hero);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (isVisible) start();
    });
  }
})();
