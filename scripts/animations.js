// Modern Portfolio Website - Animation Controllers

// ===== INTERSECTION OBSERVER ANIMATIONS =====

class ScrollAnimationController {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-animate]');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    this.createObserver();
    this.observeElements();
    this.handlePageLoad();
  }
  
  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
  }
  
  observeElements() {
    this.animatedElements.forEach(element => {
      // Add initial state
      element.style.opacity = '0';
      element.style.transform = this.getInitialTransform(element);
      
      // Observe for intersection
      this.observer.observe(element);
    });
  }
  
  getInitialTransform(element) {
    const animationType = element.getAttribute('data-animate');
    
    switch (animationType) {
      case 'fadeInUp':
        return 'translateY(30px)';
      case 'fadeInDown':
        return 'translateY(-30px)';
      case 'fadeInLeft':
        return 'translateX(-30px)';
      case 'fadeInRight':
        return 'translateX(30px)';
      case 'scaleIn':
        return 'scale(0.8)';
      case 'slideInLeft':
        return 'translateX(-50px)';
      case 'slideInRight':
        return 'translateX(50px)';
      case 'slideInUp':
        return 'translateY(50px)';
      case 'slideDown':
        return 'translateY(-30px)';
      default:
        return 'translateY(20px)';
    }
  }
  
  animateElement(element) {
    const delay = element.getAttribute('data-delay') || 0;
    const duration = element.getAttribute('data-duration') || 600;
    
    setTimeout(() => {
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1)';
      
      // Add animation complete class
      setTimeout(() => {
        element.classList.add('animation-complete');
      }, duration);
      
    }, parseInt(delay));
  }
  
  handlePageLoad() {
    // Animate elements that should appear immediately
    const immediateElements = document.querySelectorAll('[data-animate="slideDown"], [data-animate="fadeIn"]');
    immediateElements.forEach(element => {
      if (element.closest('.portfolio-header')) {
        this.animateElement(element);
      }
    });
  }
}

// ===== TYPEWRITER ANIMATION =====

class TypewriterController {
  constructor() {
    this.typewriterElements = document.querySelectorAll('[data-animate="typewriter"]');
    this.init();
  }
  
  init() {
    this.typewriterElements.forEach(element => {
      this.createTypewriterEffect(element);
    });
  }
  
  createTypewriterEffect(element) {
    const text = element.textContent;
    const delay = parseInt(element.getAttribute('data-delay')) || 0;
    const speed = parseInt(element.getAttribute('data-speed')) || 50;
    
    element.textContent = '';
    element.style.borderRight = '2px solid var(--accent-primary)';
    element.style.animation = 'blink 1s infinite';
    
    setTimeout(() => {
      this.typeText(element, text, speed);
    }, delay);
  }
  
  typeText(element, text, speed) {
    let index = 0;
    
    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(index);
      index++;
      
      if (index >= text.length) {
        clearInterval(typeInterval);
        // Remove cursor after typing is complete
        setTimeout(() => {
          element.style.borderRight = 'none';
          element.style.animation = 'none';
        }, 1000);
      }
    }, speed);
  }
}

// ===== COUNTER ANIMATION =====

class CounterController {
  constructor() {
    this.counterElements = document.querySelectorAll('[data-animate="countUp"]');
    this.init();
  }
  
  init() {
    this.observeCounters();
  }
  
  observeCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.counterElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(target * easeOutQuart);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
}

// ===== PROGRESS BAR ANIMATION =====

class ProgressBarController {
  constructor() {
    this.progressBars = document.querySelectorAll('.progress-bar[data-progress], .skill-preview-fill[data-progress]');
    this.circularProgress = document.querySelectorAll('.stat-fill[data-progress]');
    this.init();
  }
  
  init() {
    this.observeProgressBars();
    this.observeCircularProgress();
  }
  
  observeProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    this.progressBars.forEach(bar => {
      observer.observe(bar);
    });
  }
  
  observeCircularProgress() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCircularProgress(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    this.circularProgress.forEach(circle => {
      observer.observe(circle);
    });
  }
  
  animateProgressBar(bar) {
    const progress = parseInt(bar.getAttribute('data-progress'));
    const delay = parseInt(bar.getAttribute('data-delay')) || 0;
    
    // Set initial state
    bar.style.width = '0%';
    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      bar.style.width = `${progress}%`;
    }, delay);
  }
  
  animateCircularProgress(circle) {
    const progress = parseInt(circle.getAttribute('data-progress'));
    const delay = parseInt(circle.getAttribute('data-delay')) || 0;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (progress / 100) * circumference;
    
    // Set initial state
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, delay);
  }
}

// ===== PARALLAX EFFECTS =====

class ParallaxController {
  constructor() {
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.backgroundElements = document.querySelectorAll('.parallax-bg');
    this.init();
  }
  
  init() {
    this.createParallaxElements();
    if (this.parallaxElements.length > 0 || this.backgroundElements.length > 0) {
      this.bindScrollEvents();
    }
  }
  
