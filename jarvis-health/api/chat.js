export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { context, question } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `You are JARVIS, CGR's AI health coach. Answer his question using his data. Be specific and actionable.

Context: ${JSON.stringify(context)}

Question: ${question}

Answer (2-4 sentences):`
        }]
      })
    });

    const data = await response.json();
    const answer = data.content?.[0]?.text || 'Connection error. Try again.';
    
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
}