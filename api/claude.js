// Kurryculum Claude API Proxy
const RATE_LIMIT = new Map();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000;

function getRateLimit(ip) {
  const now = Date.now();
  const record = RATE_LIMIT.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > record.reset) { record.count = 0; record.reset = now + WINDOW_MS; }
  record.count++;
  RATE_LIMIT.set(ip, record);
  return { allowed: record.count <= MAX_REQUESTS, remaining: Math.max(0, MAX_REQUESTS - record.count), reset: record.reset };
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  const limit = getRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', limit.remaining);
  res.setHeader('X-RateLimit-Reset', limit.reset);
  if (!limit.allowed) return res.status(429).json({ error: 'Too many requests. Please try again in an hour.' });

  const { messages, system, max_tokens } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request: messages array required' });
  if (messages.length > 20) return res.status(400).json({ error: 'Too many messages' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Service not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20251001',
        max_tokens: Math.min(max_tokens || 500, 1500), // raised cap: chatbot=250, recipes=1400, both now work
        system: system || 'You are a helpful supplement advisor for Kurryculum.',
        messages: messages
      })
    });
    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(response.status).json({ error: 'AI service error' });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Claude proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
