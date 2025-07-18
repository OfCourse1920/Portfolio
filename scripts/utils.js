// Modern Portfolio Website - Utility Functions and Interactivity

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

// Get element offset from top of document
function getElementOffset(element) {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0, duration = 800) {
  const targetPosition = getElementOffset(element) - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Generate unique ID
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date
function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize HTML
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// ===== ENHANCED INTERACTIVITY CONTROLLER =====
class InteractivityController {
  constructor() {
    this.activeElements = new Set();
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.init();
  }
  
  init() {
    this.setupGlobalInteractions();
    this.setupTouchGestures();
    this.setupKeyboardShortcuts();
    this.setupContextualHelp();
    this.setupDynamicContent();
  }
  
  setupGlobalInteractions() {
    // Global click handler with delegation
    document.addEventListener('click', (e) => {
      this.handleGlobalClick(e);
    });
    
    // Global hover effects
    document.addEventListener('mouseover', (e) => {
      this.handleGlobalHover(e);
    });
    
    // Global focus management
    document.addEventListener('focusin', (e) => {
      this.handleGlobalFocus(e);
    });
    
    // Global scroll effects
    window.addEventListener('scroll', throttle(() => {
      this.handleGlobalScroll();
    }, 16));
  }
  
  handleGlobalClick(e) {
    const target = e.target;
    
    // Handle copy buttons
    if (target.matches('[data-copy]')) {
      this.handleCopyClick(target);
    }
    
    // Handle share buttons
    if (target.matches('[data-share]')) {
      this.handleShareClick(target);
    }
    
    // Handle expand/collapse
    if (target.matches('[data-toggle]')) {
      this.handleToggleClick(target);
    }
    
    // Handle external links
    if (target.matches('a[href^="http"]')) {
      this.handleExternalLink(target);
    }
  }
  
  handleGlobalHover(e) {
    const target = e.target;
    
    // Add hover effects to interactive elements
    if (target.matches('button, a, [role="button"]')) {
      this.addHoverEffect(target);
    }
    
    // Show tooltips
    if (target.hasAttribute('data-tooltip')) {
      this.showTooltip(target);
    }
  }
  
  handleGlobalFocus(e) {
    const target = e.target;
    
    // Ensure focused elements are visible
    if (target.matches('input, textarea, button, a, [tabindex]')) {
      this.ensureElementVisible(target);
    }
  }
  
  handleGlobalScroll() {
    // Update scroll-dependent elements
    this.updateScrollProgress();
    this.updateActiveNavigation();
    this.handleScrollToTop();
  }
  
  setupTouchGestures() {
    // Touch start
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    // Touch end - detect swipe gestures
    document.addEventListener('touchend', (e) => {
      if (!e.changedTouches[0]) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = this.touchStartY - touchEndY;
      const deltaX = this.touchStartX - touchEndX;
      
      // Detect swipe direction
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            this.handleSwipeUp();
          } else {
            this.handleSwipeDown();
          }
        }
      } else {
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.handleSwipeLeft();
          } else {
            this.handleSwipeRight();
          }
        }
      }
    }, { passive: true });
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K - Focus search (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearch();
      }
      
      // Escape - Close modals/menus
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
      
      // Arrow keys for navigation
      if (e.key.startsWith('Arrow')) {
        this.handleArrowNavigation(e);
      }
      
      // Home/End for quick navigation
      if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToTop();
      }
      
      if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToBottom();
      }
    });
  }
  
  setupContextualHelp() {
    // Add help tooltips to complex elements
    const complexElements = document.querySelectorAll('.skill-item, .project-card, .contact-form');
    
    complexElements.forEach(element => {
      if (!element.hasAttribute('data-tooltip')) {
        const helpText = this.generateHelpText(element);
        if (helpText) {
          element.setAttribute('data-tooltip', helpText);
        }
      }
    });
  }
  
  setupDynamicContent() {
    // Setup dynamic content loading
    this.setupInfiniteScroll();
    this.setupDynamicImages();
    this.setupContentFiltering();
  }
  
  // Touch gesture handlers
  handleSwipeUp() {
    // Could be used for navigation or content reveal
    console.log('Swipe up detected');
  }
  
  handleSwipeDown() {
    // Could be used for refresh or menu reveal
    console.log('Swipe down detected');
  }
  
  handleSwipeLeft() {
    // Could be used for next item navigation
    this.navigateNext();
  }
  
  handleSwipeRight() {
    // Could be used for previous item navigation
    this.navigatePrevious();
  }
  
  // Click handlers
  handleCopyClick(element) {
    const textToCopy = element.getAttribute('data-copy');
    copyToClipboard(textToCopy).then(success => {
      if (success) {
        this.showNotification('Copied to clipboard!');
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);
      }
    });
  }
  
  handleShareClick(element) {
    const shareData = {
      title: document.title,
      text: element.getAttribute('data-share-text') || 'Check out this portfolio!',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to copy URL
      copyToClipboard(shareData.url).then(success => {
        if (success) {
          this.showNotification('Link copied to clipboard!');
        }
      });
    }
  }
  
  handleToggleClick(element) {
    const targetSelector = element.getAttribute('data-toggle');
    const target = document.querySelector(targetSelector);
    
    if (target) {
      const isExpanded = element.getAttribute('aria-expanded') === 'true';
      element.setAttribute('aria-expanded', !isExpanded);
      target.classList.toggle('expanded');
      
      // Animate height
      if (target.classList.contains('expanded')) {
        target.style.maxHeight = target.scrollHeight + 'px';
      } else {
        target.style.maxHeight = '0';
      }
    }
  }
  
  handleExternalLink(link) {
    // Add external link indicator
    if (!link.querySelector('.external-icon')) {
      const icon = document.createElement('span');
      icon.className = 'external-icon';
      icon.innerHTML = ' <i class="fas fa-external-link-alt"></i>';
      icon.style.fontSize = '0.8em';
      icon.style.opacity = '0.7';
      link.appendChild(icon);
    }
  }
  
  // Utility methods
  addHoverEffect(element) {
    element.classList.add('hover-active');
    setTimeout(() => element.classList.remove('hover-active'), 300);
  }
  
  showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    // Remove existing tooltip
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--bg-tertiary);
      color: var(--text-primary);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      z-index: var(--z-tooltip);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      max-width: 200px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    // Show tooltip
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    // Hide tooltip on mouse leave
    element.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 200);
    }, { once: true });
  }
  
  ensureElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isVisible) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
  
  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update CSS custom property
    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
  }
  
  updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    let activeSection = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = section.id;
      }
    });
    
    navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      link.classList.toggle('active', section === activeSection);
    });
  }
  
  handleScrollToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      const shouldShow = window.pageYOffset > 500;
      backToTopBtn.classList.toggle('visible', shouldShow);
    }
  }
  
  generateHelpText(element) {
    if (element.classList.contains('skill-item')) {
      return 'Click to see more details about this skill';
    }
    if (element.classList.contains('project-card')) {
      return 'Click to view project details and live demo';
    }
    if (element.classList.contains('contact-form')) {
      return 'Fill out this form to get in touch';
    }
    return null;
  }
  
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-primary);
      color: var(--bg-primary);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      z-index: var(--z-toast);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.style.transform = 'translateX(0)', 10);
    
    // Hide notification
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Navigation methods
  navigateNext() {
    // Implementation for next navigation
    console.log('Navigate to next item');
  }
  
  navigatePrevious() {
    // Implementation for previous navigation
    console.log('Navigate to previous item');
  }
  
  focusSearch() {
    // Focus search input if available
    const searchInput = document.querySelector('input[type="search"], .search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  closeAllModals() {
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Close mobile menu
    const mobileMenu = document.querySelector('.mobile-nav-menu.active');
    if (mobileMenu) {
      const mobileToggle = document.querySelector('.mobile-nav-toggle');
      if (mobileToggle) {
        mobileToggle.click();
      }
    }
  }
  
  handleArrowNavigation(e) {
    // Handle arrow key navigation for focused elements
    const activeElement = document.activeElement;
    
    if (activeElement.matches('.skill-tab')) {
      // Handle skills tab navigation (already implemented in skills.js)
      return;
    }
    
    if (activeElement.matches('.project-card')) {
      this.handleProjectNavigation(e, activeElement);
    }
  }
  
  handleProjectNavigation(e, currentProject) {
    const projects = Array.from(document.querySelectorAll('.project-card'));
    const currentIndex = projects.indexOf(currentProject);
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
        break;
    }
    
    if (newIndex !== currentIndex) {
      projects[newIndex].focus();
    }
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  setupInfiniteScroll() {
    // Placeholder for infinite scroll implementation
    // Could be used for loading more projects or blog posts
  }
  
  setupDynamicImages() {
    // Setup dynamic image loading and optimization
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      
      img.addEventListener('error', () => {
        img.classList.add('error');
        // Could set a fallback image here
      });
    });
  }
  
  setupContentFiltering() {
    // Setup content filtering for projects or skills
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterContent(filter);
      });
    });
  }
  
  filterContent(filter) {
    const items = document.querySelectorAll('[data-category]');
    
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      
      item.style.display = shouldShow ? 'block' : 'none';
      item.setAttribute('aria-hidden', !shouldShow);
    });
  }
}

