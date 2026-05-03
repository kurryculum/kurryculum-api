module.exports = function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'Kurryculum Payment API',
    timestamp: new Date().toISOString(),
    stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'MISSING - add to env vars',
    klaviyo: process.env.KLAVIYO_PRIVATE_KEY ? 'configured' : 'not configured yet'
  });
};
