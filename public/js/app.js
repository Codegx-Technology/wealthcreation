// Wealth Creation Registration Form - Main JavaScript

// Constants
const IS_PRODUCTION = window.location.protocol === 'https:';
// Get Stripe key from meta tag instead of process.env
const STRIPE_PUBLISHABLE_KEY = document.querySelector('meta[name="stripe-publishable-key"]')?.content;

// Stripe configuration - LIVE KEYS (PRODUCTION READY)
let stripe;
let elements;
let cardElement;

// Initialize application when DOM is loaded
function tryInitializeAppWithStripe() {
  if (typeof Stripe !== 'undefined') {
    initializeApp();
  } else {
    console.warn('[INIT] Stripe SDK not loaded yet, retrying in 200ms...');
    setTimeout(tryInitializeAppWithStripe, 200);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing application");

  // Ensure critical elements exist before proceeding
  const form = document.getElementById('registrationForm');
  const submitButton = document.getElementById('submitButton');

  if (!form || !submitButton) {
    console.error('Critical form elements missing - retrying in 500ms');
    setTimeout(() => {
      if (document.getElementById('registrationForm') && document.getElementById('submitButton')) {
        tryInitializeAppWithStripe();
      } else {
        console.error('Form elements still missing after retry');
      }
    }, 500);
    return;
  }

  tryInitializeAppWithStripe();
});

async function initializeApp() {
  try {
    console.log('[INIT] Initializing application...');
    
    // Initialize Stripe
    await initializeStripe();
    
    // Initialize payment methods
    initializePaymentMethods();
    
    // Initialize custom amount functionality
    initializeCustomAmount();
    
    // Initialize form submission
    initializeFormSubmission();
    
    console.log('[INIT] Application initialized successfully');
  } catch (error) {
    console.error('[INIT] Application initialization error:', error);
  }
}

// Initialize Stripe
async function initializeStripe() {
  try {
    console.log('[STRIPE] Initializing Stripe...');
    
    if (typeof Stripe === 'undefined') {
      console.error('[STRIPE] Stripe SDK not loaded');
      return;
    }

    // Check if we have a valid publishable key
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.warn('[STRIPE] Stripe publishable key not found in meta tag - Stripe payments disabled');
      // Hide Stripe payment option
      const stripeOption = document.getElementById('stripe-payment');
      if (stripeOption) {
        stripeOption.disabled = true;
        stripeOption.parentElement.style.opacity = '0.5';
      }
      // Select bank transfer by default
      const bankOption = document.getElementById('bank-transfer');
      if (bankOption) {
        bankOption.checked = true;
      }
      return;
    }

    stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    elements = stripe.elements();

    // Create card element
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    // Mount card element
    const cardElementContainer = document.getElementById('card-element');
    if (cardElementContainer) {
      cardElement.mount('#card-element');
      console.log('[STRIPE] Card element mounted successfully');
      
      // Add error handling for card element
      cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (displayError) {
          if (event.error) {
            displayError.textContent = event.error.message;
          } else {
            displayError.textContent = '';
          }
        }
      });
    } else {
      console.error('[STRIPE] Card element container not found');
    }
  } catch (error) {
    console.error('[STRIPE] Error initializing Stripe:', error);
    // Disable Stripe option on error
    const stripeOption = document.getElementById('stripe-payment');
    if (stripeOption) {
      stripeOption.disabled = true;
      stripeOption.parentElement.style.opacity = '0.5';
    }
    // Select bank transfer by default
    const bankOption = document.getElementById('bank-transfer');
    if (bankOption) {
      bankOption.checked = true;
    }
  }
}

