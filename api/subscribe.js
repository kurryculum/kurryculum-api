module.exports = async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || 'https://kurryculum-02b0c0.webflow.io';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, source, cuisine, firstName } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': 'Klaviyo-API-Key ' + process.env.KLAVIYO_PRIVATE_KEY,
        'Content-Type': 'application/json',
        'revision': '2024-02-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            list_id: process.env.KLAVIYO_LIST_ID,
            subscriptions: [{
              email: email,
              channels: { email: { marketing: { is_subscribed: true } } }
            }]
          },
          relationships: {
            profiles: {
              data: [{
                type: 'profile',
                attributes: {
                  email: email,
                  first_name: firstName || '',
                  properties: {
                    source: source || 'website',
                    cuisine_preference: cuisine || '',
                    signup_date: new Date().toISOString()
                  }
                }
              }]
            }
          }
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Klaviyo error:', err);
      // Still return success to user — don't block them if Klaviyo has issues
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Subscribe error:', error.message);
    return res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
};
