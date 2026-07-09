const crypto = require("crypto");

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

  const { email } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Valid email required" }) };
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER } = process.env;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER) {
    console.error("Missing Mailchimp environment variables");
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error" }) };
  }

  const subscriberHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

  try {
    const res = await fetch(
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
          tags: ["newsletter"],
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      console.error("Mailchimp error:", data.detail);
      return { statusCode: 400, body: JSON.stringify({ error: data.detail || "Subscription failed" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Subscribe function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
