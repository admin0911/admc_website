(function () {

  /* ── Inject styles ──────────────────────────────────── */
  var css = [
    '.admc-modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(10,8,35,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .32s ease;pointer-events:none}',
    '.admc-modal-overlay.is-open{opacity:1;pointer-events:auto}',
    '.admc-confetti-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}',
    '.admc-modal{position:relative;z-index:2;background:#fff;border-radius:24px;padding:52px 44px 44px;max-width:500px;width:calc(100% - 32px);text-align:center;transform:translateY(28px) scale(.95);transition:transform .46s cubic-bezier(.22,1,.36,1);box-shadow:0 40px 100px rgba(0,0,0,.38)}',
    '.admc-modal-overlay.is-open .admc-modal{transform:translateY(0) scale(1)}',
    '.admc-modal__icon-wrap{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 22px}',
    '.admc-modal__title{font-size:1.55rem;font-weight:800;color:#1a1a2e;margin:0 0 14px;line-height:1.2}',
    '.admc-modal__body{font-size:.94rem;color:#555;line-height:1.78;margin:0 0 32px;white-space:pre-line;text-align:left}',
    '.admc-modal__close{background:#1a1a2e;color:#fff;border:none;border-radius:50px;padding:14px 44px;font-size:.875rem;font-weight:700;letter-spacing:.05em;cursor:pointer;transition:background .2s,transform .15s}',
    '.admc-modal__close:hover{background:#2d2d6b;transform:translateY(-2px)}',
    '@media(max-width:520px){.admc-modal{padding:36px 22px 30px;border-radius:18px}.admc-modal__title{font-size:1.25rem}}'
  ].join('');
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── SVG helpers (safe — no user data, parsed via DOMParser) ── */
  var parser = new DOMParser();

  function makeSVG(svgStr) {
    var doc = parser.parseFromString(svgStr, 'image/svg+xml');
    return doc.documentElement;
  }

  var ICON_STAR_SRC  = '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M17 3l3.6 8.7H30l-7.5 5.6 2.9 9L17 21.4l-8.4 4.9 2.9-9L4 11.7h9.4z" fill="currentColor"/></svg>';
  var ICON_CHECK_SRC = '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M6 18l8 8L28 9" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── Modal content ──────────────────────────────────── */
  var CONTENT = {
    newsletter: {
      bg: '#fff8ec', color: '#c47e00', iconSrc: ICON_STAR_SRC,
      title: "You're In — Welcome Aboard!",
      body:  "Thank you for subscribing to the ADMC IT Solutions newsletter.\n\nYou'll be the first to receive our latest insights on enterprise IT infrastructure, intelligent datacenters, next-generation networking solutions, and exclusive updates from our operations across the Middle East, Europe, and North America.\n\nWe're delighted to have you with us. Stay connected — great things are on the way."
    },
    contact: {
      bg: '#edf4ff', color: '#1e5fbd', iconSrc: ICON_CHECK_SRC,
      title: "Message Received",
      body:  "Thank you for reaching out to ADMC IT Solutions.\n\nYour enquiry has been received and is now with our specialist team. A dedicated expert will carefully review your request and get in touch with you at the earliest opportunity.\n\nWe look forward to understanding your goals and crafting the right solution for your organisation."
    }
  };

  /* ── Confetti ───────────────────────────────────────── */
  var rafId = null;
  var COLORS = ['#f5a623','#2d6bbf','#10b981','#f43f5e','#8b5cf6','#06b6d4','#fbbf24','#ef4444'];

  function launchConfetti(canvas) {
    if (rafId) cancelAnimationFrame(rafId);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var ctx = canvas.getContext('2d');
    var particles = [];
    for (var i = 0; i < 160; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  -20 - Math.random() * 140,
        w:  7  + Math.random() * 7,
        h:  4  + Math.random() * 5,
        vy: 2.5 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 1.6,
        rot: Math.random() * Math.PI * 2,
        rs:  (Math.random() - 0.5) * 0.14,
        color: COLORS[i % COLORS.length],
        alpha: 1
      });
    }
    var start = performance.now();
    var LIVE  = 4800;

    function tick(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var elapsed = now - start;
      var alive   = false;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (elapsed > LIVE) p.alpha = Math.max(0, p.alpha - 0.016);
        if (p.alpha <= 0) continue;
        alive = true;
        p.y += p.vy; p.x += p.vx; p.rot += p.rs;
        if (p.y > canvas.height + 20 && elapsed < LIVE) {
          p.y = -20; p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) rafId = requestAnimationFrame(tick);
      else rafId = null;
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopConfetti(canvas) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (canvas) { canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ── Build overlay DOM (no innerHTML — all via createElement) ── */
  var overlayEl = null;
  var iconWrapEl, titleEl, bodyEl, canvasEl, closeBtnEl;

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'admc-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    canvasEl = document.createElement('canvas');
    canvasEl.className = 'admc-confetti-canvas';
    overlay.appendChild(canvasEl);

    var card = document.createElement('div');
    card.className = 'admc-modal';

    iconWrapEl = document.createElement('div');
    iconWrapEl.className = 'admc-modal__icon-wrap';

    titleEl = document.createElement('h2');
    titleEl.className = 'admc-modal__title';

    bodyEl = document.createElement('p');
    bodyEl.className = 'admc-modal__body';

    closeBtnEl = document.createElement('button');
    closeBtnEl.className = 'admc-modal__close';
    closeBtnEl.textContent = 'Close';

    card.appendChild(iconWrapEl);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    card.appendChild(closeBtnEl);
    overlay.appendChild(card);

    document.body.appendChild(overlay);
    return overlay;
  }

  function closeModal() {
    if (!overlayEl) return;
    overlayEl.classList.remove('is-open');
    stopConfetti(canvasEl);
  }

  /* ── Public API ─────────────────────────────────────── */
  window.admcShowModal = function (type) {
    if (!overlayEl) overlayEl = buildOverlay();

    var d = CONTENT[type] || CONTENT.contact;

    iconWrapEl.style.background = d.bg;
    iconWrapEl.style.color      = d.color;
    while (iconWrapEl.firstChild) iconWrapEl.removeChild(iconWrapEl.firstChild);
    iconWrapEl.appendChild(makeSVG(d.iconSrc));

    titleEl.textContent = d.title;
    bodyEl.textContent  = d.body;

    overlayEl.classList.add('is-open');
    launchConfetti(canvasEl);

    closeBtnEl.onclick = closeModal;

    function onBg(e) {
      if (e.target === overlayEl) { closeModal(); overlayEl.removeEventListener('click', onBg); }
    }
    overlayEl.addEventListener('click', onBg);

    function onKey(e) {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKey); }
    }
    document.addEventListener('keydown', onKey);
  };

})();