// ===== ERROR HANDLER =====
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Global error handling
    window.addEventListener('error', (e) => {
      this.handleError(e.error, e.filename, e.lineno);
    });
    
    // Promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
      this.handlePromiseRejection(e.reason);
    });
  }
  
  handleError(error, filename, lineno) {
    console.error('JavaScript Error:', {
      message: error.message,
      filename,
      lineno,
      stack: error.stack
    });
    
    // Could send error to logging service
    this.logError({
      type: 'javascript',
      message: error.message,
      filename,
      lineno,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  handlePromiseRejection(reason) {
    console.error('Unhandled Promise Rejection:', reason);
    
    this.logError({
      type: 'promise',
      message: reason.toString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  logError(errorData) {
    // In a real application, you would send this to a logging service
    // For now, we'll just store it locally
    const errors = JSON.parse(localStorage.getItem('portfolio-errors') || '[]');
    errors.push(errorData);
    
    // Keep only the last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('portfolio-errors', JSON.stringify(errors));
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize interactivity controller
  const interactivityController = new InteractivityController();
  
  // Initialize error handler
  const errorHandler = new ErrorHandler();
  
  // Export utility functions globally
  window.PortfolioUtils = {
    debounce,
    throttle,
    isInViewport,
    getElementOffset,
    smoothScrollTo,
    generateId,
    formatDate,
    isValidEmail,
    sanitizeHTML,
    copyToClipboard,
    interactivityController,
    errorHandler
  };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isInViewport,
    getElementOffset,
    smoothScrollTo,
    generateId,
    formatDate,
    isValidEmail,
    sanitizeHTML,
    copyToClipboard,
    InteractivityController,
    ErrorHandler
  };
}