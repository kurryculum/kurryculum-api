const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: 'Webhook Error: ' + err.message });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      console.log('Payment succeeded:', pi.id, pi.metadata.customer_email, '$' + pi.amount / 100);
      // Add Klaviyo tracking here when ready
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      console.log('Payment failed:', pi.id, pi.last_payment_error && pi.last_payment_error.message);
      break;
    }
    case 'charge.refunded': {
      console.log('Refund processed:', event.data.object.id);
      break;
    }
    default:
      console.log('Unhandled event:', event.type);
  }

  return res.status(200).json({ received: true });
};
