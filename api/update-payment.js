import { VercelKV } from '@vercel/kv';

const kv = new VercelKV();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { registrationId, paymentId, status, paymentDetails } = req.body;

    if (!registrationId) {
      return res.status(400).json({ message: 'Missing registration ID' });
    }

    // Get registration data
    const registration = await kv.get(`registration:${registrationId}`);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Update payment details
    const updatedRegistration = {
      ...registration,
      paymentDetails: paymentDetails || {
        ...registration.paymentDetails,
        status: status || registration.paymentDetails.status,
        paymentId: paymentId || registration.paymentDetails.paymentId,
        updatedAt: new Date().toISOString()
      }
    };

    // Save updated registration
    await kv.set(`registration:${registrationId}`, updatedRegistration);

    // If payment is completed, add to completed registrations list
    if (status === 'completed' || (paymentDetails && paymentDetails.status === 'completed')) {
      await kv.lpush('completed_registrations', registrationId);
    }

    return res.status(200).json({
      message: 'Payment updated successfully',
      registrationId,
      status: updatedRegistration.paymentDetails.status
    });
  } catch (error) {
    console.error('Payment update error:', error);
    return res.status(500).json({
      message: 'Failed to update payment',
      error: error.message
    });
  }
} 