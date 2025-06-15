// Wealth Creation Registration Form - Main JavaScript

// Production Environment Configuration
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = IS_PRODUCTION ? '/.netlify/functions' : 'http://localhost:8888/.netlify/functions';

// Stripe configuration - LIVE KEYS (PRODUCTION READY)
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RSwMYHJXlyttSrEkl62MQWevo8uCIv3g7VghWNHomq73nPJxqO0VtKIxmxTcJmcXHLRbSWNO8X2IGEHqYT4CVRG00dW3xOhDz';
let stripe;
let elements;
let cardElement;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXiak3a4DluvlmBzniR1n7U7hkQ1J1lAM",
  authDomain: "wealth-creation-registration.firebaseapp.com",
  projectId: "wealth-creation-registration",
  storageBucket: "wealth-creation-registration.firebasestorage.app",
  messagingSenderId: "440514993252",
  appId: "1:440514993252:web:47cc825e650523bc515371",
  measurementId: "G-LXZ6HGN7LF"
};

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
  // Only preload on desktop or fast connections
  if (navigator.connection && navigator.connection.effectiveType === '4g' || window.innerWidth > 768) {
    // Preload hero image
    const heroImg = new Image();
    heroImg.src = 'images/background.jpg';

    // Preload QR code image
    const qrImg = new Image();
    qrImg.src = 'images/wealthcreationlondon.png';

    // Preload other images only on desktop
    if (window.innerWidth > 768) {
      const bgImg = new Image();
      bgImg.src = 'images/london_skyline.jpg';
    }
  }
}

// Toggle custom amount section
function toggleCustomAmount() {
  const ticketAmount = document.getElementById('ticket-amount');
  const customSection = document.getElementById('custom-amount-section');
  const customInput = document.getElementById('custom-amount-input');

  console.log('toggleCustomAmount called, value:', ticketAmount?.value);

  if (ticketAmount && customSection) {
    if (ticketAmount.value === 'custom') {
      customSection.style.display = 'block';
      customSection.style.opacity = '1';
      if (customInput) {
        customInput.focus();
        customInput.setAttribute('required', 'required');
      }
      console.log('Custom amount section shown');
    } else {
      customSection.style.display = 'none';
      customSection.style.opacity = '0';
      if (customInput) {
        customInput.removeAttribute('required');
        customInput.value = '';
      }
      console.log('Custom amount section hidden');
    }
  } else {
    console.error('toggleCustomAmount: Elements not found', {
      ticketAmount: !!ticketAmount,
      customSection: !!customSection
    });
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing application");

  // Ensure critical elements exist before proceeding
  const form = document.getElementById('registrationForm');
  const submitButton = document.getElementById('submitButton');

  if (!form || !submitButton) {
    console.error('Critical form elements missing - retrying in 500ms');
    setTimeout(() => {
      if (document.getElementById('registrationForm') && document.getElementById('submitButton')) {
        initializeApp();
      } else {
        console.error('Form elements still missing after retry');
      }
    }, 500);
    return;
  }

  initializeApp();
});

function initializeApp() {

  // Check for duplicate payment method titles and remove them
  const paymentTitles = document.querySelectorAll('.payment-method-title');
  if (paymentTitles.length > 1) {
    // Keep only the first one and remove the rest
    for (let i = 1; i < paymentTitles.length; i++) {
      paymentTitles[i].remove();
    }
  }

  // Quick element check
  const testButton = document.getElementById('submitButton');
  const testForm = document.getElementById('registrationForm');

  if (!testButton || !testForm) {
    console.error('Critical form elements missing!');
    return;
  }

  // Check if mobile device
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Immediate mobile optimizations
    document.body.classList.add('mobile-device');

    // Ensure button is properly clickable on mobile
    setTimeout(() => {
      const submitButton = document.getElementById('submitButton');
      if (submitButton) {
        submitButton.style.pointerEvents = 'auto';
        submitButton.style.touchAction = 'manipulation';
        submitButton.style.webkitTapHighlightColor = 'transparent';
      }
    }, 100);
  }

  // Preload resources for better performance (only on desktop or fast connections)
  if (!isMobile || (navigator.connection && navigator.connection.effectiveType === '4g')) {
    preloadCriticalResources();
  }

  // Initialize Stripe
  initializeStripe();

  // Initialize Firebase and form handling
  initializeFirebase();

  // Initialize payment method handling
  initializePaymentMethods();

  // Initialize custom amount functionality
  initializeCustomAmount();

  // Initialize performance optimizations
  initializePerformanceOptimizations();

  // Initialize accessibility features
  initializeAccessibility();

  // Initialize form submission (fallback if Firebase fails)
  initializeFormSubmission();
}

