// Wealth Creation Registration Form - Main JavaScript

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

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing application");

  // Check if mobile device
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Immediate mobile optimizations
    document.body.classList.add('mobile-device');

    // Force immediate visibility on mobile to prevent shaky loading
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.animation = 'none';
    });
  }

  // Preload resources for better performance (only on desktop or fast connections)
  if (!isMobile || (navigator.connection && navigator.connection.effectiveType === '4g')) {
    preloadCriticalResources();
  }

  // Initialize Firebase and form handling
  initializeFirebase();

  // Initialize performance optimizations
  initializePerformanceOptimizations();

  // Initialize accessibility features
  initializeAccessibility();
});

// Initialize Firebase
function initializeFirebase() {
  // Wait for Firebase SDK to load
  window.addEventListener('load', function() {
    console.log("Window loaded, initializing Firebase");

    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);

      // Initialize Firestore
      const db = firebase.firestore();

      // Get form elements
      const form = document.getElementById('registrationForm');
      console.log("Form found:", !!form);

      if (!form) {
        console.error("Registration form not found in the DOM");
        return;
      }

      const formStatus = document.getElementById('formStatus');
      const submitButton = document.getElementById('submitButton');

      // Form submission event listener
      form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Form submitted");

        // Show loading message
        if (formStatus) {
          formStatus.textContent = 'Submitting your registration...';
          formStatus.className = 'form-status loading';
          formStatus.style.display = 'block';
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';
        }

        try {
          // Get form data
          const formData = {
            title: form.title ? form.title.value : '',
            firstName: form.firstName ? form.firstName.value : '',
            secondName: form.secondName ? form.secondName.value : '',
            email: form.email ? form.email.value : '',
            phone: form.phone ? form.phone.value : '',
            amount: form.amount ? form.amount.value : '',
            org: form.org ? form.org.value : '',
            referenceNumber: form.referenceNumber ? form.referenceNumber.value : '',
            timestamp: new Date().toISOString(),
            source: window.location.hostname,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
          };

          console.log("Sending data to Firebase:", formData);

          // Add to Firestore
          const docRef = await db.collection('registrations').add(formData);

          // Success
          console.log("Document written with ID:", docRef.id);

          if (formStatus) {
            formStatus.textContent = 'Registration successful! Thank you for registering.';
            formStatus.className = 'form-status success';
          }

          // Reset form
          form.reset();

          // Track successful submission
          trackEvent('form_submission', 'success', formData.email);

        } catch (error) {
          // Error
          console.error('Error adding document:', error);

          if (formStatus) {
            formStatus.textContent = 'There was a problem submitting your registration. Please try again.';
            formStatus.className = 'form-status error';
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
    } else {
      console.error("Firebase SDK not loaded");
    }
  });
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