  createParallaxElements() {
    // Add parallax backgrounds to sections
    const sections = document.querySelectorAll('.hero-section, .about-section, .skills-section');
    sections.forEach((section, index) => {
      if (!section.querySelector('.parallax-bg')) {
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        parallaxBg.setAttribute('data-parallax', (0.3 + index * 0.1).toString());
        section.appendChild(parallaxBg);
      }
    });
    
    // Update parallax elements list
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.backgroundElements = document.querySelectorAll('.parallax-bg');
  }
  
  bindScrollEvents() {
    let ticking = false;
    
    const updateParallax = () => {
      this.parallaxElements.forEach(element => {
        this.updateParallaxElement(element);
      });
      this.backgroundElements.forEach(element => {
        this.updateBackgroundParallax(element);
      });
      ticking = false;
    };
    
    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }
  
  updateParallaxElement(element) {
    const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
    const rect = element.getBoundingClientRect();
    const scrolled = window.scrollY;
    const rate = scrolled * -speed;
    
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      element.style.transform = `translateY(${rate}px)`;
    }
  }
  
  updateBackgroundParallax(element) {
    const speed = parseFloat(element.getAttribute('data-parallax')) || 0.3;
    const rect = element.getBoundingClientRect();
    const scrolled = window.scrollY;
    const rate = scrolled * speed;
    
    if (rect.bottom >= -200 && rect.top <= window.innerHeight + 200) {
      element.style.transform = `translateY(${rate}px)`;
    }
  }
}

// ===== SCROLL REVEAL CONTROLLER =====

class ScrollRevealController {
  constructor() {
    this.revealElements = document.querySelectorAll('[data-reveal]');
    this.init();
  }
  
  init() {
    this.observeElements();
  }
  
  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    this.revealElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===== STAGGER ANIMATION CONTROLLER =====

class StaggerAnimationController {
  constructor() {
    this.staggerGroups = document.querySelectorAll('[data-stagger]');
    this.init();
  }
  
  init() {
    this.observeStaggerGroups();
  }
  
  observeStaggerGroups() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStaggerGroup(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    this.staggerGroups.forEach(group => {
      observer.observe(group);
    });
  }
  
  animateStaggerGroup(group) {
    const children = group.children;
    const staggerDelay = parseInt(group.getAttribute('data-stagger')) || 100;
    
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * staggerDelay);
    });
  }
}

// ===== HOVER EFFECTS CONTROLLER =====

class HoverEffectsController {
  constructor() {
    this.init();
  }
  
  init() {
    this.addCardHoverEffects();
    this.addButtonHoverEffects();
  }
  
  addCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card, .skill-item');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = 'var(--shadow-xl)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  }
  
  addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.cta-button, .form-submit');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }
}

// ===== SCROLL PROGRESS INDICATOR =====

class ScrollProgressController {
  constructor() {
    this.progressBar = null;
    this.init();
  }
  
  init() {
    this.createProgressBar();
    this.bindScrollEvents();
  }
  
  createProgressBar() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'scroll-progress';
    document.body.appendChild(this.progressBar);
  }
  
  bindScrollEvents() {
    let ticking = false;
    
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (this.progressBar) {
        this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      }
      
      ticking = false;
    };
    
    const requestProgressUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  }
}

// ===== ENHANCED SCROLL EFFECTS CONTROLLER =====

class EnhancedScrollController {
  constructor() {
    this.scrollElements = document.querySelectorAll('.scroll-fade, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right, .scroll-scale');
    this.init();
  }
  
  init() {
    this.observeElements();
  }
  
  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    this.scrollElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===== SECTION TRANSITION CONTROLLER =====

class SectionTransitionController {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.init();
  }
  
  init() {
    this.observeSections();
  }
  
  observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-transition', 'active');
          setTimeout(() => {
            entry.target.classList.remove('active');
          }, 800);
        }
      });
    }, {
      threshold: 0.3
    });
    
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Initialize animation controllers
    new ScrollAnimationController();
    new TypewriterController();
    new CounterController();
    new ProgressBarController();
    new ParallaxController();
    new ScrollRevealController();
    new StaggerAnimationController();
    new HoverEffectsController();
    new ScrollProgressController();
    new EnhancedScrollController();
    new SectionTransitionController();
  } else {
    // Initialize minimal controllers for reduced motion
    new ScrollProgressController();
  }
});

// ===== CSS KEYFRAMES FOR ANIMATIONS =====

// Add dynamic CSS for blink animation
const style = document.createElement('style');
style.textContent = `
  @keyframes blink {
    0%, 50% { border-color: var(--accent-primary); }
    51%, 100% { border-color: transparent; }
  }
  
  @keyframes expandWidth {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .section-divider[data-animate="expandWidth"] {
    width: 0;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .section-divider.animation-complete {
    width: 100%;
  }
`;
document.head.appendChild(style);

// Export for use in other modules
window.PortfolioAnimations = {
  ScrollAnimationController,
  TypewriterController,
  CounterController,
  ProgressBarController,
  ParallaxController,
  ScrollRevealController,
  StaggerAnimationController,
  HoverEffectsController
};