import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, key, value } = req.body;
    
    if (!userId || !key || value === undefined) {
      return res.status(400).json({ error: 'userId, key, and value required' });
    }

    const storageKey = `user:${userId}:${key}`;
    await kv.set(storageKey, value);
    
    res.status(200).json({ key, value, shared: false });
  } catch (error) {
    console.error('Storage set error:', error);
    res.status(500).json({ error: 'Storage operation failed' });
  }
}
