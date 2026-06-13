/* ======================================================
   WHY ADMC SECTION ANIMATIONS
   Scroll-stepped cards with staggered content reveals
====================================================== */

export function initWhyAdmcAnimations() {
  const why2Section = document.querySelector("[data-animate='why-admc-stagger']");
  const why2Pin = why2Section?.querySelector("[data-why2-pin]");
  const why2Cards = why2Section
    ? gsap.utils.toArray(why2Section.querySelectorAll("[data-why2-card]"))
    : [];

  if (!why2Section || !why2Pin || !why2Cards.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = -1;

  function showCard(nextIndex) {
    if (nextIndex === activeIndex) return;

    const prevCard = activeIndex >= 0 ? why2Cards[activeIndex] : null;
    const nextCard = why2Cards[nextIndex];
    const nextItems = nextCard.querySelectorAll("[data-why2-stagger]");

    if (prevCard) {
      gsap.to(prevCard, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
        duration: prefersReduced ? 0 : 0.3,
        ease: "power2.out",
        overwrite: true
      });
    }

    why2Cards.forEach((card, i) => gsap.set(card, { zIndex: i === nextIndex ? 2 : 1 }));

    gsap.to(nextCard, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: prefersReduced ? 0 : 0.5,
      ease: "power3.out",
      overwrite: true
    });

    if (!prefersReduced) {
      gsap.fromTo(
        nextItems,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.07,
          overwrite: true
        }
      );
    } else {
      gsap.set(nextItems, { autoAlpha: 1, y: 0 });
    }

    activeIndex = nextIndex;
  }

  gsap.set(why2Cards, { autoAlpha: 0, y: 24, scale: 0.98 });
  showCard(0);

  ScrollTrigger.create({
    trigger: why2Pin,
    start: "top top+=24",
    end: () => "+=" + Math.max(1, (why2Cards.length - 1) * window.innerHeight * 0.85),
    pin: true,
    scrub: prefersReduced ? false : 0.9,
    snap: prefersReduced ? false : why2Cards.length > 1 ? 1 / (why2Cards.length - 1) : 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(
        why2Cards.length - 1,
        Math.round(self.progress * (why2Cards.length - 1))
      );
      showCard(idx);
    }
  });
}
