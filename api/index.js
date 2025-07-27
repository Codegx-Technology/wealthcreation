const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'https://wealthcreation.suzzyevents.com',
    // Add Netlify domains
    /https:\/\/.*\.netlify\.app$/,
    /https:\/\/.*\.netlify\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
}));

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[API ${requestId}] Registration request received`);

  try {
    const registrationData = req.body;
    
    // Validate required fields
    const requiredFields = ['firstName', 'secondName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !registrationData[field]);
    
    if (missingFields.length > 0) {
      console.error(`[API ${requestId}] Missing required fields:`, missingFields);
      return res.status(400).json({
        message: 'Missing required fields',
        fields: missingFields
      });
    }

    // Generate a unique ID for the registration
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add metadata
    const fullRegistrationData = {
      ...registrationData,
      id: registrationId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Save to database (for now, just log it)
    console.log('New registration:', fullRegistrationData);

    // Set registration cookie
    res.cookie('registration_id', registrationId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600000 // 1 hour
    });

    // Return success with registration ID
    res.json({
      success: true,
      message: 'Registration successful',
      id: registrationId,
      requestId: requestId
    });

  } catch (error) {
    console.error(`[API ${requestId}] Registration error:`, error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      requestId: requestId
    });
  }
});

// Payment intent endpoint
app.post('/api/create-payment', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[PAYMENT ${requestId}] Starting payment intent creation`);

  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error(`[PAYMENT ${requestId}] Stripe not configured`);
      return res.status(503).json({
        error: 'Payment processing is temporarily unavailable. Please try again later or contact support.',
        code: 'PAYMENT_NOT_CONFIGURED',
        requestId
      });
    }

    const { amount, registrationId, paymentMethod, email } = req.body;
    
    // Validate required fields
    if (!amount || !registrationId) {
      console.error(`[PAYMENT ${requestId}] Missing required fields:`, { amount, registrationId });
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'registrationId'],
        requestId
      });
    }

    // Validate and parse amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error(`[PAYMENT ${requestId}] Invalid amount:`, amount);
      return res.status(400).json({
        error: 'Invalid amount. Must be a positive number.',
        requestId
      });
    }

    // Ensure minimum amount
    if (numericAmount < 1) {
      console.error(`[PAYMENT ${requestId}] Amount too small:`, numericAmount);
      return res.status(400).json({
        error: 'Minimum amount is £1',
        requestId
      });
    }

    // Convert to pence and ensure it's an integer
    const amountInPence = Math.round(numericAmount * 100);
    console.log(`[PAYMENT ${requestId}] Creating payment intent for £${numericAmount} (${amountInPence} pence) for registration ${registrationId}`);

    // Initialize Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {
      // Create payment intent with detailed options
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: 'gbp',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        metadata: {
          registrationId,
          paymentMethod,
          requestId,
          conference: 'Wealth Creation & Leadership Conference',
          created_at: new Date().toISOString()
        },
        description: 'Wealth Creation & Leadership Conference Registration',
        receipt_email: email, // Optional: Add if email is provided
        statement_descriptor: 'WEALTH CONF',
        statement_descriptor_suffix: 'REG'
      });

      console.log(`[PAYMENT ${requestId}] Payment intent created:`, {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        registrationId: registrationId,
        clientSecret: paymentIntent.client_secret.substring(0, 10) + '...'
      });

      // Return success response
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: numericAmount,
        currency: 'gbp',
        registrationId: registrationId,
        requestId
      });

    } catch (error) {
      console.error(`[PAYMENT ${requestId}] Stripe error:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`[PAYMENT ${requestId}] Payment creation error:`, error);
    res.status(500).json({
      error: error.message || 'Failed to create payment',
      requestId
    });
  }
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

// Export for Netlify
module.exports.handler = serverless(app); 