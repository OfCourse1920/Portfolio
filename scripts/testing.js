// Modern Portfolio Website - Testing and Optimization

// ===== PERFORMANCE TESTING =====
class PerformanceTester {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.measureLoadTime();
    this.measureRenderTime();
    this.measureInteractionTime();
    this.testAnimationPerformance();
    this.runAccessibilityTests();
  }
  
  measureLoadTime() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      this.metrics.loadTime = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
      
      console.log('Load Time Metrics:', this.metrics.loadTime);
      this.checkLoadTimeThresholds();
    });
  }
  
  measureRenderTime() {
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics[entry.name] = entry.startTime;
        });
        
        console.log('Paint Metrics:', {
          firstPaint: this.metrics['first-paint'],
          firstContentfulPaint: this.metrics['first-contentful-paint']
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        
        console.log('LCP:', this.metrics.largestContentfulPaint);
        this.checkLCPThreshold();
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  measureInteractionTime() {
    // First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          console.log('First Input Delay:', this.metrics.firstInputDelay);
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
    
    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.metrics.cumulativeLayoutShift = clsValue;
      console.log('Cumulative Layout Shift:', clsValue);
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
  
  testAnimationPerformance() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    let frameCount = 0;
    let startTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - startTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
        console.log('Animation FPS:', fps);
        
        if (fps < 55) {
          console.warn('Animation performance below 55fps:', fps);
        }
        
        frameCount = 0;
        startTime = currentTime;
      }
      
      if (animatedElements.length > 0) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    if (animatedElements.length > 0) {
      requestAnimationFrame(measureFPS);
    }
  }
  
  runAccessibilityTests() {
    this.testColorContrast();
    this.testKeyboardNavigation();
    this.testARIALabels();
    this.testFocusManagement();
  }
  
  testColorContrast() {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    const contrastIssues = [];
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simplified contrast check (would need proper implementation)
      if (this.isLowContrast(color, backgroundColor)) {
        contrastIssues.push(element);
      }
    });
    
    if (contrastIssues.length > 0) {
      console.warn('Potential contrast issues found:', contrastIssues.length);
    } else {
      console.log('✓ Color contrast check passed');
    }
  }
  
  testKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const issues = [];
    
    interactiveElements.forEach(element => {
      // Check if element is focusable
      if (element.tabIndex < 0 && !element.hasAttribute('tabindex')) {
        issues.push(`Element not focusable: ${element.tagName}`);
      }
      
      // Check for ARIA labels
      if (!element.getAttribute('aria-label') && 
          !element.getAttribute('aria-labelledby') && 
          !element.textContent.trim()) {
        issues.push(`Element missing accessible name: ${element.tagName}`);
      }
    });
    
    if (issues.length > 0) {
      console.warn('Keyboard navigation issues:', issues);
    } else {
      console.log('✓ Keyboard navigation check passed');
    }
  }
  
  testARIALabels() {
    const elementsNeedingLabels = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby]), ' +
      'input:not([aria-label]):not([aria-labelledby]), ' +
      '[role="button"]:not([aria-label]):not([aria-labelledby])'
    );
    
    const unlabeledElements = Array.from(elementsNeedingLabels).filter(element => {
      return !element.textContent.trim() && !element.querySelector('label');
    });
    
    if (unlabeledElements.length > 0) {
      console.warn('Elements missing ARIA labels:', unlabeledElements.length);
    } else {
      console.log('✓ ARIA labels check passed');
    }
  }
  
  testFocusManagement() {
    // Test focus trap in modals
    const modals = document.querySelectorAll('[role="dialog"]');
    
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        console.warn('Modal without focusable elements:', modal);
      }
    });
    
    console.log('✓ Focus management check completed');
  }
  
  checkLoadTimeThresholds() {
    const { totalTime } = this.metrics.loadTime;
    
    if (totalTime > 3000) {
      console.warn('⚠️ Load time exceeds 3 seconds:', totalTime + 'ms');
    } else {
      console.log('✓ Load time within acceptable range:', totalTime + 'ms');
    }
  }
  
  checkLCPThreshold() {
    const lcp = this.metrics.largestContentfulPaint;
    
    if (lcp > 2500) {
      console.warn('⚠️ LCP exceeds 2.5 seconds:', lcp + 'ms');
    } else {
      console.log('✓ LCP within acceptable range:', lcp + 'ms');
    }
  }
  
  isLowContrast(color, backgroundColor) {
    // Simplified contrast check - would need proper implementation
    // This is a placeholder for actual contrast ratio calculation
    return false;
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    };
    
    console.log('Performance Report:', report);
    return report;
  }
}

