import { VercelKV } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const kv = new VercelKV();
    const registrationData = req.body;
    
    // Generate a unique ID for the registration
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save registration data to KV store
    await kv.set(`registration:${registrationId}`, {
      ...registrationData,
      id: registrationId,
      createdAt: new Date().toISOString()
    });

    // Add to registrations list
    await kv.lpush('registrations', registrationId);

    return res.status(200).json({ 
      id: registrationId,
      message: 'Registration saved successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Failed to save registration',
      error: error.message 
    });
  }
} 