
const express = require('express');
const stripe = require('stripe')('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');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve static files from current directory

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Server is running!' });
});

// Payment endpoint
app.post('/create-payment', async (req, res) => {
    console.log('Payment request received:', req.body);
    try {
        const { paymentMethodId, amount, email, name } = req.body;

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'gbp',
            payment_method: paymentMethodId,
            confirm: true,
            receipt_email: email,
            description: `Registration payment for ${name}`,
            metadata: {
                name: name,
                email: email
            }
        });

        console.log('Payment successful:', paymentIntent.id);
        // Return success response
        res.json({
            success: true,
            paymentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

// Serve index.html for all routes
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('=================================');
    console.log('Available endpoints:');
    console.log('- GET  /test');
    console.log('- POST /create-payment');
    console.log('- GET  / (serves index.html)');
    console.log('=================================');

// Wealth Creation Conference - Node.js Server with Stripe Integration
// Production-ready server for handling payments and form submissions

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://wealthcreation.suzzyevents.com', 'https://your-domain.com']
    : ['http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:8000']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stripe_configured: !!process.env.STRIPE_SECRET_KEY
  });
});

// Create payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp', metadata = {} } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      console.error('Stripe secret key not configured');
      return res.status(500).json({
        error: 'Payment processing not configured. Please contact support.'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        conference: 'Wealth Creation & Leadership',
        ...metadata
      },
      description: 'Wealth Creation & Leadership Conference Registration'
    });

    console.log('Payment intent created:', paymentIntent.id, 'Amount:', amount, currency.toUpperCase());

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Stripe webhook endpoint for handling payment events
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.warn('Stripe webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you could update your database, send confirmation emails, etc.
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  Stripe secret key not configured. Set STRIPE_SECRET_KEY environment variable.');
  }

});