// Initialize Stripe
function initializeStripe() {
  try {
    if (typeof Stripe !== 'undefined') {
      // Check if we have a valid publishable key
      if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes('pk_test_51234567890abcdef')) {
        console.warn('Stripe publishable key not configured - Stripe payments disabled');
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

        // Handle real-time validation errors from the card Element
        cardElement.on('change', ({error}) => {
          const displayError = document.getElementById('card-errors');
          if (error) {
            displayError.textContent = error.message;
            displayError.style.display = 'block';
          } else {
            displayError.textContent = '';
            displayError.style.display = 'none';
          }
        });

        console.log('Stripe initialized successfully');
      } else {
        console.error('Card element container not found');
      }
    } else {
      console.error('Stripe SDK not loaded');
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error);
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
  const stripeRadio = document.getElementById('stripe-payment');
  const bankRadio = document.getElementById('bank-transfer');
  const stripeSection = document.getElementById('stripe-payment-section');
  const bankSection = document.getElementById('bank-transfer-section');
  const manualAmountField = document.getElementById('manual-amount');
  const manualReferenceField = document.getElementById('manual-reference');

  console.log('Initializing payment methods...');
  console.log('Stripe radio found:', !!stripeRadio);
  console.log('Bank radio found:', !!bankRadio);
  console.log('Stripe section found:', !!stripeSection);
  console.log('Bank section found:', !!bankSection);

  function togglePaymentSections() {
    console.log('🔄 Toggling payment sections with smooth transitions...');

    if (stripeRadio && stripeRadio.checked) {
      // Show Stripe section with animation
      if (stripeSection) {
        stripeSection.classList.remove('hidden');
        stripeSection.classList.add('show');
        stripeSection.style.display = 'block';
        console.log('✨ Showing Stripe section with animation');
      }
      // Hide bank section with animation
      if (bankSection) {
        bankSection.classList.add('hidden');
        bankSection.classList.remove('show');
        setTimeout(() => {
          bankSection.style.display = 'none';
        }, 500); // Wait for animation to complete
        console.log('🎭 Hiding bank section with animation');
      }
      // Make manual amount and reference optional for Stripe payments
      if (manualAmountField) manualAmountField.removeAttribute('required');
      if (manualReferenceField) manualReferenceField.removeAttribute('required');
      console.log('💳 Switched to Stripe payment');
    } else {
      // Hide Stripe section with animation
      if (stripeSection) {
        stripeSection.classList.add('hidden');
        stripeSection.classList.remove('show');
        setTimeout(() => {
          stripeSection.style.display = 'none';
        }, 500); // Wait for animation to complete
        console.log('🎭 Hiding Stripe section with animation');
      }
      // Show bank section with animation
      if (bankSection) {
        bankSection.classList.remove('hidden');
        bankSection.classList.add('show');
        bankSection.style.display = 'block';
        console.log('✨ Showing bank section with animation');
      }
      // Make manual amount and reference required for bank transfers
      if (manualAmountField) manualAmountField.setAttribute('required', 'required');
      if (manualReferenceField) manualReferenceField.setAttribute('required', 'required');
      console.log('🏦 Switched to bank transfer');
    }
  }

  // Initial setup
  togglePaymentSections();

  // Add event listeners with debugging
  if (stripeRadio) {
    stripeRadio.addEventListener('change', function() {
      console.log('🔄 Stripe radio changed, checked:', this.checked);
      togglePaymentSections();
    });
  }
  if (bankRadio) {
    bankRadio.addEventListener('change', function() {
      console.log('🔄 Bank radio changed, checked:', this.checked);
      togglePaymentSections();
    });
  }

  console.log('Payment method initialization complete');
}

