// api/paypal/create-order.js  — Vercel serverless function
// Creates a PayPal order with a SERVER-SET price. Never trust a price sent by the browser.
// Required Vercel env vars: PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV ("sandbox" | "live")

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Server-authoritative catalog — the ONLY source of truth for what a buyer is charged.
// Add every SKU you sell here. Amounts are USD strings.
const CATALOG = {
  ashwagandha: { name: "Ashwagandha Root Powder + Black Pepper (60 tablets)", price: "21.99" },
  magnesium:   { name: "Magnesium Bisglycinate 200mg (60 capsules)",          price: "23.99" },
  // collagen:  { name: "Collagen Peptides ...", price: "29.99" },  // add the rest as you wire them
};

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
    const { sku, quantity } = req.body || {};
    const item = CATALOG[sku];
    if (!item) return res.status(400).json({ error: "Unknown product" });

    const qty = Math.max(1, Math.min(parseInt(quantity, 10) || 1, 20)); // clamp 1–20
    const total = (Number(item.price) * qty).toFixed(2);

    const token = await getAccessToken();
    const order = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total,
              breakdown: { item_total: { currency_code: "USD", value: total } },
            },
            items: [
              {
                name: item.name,
                quantity: String(qty),
                unit_amount: { currency_code: "USD", value: item.price },
              },
            ],
          },
        ],
      }),
    });

    const data = await order.json();
    if (!order.ok) {
      console.error("create-order error", data);
      return res.status(502).json({ error: "Could not create order" });
    }
    return res.status(200).json({ id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
