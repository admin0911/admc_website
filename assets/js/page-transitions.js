/* ======================================================
   PAGE TRANSITIONS
   Fade-out on load, fade-to-dark on navigation
====================================================== */

(function () {
  // Create the overlay element early — before DOM is ready — so it's
  // painted immediately and covers the blank white flash on load.
  var overlay = document.createElement("div");
  overlay.id = "page-fade-overlay";
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9998",
    "background:#0f0e2f",
    "opacity:1",
    "pointer-events:none",
    "transition:opacity 0.32s ease",
    "will-change:opacity"
  ].join(";");
  // Append to html element immediately (before body exists)
  (document.documentElement || document.body || document).appendChild(overlay);

  // Fade in (reveal) — run as early as possible
  function revealPage() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.opacity = "0";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealPage);
  } else {
    revealPage();
  }

  // bfcache restore: fires when user hits back/forward and browser restores a cached page.
  // DOMContentLoaded does NOT fire in this case, so the overlay stays opaque without this.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      overlay.style.pointerEvents = "none";
      revealPage();
    }
  });

  // Fade out (leave) — intercept internal link clicks
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;

    var href = a.getAttribute("href");
    if (!href) return;

    // Skip: anchors, mailto/tel, absolute URLs, new tab targets
    if (
      href.charAt(0) === "#" ||
      href.indexOf("mailto:") === 0 ||
      href.indexOf("tel:") === 0 ||
      href.indexOf("http://") === 0 ||
      href.indexOf("https://") === 0 ||
      a.target === "_blank" ||
      a.hasAttribute("download")
    ) {
      return;
    }

    e.preventDefault();
    overlay.style.pointerEvents = "all";
    overlay.style.opacity = "1";

    var dest = href;
    setTimeout(function () {
      window.location.href = dest;
    }, 320);
  });
})();
