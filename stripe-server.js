// stripe-server.js - Local Stripe Server for Live API Testing
console.log('[DEBUG] Starting stripe-server.js...');
console.log('[DEBUG] Current working directory:', process.cwd());
console.log('[DEBUG] .env file exists:', require('fs').existsSync('.env'));

// Manual .env file loading
const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('[DEBUG] .env content length:', envContent.length);
  
  // Parse .env content manually
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key] = value;
        console.log(`[DEBUG] Set ${key} = ${value.substring(0, 10)}...`);
      }
    }
  });
} catch (error) {
  console.error('[DEBUG] Error reading .env:', error.message);
}

console.log('[DEBUG] After manual loading:');
console.log('[DEBUG] process.env.STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'EXISTS' : 'NOT FOUND');
console.log('[DEBUG] process.env.STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0);

const express = require('express');
const cors = require('cors');

// Conditional Stripe initialization
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('[DEBUG] Stripe initialized successfully');
  } catch (error) {
    console.error('[DEBUG] Error initializing Stripe:', error.message);
  }
} else {
  console.log('[DEBUG] No Stripe key found, Stripe not initialized');
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Payment processing not configured - Stripe not initialized',
        debug: {
          stripe_initialized: !!stripe,
          env_key_exists: !!process.env.STRIPE_SECRET_KEY,
          env_key_length: process.env.STRIPE_SECRET_KEY?.length || 0
        }
      });
    }

    const { amount, currency = 'gbp', payment_method_types = ['card'] } = req.body;

    console.log(`[STRIPE] Creating payment intent for £${amount/100} ${currency.toUpperCase()}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
      metadata: {
        conference: 'Wealth Creation & Leadership Conference',
        amount_gbp: (amount/100).toString(),
        created_at: new Date().toISOString()
      },
      description: 'Wealth Creation & Leadership Conference Registration'
    });

    console.log('[STRIPE] Payment intent created successfully:', paymentIntent.id);

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency
    });
  } catch (err) {
    console.error('[STRIPE ERROR]', err);
    res.status(500).send({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not found'
  });
});

const PORT = process.env.STRIPE_PORT || 4243;
app.listen(PORT, () => {
  console.log(`✅ Stripe test server running on http://localhost:${PORT}`);
  console.log(`[ENV] Stripe key: ${process.env.STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Not found'}`);
  console.log(`[ENV] Key prefix: ${process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not found'}`);
}); 