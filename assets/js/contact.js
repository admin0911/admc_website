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

}

// Form submission — runs regardless of GSAP availability
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const submit = form.querySelector(".contact-form__submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submit) return;

    const originalText = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending…";

    const data = {
      first_name: form.querySelector('[name="first_name"]')?.value?.trim() || "",
      last_name:  form.querySelector('[name="last_name"]')?.value?.trim()  || "",
      email:      form.querySelector('[name="email"]')?.value?.trim()      || "",
      phone:      form.querySelector('[name="phone"]')?.value?.trim()      || "",
      country:    form.querySelector('[name="country"]')?.value?.trim()    || "",
      service:    form.querySelector('[name="service"]')?.value?.trim()    || "",
      message:    form.querySelector('[name="message"]')?.value?.trim()    || "",
    };

    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        submit.textContent = "Message Sent";
        submit.style.filter = "saturate(0.8)";
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        submit.disabled = false;
        submit.textContent = originalText;
        alert(body.error || "Something went wrong. Please try again.");
      }
    } catch {
      submit.disabled = false;
      submit.textContent = originalText;
      alert("Connection error. Please try again.");
    }
  });
});
