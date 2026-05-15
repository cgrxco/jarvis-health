export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, key } = req.body;
    
    if (!userId || !key) {
      return res.status(400).json({ error: 'userId and key required' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Query Supabase storage table
    const response = await fetch(
      `${supabaseUrl}/rest/v1/storage?user_id=eq.${userId}&key=eq.${key}&select=value`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Supabase query failed');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Key not found' });
    }
    
    res.status(200).json({ key, value: data[0].value, shared: false });
  } catch (error) {
    console.error('Storage get error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
}
