// Modern Portfolio Website - Skills Section Controller

// ===== SKILLS SECTION CONTROLLER =====
class SkillsController {
  constructor() {
    this.skillTabs = document.querySelectorAll('.skill-tab');
    this.skillCategories = document.querySelectorAll('.skills-category');
    this.skillItems = document.querySelectorAll('.skill-item');
    this.progressBars = document.querySelectorAll('.progress-bar');
    this.currentCategory = 'technical';
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initializeProgressBars();
    this.observeSkillItems();
  }
  
  bindEvents() {
    // Tab click events
    this.skillTabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e));
    });
    
    // Keyboard navigation for tabs
    this.skillTabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => this.handleTabKeydown(e, index));
    });
    
    // Skill item hover effects
    this.skillItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.handleSkillHover(item));
      item.addEventListener('mouseleave', () => this.handleSkillLeave(item));
    });
  }
  
  handleTabClick(e) {
    const clickedTab = e.currentTarget;
    const targetCategory = clickedTab.getAttribute('data-tab');
    
    if (targetCategory === this.currentCategory) return;
    
    this.switchCategory(targetCategory);
  }
  
  handleTabKeydown(e, index) {
    let newIndex = index;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = index > 0 ? index - 1 : this.skillTabs.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = index < this.skillTabs.length - 1 ? index + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = this.skillTabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.skillTabs[index].click();
        return;
      default:
        return;
    }
    
    this.skillTabs[newIndex].focus();
    this.skillTabs[newIndex].click();
  }
  
  switchCategory(targetCategory) {
    // Update current category
    this.currentCategory = targetCategory;
    
    // Update active tab
    this.skillTabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === targetCategory) {
        tab.classList.add('active');
      }
    });
    
    // Update active category with smooth transition
    this.skillCategories.forEach(category => {
      const categoryName = category.getAttribute('data-category');
      
      if (categoryName === targetCategory) {
        // Show target category
        setTimeout(() => {
          category.classList.add('active');
          this.animateSkillItems(category);
        }, 150);
      } else {
        // Hide other categories
        category.classList.remove('active');
      }
    });
    
    // Announce change to screen readers
    this.announceTabChange(targetCategory);
  }
  
  animateSkillItems(category) {
    const skillItems = category.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
      // Reset animation state
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      
      // Animate with staggered delay
      setTimeout(() => {
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  handleSkillHover(item) {
    const progressBar = item.querySelector('.progress-bar');
    if (progressBar) {
      this.animateProgressBar(progressBar);
    }
    
    // Add hover class for additional effects
    item.classList.add('skill-hovered');
  }
  
  handleSkillLeave(item) {
    item.classList.remove('skill-hovered');
  }
  
  initializeProgressBars() {
    this.progressBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      if (progress) {
        // Set initial state
        bar.style.setProperty('--progress-width', '0%');
      }
    });
  }
  
  animateProgressBar(progressBar) {
    const progress = progressBar.getAttribute('data-progress');
    if (progress && !progressBar.classList.contains('animated')) {
      progressBar.classList.add('animated');
      
      // Animate the progress bar
      setTimeout(() => {
        progressBar.style.setProperty('--progress-width', `${progress}%`);
      }, 100);
    }
  }
  
  observeSkillItems() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillItem = entry.target;
          const progressBar = skillItem.querySelector('.progress-bar');
          
          if (progressBar) {
            this.animateProgressBar(progressBar);
          }
          
          observer.unobserve(skillItem);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.skillItems.forEach(item => {
      observer.observe(item);
    });
  }
  
  announceTabChange(category) {
    const categoryNames = {
      'technical': 'Technical Skills',
      'soft': 'Soft Skills',
      'tools': 'Tools & Software',
      'languages': 'Programming Languages'
    };
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Switched to ${categoryNames[category]} section`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Public method to switch to a specific category
  showCategory(categoryName) {
    if (this.skillTabs.length > 0) {
      const targetTab = Array.from(this.skillTabs).find(tab => 
        tab.getAttribute('data-tab') === categoryName
      );
      
      if (targetTab) {
        targetTab.click();
      }
    }
  }
  
  // Public method to get current category
  getCurrentCategory() {
    return this.currentCategory;
  }
}

// ===== SKILL HOVER EFFECTS CONTROLLER =====
class SkillHoverEffectsController {
  constructor() {
    this.skillItems = document.querySelectorAll('.skill-item');
    this.init();
  }
  
  init() {
    this.addHoverEffects();
  }
  
  addHoverEffects() {
    this.skillItems.forEach(item => {
      // Mouse enter effect
      item.addEventListener('mouseenter', () => {
        this.createRippleEffect(item);
        this.enhanceSkillIcon(item);
      });
      
      // Mouse leave effect
      item.addEventListener('mouseleave', () => {
        this.resetSkillIcon(item);
      });
      
      // Click effect for mobile
      item.addEventListener('click', () => {
        this.createClickEffect(item);
      });
    });
  }
  
  createRippleEffect(item) {
    const ripple = document.createElement('div');
    ripple.className = 'skill-ripple';
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(0, 212, 255, 0.1);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: skillRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    item.style.position = 'relative';
    item.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  enhanceSkillIcon(item) {
    const icon = item.querySelector('.skill-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.boxShadow = 'var(--shadow-glow)';
    }
  }
  
  resetSkillIcon(item) {
    const icon = item.querySelector('.skill-icon');
    if (icon) {
      icon.style.transform = '';
      icon.style.boxShadow = '';
    }
  }
  
  createClickEffect(item) {
    item.style.transform = 'scale(0.98)';
    setTimeout(() => {
      item.style.transform = '';
    }, 150);
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize skills controller
  const skillsController = new SkillsController();
  
  // Initialize hover effects
  const hoverEffectsController = new SkillHoverEffectsController();
  
  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skillRipple {
      0% {
        width: 0;
        height: 0;
        opacity: 1;
      }
      100% {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
    
    .skill-ripple {
      animation: skillRipple 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Export for global access
  window.SkillsController = skillsController;
  window.SkillHoverEffectsController = hoverEffectsController;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SkillsController,
    SkillHoverEffectsController
  };
}