// Initialize payment method handling
function initializePaymentMethods() {
  console.log('[PAYMENT] Initializing payment methods...');
  
  const stripeRadio = document.getElementById('stripe-payment');
  const bankRadio = document.getElementById('bank-transfer');
  const stripeSection = document.getElementById('stripe-payment-section');
  const bankSection = document.getElementById('bank-transfer-section');
  const manualAmountField = document.getElementById('manual-amount');
  const manualReferenceField = document.getElementById('manual-reference');

  console.log('[PAYMENT] Elements found:', {
    stripeRadio: !!stripeRadio,
    bankRadio: !!bankRadio,
    stripeSection: !!stripeSection,
    bankSection: !!bankSection
  });

  if (!stripeRadio || !bankRadio || !stripeSection || !bankSection) {
    console.error('[PAYMENT] Required payment elements not found');
    return;
  }

  function togglePaymentSections() {
    console.log('[PAYMENT] Toggling payment sections...');
    
    if (stripeRadio.checked) {
      console.log('[PAYMENT] Switching to Stripe payment');
      stripeSection.style.display = 'block';
      stripeSection.style.opacity = '1';
      bankSection.style.display = 'none';
      bankSection.style.opacity = '0';
      if (manualAmountField) manualAmountField.removeAttribute('required');
      if (manualReferenceField) manualReferenceField.removeAttribute('required');
    } else {
      console.log('[PAYMENT] Switching to bank transfer');
      stripeSection.style.display = 'none';
      stripeSection.style.opacity = '0';
      bankSection.style.display = 'block';
      bankSection.style.opacity = '1';
      if (manualAmountField) manualAmountField.setAttribute('required', 'required');
      if (manualReferenceField) manualReferenceField.setAttribute('required', 'required');
    }
  }

  // Add event listeners
  stripeRadio.addEventListener('change', function() {
    console.log('[PAYMENT] Stripe radio changed:', this.checked);
    togglePaymentSections();
  });
  
  bankRadio.addEventListener('change', function() {
    console.log('[PAYMENT] Bank radio changed:', this.checked);
    togglePaymentSections();
  });

  // Add click event listeners to labels as well
  const stripeLabel = document.querySelector('label[for="stripe-payment"]');
  const bankLabel = document.querySelector('label[for="bank-transfer"]');
  
  if (stripeLabel) {
    stripeLabel.addEventListener('click', function() {
      console.log('[PAYMENT] Stripe label clicked');
      stripeRadio.checked = true;
      togglePaymentSections();
    });
  }
  
  if (bankLabel) {
    bankLabel.addEventListener('click', function() {
      console.log('[PAYMENT] Bank label clicked');
      bankRadio.checked = true;
      togglePaymentSections();
    });
  }

  // Initial setup
  togglePaymentSections();
  console.log('[PAYMENT] Payment methods initialized');
}

// Toggle custom amount section visibility
function toggleCustomAmount() {
  const ticketAmountSelect = document.getElementById('ticket-amount');
  const customAmountSection = document.getElementById('custom-amount-section');
  const customAmountInput = document.getElementById('custom-amount-input');

  if (!ticketAmountSelect || !customAmountSection) {
    console.warn('[CUSTOM AMOUNT] Required elements not found');
    return;
  }

  if (ticketAmountSelect.value === 'custom') {
    customAmountSection.style.display = 'block';
    if (customAmountInput) {
      customAmountInput.setAttribute('required', 'required');
      customAmountInput.focus();
    }
    console.log('[CUSTOM AMOUNT] Custom amount section shown');
  } else {
    customAmountSection.style.display = 'none';
    if (customAmountInput) {
      customAmountInput.removeAttribute('required');
      customAmountInput.value = '';
    }
    console.log('[CUSTOM AMOUNT] Custom amount section hidden');
  }
}

// Initialize custom amount functionality
function initializeCustomAmount() {
  const ticketAmountSelect = document.getElementById('ticket-amount');

  if (ticketAmountSelect) {
    // Add event listener for amount selection change
    ticketAmountSelect.addEventListener('change', function() {
      console.log('[CUSTOM AMOUNT] Ticket amount changed to:', this.value);
      toggleCustomAmount();
    });

    // Initial call to set correct state
    toggleCustomAmount();

    console.log('[CUSTOM AMOUNT] Custom amount functionality initialized');
  } else {
    console.warn('[CUSTOM AMOUNT] Ticket amount select not found - custom amount functionality disabled');
  }
}

