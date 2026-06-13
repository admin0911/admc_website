/* ======================================================
   COMPANY OVERVIEW — INTERACTIVE TIMELINE + ANIMATIONS
====================================================== */

/* ── Interactive Timeline (runs synchronously at page bottom) ── */
(function () {
  'use strict';

  var section = document.querySelector('[data-ov-history]');
  if (!section) return;

  var stage   = section.querySelector('[data-ov-timeline-stage]');
  var track   = section.querySelector('[data-ov-timeline-track]');
  if (!stage || !track) return;

  var nodes   = Array.from(track.querySelectorAll('[data-milestone-node]'));
  var cards   = Array.from(stage.querySelectorAll('[data-milestone-card]'));
  var cols    = Array.from(stage.querySelectorAll('.ov-history__col'));
  var fill    = track.querySelector('[data-timeline-fill]');
  var prevBtn = section.querySelector('[data-history-prev]');
  var nextBtn = section.querySelector('[data-history-next]');
  var pips    = Array.from(section.querySelectorAll('[data-history-pip]'));
  var total   = nodes.length;
  var current = 0;

  /* ── Update fill line width ─────────────────────────── */
  function updateFill(idx) {
    if (!fill || !nodes[idx]) return;
    var trackRect = track.getBoundingClientRect();
    var nodeRect  = nodes[idx].getBoundingClientRect();
    if (trackRect.width === 0) return;
    var nodeCenterX = (nodeRect.left + nodeRect.right) / 2 - trackRect.left;
    fill.style.width = Math.max(0, Math.min(nodeCenterX, trackRect.width)) + 'px';
  }

  /* ── Activate a milestone ───────────────────────────── */
  function activate(idx, instant) {
    current = Math.max(0, Math.min(idx, total - 1));

    /* nodes */
    nodes.forEach(function (node, i) {
      node.classList.toggle('is-active', i === current);
      node.classList.toggle('is-done',   i < current);
      node.setAttribute('aria-pressed', String(i === current));
    });

    /* cards */
    cards.forEach(function (card) {
      var ci = parseInt(card.dataset.milestoneCard, 10);
      card.classList.toggle('is-active', ci === current);
    });

    /* columns — for mobile single-card view */
    cols.forEach(function (col) {
      var ms = parseInt(col.dataset.colMs, 10);
      col.classList.toggle('col--visible', ms === current);
    });

    /* pips */
    pips.forEach(function (pip, i) {
      pip.classList.toggle('is-active', i === current);
      pip.setAttribute('aria-selected', String(i === current));
    });

    /* prev / next buttons */
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;

    /* fill line */
    if (instant && fill) {
      var prev = fill.style.transition;
      fill.style.transition = 'none';
      requestAnimationFrame(function () {
        updateFill(current);
        requestAnimationFrame(function () { fill.style.transition = prev; });
      });
    } else {
      requestAnimationFrame(function () { updateFill(current); });
    }
  }

  /* ── Reveal (called by GSAP scroll trigger) ─────────── */
  function reveal() {
    /* stagger cards in */
    cards.forEach(function (card, i) {
      setTimeout(function () { card.classList.add('is-visible'); }, i * 65);
    });
    /* stagger nodes in */
    nodes.forEach(function (node, i) {
      setTimeout(function () { node.classList.add('is-visible'); }, 80 + i * 55);
    });
    /* animate fill to milestone 0 after cards appear */
    setTimeout(function () { activate(current, false); }, 420);
  }

  /* expose to GSAP */
  section._timelineReveal  = reveal;
  section._timelineActivate = activate;

  /* ── Event wiring ────────────────────────────────────── */
  nodes.forEach(function (node) {
    node.addEventListener('click', function () {
      activate(parseInt(node.dataset.milestoneNode, 10));
    });
  });

  pips.forEach(function (pip) {
    pip.addEventListener('click', function () {
      activate(parseInt(pip.dataset.historyPip, 10));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () {
    if (current > 0) activate(current - 1);
  });

  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (current < total - 1) activate(current + 1);
  });

  /* keyboard */
  section.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (current > 0) activate(current - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (current < total - 1) activate(current + 1);
    }
  });

  /* swipe */
  var swipeX = 0, swipeY = 0;
  stage.addEventListener('touchstart', function (e) {
    swipeX = e.touches[0].clientX;
    swipeY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = swipeX - e.changedTouches[0].clientX;
    var dy = swipeY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      if (dx > 0 && current < total - 1) activate(current + 1);
      else if (dx < 0 && current > 0) activate(current - 1);
    }
  }, { passive: true });

  /* resize: recalculate fill */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { updateFill(current); }, 120);
  });

  /* set initial active state without fill animation */
  activate(0, true);
})();


