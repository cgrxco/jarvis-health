export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { b64, type } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: type,
                data: b64
              }
            },
            {
              type: 'text',
              text: `Analyze food. JSON:\n{"items":[{"name":"Food","quantity":"2 eggs","calories":140,"protein":12,"carbs":2,"fat":10}],"totalCalories":number,"totalProtein":number}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Food photo analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze photo' });
  }
}
