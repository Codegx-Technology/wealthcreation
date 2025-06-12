// Performance monitoring and optimization
const perfStart = performance.now();

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

// Performance tracking
window.addEventListener('load', () => {
  const loadTime = performance.now() - perfStart;
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

  // Report slow loading for optimization
  if (loadTime > 3000) {
    console.warn('Slow page load detected:', loadTime);
  }
});

// Service Worker registration for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
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
  loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js', function() {
    loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js', function() {
      // Load main app after dependencies
      loadScript('js/app.js');
    });
  });
});
