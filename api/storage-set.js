export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, key, value } = req.body;
    
    if (!userId || !key || value === undefined) {
      return res.status(400).json({ error: 'userId, key, and value required' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Upsert to Supabase storage table
    const response = await fetch(
      `${supabaseUrl}/rest/v1/storage`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          user_id: userId,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error('Supabase insert failed');
    }
    
    res.status(200).json({ key, value, shared: false });
  } catch (error) {
    console.error('Storage set error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
}
