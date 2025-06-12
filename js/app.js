// Wealth Creation Registration Form - Main JavaScript

// Production Environment Configuration
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = IS_PRODUCTION ? 'https://your-domain.com' : 'http://localhost:3000';

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

  // Immediate button test
  const testButton = document.getElementById('submitButton');
  const testForm = document.getElementById('registrationForm');
  console.log('🔍 Initial element check:');
  console.log('Submit button exists:', !!testButton);
  console.log('Registration form exists:', !!testForm);

  if (testButton) {
    console.log('Button type:', testButton.type);
    console.log('Button disabled:', testButton.disabled);
    console.log('Button innerHTML:', testButton.innerHTML);
    console.log('Button style.display:', testButton.style.display);
    console.log('Button offsetWidth:', testButton.offsetWidth);
    console.log('Button offsetHeight:', testButton.offsetHeight);

    // Test button visibility and clickability
    const buttonRect = testButton.getBoundingClientRect();
    console.log('Button position:', {
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
      visible: buttonRect.width > 0 && buttonRect.height > 0
    });
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
        console.log('Mobile button optimizations applied');
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
});

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
  const amountField = document.getElementById('amount');
  const referenceField = document.getElementById('referenceNumber');

  function togglePaymentSections() {
    if (stripeRadio && stripeRadio.checked) {
      if (stripeSection) stripeSection.style.display = 'block';
      if (bankSection) bankSection.style.display = 'none';
      // Make amount and reference optional for Stripe payments
      if (amountField) amountField.removeAttribute('required');
      if (referenceField) referenceField.removeAttribute('required');
      console.log('Switched to Stripe payment');
    } else {
      if (stripeSection) stripeSection.style.display = 'none';
      if (bankSection) bankSection.style.display = 'block';
      // Make amount and reference required for bank transfers
      if (amountField) amountField.setAttribute('required', 'required');
      if (referenceField) referenceField.setAttribute('required', 'required');
      console.log('Switched to bank transfer');
    }
  }

  // Initial setup
  togglePaymentSections();

  // Add event listeners
  if (stripeRadio) stripeRadio.addEventListener('change', togglePaymentSections);
  if (bankRadio) bankRadio.addEventListener('change', togglePaymentSections);
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
  const formStatus = document.getElementById('formStatus');

  console.log('Initializing form submission fallback...');
  console.log('Form found:', !!form);
  console.log('Submit button found:', !!submitButton);

  if (!form || !submitButton) {
    console.error('Critical form elements not found!');
    return;
  }

  // Add click event listener to button as backup
  submitButton.addEventListener('click', function(event) {
    console.log('🔥 Submit button clicked!');
    console.log('Event details:', {
      type: event.type,
      target: event.target.tagName,
      buttonType: event.target.type,
      disabled: event.target.disabled,
      formId: form.id,
      buttonId: event.target.id
    });

    // Visual feedback for user
    const formStatus = document.getElementById('formStatus');
    if (formStatus) {
      formStatus.textContent = '✅ Button clicked! Processing...';
      formStatus.className = 'form-status loading';
      formStatus.style.display = 'block';
    }

    // If the form's submit event doesn't fire, this will
    if (event.target.type === 'submit') {
      console.log('Button type is submit - form should handle this');
    }
  });

  // Add additional event listeners for debugging
  submitButton.addEventListener('mousedown', () => console.log('🖱️ Button mousedown'));
  submitButton.addEventListener('mouseup', () => console.log('🖱️ Button mouseup'));
  submitButton.addEventListener('focus', () => console.log('🎯 Button focused'));
  submitButton.addEventListener('blur', () => console.log('🎯 Button blurred'));

  // Add direct form submit listener as backup
  form.addEventListener('submit', function(event) {
    console.log('Form submit event fired!');

    // If Firebase form handler isn't working, provide basic functionality
    if (!window.firebaseFormHandlerActive) {
      event.preventDefault();
      console.log('Firebase handler not active, using fallback...');

      if (formStatus) {
        formStatus.textContent = 'Form submission detected! Please ensure Firebase is loaded for full functionality.';
        formStatus.className = 'form-status loading';
        formStatus.style.display = 'block';
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';
      }

      // Re-enable button after 3 seconds
      setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Complete Registration <i class="fas fa-arrow-right"></i>';
        }
        if (formStatus) {
          formStatus.textContent = 'Please check that all required fields are filled and try again.';
          formStatus.className = 'form-status error';
        }
      }, 3000);
    }
  });

  console.log('Form submission fallback initialized');
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
      form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Form submitted via Firebase handler");

        // Show loading message
        if (formStatus) {
          formStatus.textContent = 'Processing your registration...';
          formStatus.className = 'form-status loading';
          formStatus.style.display = 'block';
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';
        }

        try {
          // Get payment method - default to bank if not found
          const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
          const paymentMethod = paymentMethodElement ? paymentMethodElement.value : 'bank';

          console.log('Payment method selected:', paymentMethod);

          // Get basic form data
          const formData = {
            title: document.getElementById('title')?.value || '',
            firstName: document.getElementById('firstName')?.value || '',
            secondName: document.getElementById('secondName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            org: document.getElementById('org')?.value || '',
            paymentMethod: paymentMethod,
            timestamp: new Date().toISOString(),
            source: window.location.hostname,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
          };

          console.log('Collected form data:', formData);

          // Validate required fields
          if (!formData.firstName || !formData.secondName || !formData.email || !formData.phone) {
            throw new Error('Please fill in all required fields (First Name, Last Name, Email, Phone)');
          }

          if (paymentMethod === 'stripe') {
            // Check if Stripe is properly configured
            if (typeof stripe === 'undefined' || !stripe) {
              throw new Error('Stripe payment is not available. Please use bank transfer or contact support.');
            }

            // Handle Stripe payment
            const ticketAmountElement = document.getElementById('ticket-amount');
            if (!ticketAmountElement || !ticketAmountElement.value) {
              throw new Error('Please select a ticket amount');
            }

            let ticketAmount = ticketAmountElement.value;

            // Handle custom amount
            if (ticketAmount === 'custom') {
              const customAmountElement = document.getElementById('custom-amount-input');
              if (!customAmountElement || !customAmountElement.value || customAmountElement.value < 1) {
                throw new Error('Please enter a valid custom amount');
              }
              ticketAmount = customAmountElement.value;
            }
            formData.amount = ticketAmount;
            formData.paymentStatus = 'processing';

            try {
              console.log('🚀 Starting LIVE Stripe payment process...');
              console.log('⚠️ WARNING: This will process REAL MONEY!');

              // Try to use backend server for real payment processing
              let useBackend = true;
              let response;

              try {
                response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: parseInt(ticketAmount),
                    currency: 'gbp'
                  }),
                });

                if (!response.ok) {
                  useBackend = false;
                }
              } catch (fetchError) {
                console.log('Backend not available, using payment method capture');
                useBackend = false;
              }

              if (useBackend && response) {
                // Full payment processing with backend
                const { clientSecret, paymentIntentId } = await response.json();
                console.log('Payment intent created:', paymentIntentId);

                const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
                  payment_method: {
                    card: cardElement,
                    billing_details: {
                      name: `${formData.firstName} ${formData.secondName}`,
                      email: formData.email,
                      phone: formData.phone,
                    },
                  }
                });

                if (error) {
                  throw new Error(error.message);
                }

                if (paymentIntent.status === 'succeeded') {
                  formData.paymentStatus = 'completed';
                  formData.stripePaymentIntentId = paymentIntent.id;
                  formData.referenceNumber = paymentIntent.id;
                  formData.amount = ticketAmount;
                  formData.currency = 'gbp';
                  formData.livePayment = true;
                  console.log('💰 PAYMENT SUCCESSFUL! Money deducted: £' + ticketAmount);
                } else {
                  throw new Error('Payment was not successful');
                }
              } else {
                // Fallback: Payment method capture only
                const {error: paymentMethodError, paymentMethod} = await stripe.createPaymentMethod({
                  type: 'card',
                  card: cardElement,
                  billing_details: {
                    name: `${formData.firstName} ${formData.secondName}`,
                    email: formData.email,
                    phone: formData.phone,
                  },
                });

                if (paymentMethodError) {
                  throw new Error(paymentMethodError.message);
                }

                formData.paymentStatus = 'payment_method_created';
                formData.stripePaymentMethodId = paymentMethod.id;
                formData.referenceNumber = paymentMethod.id;
                formData.amount = ticketAmount;
                formData.currency = 'gbp';
                formData.livePayment = true;
                console.log('💳 Payment method captured for manual processing');
              }
            } catch (stripeError) {
              console.error('Stripe payment error:', stripeError);
              throw new Error('Stripe payment failed. Please try bank transfer instead.');
            }
          } else {
            // Handle bank transfer
            const manualAmountElement = document.getElementById('manual-amount');
            const manualReferenceElement = document.getElementById('manual-reference');

            // For bank transfer, get amount from manual fields or fallback to old amount field
            const amountValue = manualAmountElement ? manualAmountElement.value :
                              (form.amount ? form.amount.value : '');
            const referenceValue = manualReferenceElement ? manualReferenceElement.value :
                                 (form.referenceNumber ? form.referenceNumber.value : '');

            if (!amountValue || !referenceValue) {
              throw new Error('Please enter both amount paid and payment reference for bank transfer.');
            }

            formData.amount = amountValue;
            formData.referenceNumber = referenceValue;
            formData.paymentStatus = 'pending_verification';
          }

          // Add production metadata
          formData.environment = IS_PRODUCTION ? 'production' : 'development';
          formData.userAgent = navigator.userAgent;
          formData.timestamp = new Date().toISOString();
          formData.submissionId = `REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          console.log("Sending data to Firebase:", formData);

          // Add to Firestore
          const docRef = await db.collection('registrations').add(formData);

          // Success
          console.log("✅ Registration saved with ID:", docRef.id);
          console.log("📊 Submission ID:", formData.submissionId);

          if (formStatus) {
            if (paymentMethod === 'stripe') {
              if (formData.livePayment) {
                formStatus.textContent = '✅ Payment method captured! Your registration is being processed. You will receive confirmation shortly.';
              } else {
                formStatus.textContent = 'Payment successful! Registration complete. Thank you!';
              }
            } else {
              formStatus.textContent = 'Registration submitted! Please complete your bank transfer using the details above.';
            }
            formStatus.className = 'form-status success';
          }

          // Reset form
          form.reset();
          if (cardElement) {
            cardElement.clear();
          }

          // Track successful submission
          trackEvent('form_submission', 'success', formData.email);

        } catch (error) {
          // Error
          console.error('Error processing registration:', error);
          console.error('Error stack:', error.stack);

          if (formStatus) {
            formStatus.textContent = `Registration Error: ${error.message}`;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
          }

          // Track failed submission
          trackEvent('form_submission', 'error', error.message);

        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Complete Registration <i class="fas fa-arrow-right"></i>';
          }
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
