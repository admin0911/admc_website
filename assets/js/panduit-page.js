document.addEventListener("DOMContentLoaded", () => {
  const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
  const accordions = Array.from(document.querySelectorAll(".panduit-accItem"));
  const inView = (el, threshold = 0.94) => {
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= viewH * threshold;
  };

  if (revealNodes.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((el) => el.classList.add("is-visible"));
    } else {
      revealNodes.forEach((el) => {
        if (inView(el)) {
          el.classList.add("is-visible");
        } else {
          el.classList.add("is-reveal-pending");
        }
      });

      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              const idx = revealNodes.indexOf(entry.target);
              const delay = Math.max(0, idx) * 80;
              setTimeout(() => {
                entry.target.classList.remove("is-reveal-pending");
                entry.target.classList.add("is-visible");
              }, delay);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px 2% 0px"
        }
      );

      revealNodes
        .filter((el) => el.classList.contains("is-reveal-pending"))
        .forEach((el) => io.observe(el));
    }
  }

  if (accordions.length) {
    accordions.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        accordions.forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      });
    });
  }
});
