// /api/create-payment-intent.js
const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method Not Allowed' });
    return;
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const { amount, currency, customer_email, customer_name, description } = req.body;

  if (!amount || !currency) {
    res.status(400).send({ error: 'Amount and currency are required' });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: description || 'Event Registration',
      metadata: {
        customer_name: customer_name || '',
        customer_email: customer_email || '',
        event: 'wealth_creation_registration',
        timestamp: new Date().toISOString(),
      },
      receipt_email: customer_email,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
