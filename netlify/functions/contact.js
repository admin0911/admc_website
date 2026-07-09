const crypto = require("crypto");

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }

  const { first_name, last_name, email, phone, company, designation, country, solution, message } = body;

  if (!first_name || !last_name || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Name and email are required" }) };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid email address" }) };
  }

  const {
    MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID,
    MAILCHIMP_SERVER,
    RESEND_API_KEY,
    NOTIFICATION_EMAIL = "sales@admcits.ae",
    FROM_EMAIL = "ADMC Website <noreply@admcits.ae>",
  } = process.env;

  // Add/update subscriber in Mailchimp
  if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID && MAILCHIMP_SERVER) {
    const subscriberHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

    try {
      const mcRes = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
          },
          body: JSON.stringify({
            email_address: email,
            status_if_new: "subscribed",
            merge_fields: {
              FNAME:   first_name,
              LNAME:   last_name,
              PHONE:   phone       || "",
              COUNTRY: country     || "",
              SERVICE: solution    || "",
            },
            tags: ["contact-form"],
          }),
        }
      );

      if (!mcRes.ok) {
        const data = await mcRes.json();
        console.error("Mailchimp error:", data.detail);
      }
    } catch (err) {
      console.error("Mailchimp fetch error:", err);
    }
  }

  // Send team notification via Resend
  if (RESEND_API_KEY) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [NOTIFICATION_EMAIL],
          subject: `New Enquiry: ${esc(first_name)} ${esc(last_name)} — ${esc(solution) || "General"}`,
          html: `
            <div style="font-family:sans-serif;max-width:580px">
              <h2 style="color:#1a1a2e;margin-bottom:20px">New Contact Form Submission</h2>
              <table style="border-collapse:collapse;width:100%;font-size:14px">
                <tr style="background:#f5f5f5"><td style="padding:10px 14px;font-weight:600;width:130px">Name</td><td style="padding:10px 14px">${esc(first_name)} ${esc(last_name)}</td></tr>
                <tr><td style="padding:10px 14px;font-weight:600">Email</td><td style="padding:10px 14px"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
                <tr style="background:#f5f5f5"><td style="padding:10px 14px;font-weight:600">Phone</td><td style="padding:10px 14px">${esc(phone) || "—"}</td></tr>
                <tr><td style="padding:10px 14px;font-weight:600">Company</td><td style="padding:10px 14px">${esc(company) || "—"}</td></tr>
                <tr style="background:#f5f5f5"><td style="padding:10px 14px;font-weight:600">Designation</td><td style="padding:10px 14px">${esc(designation) || "—"}</td></tr>
                <tr><td style="padding:10px 14px;font-weight:600">Country</td><td style="padding:10px 14px">${esc(country) || "—"}</td></tr>
                <tr style="background:#f5f5f5"><td style="padding:10px 14px;font-weight:600">Solution</td><td style="padding:10px 14px">${esc(solution) || "—"}</td></tr>
              </table>
              <h3 style="color:#1a1a2e;margin-top:24px;margin-bottom:8px">Message</h3>
              <p style="white-space:pre-wrap;background:#f5f5f5;padding:14px;border-radius:6px;font-size:14px">${esc(message) || "—"}</p>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const data = await emailRes.json();
        console.error("Resend error:", data);
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
