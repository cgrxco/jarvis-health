import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, key } = req.body;
    
    if (!userId || !key) {
      return res.status(400).json({ error: 'userId and key required' });
    }

    const storageKey = `user:${userId}:${key}`;
    const value = await kv.get(storageKey);
    
    if (value === null) {
      return res.status(404).json({ error: 'Key not found' });
    }
    
    res.status(200).json({ key, value, shared: false });
  } catch (error) {
    console.error('Storage get error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
}
