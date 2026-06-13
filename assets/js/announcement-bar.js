(function () {
  var STORAGE_KEY = 'admc-ann-dismissed-v1';
  var LINKEDIN_URL =
    'https://www.linkedin.com/posts/admc-it_admcitsolutions-newoffice-dubai-activity-7446799155819241472-fqpc?utm_source=share&utm_medium=member_desktop&rcm=ACoAACzLDh0Bl8MrZ2eIl9H2VUmh4Hm7Mcfcjq4';

  function isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
  }

  function dismiss() {
    setDismissed();
    document.documentElement.classList.add('ann-dismissed');
    var bar = document.getElementById('ann-bar');
    if (bar) bar.classList.add('is-hidden');
  }

  function buildBar() {
    var bar = document.createElement('div');
    bar.id = 'ann-bar';
    bar.className = 'ann-bar';
    bar.setAttribute('role', 'banner');
    bar.setAttribute('aria-label', 'Announcement: New Dubai office');
    bar.innerHTML =
      '<span class="ann-bar__dot" aria-hidden="true"></span>' +
      '<span class="ann-bar__text">ADMC has inaugurated a new office in Dubai — strengthening our UAE presence.</span>' +
      '<a class="ann-bar__link" href="' + LINKEDIN_URL + '" target="_blank" rel="noopener noreferrer">Learn More &#x2192;</a>' +
      '<button class="ann-bar__dismiss" type="button" aria-label="Dismiss announcement">' +
      '  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
      '    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '  </svg>' +
      '</button>';

    /* Insert as first child of body so it sits above everything */
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector('.ann-bar__dismiss').addEventListener('click', dismiss);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (isDismissed()) {
      /* Already dismissed — apply class immediately, no bar rendered */
      document.documentElement.classList.add('ann-dismissed');
      return;
    }
    buildBar();
  });
})();
