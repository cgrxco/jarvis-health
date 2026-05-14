export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { context } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are JARVIS, CGR's AI health coach. Generate his daily brief (2-3 sentences). Analyze yesterday and give ONE specific priority action for today. Be direct.

Context: ${JSON.stringify(context)}

Respond ONLY with the brief message, no JSON.`
        }]
      })
    });

    const data = await response.json();
    const brief = data.content?.[0]?.text || 'JARVIS systems online. Execute today\'s plan.';
    
    res.status(200).json({ brief });
  } catch (error) {
    console.error('Daily brief error:', error);
    res.status(500).json({ error: 'Failed to generate brief' });
  }
}