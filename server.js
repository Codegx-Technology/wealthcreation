// Wealth Creation Conference - Node.js Server with Real Stripe Integration
const express = require('express');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

// Manual .env file loading (same approach as stripe-server.js)
const fs = require('fs');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('[ENV] Loading environment variables from .env file...');
  
  // Parse .env content manually
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key] = value;
      }
    }
  });
  console.log('[ENV] Environment variables loaded successfully');
} catch (error) {
  console.error('[ENV] Error reading .env:', error.message);
}

// Verify environment variables
console.log('[ENV] Environment check:', {
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not found',
  nodeEnv: process.env.NODE_ENV || 'development'
});

// Initialize Stripe
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not found in environment variables');
  }
  
  // Check if we're using test or live mode
  const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
  const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
  
  if (!isTestMode && !isLiveMode) {
    throw new Error('Invalid Stripe secret key format - must be a test key (sk_test_) or live key (sk_live_)');
  }

  console.log(`[STRIPE] Initializing in ${isTestMode ? 'TEST' : 'LIVE'} mode with key:`, process.env.STRIPE_SECRET_KEY.substring(0, 12) + '...');
  
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true
  });
  
  // Test the Stripe connection
  stripe.paymentMethods.list({ limit: 1 })
    .then(() => {
      console.log(`[STRIPE] ✅ ${isTestMode ? 'Test' : 'Live'} mode connection test successful`);
      if (isLiveMode) {
        console.log('[STRIPE] ⚠️ WARNING: Using LIVE mode - real charges will be processed');
      } else {
        console.log('[STRIPE] ℹ️ Using TEST mode - no real charges will be processed');
      }
    })
    .catch(err => {
      console.error(`[STRIPE] ❌ ${isTestMode ? 'Test' : 'Live'} mode connection test failed:`, err.message);
      if (err.type === 'StripeAuthenticationError') {
        console.error('[STRIPE] Authentication failed - please check your secret key');
        console.log('[STRIPE] ⚠️ Server will continue running but payment processing will be disabled');
      }
      // Don't throw error, just log it and continue
    });

} catch (error) {
  console.error('[STRIPE] Initialization error:', {
    message: error.message,
    stack: error.stack,
    type: error.type
  });
  console.log('[STRIPE] ⚠️ Server will continue running but payment processing will be disabled');
  // Don't exit, just continue without Stripe
}

// Email Configuration
let emailTransporter;
try {
  console.log('[EMAIL] Configuring email transporter...');
  
  // Email configuration - you can use Gmail, Outlook, or SMTP service
  emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'solver.peters@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-16-character-app-password' // MUST be App Password from Google
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  console.log('[EMAIL] ✅ Email transporter configured');
} catch (error) {
  console.error('[EMAIL] Email configuration error:', error.message);
  console.log('[EMAIL] ⚠️ Server will continue running but email notifications will be disabled');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Email sending function
async function sendRegistrationEmail(registrationData) {
  if (!emailTransporter) {
    console.log('[EMAIL] Email transporter not available, skipping email notification');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { firstName, secondName, email, phone, org, title, paymentMethod, manualAmount, manualReference } = registrationData;
    
    // Email content for admin notification
    const adminEmailContent = `
      <h2>New Registration - Wealth Creation Conference</h2>
      <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Participant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${title ? title + ' ' : ''}${firstName} ${secondName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Organisation:</strong> ${org || 'Not provided'}</li>
      </ul>
      
      <h3>Payment Information:</h3>
      <ul>
        <li><strong>Payment Method:</strong> ${paymentMethod === 'bank' ? 'Bank Transfer' : 'Stripe Card Payment'}</li>
        <li><strong>Amount:</strong> £${manualAmount || 'Not specified'}</li>
        <li><strong>Reference:</strong> ${manualReference || 'Not provided'}</li>
      </ul>
      
      <hr>
      <p><em>This is an automated notification from the Wealth Creation Conference registration system.</em></p>
    `;
    
    // Email content for participant confirmation
    const participantEmailContent = `
      <h2>Registration Confirmed - Wealth Creation & Leadership Conference</h2>
      <p>Dear ${firstName},</p>
      
      <p>Thank you for registering for the <strong>Secrets to Wealth Creation & Leadership Conference</strong> featuring Dr. Cindy Trimm.</p>
      
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Date:</strong> September 20, 2025</li>
        <li><strong>Time:</strong> 9:00 AM - 5:00 PM</li>
        <li><strong>Venue:</strong> GRACEPOINT, 161-169 Essex Road, Islington, N1 2SN, London</li>
      </ul>
      
      <h3>Your Registration Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${title ? title + ' ' : ''}${firstName} ${secondName}</li>
        <li><strong>Amount:</strong> £${manualAmount}</li>
        <li><strong>Payment Reference:</strong> ${manualReference}</li>
      </ul>
      
      <h3>Important Reminders:</h3>
      <p>Please ensure you have sent your payment confirmation to <strong>info@suzzyevents.com</strong> or call <strong>+447365595954</strong> with your payment reference: <strong>${manualReference}</strong></p>
      
      <p>We look forward to seeing you at this transformative event!</p>
      
      <p>Best regards,<br>
      The Suzzy Events Team<br>
      <a href="https://www.suzzyevents.com">www.suzzyevents.com</a></p>
    `;

    // Send admin notification
    const adminEmail = {
      from: process.env.EMAIL_USER || 'solver.peters@gmail.com',
      to: process.env.ADMIN_EMAIL || 'solver.peters@gmail.com',
      subject: `New Registration: ${firstName} ${secondName} - £${manualAmount}`,
      html: adminEmailContent
    };

    // Send participant confirmation
    const participantEmail = {
      from: process.env.EMAIL_USER || 'solver.peters@gmail.com',
      to: email,
      subject: 'Registration Confirmed - Wealth Creation Conference',
      html: participantEmailContent
    };

    // Send both emails
    await emailTransporter.sendMail(adminEmail);
    console.log(`[EMAIL] Admin notification sent for registration: ${firstName} ${secondName}`);
    
    await emailTransporter.sendMail(participantEmail);
    console.log(`[EMAIL] Confirmation sent to participant: ${email}`);

    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send registration emails:', error);
    return { success: false, error: error.message };
  }
}

// Middleware setup
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'https://wealthcreation.suzzyevents.com',
    // Add Vercel domains
    /https:\/\/.*\.vercel\.app$/,
    /https:\/\/.*\.vercel\.com$/
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
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Set cookie policy
  res.setHeader('Set-Cookie', [
    'SameSite=None; Secure',
    'Path=/',
    'HttpOnly'
  ].join('; '));
  
  next();
});

