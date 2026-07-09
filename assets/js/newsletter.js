document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".site-footer__newsletterForm");
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = input?.value?.trim();
    if (!email) return;

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Subscribing…";

    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        button.textContent = "Subscribed!";
        input.value = "";
      } else {
        const data = await res.json().catch(() => ({}));
        button.disabled = false;
        button.textContent = originalText;
        const msg = data.error === "Member Exists"
          ? "You're already subscribed!"
          : (data.error || "Something went wrong. Please try again.");
        alert(msg);
      }
    } catch {
      button.disabled = false;
      button.textContent = originalText;
      alert("Connection error. Please try again.");
    }
  });
});
