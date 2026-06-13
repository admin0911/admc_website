/* ======================================================
   CONTACT PAGE ANIMATIONS
   Webflow-like reveal motions implemented with GSAP
====================================================== */

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener("DOMContentLoaded", () => {
    initContactReveal();
    initLocationCards();
    initMapReveal();
    initContactFormState();
  });

  function initContactReveal() {
    const heroEls = gsap.utils.toArray(".contact-hero [data-contact-reveal]");
    const formEl = document.querySelector(".contact-formShell[data-contact-reveal]");
    const disableReveal =
      window.matchMedia("(max-width: 640px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disableReveal) {
      if (heroEls.length) gsap.set(heroEls, { autoAlpha: 1, y: 0, clearProps: "transform" });
      if (formEl) gsap.set(formEl, { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    if (heroEls.length) {
      gsap.set(heroEls, { autoAlpha: 0, y: 22 });

      ScrollTrigger.create({
        trigger: ".contact-hero",
        start: "top 96%",
        once: true,
        onEnter: () => {
          gsap.to(heroEls, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.64,
            ease: "power3.out"
          });
        }
      });
    }

    if (formEl) {
      gsap.set(formEl, { autoAlpha: 0, y: 20 });

      ScrollTrigger.create({
        trigger: formEl,
        start: "top 96%",
        once: true,
        onEnter: () => {
          gsap.to(formEl, {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: "power3.out"
          });
        }
      });
    }
  }

  function initLocationCards() {
    const cards = gsap.utils.toArray("[data-contact-location]");
    if (!cards.length) return;
    const disableReveal =
      window.matchMedia("(max-width: 640px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disableReveal) {
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
      return;
    }

    gsap.set(cards, { autoAlpha: 0, y: 20, scale: 0.985 });

    ScrollTrigger.create({
      trigger: ".contact-locations",
      start: "top 96%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out"
        });
      }
    });
  }

  function initMapReveal() {
    const mapWrap = document.querySelector("[data-contact-map]");
    if (!mapWrap) return;
    const disableReveal =
      window.matchMedia("(max-width: 640px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disableReveal) {
      gsap.set(mapWrap, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
      return;
    }

    gsap.set(mapWrap, { autoAlpha: 0, y: 18, scale: 0.99 });

    ScrollTrigger.create({
      trigger: mapWrap,
      start: "top 96%",
      once: true,
      onEnter: () => {
        gsap.to(mapWrap, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.56,
          ease: "power3.out"
        });
      }
    });
  }

  function initContactFormState() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    const submit = form.querySelector(".contact-form__submit");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!submit) return;

      submit.disabled = true;
      submit.textContent = "Message Sent";
      submit.style.filter = "saturate(0.8)";
    });
  }
}
