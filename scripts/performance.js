// Modern Portfolio Website - Performance Optimizations

// ===== LAZY LOADING CONTROLLER =====
class LazyLoadingController {
  constructor() {
    this.lazyImages = document.querySelectorAll('img[data-src]');
    this.lazyBackgrounds = document.querySelectorAll('[data-bg]');
    this.imageObserver = null;
    this.init();
  }
  
  init() {
    this.createImageObserver();
    this.observeImages();
    this.preloadCriticalImages();
  }
  
  createImageObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };
    
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }
  
  observeImages() {
    this.lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
    
    this.lazyBackgrounds.forEach(element => {
      this.imageObserver.observe(element);
    });
  }
  
  loadImage(element) {
    if (element.tagName === 'IMG') {
      this.loadImageElement(element);
    } else {
      this.loadBackgroundImage(element);
    }
  }
  
  loadImageElement(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Add blur-to-sharp effect
      img.style.filter = 'blur(5px)';
      img.style.transition = 'filter 0.3s ease-out';
      
      img.src = src;
      img.removeAttribute('data-src');
      
      // Remove blur after image loads
      setTimeout(() => {
        img.style.filter = 'none';
      }, 100);
      
      // Add loaded class for additional styling
      img.classList.add('lazy-loaded');
    };
    
    imageLoader.onerror = () => {
      // Fallback for failed images
      img.src = this.createPlaceholderImage(img.alt || 'Image');
      img.classList.add('lazy-error');
    };
    
    imageLoader.src = src;
  }
  
  loadBackgroundImage(element) {
    const bgSrc = element.getAttribute('data-bg');
    if (!bgSrc) return;
    
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      element.style.backgroundImage = `url(${bgSrc})`;
      element.removeAttribute('data-bg');
      element.classList.add('bg-loaded');
    };
    
    imageLoader.src = bgSrc;
  }
  
  preloadCriticalImages() {
    // Preload hero image and other critical images
    const criticalImages = document.querySelectorAll('.hero-image, .about-image');
    
    criticalImages.forEach(img => {
      if (img.src && !img.complete) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
      }
    });
  }
  
  createPlaceholderImage(altText) {
    // Create a simple SVG placeholder
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2a2a2a"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
              fill="#666" text-anchor="middle" dy=".3em">${altText}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

// ===== RESOURCE PRELOADER =====
class ResourcePreloader {
  constructor() {
    this.criticalResources = [
      { type: 'font', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap' },
      { type: 'style', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
    ];
    this.init();
  }
  
  init() {
    this.preloadCriticalResources();
    this.preloadNextPageResources();
  }
  
  preloadCriticalResources() {
    this.criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.type;
      link.href = resource.href;
      if (resource.type === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }
  
  preloadNextPageResources() {
    // Preload resources that might be needed soon
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.preloadSectionResources(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }
  
  preloadSectionResources(section) {
    // Preload images in the next section
    const images = section.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.href = src;
        document.head.appendChild(preloadLink);
      }
    });
  }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
    };
    this.init();
  }
  
  init() {
    this.measureLoadTimes();
    this.observePerformanceMetrics();
    this.monitorResourceLoading();
  }
  
  measureLoadTimes() {
    // Measure page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      this.logPerformanceMetrics();
    });
  }
  
  observePerformanceMetrics() {
    // Observe paint metrics
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
      
      // Observe LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  monitorResourceLoading() {
    // Monitor slow-loading resources
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 1000) { // Resources taking more than 1 second
          console.warn(`Slow resource detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
  
  logPerformanceMetrics() {
    console.group('Performance Metrics');
    console.log(`Load Time: ${this.metrics.loadTime}ms`);
    console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded}ms`);
    console.log(`First Paint: ${this.metrics.firstPaint}ms`);
    console.log(`First Contentful Paint: ${this.metrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${this.metrics.largestContentfulPaint}ms`);
    console.groupEnd();
  }
  
  getMetrics() {
    return this.metrics;
  }
}

// ===== CACHE CONTROLLER =====
class CacheController {
  constructor() {
    this.cacheName = 'portfolio-cache-v1';
    this.cacheableResources = [
      '/',
      '/styles/main.css',
      '/styles/responsive.css',
      '/scripts/main.js',
      '/scripts/animations.js',
      '/scripts/skills.js',
      '/scripts/contact.js',
      '/scripts/projects.js',
      '/scripts/utils.js'
    ];
    this.init();
  }
  
  init() {
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
    this.implementBrowserCaching();
  }
  
  registerServiceWorker() {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }
  
  implementBrowserCaching() {
    // Add cache headers via meta tags for static resources
    const cacheMetaTags = [
      { name: 'Cache-Control', content: 'public, max-age=31536000' }, // 1 year for static assets
      { name: 'Expires', content: new Date(Date.now() + 31536000000).toUTCString() }
    ];
    
    cacheMetaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.httpEquiv = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }
  
