// Stripe Integration for Wealth Creation Conference
// This file handles all Stripe payment processing functionality

// Stripe Configuration
const STRIPE_CONFIG = {
  // Replace with your actual Stripe publishable key
  publishableKey: 'pk_test_51234567890abcdef', // PLACEHOLDER - REPLACE WITH REAL KEY
  currency: 'gbp',
  country: 'GB'
};

// Stripe instance and elements
let stripe;
let elements;
let cardElement;
let paymentElement;

// Initialize Stripe
async function initializeStripe() {
  try {
    // Check if Stripe is loaded
    if (typeof Stripe === 'undefined') {
      console.error('Stripe SDK not loaded');
      return false;
    }

    // Initialize Stripe with publishable key
    stripe = Stripe(STRIPE_CONFIG.publishableKey);

    // Create elements instance
    elements = stripe.elements({
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0c2340',
          colorBackground: '#ffffff',
          colorText: '#0c2340',
          colorDanger: '#df1b41',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    });

    // Create card element with custom styling
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#0c2340',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
          iconColor: '#c6a343',
        },
        invalid: {
          color: '#df1b41',
          iconColor: '#df1b41'
        },
      },
      hidePostalCode: true
    });

    // Mount the card element
    const cardElementContainer = document.getElementById('card-element');
    if (cardElementContainer) {
      cardElement.mount('#card-element');

      // Handle real-time validation errors
      cardElement.on('change', handleCardChange);

      console.log('Stripe initialized successfully');
      return true;
    } else {
      console.error('Card element container not found');
      return false;
    }

  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return false;
  }
}

// Handle card element changes and validation
function handleCardChange(event) {
  const displayError = document.getElementById('card-errors');
  if (displayError) {
    if (event.error) {
      displayError.textContent = event.error.message;
      displayError.style.display = 'block';
    } else {
      displayError.textContent = '';
      displayError.style.display = 'none';
    }
  }
}

// Create payment intent on server
async function createPaymentIntent(amount, currency = 'gbp') {
  try {
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to pence
        currency: currency
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Process Stripe payment
async function processStripePayment(formData) {
  try {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      throw new Error('Please fill in all required fields');
    }

    const ticketAmount = document.getElementById('ticket-amount')?.value;
    if (!ticketAmount) {
      throw new Error('Please select a ticket amount');
    }

    // Create payment intent
    const { clientSecret, paymentIntentId } = await createPaymentIntent(
      parseFloat(ticketAmount),
      STRIPE_CONFIG.currency
    );

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || undefined,
        },
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: ticketAmount,
        currency: STRIPE_CONFIG.currency,
        status: 'completed'
      };
    } else {
      throw new Error(`Payment status: ${paymentIntent.status}`);
    }

  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
}

// Validate Stripe configuration
function validateStripeConfig() {
  if (!STRIPE_CONFIG.publishableKey || STRIPE_CONFIG.publishableKey.includes('PLACEHOLDER')) {
    console.warn('⚠️ Stripe publishable key not configured. Please update STRIPE_CONFIG.publishableKey');
    return false;
  }
  return true;
}

// Export functions for use in main app
window.StripeIntegration = {
  initialize: initializeStripe,
  processPayment: processStripePayment,
  validateConfig: validateStripeConfig,
  createPaymentIntent: createPaymentIntent
};