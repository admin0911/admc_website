document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".solutions-page, .partners-page, .vendor-page");
  if (!root || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  if (!gsap.core.globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealElement(element, options = {}) {
    if (!element) return;

    if (prefersReduced) {
      gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: "all" });
      return;
    }

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: options.fromY ?? 22,
        x: options.fromX ?? 0,
        scale: options.fromScale ?? 1
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: options.duration ?? 0.82,
        ease: options.ease ?? "power2.out",
        scrollTrigger: {
          trigger: options.trigger || element,
          start: options.start || "top 96%",
          once: true
        }
      }
    );
  }

  function revealStagger(selector, options = {}) {
    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return;

    if (prefersReduced) {
      gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: "all" });
      return;
    }

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: options.fromY ?? 18,
        x: options.fromX ?? 0
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: options.duration ?? 0.72,
        stagger: options.stagger ?? 0.08,
        ease: options.ease ?? "power2.out",
        scrollTrigger: {
          trigger: options.trigger || elements[0].closest("section, .sol-map, .vendor-block, .partner-grid") || elements[0],
          start: options.start || "top 96%",
          once: true
        }
      }
    );
  }

  // Shared intro reveal
  revealElement(document.querySelector(".sol-hero, .part-hero, .vendor-hero"), {
    fromY: 24,
    duration: 0.78
  });

  // Page-type specific patterns
  if (document.body.classList.contains("solutions-page")) {
    revealElement(document.querySelector(".sol-deliverStrip"), { fromY: 16, duration: 0.65 });
    const isIndexPage = !!document.querySelector(".sol-deliverStrip");
    if (!isIndexPage) {
      revealStagger(".sol-grid .sol-card", { fromY: 24, stagger: 0.07, duration: 0.62 });
    }
    revealElement(document.querySelector(".sol-map"), { fromY: 26, duration: 0.75 });
    revealStagger(".sol-logoGrid a", { fromY: 14, stagger: 0.05, duration: 0.55 });
    revealStagger(".sol-detail, .sol-delivers, .sol-oem", { fromY: 20, stagger: 0.12, duration: 0.68 });
    revealElement(document.querySelector(".sol-ctaRow"), { fromY: 16, duration: 0.58 });
  }

  if (document.body.classList.contains("partners-page")) {
    revealStagger(".partner-grid .partner-card", { fromY: 20, stagger: 0.08, duration: 0.6 });
    revealElement(document.querySelector(".sol-ctaRow"), { fromY: 18, duration: 0.58 });
  }

  if (document.body.classList.contains("vendor-page")) {
    revealElement(document.querySelector(".vendor-heroLogo"), { fromX: -22, fromY: 0, duration: 0.7 });
    revealElement(document.querySelector(".vendor-hero h1")?.parentElement, { fromX: 18, fromY: 0, duration: 0.72 });
    revealStagger(".vendor-block", { fromY: 18, stagger: 0.12, duration: 0.64 });
    revealStagger(".vendor-logoRow a", { fromY: 12, stagger: 0.06, duration: 0.52 });
    revealElement(document.querySelector(".sol-ctaRow"), { fromY: 14, duration: 0.56 });
  }
});