// Initialize form submission (fallback if Firebase fails)
function initializeFormSubmission() {
  const form = document.getElementById('registrationForm');
  const submitButton = document.getElementById('submitButton');

  if (!form || !submitButton) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Handle payment based on selected method
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
      
      if (paymentMethod === 'stripe') {
        await handleStripePayment(data);
      } else if (paymentMethod === 'bank') {
        await handleBankTransfer(data);
      } else {
        throw new Error('Please select a payment method');
      }

      // Save to Firebase
      // await saveToFirebase(data); // REMOVED
      
      alert('Registration successful!');
      form.reset();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Complete Registration';
    }
  });
}

// Initialize Firebase
// async function initializeFirebase() { // REMOVED
//   try { // REMOVED
//     console.log('[FIREBASE] Initializing Firebase...'); // REMOVED
    
//     // Check if Firebase SDK is loaded // REMOVED
//     if (typeof firebase === 'undefined') { // REMOVED
//       console.error('[FIREBASE] Firebase SDK not loaded'); // REMOVED
//       throw new Error('Firebase SDK not loaded'); // REMOVED
//     } // REMOVED

//     // Check if Firebase is already initialized // REMOVED
//     if (!firebase.apps.length) { // REMOVED
//       const firebaseConfig = { // REMOVED
//         apiKey: FIREBASE_API_KEY, // REMOVED
//         authDomain: FIREBASE_AUTH_DOMAIN, // REMOVED
//         projectId: FIREBASE_PROJECT_ID, // REMOVED
//         storageBucket: FIREBASE_STORAGE_BUCKET, // REMOVED
//         messagingSenderId: FIREBASE_MESSAGING_SENDER_ID, // REMOVED
//         appId: FIREBASE_APP_ID, // REMOVED
//         measurementId: FIREBASE_MEASUREMENT_ID // REMOVED
//       }; // REMOVED

//       // Initialize Firebase // REMOVED
//       firebase.initializeApp(firebaseConfig); // REMOVED
//       console.log('[FIREBASE] Firebase initialized successfully'); // REMOVED
//     } else { // REMOVED
//       console.log('[FIREBASE] Firebase already initialized'); // REMOVED
//     } // REMOVED

//     // Initialize Firestore // REMOVED
//     const db = firebase.firestore(); // REMOVED
//     console.log('[FIREBASE] Firestore initialized'); // REMOVED

//     return db; // REMOVED
//   } catch (error) { // REMOVED
//     console.error('[FIREBASE] Initialization error:', error); // REMOVED
//     throw error; // REMOVED
//   } // REMOVED
// } // REMOVED

// Save registration data to Firebase
// async function saveToFirebase(formData) { // REMOVED
//   try { // REMOVED
//     console.log('[FIREBASE] Saving registration data...'); // REMOVED
    
//     // Get Firestore instance // REMOVED
//     const db = await initializeFirebase(); // REMOVED
//     if (!db) { // REMOVED
//       throw new Error('Failed to initialize Firebase'); // REMOVED
//     } // REMOVED

//     // Prepare registration data // REMOVED
//     const registrationData = { // REMOVED
//       ...formData, // REMOVED
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(), // REMOVED
//       status: 'pending', // REMOVED
//       paymentMethod: formData.paymentMethod || 'bank', // REMOVED
//       paymentStatus: 'pending' // REMOVED
//     }; // REMOVED

//     // Add payment details based on method // REMOVED
//     if (formData.paymentMethod === 'stripe') { // REMOVED
//       registrationData.paymentDetails = { // REMOVED
//         type: 'stripe', // REMOVED
//         amount: formData.ticketAmount || formData.customAmount, // REMOVED
//         status: 'pending' // REMOVED
//       }; // REMOVED
//     } else { // REMOVED
//       registrationData.paymentDetails = { // REMOVED
//         type: 'bank_transfer', // REMOVED
//         amount: formData.manualAmount, // REMOVED
//         reference: formData.manualReference, // REMOVED
//         status: 'pending' // REMOVED
//       }; // REMOVED
//     } // REMOVED

