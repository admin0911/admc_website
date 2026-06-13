/* ======================================================
   SERVICES SECTION ANIMATIONS
   Scroll-pinned cards with parallax effect
====================================================== */

export function initServicesAnimations() {
  const services = document.querySelector("[data-animate='services']");

  if (!services) return;

  const chunks = Array.from(services.querySelectorAll("[data-step]"));
  const cardsTrack = services.querySelector("[data-cards-track]");
  const viewport = services.querySelector("[data-cards-viewport]");
  const cards = Array.from(services.querySelectorAll("[data-card]"));

  if (!cardsTrack || !viewport || !cards.length) return;

  const gap = () => parseFloat(getComputedStyle(cardsTrack).gap) || 0;
  const peekRatio = () => {
    const v = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--peek-ratio")
    );
    return Number.isFinite(v) ? v : 0.5;
  };

  function setActiveIndex(activeIdx) {
    chunks.forEach((el, i) => el.classList.toggle("is-active", i <= activeIdx));
    cards.forEach((c, i) => c.classList.toggle("is-active", i === activeIdx));
  }

  function computeYForCard(i) {
    const g = gap();
    let offsetTop = 0;
    for (let k = 0; k < i; k++) {
      offsetTop += cards[k].offsetHeight + g;
    }

    const thisH = cards[i].offsetHeight;
    const next = cards[i + 1];
    const nextH = next ? next.offsetHeight : thisH;

    const vpH = viewport.clientHeight;
    const peekPx = next ? nextH * peekRatio() : 0;

    const desiredTop = Math.max(0, vpH - peekPx - thisH);
    return -(offsetTop - desiredTop);
  }

  let yPositions = [];

  function rebuildPositions() {
    yPositions = cards.map((_, i) => computeYForCard(i));
  }

  const setY = gsap.quickTo(cardsTrack, "y", { duration: 0.65, ease: "power3.out" });

  function yAtProgress(p) {
    const max = cards.length - 1;
    const raw = gsap.utils.clamp(0, max, p * max);
    const i0 = Math.floor(raw);
    const i1 = Math.min(max, i0 + 1);
    const t = raw - i0;
    return gsap.utils.interpolate(yPositions[i0], yPositions[i1], t);
  }

  rebuildPositions();
  setActiveIndex(0);
  gsap.set(cardsTrack, { y: yPositions[0] });

  ScrollTrigger.create({
    trigger: services,
    start: "top top",
    end: () => "+=" + Math.max(1, services.offsetHeight - window.innerHeight),
    pin: services.querySelector(".services-sticky"),
    scrub: 1.2,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      setY(yAtProgress(self.progress));
      setActiveIndex(Math.round(self.progress * (cards.length - 1)));
    }
  });

  window.addEventListener("load", () => {
    rebuildPositions();
    ScrollTrigger.refresh();
  });
  window.addEventListener("resize", () => {
    rebuildPositions();
    ScrollTrigger.refresh();
  });
}