// Initialize custom amount functionality
function initializeCustomAmount() {
  const ticketAmountSelect = document.getElementById('ticket-amount');

  if (ticketAmountSelect) {
    // Add event listener for amount selection change
    ticketAmountSelect.addEventListener('change', function() {
      console.log('Ticket amount changed to:', this.value);
      toggleCustomAmount();
    });

    // Initial call to set correct state
    toggleCustomAmount();

    console.log('Custom amount functionality initialized');
  } else {
    console.warn('Ticket amount select not found - custom amount functionality disabled');
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
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
      
      if (paymentMethod === 'stripe') {
        await handleStripePayment(data);
      } else if (paymentMethod === 'bank-transfer') {
        await handleBankTransfer(data);
      } else {
        throw new Error('Please select a payment method');
      }

      // Save to Firebase
      await saveToFirebase(data);
      
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
function initializeFirebase() {
  console.log("Initializing Firebase");

  // Check if Firebase is available
  if (typeof firebase !== 'undefined') {
    console.log('Firebase SDK loaded, initializing...');

    try {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase app initialized');

      // Initialize Firestore
      const db = firebase.firestore();
      console.log('Firestore initialized');

      // Get form elements
      const form = document.getElementById('registrationForm');
      console.log("Form found:", !!form);

      if (!form) {
        console.error("Registration form not found in the DOM");
        return;
      }

      const formStatus = document.getElementById('formStatus');
      const submitButton = document.getElementById('submitButton');

      // Set flag to indicate Firebase handler is active
      window.firebaseFormHandlerActive = true;

      // Form submission event listener
      form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
          alert('Please fill in all required fields correctly.');
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        try {
          const formData = new FormData(this);
          const data = Object.fromEntries(formData.entries());
          
          // Add timestamp
          data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
          
          // Handle payment method
          const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
          data.paymentMethod = paymentMethod;

          // Handle custom amount
          if (data['ticket-amount'] === 'custom') {
            data.amount = parseFloat(data['custom-amount-input']);
          } else {
            data.amount = parseFloat(data['ticket-amount']);
          }

          // Save to Firebase
          const docRef = await db.collection('registrations').add(data);
          console.log('Registration saved with ID:', docRef.id);

          // Handle payment based on method
          if (paymentMethod === 'stripe') {
            await handleStripePayment(data);
          } else if (paymentMethod === 'bank-transfer') {
            showBankTransferDetails();
          }

          // Show success message
          showSuccessMessage();
        } catch (error) {
          console.error('Error saving registration:', error);
          alert('There was an error processing your registration. Please try again.');
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Complete Registration';
        }
      });

    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  } else {
    console.error("Firebase SDK not loaded");
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

async function handleStripePayment(data) {
  if (!stripe || !cardElement) {
    throw new Error('Stripe not initialized');
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentMethod;
}

async function handleBankTransfer(data) {
  // Validate bank transfer details
  const amount = data['ticket-amount'] === 'custom' 
    ? data['custom-amount-input'] 
    : data['ticket-amount'];

  if (!amount || isNaN(amount) || amount <= 0) {
    throw new Error('Invalid payment amount');
  }

  return { type: 'bank_transfer', amount };
}

async function saveToFirebase(data) {
  try {
    const db = firebase.firestore();
    const registrationRef = db.collection('registrations');
    
    // Add timestamp and status
    const registrationData = {
      ...data,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    await registrationRef.add(registrationData);
  } catch (error) {
    console.error('Firebase save error:', error);
    throw new Error('Failed to save registration data');
}
