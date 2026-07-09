(function () {
  function init() {
    var form = document.querySelector(".site-footer__newsletterForm");
    if (!form || form.dataset.nlBound === "1") return;
    form.dataset.nlBound = "1";

    var input  = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      var email = input ? input.value.trim() : "";
      if (!email) return;

      var originalText = button ? button.textContent : "Subscribe";
      if (button) { button.disabled = true; button.textContent = "Subscribing…"; }

      try {
        var res = await fetch("/.netlify/functions/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });

        if (res.ok) {
          if (input)  input.value = "";
          if (button) button.textContent = "Subscribed!";
          if (typeof window.admcShowModal === "function") {
            window.admcShowModal("newsletter");
          }
        } else {
          var data = await res.json().catch(function () { return {}; });
          if (button) { button.disabled = false; button.textContent = originalText; }
          alert(data.error || "Something went wrong. Please try again.");
        }
      } catch (_) {
        if (button) { button.disabled = false; button.textContent = originalText; }
        alert("Connection error. Please try again.");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
