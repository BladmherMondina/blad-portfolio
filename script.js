// Enhancements: scroll progress bar, reveal-on-scroll, project count, year,
// contact form copy-to-clipboard, and controller mini-game.

(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Project count
  const projects = document.querySelectorAll("[data-project]");
  const statProjects = document.getElementById("statProjects");
  if (statProjects) statProjects.textContent = String(projects.length);

  // Scroll progress bar
  const bar = document.getElementById("scrollbar");
  function onScroll(){
    if (!bar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);

  // Reveal-on-scroll
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".hero__copy, .hero__card, .section, .card, .item");
  if (!prefersReduced) {
    targets.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add("in"));
  }

  // Contact form -> copy mailto
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();

    const subject = encodeURIComponent("Portfolio inquiry");
    const body = encodeURIComponent(
      `Hi Bladmher,\n\nMy name is ${name} (${email}).\n\n${message}\n\nThanks,\n${name}`
    );
    const mailto = `mailto:bladmhermondina@gmail.com?subject=${subject}&body=${body}`;

    try {
      await navigator.clipboard.writeText(mailto);
      if (hint) hint.textContent = "Copied a ready-to-use mailto link to your clipboard. Paste it into your browser address bar or a note.";
      form.reset();
    } catch {
      window.location.href = mailto;
    }
  });

  // Controller mini-game
  const field = document.getElementById("field");
  const controller = document.getElementById("controller");
  const scoreEl = document.getElementById("score");
  const resetBtn = document.getElementById("reset");

  let score = 0;
  let interval = 950;
  let timer = null;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function placeController() {
    if (!field || !controller) return;

    const pad = 10;
    const fw = field.clientWidth;
    const fh = field.clientHeight;
    const size = controller.offsetWidth;

    const x = rand(pad, Math.max(pad, fw - size - pad));
    const y = rand(pad, Math.max(pad, fh - size - pad));

    controller.style.left = x + "px";
    controller.style.top = y + "px";

    controller.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
      { duration: 190, easing: "ease-out" }
    );
  }

  function tick() {
    placeController();
    clearTimeout(timer);
    timer = setTimeout(tick, interval);
  }

  function setScore(next) {
    score = next;
    if (scoreEl) scoreEl.textContent = String(score);
    interval = Math.max(320, 950 - Math.floor(score / 5) * 90);
  }

  controller?.addEventListener("click", () => {
    setScore(score + 1);
    placeController();
  });

  controller?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") placeController();
  });

  resetBtn?.addEventListener("click", () => {
    setScore(0);
    placeController();
  });

  window.addEventListener("load", () => {
    placeController();
    tick();
  });

  window.addEventListener("resize", () => placeController());
})();