  async cacheResources() {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName);
        await cache.addAll(this.cacheableResources);
        console.log('Resources cached successfully');
      } catch (error) {
        console.error('Failed to cache resources:', error);
      }
    }
  }
}

// ===== HARDWARE ACCELERATION OPTIMIZER =====
class HardwareAccelerationOptimizer {
  constructor() {
    this.animatedElements = [];
    this.init();
  }
  
  init() {
    this.identifyAnimatedElements();
    this.applyHardwareAcceleration();
    this.optimizeAnimations();
  }
  
  identifyAnimatedElements() {
    // Find elements that will be animated
    this.animatedElements = [
      ...document.querySelectorAll('[data-animate]'),
      ...document.querySelectorAll('.skill-item'),
      ...document.querySelectorAll('.project-card'),
      ...document.querySelectorAll('.contact-item'),
      ...document.querySelectorAll('.social-link'),
      ...document.querySelectorAll('.nav-link'),
      ...document.querySelectorAll('.progress-bar'),
      ...document.querySelectorAll('.parallax-bg')
    ];
  }
  
  applyHardwareAcceleration() {
    this.animatedElements.forEach(element => {
      // Apply hardware acceleration properties
      element.style.willChange = 'transform, opacity';
      element.style.transform = 'translateZ(0)';
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
    });
  }
  
  optimizeAnimations() {
    // Use transform and opacity for animations instead of other properties
    const style = document.createElement('style');
    style.textContent = `
      /* Hardware-accelerated animations */
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
      }
      
      /* Optimize common animations */
      .animate-transform {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .animate-opacity {
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Prevent layout thrashing */
      .no-layout-shift {
        contain: layout style paint;
      }
    `;
    document.head.appendChild(style);
  }
  
  cleanupAcceleration() {
    // Remove will-change after animations complete
    this.animatedElements.forEach(element => {
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
      });
      
      element.addEventListener('animationend', () => {
        element.style.willChange = 'auto';
      });
    });
  }
}

// ===== MEMORY OPTIMIZER =====
class MemoryOptimizer {
  constructor() {
    this.observers = [];
    this.eventListeners = [];
    this.init();
  }
  
  init() {
    this.optimizeEventListeners();
    this.implementMemoryCleanup();
    this.monitorMemoryUsage();
  }
  
  optimizeEventListeners() {
    // Use event delegation for better performance
    document.addEventListener('click', this.handleDelegatedClick.bind(this), { passive: true });
    document.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16), { passive: true });
  }
  
  handleDelegatedClick(e) {
    // Handle clicks for various elements
    if (e.target.matches('.nav-link, .mobile-nav-link')) {
      // Navigation handled by NavigationController
    } else if (e.target.matches('.skill-tab')) {
      // Skills tab handled by SkillsController
    } else if (e.target.matches('.project-card')) {
      // Project card handled by ProjectsController
    }
  }
  
  handleScroll() {
    // Throttled scroll handling
    this.updateScrollProgress();
    this.updateParallaxElements();
  }
  
  updateScrollProgress() {
    // Update scroll progress indicator
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
  }
  
  updateParallaxElements() {
    // Update parallax elements efficiently
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const rate = window.scrollY * -speed;
        element.style.transform = `translateY(${rate}px)`;
      }
    });
  }
  
  implementMemoryCleanup() {
    // Clean up observers and listeners when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  pauseAnimations() {
    // Pause animations when page is not visible
    document.querySelectorAll('[data-animate]').forEach(element => {
      element.style.animationPlayState = 'paused';
    });
  }
  
  resumeAnimations() {
    // Resume animations when page becomes visible
    document.querySelectorAll('[data-animate]').forEach(element => {
      element.style.animationPlayState = 'running';
    });
  }
  
  cleanup() {
    // Clean up observers and event listeners
    this.observers.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected');
          this.forceGarbageCollection();
        }
      }, 30000); // Check every 30 seconds
    }
  }
  
  forceGarbageCollection() {
    // Force garbage collection if available (Chrome DevTools)
    if (window.gc) {
      window.gc();
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize performance optimizations
  const lazyLoader = new LazyLoadingController();
  const resourcePreloader = new ResourcePreloader();
  const performanceMonitor = new PerformanceMonitor();
  const cacheController = new CacheController();
  const hardwareOptimizer = new HardwareAccelerationOptimizer();
  const memoryOptimizer = new MemoryOptimizer();
  
  // Cache resources after initial load
  window.addEventListener('load', () => {
    setTimeout(() => {
      cacheController.cacheResources();
    }, 1000);
  });
  
  // Export for global access
  window.PerformanceOptimizations = {
    lazyLoader,
    resourcePreloader,
    performanceMonitor,
    cacheController,
    hardwareOptimizer,
    memoryOptimizer
  };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyLoadingController,
    ResourcePreloader,
    PerformanceMonitor,
    CacheController,
    HardwareAccelerationOptimizer,
    MemoryOptimizer
  };
}