/* ── GSAP scroll animations ─────────────────────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('DOMContentLoaded', function () {

    var revealEls     = gsap.utils.toArray('[data-ov-reveal]');
    var introEls      = gsap.utils.toArray('[data-ov-intro-reveal]');
    var introLanes    = gsap.utils.toArray('.ov-intro__lane');
    var processSection = document.querySelector('[data-ov-process]');
    var processStage   = processSection && processSection.querySelector('[data-ov-process-stage]');
    var processSteps   = processSection ? Array.from(processSection.querySelectorAll('[data-ov-process-step]')) : [];
    var processRing    = processSection && processSection.querySelector('[data-ov-process-ring]');
    var processCurrent = processSection && processSection.querySelector('[data-ov-process-current]');
    var historySection = document.querySelector('[data-ov-history]');
    var domainCards    = gsap.utils.toArray('.ov-domains [data-ov-domain]');
    var metricCards    = gsap.utils.toArray('.ov-metrics [data-ov-card]');
    var steps          = gsap.utils.toArray('[data-ov-step]');

    /* generic reveal */
    if (revealEls.length) {
      gsap.set(revealEls, { autoAlpha: 0, y: 20 });
      revealEls.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 96%',
          once: true,
          onEnter: function () {
            gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power3.out' });
          }
        });
      });
    }

    /* intro */
    if (introEls.length) {
      gsap.set(introEls, { autoAlpha: 0, y: 18 });
      ScrollTrigger.create({
        trigger: '.ov-intro',
        start: 'top 96%',
        once: true,
        onEnter: function () {
          gsap.to(introEls, { autoAlpha: 1, y: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
        }
      });
    }

    if (introLanes.length) {
      gsap.set(introLanes, { autoAlpha: 0, y: 28, rotateX: -7, transformOrigin: '50% 100%' });
      ScrollTrigger.create({
        trigger: '.ov-intro__rail',
        start: 'top 96%',
        once: true,
        onEnter: function () {
          gsap.to(introLanes, { autoAlpha: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 0.7, ease: 'back.out(1.2)' });
        }
      });
    }

    /* process section */
    if (processSection && processStage && processSteps.length) {
      function setProcessStep(index) {
        processSteps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
        if (processCurrent) processCurrent.textContent = String(index + 1).padStart(2, '0');
      }

      function syncProcessVisuals(rawIndex) {
        processSteps.forEach(function (step, i) {
          var distance = Math.abs(i - rawIndex);
          var focus    = Math.max(0, 1 - distance);
          gsap.set(step, {
            y:        gsap.utils.interpolate(14, 0, focus),
            autoAlpha: gsap.utils.interpolate(0.42, 1, focus),
            scale:    gsap.utils.interpolate(0.985, 1, focus)
          });
        });
      }

      setProcessStep(0);
      syncProcessVisuals(0);

      ScrollTrigger.create({
        trigger: processStage,
        start: 'top 96%',
        end: 'bottom 28%',
        scrub: 0.75,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var max = processSteps.length - 1;
          var raw = gsap.utils.clamp(0, max, self.progress * max);
          var idx = Math.min(max, Math.round(raw));
          setProcessStep(idx);
          syncProcessVisuals(raw);
          if (processRing) processRing.style.setProperty('--progress', String(gsap.utils.clamp(0, 1, self.progress)));
        }
      });
    }

    /* timeline — trigger the CSS-class-based reveal */
    if (historySection && historySection._timelineReveal) {
      ScrollTrigger.create({
        trigger: historySection,
        start: 'top 84%',
        once: true,
        onEnter: function () {
          historySection._timelineReveal();
        }
      });
    }

    /* domain cards */
    if (domainCards.length) {
      gsap.set(domainCards, { autoAlpha: 0, y: 20, scale: 0.985 });
      ScrollTrigger.create({
        trigger: '.ov-domains',
        start: 'top 96%',
        once: true,
        onEnter: function () {
          gsap.to(domainCards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.5, ease: 'power3.out' });
        }
      });
    }

    /* flow steps */
    if (steps.length) {
      gsap.set(steps, { autoAlpha: 0, y: 20 });
      ScrollTrigger.create({
        trigger: '[data-ov-flow]',
        start: 'top 96%',
        once: true,
        onEnter: function () {
          gsap.to(steps, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.48, ease: 'power2.out' });
        }
      });
    }

    /* metric cards */
    if (metricCards.length) {
      gsap.set(metricCards, { autoAlpha: 0, y: 18, scale: 0.99 });
      ScrollTrigger.create({
        trigger: '.ov-metrics',
        start: 'top 96%',
        once: true,
        onEnter: function () {
          gsap.to(metricCards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.46, ease: 'power2.out' });
        }
      });
    }

  });
}