//     // Save to Firestore // REMOVED
//     const docRef = await db.collection('registrations').add(registrationData); // REMOVED
//     console.log('[FIREBASE] Registration saved with ID:', docRef.id); // REMOVED

//     // Update payment status if using Stripe // REMOVED
//     if (formData.paymentMethod === 'stripe') { // REMOVED
//       await docRef.update({ // REMOVED
//         'paymentDetails.status': 'processing' // REMOVED
//       }); // REMOVED
//     } // REMOVED

//     return docRef.id; // REMOVED
//   } catch (error) { // REMOVED
//     console.error('[FIREBASE] Save error:', error); // REMOVED
//     throw new Error('Failed to save registration data: ' + error.message); // REMOVED
//   } // REMOVED
// } // REMOVED

// Save registration data
async function saveRegistration(formData) {
  try {
    console.log('[API] Saving registration data...');
    
    // Prepare registration data
    const registrationData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      paymentMethod: formData.paymentMethod || 'bank',
      paymentStatus: 'pending'
    };

    // Add payment details based on method
    if (formData.paymentMethod === 'stripe') {
      registrationData.paymentDetails = {
        type: 'stripe',
        amount: formData.ticketAmount === 'custom' ? formData.customAmount : formData.ticketAmount,
        reference: formData.stripeReference,
        status: 'pending'
      };
    } else {
      registrationData.paymentDetails = {
        type: 'bank_transfer',
        amount: formData.manualAmount,
        reference: formData.manualReference,
        status: 'pending'
      };
    }

    // Save using API endpoint
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save registration');
    }

    const result = await response.json();
    console.log('[API] Registration saved:', result);
    
    // Return the registration ID from the response
    if (!result.id) {
      throw new Error('Registration ID not received from server');
    }
    
    return result.id;
  } catch (error) {
    console.error('[API] Save error:', error);
    throw new Error('Failed to save registration data: ' + error.message);
  }
}

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log('[FORM] Form submission started');

  try {
    // Get form data
    const formData = new FormData(this);
    const data = {};
    
    // Collect all form fields
    for (const [key, value] of formData.entries()) {
      data[key] = value.trim();
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (paymentMethod) {
      data.paymentMethod = paymentMethod.value;
    }
    
    // Get ticket amount
    const ticketAmount = document.getElementById('ticket-amount');
    if (ticketAmount) {
      data.ticketAmount = ticketAmount.value;
      if (ticketAmount.value === 'custom') {
        const customAmount = document.getElementById('custom-amount-input');
        if (customAmount) {
          data.customAmount = customAmount.value;
        }
      }
    }
    
    // Get bank transfer details if applicable
    if (data.paymentMethod === 'bank') {
      const manualAmount = document.getElementById('manual-amount');
      const manualReference = document.getElementById('manual-reference');
      if (manualAmount) data.manualAmount = manualAmount.value;
      if (manualReference) data.manualReference = manualReference.value;
    }

    console.log('[FORM] Collected form data:', data);
    
    // Validate form data
    if (!validateFormData(data)) {
      console.error('[FORM] Validation failed');
      return;
    }

    // Show loading state
    showFormStatus('Processing registration...', 'info');
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }

    // Save registration and get ID
    const registrationId = await saveRegistration(data);
    console.log('[FORM] Registration saved with ID:', registrationId);

    // Handle payment based on method
    if (data.paymentMethod === 'stripe') {
      await handleStripePayment(data, registrationId);
    } else {
      await handleBankTransfer(data, registrationId);
    }

    // Show success message
    showFormStatus('🎉 Registration successful! Thank you for registering.', 'success');
    
    // Show additional success details
    setTimeout(() => {
      showFormStatus('✅ Payment processed successfully! You will receive a confirmation email shortly.', 'success');
    }, 2000);
    
    // Clear form after successful submission
    this.reset();
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    console.error('[FORM] Registration error:', error);
    showFormStatus(error.message || 'Registration failed. Please try again.', 'error');
  } finally {
    // Reset button state
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Register Now';
    }
  }
});

