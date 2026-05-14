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
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `You are JARVIS analyzing CGR's patterns. Generate 2-4 actionable suggestions. Focus on:
- Stalled exercises (same weight 3+ sessions) → suggest deload or add movement
- Protein gaps (avg <145g) → suggest add food item
- Skipped supplements (taken <4/7 days) → suggest remove or remind
- Low water (<3.5L avg) → remind
- Visceral fat >10% → suggest blood tests
- INR timing (greens added, time for test)
- Month 2 approaching → suggest enable legs if medical clearance

Context: ${JSON.stringify(context)}

Respond with JSON array of suggestions:
[{
  "type":"exercise|supplement|food|test|warning",
  "action":"add|remove|modify|request|alert",
  "title":"Brief title",
  "message":"Specific observation + reasoning",
  "priority":"high|medium|low",
  "data":{} // data needed to execute
}]

ONLY JSON, no markdown.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '[]';
    const suggestions = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Pattern analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze patterns' });
  }
}