// Performance monitoring and optimization
const perfStart = performance.now();

// Luxury Preloader Management
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
}

// Initialize preloader hiding on multiple events
function initPreloader() {
  // Hide on DOM content loaded (faster)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(hidePreloader, 600);
    });
  } else {
    // Document already loaded
    setTimeout(hidePreloader, 600);
  }

  // Backup: hide on window load
  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 100);
  });

  // Emergency backup: force hide after 3 seconds
  setTimeout(hidePreloader, 3000);
}

// Mobile device detection and optimization
const isMobile = window.innerWidth <= 768;
const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');

if (isMobile) {
  document.documentElement.classList.add('mobile-device');

  // Disable smooth scrolling on very old mobile browsers
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
}

// Intelligent resource loading based on connection speed
if (!isMobile && !isSlowConnection) {
  // Preload critical images only on desktop with good connection
  const criticalImages = ['images/background.jpg', 'images/wealthcreationlondon.png'];
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Icon fallback for mobile devices - Use professional Font Awesome icons
function forceEmojiIcons() {
  const isMobile = window.innerWidth <= 768;
  console.log('🔧 forceProfessionalIcons called - isMobile:', isMobile, 'width:', window.innerWidth);

  if (isMobile) {
    const paymentIcons = document.querySelectorAll('.payment-method-content i');
    console.log('📱 Found payment icons:', paymentIcons.length);

    paymentIcons.forEach((icon, index) => {
      console.log(`🎯 Processing icon ${index}:`, icon.className);

      // Ensure Font Awesome icons are properly displayed
      icon.style.fontSize = '2.5rem';
      icon.style.lineHeight = '1';
      icon.style.textAlign = 'center';
      icon.style.color = '#0c2340';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.opacity = '1';
      icon.style.visibility = 'visible';
      icon.style.zIndex = '100';
      icon.style.background = 'none';
      icon.style.border = 'none';
      icon.style.boxShadow = 'none';
      icon.style.textShadow = 'none';
      icon.style.filter = 'none';
      icon.style.transform = 'none';
      
      console.log('✅ Font Awesome icon styled:', icon.className);
    });

    console.log('✅ Professional icons applied');
  } else {
    console.log('💻 Desktop view - icons already professional');
  }
}

// Initialize preloader immediately
initPreloader();

// Also initialize on script load
if (document.readyState !== 'loading') {
  setTimeout(hidePreloader, 500);
}

// Performance tracking
window.addEventListener('load', () => {
  const loadTime = performance.now() - perfStart;
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

  // Report slow loading for optimization
  if (loadTime > 3000) {
    console.warn('Slow page load detected:', loadTime);
  }

  // Force professional icons on mobile
  setTimeout(forceEmojiIcons, 100);
});

// Also run immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, applying professional icons...');
  forceEmojiIcons();
  // Run again after a short delay
  setTimeout(forceEmojiIcons, 500);
  // Run again after longer delay to catch late-loading elements
  setTimeout(forceEmojiIcons, 2000);
});

// Run immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  console.log('DOM already loaded, applying professional icons immediately...');
  forceEmojiIcons();
}

// Register service worker
async function registerServiceWorker() {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('[SW] Service Worker registered:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[SW] Service Worker update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New content available; please refresh');
          }
        });
      });
      
      return registration;
    }
  } catch (error) {
    console.warn('[SW] Service Worker registration failed:', error);
    // Don't throw the error, just log it
    return null;
  }
}

// Initialize performance optimizations
async function initializePerformanceOptimizations() {
  try {
    // Register service worker
    await registerServiceWorker();
    
    // Force professional icons on mobile
    forceEmojiIcons();
    
    // Track page load time
    trackPageLoadTime();
  } catch (error) {
    console.warn('[PERF] Performance optimization error:', error);
    // Don't throw the error, just log it
  }
}

// Async script loader
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// Load critical scripts in order
loadScript('https://js.stripe.com/v3/', function() {
      // Load main app after dependencies
      loadScript('js/app.js');
});
