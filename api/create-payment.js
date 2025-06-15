import Stripe from 'stripe';
import { VercelKV } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const kv = new VercelKV();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, registrationId, paymentMethod } = req.body;

    if (!amount || !registrationId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get registration data
    const registration = await kv.get(`registration:${registrationId}`);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (paymentMethod === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Ensure amount is an integer
        currency: 'gbp',
        metadata: {
          registrationId,
          paymentMethod: 'stripe'
        }
      });

      // Update registration with payment intent
      await kv.set(`registration:${registrationId}`, {
        ...registration,
        paymentDetails: {
          ...registration.paymentDetails,
          paymentIntentId: paymentIntent.id,
          status: 'pending'
        }
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } else {
      // Handle bank transfer
      await kv.set(`registration:${registrationId}`, {
        ...registration,
        paymentDetails: {
          ...registration.paymentDetails,
          status: 'pending_verification'
        }
      });

      return res.status(200).json({
        message: 'Bank transfer payment created',
        registrationId
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({
      message: 'Failed to create payment',
      error: error.message
    });
  }
} 