// Form status display function
function showFormStatus(message, type = 'info') {
  const statusElement = document.getElementById('formStatus');
  if (!statusElement) {
    console.error('[FORM] Status element not found');
    return;
  }

  // Remove existing classes
  statusElement.className = 'form-status';
  
  // Add type-specific class
  switch(type) {
    case 'success':
      statusElement.classList.add('success');
      break;
    case 'error':
      statusElement.classList.add('error');
      break;
    case 'warning':
      statusElement.classList.add('warning');
      break;
    default:
      statusElement.classList.add('info');
  }

  // Set message and show
  statusElement.textContent = message;
  statusElement.style.display = 'block';
  
  // Auto-hide after different times based on message type
  let hideDelay = 5000; // Default 5 seconds
  
  switch(type) {
    case 'success':
      hideDelay = 8000; // Keep success messages longer
      break;
    case 'error':
      hideDelay = 10000; // Keep error messages longer so users can read them
      break;
    case 'warning':
      hideDelay = 7000;
      break;
    default:
      hideDelay = 5000;
  }
  
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, hideDelay);
}

// Update validateFormData to be more specific about validation errors
function validateFormData(data) {
  console.log('[FORM] Validating form data...', data);
  
  // Required fields with friendly names
  const requiredFields = {
    firstName: 'First Name',
    secondName: 'Last Name',
    email: 'Email',
    phone: 'Phone Number',
    paymentMethod: 'Payment Method'
  };
  
  // Check for missing required fields
  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => !data[key] || data[key].trim() === '')
    .map(([_, label]) => label);
  
  if (missingFields.length > 0) {
    const message = `Please fill in the following required fields: ${missingFields.join(', ')}`;
    console.error('[FORM] Validation error:', message);
    showFormStatus(message, 'error');
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    const message = 'Please enter a valid email address';
    console.error('[FORM] Validation error:', message);
    showFormStatus(message, 'error');
    return false;
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(data.phone)) {
    const message = 'Please enter a valid phone number (minimum 10 digits)';
    console.error('[FORM] Validation error:', message);
    showFormStatus(message, 'error');
    return false;
  }

  // Payment method specific validation
  if (data.paymentMethod === 'bank') {
    if (!data.manualAmount || data.manualAmount.trim() === '') {
      showFormStatus('Please enter the bank transfer amount', 'error');
      return false;
    }
    if (!data.manualReference || data.manualReference.trim() === '') {
      showFormStatus('Please enter the bank transfer reference', 'error');
      return false;
    }
    // Validate amount format
    const amountRegex = /^[£]?\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(data.manualAmount.replace(/[£,\s]/g, ''))) {
      showFormStatus('Please enter a valid amount (e.g., £150 or 150)', 'error');
      return false;
    }
  } else if (data.paymentMethod === 'stripe') {
    if (!data.ticketAmount) {
      showFormStatus('Please select a ticket amount', 'error');
      return false;
    }
    if (data.ticketAmount === 'custom') {
      if (!data.customAmount || data.customAmount.trim() === '') {
        showFormStatus('Please enter a custom amount', 'error');
        return false;
      }
      const customAmount = parseFloat(data.customAmount);
      if (isNaN(customAmount) || customAmount <= 0 || customAmount > 10000) {
        showFormStatus('Please enter a valid custom amount between £1 and £10,000', 'error');
        return false;
      }
    }
    if (!data.stripeReference || data.stripeReference.trim() === '') {
      showFormStatus('Please enter a payment reference for Stripe payment', 'error');
      return false;
    }
  }

  console.log('[FORM] Form data validation successful');
  return true;
}

