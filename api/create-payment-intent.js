const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TAX_RATES = {
  AL:4,AK:0,AZ:5.6,AR:6.5,CA:7.25,CO:2.9,CT:6.35,DE:0,FL:6,GA:4,
  HI:4,ID:6,IL:6.25,IN:7,IA:6,KS:6.5,KY:6,LA:4.45,ME:5.5,MD:6,
  MA:6.25,MI:6,MN:6.875,MS:7,MO:4.225,MT:0,NE:5.5,NV:6.85,NH:0,NJ:6.625,
  NM:5,NY:4,NC:4.75,ND:5,OH:5.75,OK:4.5,OR:0,PA:6,RI:7,SC:6,
  SD:4.5,TN:7,TX:6.25,UT:6.1,VT:6,VA:5.3,WA:6.5,WV:6,WI:5,WY:4,DC:6
};

const PRODUCTS = {
  '7-chakra':    { name:'7 Chakra Ayurvedic Complex', price:2499 },
  'sugaverve':   { name:'Sugaverve',                  price:2999 },
  'beet-root':   { name:'Beet Root + Black Pepper',   price: 999 },
  'vitamin-b12': { name:'Vitamin B-12',               price: 899 },
  'bonevite':    { name:'BoneVite+',                  price:2299 },
  'krill-oil':   { name:'Krill Oil 500mg',            price:1999 },
  'collagen':    { name:'Collagen Peptides',          price:2799 },
  'optikind':    { name:'OptiKind Vision Support',    price:2499 },
  'cardiavite':  { name:'CardiaVite+',                price:2699 },
};

module.exports = async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || 'https://kurryculum-02b0c0.webflow.io';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, state, customer } = req.body;

    if (!items || !items.length) return res.status(400).json({ error: 'No items provided' });
    if (!TAX_RATES.hasOwnProperty(state)) return res.status(400).json({ error: 'Invalid state code' });
    if (!customer || !customer.email || !customer.email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
    if (!customer.name) return res.status(400).json({ error: 'Customer name required' });

    let subtotalCents = 0;
    const lineItems = [];

    for (const item of items) {
      const product = PRODUCTS[item.id];
      if (!product) return res.status(400).json({ error: 'Unknown product: ' + item.id });
      const qty = Math.max(1, Math.min(10, parseInt(item.qty) || 1));
      subtotalCents += product.price * qty;
      lineItems.push(product.name + ' x' + qty);
    }

    const taxCents = Math.round(subtotalCents * (TAX_RATES[state] / 100));
    const shippingCents = subtotalCents >= 3500 ? 0 : 599;
    const totalCents = subtotalCents + taxCents + shippingCents;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        state: state,
        subtotal_cents: String(subtotalCents),
        tax_cents: String(taxCents),
        shipping_cents: String(shippingCents),
        items: lineItems.join(', '),
        source: 'kurryculum_website'
      },
      shipping: {
        name: customer.name,
        address: {
          line1: customer.address || '',
          city: customer.city || '',
          state: state,
          postal_code: customer.zip || '',
          country: 'US'
        }
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      breakdown: {
        subtotal: subtotalCents,
        tax: taxCents,
        shipping: shippingCents,
        total: totalCents,
        taxRate: TAX_RATES[state],
        freeShipping: shippingCents === 0
      }
    });

  } catch (error) {
    console.error('PaymentIntent error:', error.message);
    if (error.type === 'StripeCardError') return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: 'Payment processing error. Please try again.' });
  }
};
