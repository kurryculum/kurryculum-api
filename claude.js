// Kurryculum Claude API Proxy
// Keeps API key server-side, adds rate limiting
// Prevents frontend API key exposure and abuse

const RATE_LIMIT = new Map();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getRateLimit(ip) {
  const now = Date.now();
  const record = RATE_LIMIT.get(ip) || { count: 0, reset: now + WINDOW_MS };
  
  // Reset window if expired
  if (now > record.reset) {
    record.count = 0;
    record.reset = now + WINDOW_MS;
  }
  
  record.count++;
  RATE_LIMIT.set(ip, record);
  
  return {
    allowed: record.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - record.count),
    reset: record.reset
  };
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://kurryculum.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Also allow webflow subdomain during transition
  const origin = req.headers.origin || '';
  if (origin.includes('webflow.io') || origin.includes('kurryculum.com')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Rate limiting by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.socket?.remoteAddress || 
             'unknown';
  
  const limit = getRateLimit(ip);
  
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', limit.remaining);
  res.setHeader('X-RateLimit-Reset', limit.reset);
  
  if (!limit.allowed) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again in an hour.',
      reset: limit.reset
    });
  }
  
  // Validate request body
  const { messages, system, max_tokens } = req.body || {};
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required' });
  }
  
  if (messages.length > 20) {
    return res.status(400).json({ error: 'Too many messages in conversation' });
  }
  
  // Check API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'Service not configured' });
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: Math.min(max_tokens || 300, 500), // Cap at 500 tokens
        system: system || 'You are a helpful supplement advisor for Kurryculum.',
        messages: messages
      })
    });
    
    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(response.status).json({ error: 'AI service error' });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Claude proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