// Handle Stripe payment
async function handleStripePayment(data, registrationId) {
  if (!registrationId) {
    console.error('[STRIPE] Cannot proceed: registrationId is undefined');
    showFormStatus('Registration failed. Please try again.', 'error');
    return;
  }
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[STRIPE ${requestId}] Starting payment process for registration ${registrationId}`);

  try {
    // Validate Stripe initialization
    if (!stripe || !elements) {
      console.error(`[STRIPE ${requestId}] Stripe not initialized`);
      throw new Error('Payment system not initialized');
    }

    // Validate card element
    if (!cardElement) {
      console.error(`[STRIPE ${requestId}] Card element not found`);
      throw new Error('Payment form not properly initialized');
    }

    // Get and validate amount
    const amount = data.ticketAmount === 'custom' ? data.customAmount : data.ticketAmount;
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error(`[STRIPE ${requestId}] Invalid amount:`, amount);
      throw new Error('Invalid payment amount');
    }

    console.log(`[STRIPE ${requestId}] Creating payment intent for £${numericAmount} (Registration: ${registrationId})`);

    // Create payment intent (do NOT send automatic_payment_methods or payment_method_types)
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: numericAmount,
        registrationId: registrationId,
        paymentMethod: 'stripe',
        email: data.email
      })
    });

    // Parse response
    const responseData = await response.json();

    if (!response.ok) {
      console.error(`[STRIPE ${requestId}] Payment intent creation failed:`, {
        status: response.status,
        data: responseData
      });
      throw new Error(responseData.error || 'Failed to create payment intent');
    }

    console.log(`[STRIPE ${requestId}] Payment intent created:`, {
      id: responseData.paymentIntentId,
      requestId: responseData.requestId,
      registrationId: registrationId
    });

    // Confirm payment
    const result = await stripe.confirmCardPayment(responseData.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${data.firstName} ${data.secondName}`,
          email: data.email,
          phone: data.phone
        }
      }
    });

    if (result.error) {
      console.error(`[STRIPE ${requestId}] Payment confirmation failed:`, {
        code: result.error.code,
        message: result.error.message,
        type: result.error.type
      });
      
      // Convert technical errors to user-friendly messages
      let userMessage = 'Payment failed. Please try again.';
      
      switch (result.error.code) {
        case 'incorrect_number':
          userMessage = 'Please check your card number and try again.';
          break;
        case 'invalid_expiry_month':
        case 'invalid_expiry_year':
          userMessage = 'Please check your card expiry date and try again.';
          break;
        case 'invalid_cvc':
          userMessage = 'Please check your card security code (CVC) and try again.';
          break;
        case 'expired_card':
          userMessage = 'Your card has expired. Please use a different card.';
          break;
        case 'card_declined':
          userMessage = 'Your card was declined. Please try a different card or contact your bank.';
          break;
        case 'insufficient_funds':
          userMessage = 'Insufficient funds. Please try a different card or contact your bank.';
          break;
        case 'processing_error':
          userMessage = 'There was an error processing your payment. Please try again.';
          break;
        default:
          userMessage = 'Payment failed. Please check your card details and try again.';
      }
      
      throw new Error(userMessage);
    }

    console.log(`[STRIPE ${requestId}] Payment confirmed:`, {
      id: result.paymentIntent.id,
      status: result.paymentIntent.status,
      registrationId: registrationId
    });

    // Update payment status
    const updateResponse = await fetch('/api/update-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: registrationId,
        paymentId: result.paymentIntent.id,
        status: 'completed',
        requestId: responseData.requestId
      })
    });

    if (!updateResponse.ok) {
      console.warn(`[STRIPE ${requestId}] Payment status update failed:`, await updateResponse.json());
      // Don't throw here - payment was successful even if status update fails
    }

    return result.paymentIntent;
    
  } catch (error) {
    console.error(`[STRIPE ${requestId}] Payment error:`, {
      message: error.message,
      stack: error.stack,
      registrationId: registrationId
    });
    throw error;
  }
}

