/* ======================================================
   SOLUTIONS SECTION ANIMATIONS
   Includes both solutions grid and solutions showcase
====================================================== */

export function initSolutionsGridAnimations() {
  const solutionsSection = document.querySelector("#solutions");
  const solutionsHeader = solutionsSection?.querySelector(".solutions__header");
  const solutionCards = gsap.utils.toArray(".solutions__grid .solution-card");

  if (!solutionsSection || !solutionCards.length) return;

  /* Animate header on scroll into view */
  if (solutionsHeader) {
    ScrollTrigger.create({
      trigger: solutionsSection,
      start: "top 96%",
      once: true,
      onEnter: () => {
        gsap.to(solutionsHeader, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    });
  }

  /* Staggered card reveals on scroll */
  ScrollTrigger.create({
    trigger: solutionsSection,
    start: "top 96%",
    once: true,
    onEnter: () => {
      gsap.to(solutionCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power4.out"
      });
    }
  });

  /* Card hover animation enhancement (GSAP for smooth transitions) */
  solutionCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -12,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        overwrite: false
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: false
      });
    });
  });
}

export function initSolutionsShowcaseAnimations() {
  const showcaseHeading = document.querySelector(".solutions-showcase .showcase-heading h2");
  const showcaseCards = gsap.utils.toArray(".solutions-showcase .showcase-card");

  if (!showcaseCards.length) return;

  /* Heading reveal on scroll */
  if (showcaseHeading) {
    ScrollTrigger.create({
      trigger: ".solutions-showcase",
      start: "top 96%",
      once: true,
      onEnter: () => {
        gsap.to(showcaseHeading, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out"
        });
      }
    });
  }

  /* Staggered card reveals */
  ScrollTrigger.create({
    trigger: ".solutions-showcase",
    start: "top 96%",
    once: true,
    onEnter: () => {
      gsap.to(showcaseCards, {
        y: 0,
        scale: 1,
        opacity: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: "power4.out"
      });
    }
  });

  /* Hover animations with icon bounce */
  showcaseCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -16,
        scale: 1.02,
        duration: 0.28,
        overwrite: false,
        ease: "power2.out"
      });

      const icon = card.querySelector(".showcase-card-icon");
      if (icon) {
        gsap.to(icon, {
          y: -4,
          scale: 1.1,
          duration: 0.26,
          overwrite: false,
          ease: "none"
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.28,
        overwrite: false,
        ease: "power2.out"
      });

      const icon = card.querySelector(".showcase-card-icon");
      if (icon) {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          duration: 0.26,
          overwrite: false,
          ease: "none"
        });
      }
    });
  });
}
