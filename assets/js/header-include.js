(function () {

  /* ── Markup helpers ─────────────────────────────────── */

  function headerMarkup() {
    return (
      '<header class="top-nav" data-top-nav>' +
      '  <div class="top-nav__inner">' +
      '    <a class="top-nav__avatar" data-nav-home aria-label="ADMC Home"><img data-nav-logo src="" alt="ADMC" /></a>' +
      '    <nav class="top-nav__links" aria-label="Primary">' +
      '      <div class="top-nav__about">' +
      '        <button class="top-nav__aboutToggle" type="button" aria-haspopup="true" aria-expanded="false">ABOUT' +
      '          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" /></svg>' +
      '        </button>' +
      '        <div class="top-nav__aboutMenu" role="menu" aria-label="About pages">' +
      '          <a data-nav-company role="menuitem">Company Overview</a>' +
      '          <a data-nav-management role="menuitem">ADMC Management Team</a>' +
      '        </div>' +
      '      </div>' +
      '      <a data-nav-solutions>SOLUTIONS</a>' +
      '      <a data-nav-vendors>VENDORS</a>' +
      '      <a data-nav-clients>CLIENTS</a>' +
      '    </nav>' +
      '    <div class="top-nav__right">' +
      '      <button class="top-nav__theme" type="button" data-theme-toggle aria-label="Toggle light and dark mode" aria-pressed="false">' +
      '        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7" /><path d="M12 2v2.8M12 19.2V22M4.9 4.9l2 2M17.1 17.1l2 2M2 12h2.8M19.2 12H22M4.9 19.1l2-2M17.1 6.9l2-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>' +
      '      </button>' +
      '      <a class="top-nav__cta" data-nav-contact>CONTACT</a>' +
      '    </div>' +
      '  </div>' +
      '</header>'
    );
  }

  /* ── Build the overlay (appended to body) ───────────── */

  function buildOverlay() {
    var existing = document.getElementById('ham-overlay');
    if (existing) existing.parentNode.removeChild(existing);

    var overlay = document.createElement('div');
    overlay.className = 'ham-overlay';
    overlay.id = 'ham-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Site navigation');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<nav class="ham-overlay__nav" aria-label="Site navigation">' +
      '  <a class="ham-overlay__link" data-nav-company-mobile>Company Overview</a>' +
      '  <a class="ham-overlay__link" data-nav-management-mobile>Management Team</a>' +
      '  <a class="ham-overlay__link" data-nav-solutions-mobile>Solutions</a>' +
      '  <a class="ham-overlay__link" data-nav-vendors-mobile>Vendors</a>' +
      '  <a class="ham-overlay__link" data-nav-clients-mobile>Clients</a>' +
      '</nav>' +
      '<div class="ham-overlay__footer">' +
      '  <button class="ham-overlay__theme" type="button" data-theme-toggle aria-label="Toggle light and dark mode" aria-pressed="false">' +
      '    <span>Theme</span>' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '      <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7"/>' +
      '      <path d="M12 2v2.8M12 19.2V22M4.9 4.9l2 2M17.1 17.1l2 2M2 12h2.8M19.2 12H22M4.9 19.1l2-2M17.1 6.9l2-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
      '    </svg>' +
      '  </button>' +
      '  <a class="ham-overlay__cta" data-nav-contact-mobile>Contact Us</a>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ── Build the hamburger FAB (appended to body) ─────── */

  function buildFab() {
    var existing = document.getElementById('ham-fab');
    if (existing) existing.parentNode.removeChild(existing);

    var btn = document.createElement('button');
    btn.id = 'ham-fab';
    btn.className = 'ham-fab';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open navigation');
    btn.setAttribute('aria-expanded', 'false');
    /* Two icons in one button — CSS shows/hides based on .is-open */
    btn.innerHTML =
      '<span class="ham-fab__lines" aria-hidden="true">' +
      '  <svg width="22" height="14" viewBox="0 0 22 14" fill="none">' +
      '    <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
      '  </svg>' +
      '</span>' +
      '<span class="ham-fab__x" aria-hidden="true">' +
      '  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
      '    <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
      '  </svg>' +
      '</span>';
    document.body.appendChild(btn);
    return btn;
  }

  /* ── Path helpers ────────────────────────────────────── */

  function joinPath(base, target) {
    return base ? base + target : target;
  }

  /* ── Main configuration ──────────────────────────────── */

  function configureHeader(placeholder) {
    var basePath = placeholder.dataset.basePath || '';
    var header = placeholder.querySelector('[data-top-nav]');
    if (!header) return;

    /* Ensure right section has CTA */
    var right = header.querySelector('.top-nav__right');
    if (!right) {
      right = document.createElement('div');
      right.className = 'top-nav__right';
      var inner = header.querySelector('.top-nav__inner');
      if (inner) inner.appendChild(right);
    }
    var cta = right.querySelector('[data-nav-contact]');
    if (!cta) {
      cta = document.createElement('a');
      cta.setAttribute('data-nav-contact', '');
      right.appendChild(cta);
    }
    cta.className = 'top-nav__cta';
    cta.textContent = 'CONTACT';

    /* Nav is always visible — fixed permanently to the top */
    header.classList.add('is-visible');

    /* Hrefs */
    function setHref(sel, path) {
      var el = header.querySelector(sel);
      if (el) el.setAttribute('href', joinPath(basePath, path));
    }
    setHref('[data-nav-home]',       'index.html#hero');
    setHref('[data-nav-company]',    'company_overview.html');
    setHref('[data-nav-management]', 'admc_management_team.html');
    setHref('[data-nav-solutions]',  'solutions/index.html');
    setHref('[data-nav-vendors]',    'partners/index.html');
    setHref('[data-nav-clients]',    'clients.html');
    setHref('[data-nav-contact]',    'contact.html');

    /* Logo */
    var logo = header.querySelector('[data-nav-logo]');
    if (logo) {
      var defLogo = new URL(joinPath(basePath, 'assets/images/Logo/ADMC_LOGO.PNG'), window.location.href).href;
      var invLogo = new URL(joinPath(basePath, 'assets/images/Logo/ADMC_LOGO_White.png'), window.location.href).href;
      var stored = null;
      try { stored = localStorage.getItem('admc-theme-inverted'); } catch (e) {}
      var isInv = document.documentElement.classList.contains('is-inverted') || stored === '1';
      logo.setAttribute('data-logo-default', defLogo);
      logo.setAttribute('data-logo-inverted', invLogo);
      logo.setAttribute('src', isInv ? invLogo : defLogo);
    }

    /* ── Build overlay + FAB ─────────────────────────── */
    var overlay = buildOverlay();
    var fab     = buildFab();

    /* Overlay hrefs */
    function setOHref(sel, path) {
      var el = overlay.querySelector(sel);
      if (el) el.setAttribute('href', joinPath(basePath, path));
    }
    setOHref('[data-nav-company-mobile]',    'company_overview.html');
    setOHref('[data-nav-management-mobile]', 'admc_management_team.html');
    setOHref('[data-nav-solutions-mobile]',  'solutions/index.html');
    setOHref('[data-nav-vendors-mobile]',    'partners/index.html');
    setOHref('[data-nav-clients-mobile]',    'clients.html');
    setOHref('[data-nav-contact-mobile]',    'contact.html');

    /* ── Open / close ────────────────────────────────── */
    var overlayLinks = Array.from(overlay.querySelectorAll('.ham-overlay__link, .ham-overlay__cta'));

    function openMenu() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      fab.classList.add('is-open');
      fab.setAttribute('aria-label', 'Close navigation');
      fab.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      fab.classList.remove('is-open');
      fab.setAttribute('aria-label', 'Open navigation');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    fab.addEventListener('click', function () {
      overlay.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    overlayLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });

    /* ── Sync FAB visibility with the nav ────────────── */
    /* The FAB mirrors .is-visible on the nav header */
    function syncFab() {
      if (window.innerWidth > 980) {
        fab.classList.remove('is-visible');
        return;
      }
      if (header.classList.contains('is-visible')) {
        fab.classList.add('is-visible');
      } else {
        fab.classList.remove('is-visible');
      }
    }

    window.addEventListener('resize', syncFab);

    /* Initial sync */
    syncFab();

    document.dispatchEvent(new CustomEvent('admc:header-ready'));
  }

  /* ── Boot ────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', async function () {
    var placeholder = document.querySelector('[data-header-placeholder]');
    if (!placeholder) return;

    var basePath    = placeholder.dataset.basePath || '';
    var partialPath = placeholder.dataset.partialPath ||
                      joinPath(basePath, 'assets/partials/header.html');

    try {
      var res = await fetch(partialPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error('fetch failed');
      placeholder.innerHTML = await res.text();
    } catch (e) {
      placeholder.innerHTML = headerMarkup();
    }

    configureHeader(placeholder);

    // Load newsletter handler on every page (footer form)
    var nlScript = document.createElement('script');
    nlScript.src = joinPath(basePath, 'assets/js/newsletter.js');
    document.head.appendChild(nlScript);
  });

})();
