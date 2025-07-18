// Modern Portfolio Website - Main JavaScript

// ===== NAVIGATION FUNCTIONALITY =====

class NavigationController {
  constructor() {
    this.header = document.querySelector('.portfolio-header');
    this.mobileToggle = document.querySelector('.mobile-nav-toggle');
    this.mobileMenu = document.querySelector('.mobile-nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.lastScrollY = window.scrollY;
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateActiveSection();
    this.handleScrollEffects();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation links smooth scrolling
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Scroll events
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateActiveSection();
    }, { passive: true });
    
    // Close mobile menu on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.header.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileToggle.classList.add('active');
    this.mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstLink = this.mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileToggle.classList.remove('active');
    this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Only handle internal links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
        
        // Smooth scroll to section
        this.scrollToSection(targetSection);
        
        // Update URL without triggering scroll
        history.pushState(null, null, href);
      }
    }
  }
  
  scrollToSection(section) {
    const headerHeight = this.header.offsetHeight;
    const targetPosition = section.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Header scroll effects
    this.handleScrollEffects();
    
    // Hide/show header on scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down
      this.header.classList.add('hide');
      this.header.classList.remove('show');
    } else {
      // Scrolling up
      this.header.classList.remove('hide');
      this.header.classList.add('show');
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  handleScrollEffects() {
    const scrollY = window.scrollY;
    
    // Add scrolled class for backdrop blur effect
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
  
  updateActiveSection() {
    const scrollPosition = window.scrollY + this.header.offsetHeight + 100;
    
    let activeSection = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = section.getAttribute('id');
      }
    });
    
    // Update active nav links
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active', 'section-active');
      
      if (href === `#${activeSection}`) {
        link.classList.add('active', 'section-active');
      }
    });
  }
}

// ===== SMOOTH SCROLLING UTILITIES =====

class SmoothScrollController {
  constructor() {
    this.init();
  }
  
  init() {
    // Handle back to top button
    const backToTopBtn = document.querySelector('[data-scroll="top"]');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Handle scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const headerHeight = document.querySelector('.portfolio-header').offsetHeight;
          const targetPosition = aboutSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
      if (backToTopBtn) {
        if (window.scrollY > 500) {
          backToTopBtn.style.opacity = '1';
          backToTopBtn.style.visibility = 'visible';
        } else {
          backToTopBtn.style.opacity = '0';
          backToTopBtn.style.visibility = 'hidden';
        }
      }
    }, { passive: true });
  }
}

// ===== PERFORMANCE UTILITIES =====

class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }
  
  preloadCriticalResources() {
    // Preload hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage && heroImage.src) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = heroImage.src;
      document.head.appendChild(preloadLink);
    }
  }
  
  optimizeScrollPerformance() {
    // Use passive listeners for better scroll performance
    let ticking = false;
    
    const updateScrollElements = () => {
      // Update scroll-dependent elements here
      ticking = false;
    };
    
    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  new NavigationController();
  
  // Initialize smooth scrolling
  new SmoothScrollController();
  
  // Initialize performance optimizations
  new PerformanceOptimizer();
  
  // Add loaded class to body for CSS animations
  document.body.classList.add('loaded');
});

// ===== ERROR HANDLING =====

window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Skip to main content functionality
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-white focus:rounded';
document.body.insertBefore(skipLink, document.body.firstChild);

// Announce page changes to screen readers
const announcePageChange = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Export for use in other modules
window.PortfolioNavigation = {
  NavigationController,
  SmoothScrollController,
  PerformanceOptimizer,
  announcePageChange
};