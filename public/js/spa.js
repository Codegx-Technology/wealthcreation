// SPA Navigation and FAQ Functionality

class WealthConferenceSPA {
  constructor() {
    this.currentPage = 'home';
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupFAQ();
    this.handleInitialLoad();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateToPage(page);
      });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'home';
      this.navigateToPage(page, false);
    });
  }

  navigateToPage(page, pushState = true) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(pageEl => {
      pageEl.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      }
    });

    // Update URL and browser history
    if (pushState) {
      const url = page === 'home' ? '/' : `/#${page}`;
      history.pushState({ page }, '', url);
    }

    this.currentPage = page;

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Update page title
    this.updatePageTitle(page);
  }

  updatePageTitle(page) {
    const titles = {
      home: 'Wealth Creation & Leadership Conference - Registration',
      faq: 'FAQ - Wealth Creation & Leadership Conference',
      contact: 'Contact - Wealth Creation & Leadership Conference'
    };
    
    document.title = titles[page] || titles.home;
  }

  handleInitialLoad() {
    // Check URL hash on load
    const hash = window.location.hash.substring(1);
    const page = hash || 'home';
    this.navigateToPage(page, false);
  }

  setupFAQ() {
    // Add click handlers for FAQ items
    document.addEventListener('click', (e) => {
      const faqQuestion = e.target.closest('.faq-question');
      if (faqQuestion) {
        const faqItem = faqQuestion.parentElement;
        this.toggleFAQItem(faqItem);
      }
    });
  }

  toggleFAQItem(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items for accordion effect
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });

    // Toggle current item
    if (isActive) {
      faqItem.classList.remove('active');
    } else {
      faqItem.classList.add('active');
    }
  }
}

// Performance optimizations
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.setupIntersectionObserver();
    this.preloadCriticalResources();
  }

  optimizeImages() {
    // Lazy load images that are not immediately visible
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  setupIntersectionObserver() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.faq-item, .contact-section');
    
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
      });
    }
  }

  preloadCriticalResources() {
    // Preload critical CSS and JS for better performance
    const criticalResources = [
      'css/spa.css',
      'js/spa.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      link.href = resource;
      document.head.appendChild(link);
    });
  }
}

// Mobile optimizations
class MobileOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupTouchOptimizations();
    this.optimizeViewport();
    this.setupFastClick();
  }

  setupTouchOptimizations() {
    // Improve touch responsiveness
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // Optimize scroll performance
    let ticking = false;
    
    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll optimizations here
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  optimizeViewport() {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (window.innerWidth < 768) {
          document.querySelector('meta[name=viewport]').setAttribute(
            'content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
        }
      });

      input.addEventListener('blur', () => {
        if (window.innerWidth < 768) {
          document.querySelector('meta[name=viewport]').setAttribute(
            'content', 
            'width=device-width, initial-scale=1.0, user-scalable=yes'
          );
        }
      });
    });
  }

  setupFastClick() {
    // Remove 300ms delay on mobile taps
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', () => {}, { passive: true });
    }
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize SPA
  window.wealthSPA = new WealthConferenceSPA();
  
  // Initialize performance optimizations
  new PerformanceOptimizer();
  
  // Initialize mobile optimizations
  new MobileOptimizer();
  
  console.log('🚀 Wealth Conference SPA initialized successfully!');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WealthConferenceSPA, PerformanceOptimizer, MobileOptimizer };
}