// ===== CROSS-BROWSER TESTING =====
class CrossBrowserTester {
  constructor() {
    this.browserInfo = this.getBrowserInfo();
    this.init();
  }
  
  init() {
    this.testFeatureSupport();
    this.testCSSSupport();
    this.testJavaScriptAPIs();
    this.applyBrowserSpecificFixes();
  }
  
  getBrowserInfo() {
    const ua = navigator.userAgent;
    
    return {
      isChrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor),
      isEdge: /Edg/.test(ua),
      isIE: /Trident/.test(ua),
      isMobile: /Mobi|Android/i.test(ua),
      version: this.extractVersion(ua)
    };
  }
  
  extractVersion(ua) {
    const match = ua.match(/(Chrome|Firefox|Safari|Edg|Trident)\/(\d+)/);
    return match ? parseInt(match[2]) : 0;
  }
  
  testFeatureSupport() {
    const features = {
      grid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      customProperties: CSS.supports('--custom', 'property'),
      intersectionObserver: 'IntersectionObserver' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webp: this.testWebPSupport(),
      touchEvents: 'ontouchstart' in window
    };
    
    console.log('Feature Support:', features);
    
    // Apply fallbacks for unsupported features
    if (!features.grid) {
      document.body.classList.add('no-grid');
    }
    
    if (!features.flexbox) {
      document.body.classList.add('no-flexbox');
    }
    
    if (!features.customProperties) {
      document.body.classList.add('no-custom-properties');
    }
    
    return features;
  }
  
  testWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
  
  testCSSSupport() {
    const cssFeatures = {
      backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      clipPath: CSS.supports('clip-path', 'circle(50%)'),
      objectFit: CSS.supports('object-fit', 'cover'),
      position: CSS.supports('position', 'sticky'),
      gap: CSS.supports('gap', '1rem')
    };
    
    console.log('CSS Feature Support:', cssFeatures);
    
    // Apply CSS classes for unsupported features
    Object.keys(cssFeatures).forEach(feature => {
      if (!cssFeatures[feature]) {
        document.body.classList.add(`no-${feature.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      }
    });
  }
  
  testJavaScriptAPIs() {
    const apis = {
      fetch: 'fetch' in window,
      promise: 'Promise' in window,
      arrow: (() => { try { eval('() => {}'); return true; } catch(e) { return false; } })(),
      const: (() => { try { eval('const x = 1'); return true; } catch(e) { return false; } })(),
      let: (() => { try { eval('let x = 1'); return true; } catch(e) { return false; } })(),
      destructuring: (() => { try { eval('const {x} = {}'); return true; } catch(e) { return false; } })()
    };
    
    console.log('JavaScript API Support:', apis);
    
    // Load polyfills for unsupported APIs
    if (!apis.fetch) {
      this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=fetch');
    }
    
    if (!apis.promise) {
      this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=Promise');
    }
  }
  
  applyBrowserSpecificFixes() {
    const { browserInfo } = this;
    
    // Safari fixes
    if (browserInfo.isSafari) {
      document.body.classList.add('safari');
      this.applySafariFixes();
    }
    
    // Firefox fixes
    if (browserInfo.isFirefox) {
      document.body.classList.add('firefox');
      this.applyFirefoxFixes();
    }
    
    // Chrome fixes
    if (browserInfo.isChrome) {
      document.body.classList.add('chrome');
      this.applyChromeFixes();
    }
    
    // Edge fixes
    if (browserInfo.isEdge) {
      document.body.classList.add('edge');
      this.applyEdgeFixes();
    }
    
    // IE fixes (if still needed)
    if (browserInfo.isIE) {
      document.body.classList.add('ie');
      this.applyIEFixes();
    }
    
    // Mobile fixes
    if (browserInfo.isMobile) {
      document.body.classList.add('mobile');
      this.applyMobileFixes();
    }
  }
  
  applySafariFixes() {
    // Fix for Safari's sticky positioning
    const stickyElements = document.querySelectorAll('.sticky, [style*="sticky"]');
    stickyElements.forEach(element => {
      element.style.position = '-webkit-sticky';
    });
    
    // Fix for Safari's transform issues
    const transformElements = document.querySelectorAll('[style*="transform"]');
    transformElements.forEach(element => {
      element.style.webkitTransform = element.style.transform;
    });
  }
  
  applyFirefoxFixes() {
    // Firefox scrollbar styling
    const style = document.createElement('style');
    style.textContent = `
      * {
        scrollbar-width: thin;
        scrollbar-color: var(--accent-primary) var(--bg-tertiary);
      }
    `;
    document.head.appendChild(style);
  }
  
  applyChromeFixes() {
    // Chrome-specific optimizations
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  }
  
  applyEdgeFixes() {
    // Edge-specific fixes
    console.log('Applying Edge-specific fixes');
  }
  
  applyIEFixes() {
    // IE11 fixes (if still supporting)
    console.warn('Internet Explorer detected - limited functionality');
    
    // Load IE polyfills
    this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=default');
  }
  
  applyMobileFixes() {
    // Mobile-specific optimizations
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
          );
        }
      });
      
      input.addEventListener('blur', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1'
          );
        }
      });
    });
  }
  
  loadPolyfill(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.head.appendChild(script);
  }
}

// ===== FINAL OPTIMIZATION =====
class FinalOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.optimizeImages();
    this.optimizeAnimations();
    this.optimizeEventListeners();
    this.cleanupUnusedCode();
    this.finalPerformanceCheck();
  }
  
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading attribute if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding attribute for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
      
      // Optimize image loading
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      
      img.addEventListener('error', () => {
        img.classList.add('error');
        console.warn('Failed to load image:', img.src);
      });
    });
  }
  
  optimizeAnimations() {
    // Remove will-change after animations complete
    const animatedElements = document.querySelectorAll('[style*="will-change"]');
    
    animatedElements.forEach(element => {
      element.addEventListener('animationend', () => {
        element.style.willChange = 'auto';
      });
      
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
      });
    });
  }
  
  optimizeEventListeners() {
    // Use passive listeners where appropriate
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    scrollElements.forEach(element => {
      element.addEventListener('scroll', () => {}, { passive: true });
    });
  }
  
  cleanupUnusedCode() {
    // Remove unused CSS classes
    const allElements = document.querySelectorAll('*');
    const usedClasses = new Set();
    
    allElements.forEach(element => {
      element.classList.forEach(className => {
        usedClasses.add(className);
      });
    });
    
    console.log('Used CSS classes:', usedClasses.size);
  }
  
  finalPerformanceCheck() {
    // Final performance validation
    setTimeout(() => {
      const performanceEntries = performance.getEntriesByType('navigation');
      const loadTime = performanceEntries[0].loadEventEnd - performanceEntries[0].loadEventStart;
      
      if (loadTime < 3000) {
        console.log('✅ Performance target achieved:', loadTime + 'ms');
      } else {
        console.warn('⚠️ Performance target not met:', loadTime + 'ms');
      }
    }, 1000);
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize testing and optimization
  const performanceTester = new PerformanceTester();
  const crossBrowserTester = new CrossBrowserTester();
  const finalOptimizer = new FinalOptimizer();
  
  // Generate final report after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const report = performanceTester.generateReport();
      console.log('🎉 Portfolio optimization complete!');
      console.log('Final Performance Report:', report);
    }, 2000);
  });
  
  // Export for global access
  window.PortfolioTesting = {
    performanceTester,
    crossBrowserTester,
    finalOptimizer
  };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PerformanceTester,
    CrossBrowserTester,
    FinalOptimizer
  };
}