// Log all requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
      headers: req.headers,
      body: req.body,
      query: req.query
    });
    next();
  });
}

// Serve static files with proper MIME types
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (path.endsWith('.eot')) {
      res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
    }
  }
}));

// Add a favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images', 'favicon.ico'));
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Real Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp' } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || !stripe) {
      console.error('STRIPE_SECRET_KEY not found or Stripe not initialized');
      return res.status(503).json({
        error: 'Payment processing is temporarily unavailable. Please try again later or contact support.',
        code: 'PAYMENT_NOT_CONFIGURED'
      });
    }

    console.log(`Creating payment intent for £${amount} ${currency.toUpperCase()}`);

    // Create real payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency: currency,
      payment_method_types: ['card'],
      metadata: {
        conference: 'Wealth Creation & Leadership Conference',
        amount_gbp: amount.toString(),
        created_at: new Date().toISOString()
      },
      description: 'Wealth Creation & Leadership Conference Registration'
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      res.status(400).json({ error: error.message });
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: 'Invalid payment request' });
    } else {
      res.status(500).json({
        error: 'Payment processing failed. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Stripe webhook endpoint for handling payment events
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    webhook_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test email endpoint
app.post('/test-email', async (req, res) => {
  console.log('[TEST] Email test requested');
  
  try {
    // Create dummy registration data
    const dummyRegistration = {
      firstName: 'John',
      secondName: 'Doe',
      email: 'solver.peters@gmail.com', // Send test to your own email
      phone: '+447365595954',
      org: 'Test Company Ltd',
      title: 'Mr',
      paymentMethod: 'bank',
      manualAmount: '150',
      manualReference: 'TEST-REF-' + Date.now(),
      id: 'test_reg_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('[TEST] Sending test emails with dummy data:', dummyRegistration);
    
    // Send the test emails
    const emailResult = await sendRegistrationEmail(dummyRegistration);
    
    if (emailResult.success) {
      console.log('[TEST] ✅ Test emails sent successfully');
      res.json({
        success: true,
        message: 'Test emails sent successfully!',
        testData: dummyRegistration
      });
    } else {
      console.error('[TEST] ❌ Failed to send test emails:', emailResult.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test emails',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('[TEST] Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[API ${requestId}] Registration request received`);
  
  try {
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API ${requestId}] Request details:`, {
        headers: req.headers,
        body: req.body,
        cookies: req.cookies
      });
    }

    // Validate request
    if (!req.body) {
      throw new Error('No request body provided');
    }

    const registrationData = req.body;
    
    // Validate required fields
    const requiredFields = ['firstName', 'secondName', 'email', 'phone', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !registrationData[field]);
    
    if (missingFields.length > 0) {
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

    // Send email notifications
    console.log(`[EMAIL] Sending registration emails for: ${fullRegistrationData.firstName} ${fullRegistrationData.secondName}`);
    const emailResult = await sendRegistrationEmail(fullRegistrationData);
    
    if (emailResult.success) {
      console.log(`[EMAIL] Registration emails sent successfully`);
    } else {
      console.warn(`[EMAIL] Failed to send emails: ${emailResult.error}`);
      // Don't fail the registration if email fails
    }

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

// Create payment intent endpoint
app.post('/api/create-payment', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[PAYMENT ${requestId}] Starting payment intent creation`);

  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error(`[PAYMENT ${requestId}] Invalid request body:`, req.body);
      return res.status(400).json({
        error: 'Invalid request body',
        requestId
      });
    }

    const { amount, registrationId, paymentMethod, email } = req.body;
    console.log(`[PAYMENT ${requestId}] Request data:`, {
      amount,
      registrationId,
      paymentMethod,
      hasStripe: !!stripe,
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not found'
    });

    // Validate required fields
    if (!amount || !registrationId) {
      console.error(`[PAYMENT ${requestId}] Missing required fields:`, { amount, registrationId });
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'registrationId'],
        requestId
      });
    }

    // Check Stripe configuration
    if (!stripe) {
      console.error(`[PAYMENT ${requestId}] Stripe not initialized`);
      return res.status(500).json({
        error: 'Payment processing not configured',
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

    try {
      // Create payment intent with detailed options
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: 'gbp',
        payment_method_types: ['card'],
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Wealth Creation Conference Server`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Stripe configured: ${process.env.STRIPE_SECRET_KEY ? '✅ Yes' : '❌ No'}`);
  console.log(`🔗 Webhook configured: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Yes' : '❌ No'}`);

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in .env file');
    console.warn('   Add STRIPE_SECRET_KEY=sk_test_... to your .env file');
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET not configured (optional for development)');
  }

  console.log('📝 Ready to accept registrations!');
});