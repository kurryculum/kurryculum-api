// api/paypal/capture-order.js — Vercel serverless function
// Captures an approved PayPal order and confirms it actually completed before you fulfill.
// Required Vercel env vars: PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV ("sandbox" | "live")

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const ALLOWED_ORIGIN = "https://www.kurryculum.com";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token failed: ${res.status}`);
  return (await res.json()).access_token;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { orderID } = req.body || {};
    if (!orderID) return res.status(400).json({ error: "Missing orderID" });

    const token = await getAccessToken();
    const cap = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await cap.json();

    if (!cap.ok || data.status !== "COMPLETED") {
      console.error("capture error", data);
      return res.status(502).json({ error: "Capture failed", status: data.status });
    }

    // OPTIONAL — mirror what /order does for Stripe so PayPal sales aren't invisible:
    //   * fire the Google Ads purchase conversion (AW-11442049593/-6rlCInvzJEcELmk_88q)
    //   * push a "Placed Order" event to Klaviyo to trigger the replenishment flow
    // Do it here (server-side) or on the /order page keyed off a success flag.

    return res.status(200).json({ status: "COMPLETED", details: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