// Handle bank transfer
async function handleBankTransfer(data, registrationId) {
  try {
    console.log('[BANK] Processing bank transfer...');
    
    // Update registration with bank transfer details using Vercel API
    const response = await fetch('/api/update-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationId: registrationId,
        paymentDetails: {
          type: 'bank_transfer',
          amount: data.manualAmount,
          reference: data.manualReference,
          status: 'pending_verification'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update bank transfer details');
    }

    console.log('[BANK] Bank transfer details saved');
    return true;
    
  } catch (error) {
    console.error('[BANK] Bank transfer error:', error);
    throw error;
  }
}

// Performance optimizations
function initializePerformanceOptimizations() {
  // Mobile-first performance optimizations
  const isMobile = window.innerWidth <= 768;
  const isSlowConnection = navigator.connection &&
    (navigator.connection.effectiveType === 'slow-2g' ||
     navigator.connection.effectiveType === '2g' ||
     navigator.connection.effectiveType === '3g');

  // Lazy load non-critical images
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      // Adjust root margin based on connection speed
      rootMargin: isSlowConnection ? '50px' : '100px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // Optimize for mobile devices
  if (isMobile) {
    document.body.classList.add('mobile-optimized');

    // Disable expensive animations on slow connections
    if (isSlowConnection) {
      document.body.classList.add('reduced-motion');
    }

    // Optimize touch events
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
  }

  // Debounce resize events with better performance
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        if (newIsMobile) {
          document.body.classList.add('mobile-optimized');
        } else {
          document.body.classList.remove('mobile-optimized');
        }
      }
    }, 150); // Reduced timeout for better responsiveness
  }, { passive: true });

  // Monitor performance on mobile
  if (isMobile && 'performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Mobile load time: ${loadTime}ms`);

        // Track slow loading for optimization
        if (loadTime > 3000) {
          trackEvent('performance', 'slow_mobile_load', loadTime);
        }
      }, 0);
    });
  }
}

// Accessibility improvements
function initializeAccessibility() {
  // Add keyboard navigation for social links
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Improve form accessibility
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    // Add aria-describedby for better screen reader support
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      input.setAttribute('aria-describedby', `${input.id}-label`);
      label.id = `${input.id}-label`;
    }
  });

  // Add focus indicators for better keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Analytics and tracking (optional)
function trackEvent(action, category, label) {
  // Google Analytics tracking (if implemented)
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }

  // Console log for development
  console.log(`Event tracked: ${action} - ${category} - ${label}`);
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  trackEvent('javascript_error', 'error', e.error.message);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed');
      });
  });
}

function validateForm() {
  const form = document.getElementById('registrationForm');
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });

  // Validate custom amount if selected
  const ticketAmount = document.getElementById('ticket-amount');
  if (ticketAmount && ticketAmount.value === 'custom') {
    const customAmount = document.getElementById('custom-amount-input');
    if (customAmount && (!customAmount.value || isNaN(customAmount.value) || customAmount.value <= 0)) {
      customAmount.classList.add('error');
      isValid = false;
    }
  }

  return isValid;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.speakers-secondary .read-more-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Find the .collapsible-bio sibling in the same .speaker-info
      var bio = btn.parentElement.querySelector('.collapsible-bio');
      if (!bio) {
        // Try previousElementSibling if not found as a child
        if (btn.previousElementSibling && btn.previousElementSibling.classList.contains('collapsible-bio')) {
          bio = btn.previousElementSibling;
        }
      }
      if (bio) {
        if (bio.classList.contains('expanded')) {
          bio.classList.remove('expanded');
          btn.textContent = 'Read More';
        } else {
          bio.classList.add('expanded');
          btn.textContent = 'Read Less';
        }
      }
    });
  });
});

// Scroll Up Arrow functionality
(function() {
  var scrollArrow = document.querySelector('.scroll-up-arrow');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollArrow.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
})();

