// Simple Node.js server for testing Stripe integration
// This is a basic example - in production, use a proper backend framework

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mock Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp' } = req.body;
    
    // In a real application, you would:
    // 1. Initialize Stripe with your secret key
    // 2. Create a real payment intent
    // 3. Return the client secret
    
    // Mock response for testing
    const mockPaymentIntent = {
      id: 'pi_' + Math.random().toString(36).substr(2, 9),
      client_secret: 'pi_test_' + Math.random().toString(36).substr(2, 9) + '_secret_test',
      amount: amount * 100, // Stripe uses cents
      currency: currency,
      status: 'requires_payment_method'
    };
    
    console.log('Created mock payment intent:', mockPaymentIntent.id);
    
    res.json({
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id
    });
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mock webhook endpoint for Stripe events
app.post('/webhook', (req, res) => {
  console.log('Received webhook:', req.body);
  res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Note: This is a mock server for testing. Use a real Stripe integration in production.');
});
