/* ======================================================
   HERO SECTION ANIMATIONS
   Initialize hero reveal animation with scroll trigger
====================================================== */

export function initHeroAnimations() {
  const hero = document.querySelector("[data-animate='hero-reveal']");
  const stage = hero?.querySelector(".hero-stage");
  const pill = hero?.querySelector("[data-pill]");
  const logoImg = hero?.querySelector("[data-logo]");
  const left = hero?.querySelector("[data-word='left']");
  const right = hero?.querySelector("[data-word='right']");
  const tagline = hero?.querySelector("[data-tagline]");

  if (hero && stage && pill && logoImg && left && right && tagline) {
    gsap.set(pill, { opacity: 0, scale: 0.96, y: 0 });
    gsap.set(logoImg, { opacity: 0 });
    gsap.set(tagline, { opacity: 0, y: 14 });

    const tlHero = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        invalidateOnRefresh: true
      }
    });

    tlHero.to(left, { x: "-16vw", opacity: 0, ease: "power2.out", duration: 0.55 }, 0);
    tlHero.to(right, { x: "16vw", opacity: 0, ease: "power2.out", duration: 0.55 }, 0);
    tlHero.to(pill, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.35 }, 0.10);
    tlHero.to(
      pill,
      {
        width: () => stage.clientWidth,
        height: () => stage.clientHeight,
        borderRadius: 44,
        ease: "power3.inOut",
        duration: 1.15
      },
      0.10
    );
    tlHero.to(logoImg, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.30);
    tlHero.to(
      logoImg,
      {
        clipPath: "inset(0% 0% 0% 0% round 36px)",
        ease: "power3.inOut",
        duration: 1.10
      },
      0.30
    );
    tlHero.to(pill, { y: -24, ease: "power3.inOut", duration: 0.65 }, 1.05);
    tlHero.to(tagline, { opacity: 1, y: 0, ease: "power2.out", duration: 0.55 }, 1.08);
  }
}

export function initHeaderAnimation() {
  const hero = document.querySelector("[data-animate='hero-reveal']");
  const topNav = document.querySelector("[data-top-nav]");

  if (hero && topNav) {
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      onEnter: () => {
        topNav.classList.add("is-visible");
        gsap.to(topNav, {
          y: 0,
          autoAlpha: 1,
          duration: 0.32,
          ease: "power2.out",
          overwrite: true
        });
      },
      onLeaveBack: () => {
        topNav.classList.remove("is-visible");
        gsap.to(topNav, {
          y: -16,
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.in",
          overwrite: true
        });
      }
    });
  }
}
