/* ======================================================
   MAIN ANIMATION COORDINATOR
   Initialize GSAP and ScrollTrigger plugins
   Coordinate all section animations
====================================================== */

// This file initializes all animations
// Can be used with export imports or as a standalone script

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Initialize animations on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    // Import and initialize all animation modules
    initializeAllAnimations();
  });

  // Main initialization function
  function initializeAllAnimations() {
    initThemeToggle();
    initAboutDropdown();

    // Hero animations
    initHeroAnimations();
    initHeaderAnimation();

    // Services animations
    initServicesAnimations();

    // Solutions animations
    initSolutionsGridAnimations();
    initSolutionsShowcaseAnimations();

    // Why ADMC animations
    initWhyAdmcAnimations();
    initEndorsementsCarousel();

    // Refresh ScrollTrigger on load and resize (debounced)
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });

    let _resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    });
  }

  document.addEventListener("admc:header-ready", () => {
    initThemeToggle();
    initAboutDropdown();
    initHeaderAnimation();
  });

  function initAboutDropdown() {
    const about = document.querySelector(".top-nav__about");
    const toggle = about?.querySelector(".top-nav__aboutToggle");
    const menu = about?.querySelector(".top-nav__aboutMenu");

    if (!about || !toggle || !menu) return;
    if (about.dataset.bound === "1") return;
    about.dataset.bound = "1";

    let closeTimer = null;

    function setOpen(nextOpen) {
      about.classList.toggle("is-open", nextOpen);
      toggle.setAttribute("aria-expanded", nextOpen ? "true" : "false");
    }

    function clearCloseTimer() {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function scheduleClose() {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => setOpen(false), 260);
    }

    about.addEventListener("mouseenter", () => {
      clearCloseTimer();
      setOpen(true);
    });

    about.addEventListener("mouseleave", () => {
      scheduleClose();
    });

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      clearCloseTimer();
      setOpen(!about.classList.contains("is-open"));
    });

    document.addEventListener("click", (event) => {
      if (!about.contains(event.target)) {
        clearCloseTimer();
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpen(false);
      }
    });
  }

  /* ======== HERO ANIMATIONS ======== */
  function initHeroAnimations() {
    const hero = document.querySelector("[data-animate='hero-reveal']");
    const stage = hero?.querySelector(".hero-stage");
    const pill = hero?.querySelector("[data-pill]");
    const logoImg = hero?.querySelector("[data-logo]");
    const left = hero?.querySelector("[data-word='left']");
    const right = hero?.querySelector("[data-word='right']");
    const tagline = hero?.querySelector("[data-tagline]");
    const scrollHint = hero?.querySelector("[data-scroll-hint]");

    if (hero && stage && pill && logoImg && left && right && tagline) {
      gsap.set(pill, { opacity: 0, scale: 0.96, y: 0 });
      gsap.set(logoImg, { opacity: 0 });
      gsap.set(tagline, { opacity: 0, y: 12 });
      if (scrollHint) {
        gsap.set(scrollHint, { autoAlpha: 0, y: 0 });
      }

      // Auto-playing timeline — fluid, overlapping sequence
      const tlHero = gsap.timeline({ delay: 0.2 });

      // Words fly out immediately
      tlHero.to(left, { x: "-18vw", opacity: 0, ease: "power3.out", duration: 0.6 }, 0);
      tlHero.to(right, { x: "18vw", opacity: 0, ease: "power3.out", duration: 0.6 }, 0);

      // Pill fades in and expands in one smooth arc
      tlHero.to(pill, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.42 }, 0.1);
      tlHero.to(
        pill,
        {
          width: () => stage.clientWidth,
          height: () => stage.clientHeight,
          borderRadius: 44,
          ease: "expo.inOut",
          duration: 1.7
        },
        0.1
      );

      // Logo appears while pill is expanding
      tlHero.to(logoImg, { opacity: 1, duration: 0.32, ease: "power2.out" }, 0.44);
      tlHero.to(
        logoImg,
        {
          clipPath: "inset(0% 0% 0% 0% round 36px)",
          ease: "expo.inOut",
          duration: 1.5
        },
        0.44
      );

      // Tagline slides in (overlaps the end of logo reveal)
      tlHero.to(tagline, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 }, 1.46);

      // On complete: reveal scroll hint AND show header without requiring scroll
      tlHero.eventCallback("onComplete", () => {
        if (scrollHint) {
          gsap.to(scrollHint, { autoAlpha: 1, duration: 0.38, ease: "power2.out" });
        }
        const topNav = document.querySelector("[data-top-nav]");
        if (topNav && !topNav.classList.contains("is-visible")) {
          topNav.classList.add("is-visible");
          gsap.to(topNav, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true });
        }
      });
    }
  }

  function initHeaderAnimation() {
    const hero = document.querySelector("[data-animate='hero-reveal']");
    const topNav = document.querySelector("[data-top-nav]");

    if (hero && topNav) {
      if (topNav.dataset.headerAnimBound === "1") return;
      topNav.dataset.headerAnimBound = "1";
      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnter: () => {
          if (!topNav.classList.contains("is-visible")) {
            topNav.classList.add("is-visible");
            gsap.to(topNav, { y: 0, autoAlpha: 1, duration: 0.32, ease: "power2.out", overwrite: true });
          }
        },
        onLeaveBack: () => {
          topNav.classList.remove("is-visible");
          gsap.to(topNav, { y: -16, autoAlpha: 0, duration: 0.22, ease: "power2.in", overwrite: true });
        }
      });
    }
  }

  /* ======== SERVICES ANIMATIONS ======== */
  function initServicesAnimations() {
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
      rebuildPositions(); // services-specific rebuild
    });
  }

  /* ======== SOLUTIONS ANIMATIONS ======== */
  function initSolutionsGridAnimations() {
    const solutionsSection = document.querySelector("#solutions");
    const solutionsHeader = solutionsSection?.querySelector(".solutions__header");
    const solutionCards = gsap.utils.toArray(".solutions__grid .solution-card");

    if (!solutionsSection || !solutionCards.length) return;

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

  function initSolutionsShowcaseAnimations() {
    const showcaseHeading = document.querySelector(".solutions-showcase .showcase-heading h2");
    const showcaseCards = gsap.utils.toArray(".solutions-showcase .showcase-card");

    if (!showcaseCards.length) return;

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

  /* ======== WHY ADMC ANIMATIONS ======== */
  function initWhyAdmcAnimations() {
    const why2Section = document.querySelector("[data-animate='why-admc-stagger']");
    const why2Pin = why2Section?.querySelector("[data-why2-pin]");
    const why2Cards = why2Section
      ? gsap.utils.toArray(why2Section.querySelectorAll("[data-why2-card]"))
      : [];

    if (!why2Section || !why2Pin || !why2Cards.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
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
      end: () => "+=" + Math.max(1, (why2Cards.length - 1) * window.innerHeight * (isMobile ? 0.6 : 0.85)),
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

  function initThemeToggle() {
    const buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
    const root = document.documentElement;
    const headerLogo = document.querySelector(".top-nav__avatar img");
    const footerLogo = document.querySelector(".site-footer__wordmark img");
    const storageKey = "admc-theme-inverted";

    if (!buttons.length || !root) return;

    const swapFileName = (path, fileName) => {
      if (!path) return fileName;
      const queryIndex = path.indexOf("?");
      const cleanPath = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
      const query = queryIndex >= 0 ? path.slice(queryIndex) : "";
      const slashIndex = cleanPath.lastIndexOf("/");
      const prefix = slashIndex >= 0 ? cleanPath.slice(0, slashIndex + 1) : "";
      return prefix + fileName + query;
    };

    const headerCurrent = headerLogo?.getAttribute("src") || "";
    const footerCurrent = footerLogo?.getAttribute("src") || "";
    const headerDefaultLogo =
      headerLogo?.getAttribute("data-logo-default") ||
      headerCurrent ||
      "assets/images/Logo/ADMC_LOGO.PNG";
    const headerInvertedLogo =
      headerLogo?.getAttribute("data-logo-inverted") ||
      swapFileName(headerDefaultLogo, "ADMC_LOGO_White.png");
    const footerDefaultLogo = footerCurrent || "assets/images/Logo/ADMC_LOGO_White.png";
    const footerInvertedLogo = swapFileName(footerDefaultLogo, "ADMC_LOGO.PNG");

    function applyInversion(isInverted) {
      root.classList.toggle("is-inverted", isInverted);
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", isInverted ? "true" : "false");
      });

      if (headerLogo) {
        const nextHeaderLogo = isInverted ? headerInvertedLogo : headerDefaultLogo;
        headerLogo.setAttribute("src", nextHeaderLogo);
        headerLogo.src = nextHeaderLogo;
      }

      if (footerLogo) {
        const nextFooterLogo = isInverted ? footerInvertedLogo : footerDefaultLogo;
        footerLogo.setAttribute("src", nextFooterLogo);
        footerLogo.src = nextFooterLogo;
      }
    }

    let saved = null;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch (error) {
      saved = null;
    }

    applyInversion(saved === "1");

    buttons.forEach((button) => {
      if (button.dataset.bound === "1") return;
      button.dataset.bound = "1";
      button.addEventListener("click", () => {
        const next = !root.classList.contains("is-inverted");
        applyInversion(next);
        try {
          window.localStorage.setItem(storageKey, next ? "1" : "0");
        } catch (error) {
          /* no-op when storage is unavailable */
        }
      });
    });
  }

  /* ======== ENDORSEMENTS CAROUSEL ======== */
  function initEndorsementsCarousel() {
    const section = document.querySelector("#endorsements");
    const viewport = section?.querySelector("[data-endorse-viewport]");
    const track = section?.querySelector("[data-endorse-track]");
    const cards = track ? Array.from(track.querySelectorAll(".endorsement-card")) : [];
    const prevBtn = section?.querySelector("[data-endorse-prev]");
    const nextBtn = section?.querySelector("[data-endorse-next]");
    const dots = section ? Array.from(section.querySelectorAll("[data-endorse-dot]")) : [];

    if (!section || !viewport || !track || !cards.length || !prevBtn || !nextBtn || !dots.length) {
      return;
    }

    let currentIndex = 0;
    let startX = null;
    let endX = null;
    let pointerStartX = null;
    const swipeThreshold = 48;

    function clampIndex(index) {
      return Math.max(0, Math.min(index, cards.length - 1));
    }

    function updateCarousel(nextIndex) {
      currentIndex = clampIndex(nextIndex);
      track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
        dot.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === cards.length - 1;
    }

    prevBtn.addEventListener("click", () => updateCarousel(currentIndex - 1));
    nextBtn.addEventListener("click", () => updateCarousel(currentIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => updateCarousel(index));
    });

    viewport.addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
      endX = startX;
    }, { passive: true });

    viewport.addEventListener("touchmove", (event) => {
      endX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", () => {
      if (startX === null || endX === null) return;
      const delta = startX - endX;
      if (Math.abs(delta) > swipeThreshold) {
        updateCarousel(currentIndex + (delta > 0 ? 1 : -1));
      }
      startX = null;
      endX = null;
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartX = event.clientX;
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const delta = pointerStartX - event.clientX;
      if (Math.abs(delta) > swipeThreshold) {
        updateCarousel(currentIndex + (delta > 0 ? 1 : -1));
      }
      pointerStartX = null;
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    updateCarousel(0);
  }
}
