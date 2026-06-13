document.addEventListener("DOMContentLoaded", () => {
  const mapRoot = document.querySelector("[data-solution-map]");
  if (!mapRoot) return;

  const buttons = Array.from(mapRoot.querySelectorAll("[data-layer-btn]"));
  const panels = Array.from(mapRoot.querySelectorAll("[data-layer-panel]"));

  function setActive(layer) {
    buttons.forEach((btn) => {
      const active = btn.dataset.layerBtn === layer;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });

    panels.forEach((panel) => {
      const active = panel.dataset.layerPanel === layer;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setActive(btn.dataset.layerBtn));
    btn.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const idx = buttons.indexOf(btn);
      const next = event.key === "ArrowRight"
        ? (idx + 1) % buttons.length
        : (idx - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
      setActive(buttons[next].dataset.layerBtn);
    });
  });

  const first = buttons[0];
  if (first) setActive(first.dataset.layerBtn);
});
