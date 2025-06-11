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
});