/* ======================================================
   MANAGEMENT TEAM ANIMATIONS
====================================================== */

// Pillar infographic — stagger in on scroll
(function () {
  const pillars = document.querySelectorAll("[data-mg-pillar]");
  if (!pillars.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    },
    { threshold: 0.15 }
  );
  pillars.forEach((p) => io.observe(p));
})();

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener("DOMContentLoaded", () => {
    const revealEls = gsap.utils.toArray("[data-mg-reveal]");
    const messageBlocks = gsap.utils.toArray("[data-mg-message]");
    const ideaSection = document.querySelector("[data-mg-idea-section]");
    const ideaTrack = ideaSection?.querySelector("[data-mg-idea-track]");
    const ideaItems = ideaTrack ? Array.from(ideaTrack.querySelectorAll("[data-mg-idea-item]")) : [];

    if (revealEls.length) {
      gsap.set(revealEls, { autoAlpha: 0, y: 22 });
      revealEls.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 96%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: "power3.out"
            });
          }
        });
      });
    }

    if (messageBlocks.length) {
      messageBlocks.forEach((block) => {
        const media = block.querySelector("[data-mg-media]");
        const card = block.querySelector("[data-mg-card]");
        const items = card ? Array.from(card.querySelectorAll("[data-msg-item]")) : [];

        if (!media || !card || !items.length) return;

        gsap.set(media, { autoAlpha: 0, x: 120, scale: 0.98 });
        gsap.set(card, { autoAlpha: 0, x: 120 });
        gsap.set(items, { autoAlpha: 0, y: 14 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 96%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(media, { autoAlpha: 1, x: 0, scale: 1, duration: 0.68 })
              .to(card, { autoAlpha: 1, x: 0, duration: 0.62 }, "-=0.44")
              .to(
                items,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.08
                },
                "-=0.2"
              );
          }
        });
      });
    }

    if (ideaSection && ideaTrack && ideaItems.length > 1) {
      gsap.set(ideaItems, { autoAlpha: 0, y: 24, scale: 0.99 });

      ideaItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 96%",
          once: true,
          onEnter: () => {
            gsap.to(item, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.52,
              ease: "power3.out"
            });

            if (index > 0) {
              window.setTimeout(() => {
                item.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 120);
            }
          }
        });
      });
    }
  });
}
