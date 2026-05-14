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
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Predict CGR's timeline to 6-pack based on his pace.

Data: ${JSON.stringify(context)}

Respond with JSON: {
  "monthsToGoal": number,
  "onTrack": boolean,
  "weeklyBFLoss": number,
  "weeklyWeightLoss": number,
  "message": "brief status"
}

ONLY JSON, no markdown.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const prediction = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    res.status(200).json({ prediction });
  } catch (error) {
    console.error('Timeline prediction error:', error);
    res.status(500).json({ error: 'Failed to predict timeline' });
  }
}