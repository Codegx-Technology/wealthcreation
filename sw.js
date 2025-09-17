// Service Worker for Wealth Creation Conference PWA
// Version 2.0.0 - Optimized for Performance

const CACHE_NAME = 'wealth-creation-v2';
const STATIC_CACHE = 'wealth-creation-static-v2';
const DYNAMIC_CACHE = 'wealth-creation-dynamic-v2';

// Ultra-critical resources only (minimal for speed)
const CRITICAL_RESOURCES = [
  '/',
  '/favicon.ico'
];

// Load on demand for better performance
const CACHE_ON_DEMAND = [
  '/css/styles.css',
  '/css/responsive.css', 
  '/css/forms.css',
  '/css/sections.css',
  '/css/animations.css',
  '/js/app.js',
  '/images/wealth-london.png'
];

// Install event - cache critical resources (optimized for speed)
self.addEventListener('install', event => {
  console.log('PWA Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching ultra-critical resources only...');
        // Use addAll with error handling for individual resources
        return Promise.allSettled(
          CRITICAL_RESOURCES.map(resource => 
            cache.add(resource).catch(err => {
              console.warn(`Failed to cache resource: ${resource}`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('Critical resources cached - PWA ready');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('PWA cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external domains (except fonts and CDN resources)
  if (url.origin !== location.origin && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Don't cache if not successful
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Determine which cache to use
            const shouldCacheDynamic = CACHE_ON_DEMAND.some(resource => 
              request.url.includes(resource)
            );
            
            if (shouldCacheDynamic) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  console.log('Caching dynamic resource:', request.url);
                  cache.put(request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.error('Network request failed:', error);
            
            // Return offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'form-submission') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineFormSubmission()
    );
  }
});

// Handle offline form submissions
async function handleOfflineFormSubmission() {
  try {
    // Get stored form data from IndexedDB
    const formData = await getStoredFormData();
    
    if (formData) {
      // Attempt to submit
      const response = await fetch('/submit-form', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        // Clear stored data on successful submission
        await clearStoredFormData();
        console.log('Offline form submission successful');
      }
    }
  } catch (error) {
    console.error('Offline form submission failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredFormData() {
  // Implementation would use IndexedDB to retrieve stored form data
  return null;
}

async function clearStoredFormData() {
  // Implementation would clear stored form data from IndexedDB
}

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    console.log('Performance report:', event.data.metrics);
  }
});
