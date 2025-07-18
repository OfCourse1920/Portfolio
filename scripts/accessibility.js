// Modern Portfolio Website - Accessibility Controller

// ===== ACCESSIBILITY CONTROLLER =====
class AccessibilityController {
  constructor() {
    this.isKeyboardUser = false;
    this.focusableElements = [];
    this.currentFocusIndex = -1;
    this.announcementRegion = null;
    this.init();
  }
  
  init() {
    this.setupKeyboardDetection();
    this.createSkipLinks();
    this.createAnnouncementRegion();
    this.setupFocusManagement();
    this.setupARIALabels();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }
  
  setupKeyboardDetection() {
    // Detect keyboard usage
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboardUser = true;
        document.body.classList.add('keyboard-user');
      }
    });
    
    document.addEventListener('mousedown', () => {
      this.isKeyboardUser = false;
      document.body.classList.remove('keyboard-user');
    });
  }
  
  createSkipLinks() {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.innerHTML = `
      <a href="#main" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#contact" class="skip-link">Skip to contact</a>
    `;
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  }
  
  createAnnouncementRegion() {
    this.announcementRegion = document.createElement('div');
    this.announcementRegion.className = 'announcement-region';
    this.announcementRegion.setAttribute('aria-live', 'polite');
    this.announcementRegion.setAttribute('aria-atomic', 'true');
    this.announcementRegion.setAttribute('role', 'status');
    document.body.appendChild(this.announcementRegion);
  }
  
  setupFocusManagement() {
    // Focus trap for modals
    this.setupModalFocusTrap();
    
    // Focus restoration
    this.setupFocusRestoration();
    
    // Focus indicators
    this.enhanceFocusIndicators();
  }
  
  setupModalFocusTrap() {
    const modals = document.querySelectorAll('[role="dialog"]');
    
    modals.forEach(modal => {
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.trapFocus(e, modal);
        } else if (e.key === 'Escape') {
          this.closeModal(modal);
        }
      });
    });
  }
  
  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  setupFocusRestoration() {
    let lastFocusedElement = null;
    
    // Store focus before modal opens
    document.addEventListener('modal-open', (e) => {
      lastFocusedElement = document.activeElement;
    });
    
    // Restore focus when modal closes
    document.addEventListener('modal-close', (e) => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    });
  }
  
  enhanceFocusIndicators() {
    // Add enhanced focus styles for keyboard users
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        if (this.isKeyboardUser) {
          element.classList.add('keyboard-focus');
        }
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
      });
    });
  }
  
  setupARIALabels() {
    // Add ARIA labels to interactive elements
    this.addNavigationARIA();
    this.addFormARIA();
    this.addContentARIA();
    this.addProgressARIA();
  }
  
  addNavigationARIA() {
    // Navigation ARIA
    const nav = document.querySelector('.portfolio-nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Mobile menu button
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-controls', 'mobile-menu');
      mobileToggle.setAttribute('aria-label', 'Toggle mobile navigation menu');
    }
    
    // Mobile menu
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    if (mobileMenu) {
      mobileMenu.setAttribute('id', 'mobile-menu');
      mobileMenu.setAttribute('role', 'menu');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.setAttribute('role', 'menuitem');
    });
  }
  
  addFormARIA() {
    // Form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');
      const error = group.querySelector('.form-error');
      
      if (input && label) {
        const inputId = input.id || `input-${index}`;
        const labelId = `label-${index}`;
        const errorId = `error-${index}`;
        
        input.id = inputId;
        label.id = labelId;
        label.setAttribute('for', inputId);
        
        if (error) {
          error.id = errorId;
          error.setAttribute('role', 'alert');
          error.setAttribute('aria-live', 'polite');
          input.setAttribute('aria-describedby', errorId);
        }
      }
    });
    
    // Form validation states
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('invalid', () => {
        input.setAttribute('aria-invalid', 'true');
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.setAttribute('aria-invalid', 'true');
        }
      });
      
      input.addEventListener('input', () => {
        if (input.validity.valid) {
          input.setAttribute('aria-invalid', 'false');
          const formGroup = input.closest('.form-group');
          if (formGroup) {
            formGroup.setAttribute('aria-invalid', 'false');
          }
        }
      });
    });
  }
  
  addContentARIA() {
    // Sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        section.setAttribute('aria-labelledby', heading.id || this.generateId('heading'));
        if (!heading.id) {
          heading.id = section.getAttribute('aria-labelledby');
        }
      }
    });
    
    // Skills tabs
    const skillTabs = document.querySelectorAll('.skill-tab');
    skillTabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      tab.setAttribute('aria-controls', `skills-panel-${index}`);
      tab.setAttribute('id', `skills-tab-${index}`);
    });
    
    const skillPanels = document.querySelectorAll('.skills-category');
    skillPanels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `skills-tab-${index}`);
      panel.setAttribute('id', `skills-panel-${index}`);
      panel.setAttribute('aria-hidden', panel.classList.contains('active') ? 'false' : 'true');
    });
    
    // Progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      if (progress) {
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', progress);
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-label', `Skill level: ${progress}%`);
      }
    });
  }
  
  addProgressARIA() {
    // Loading states
    const loadingElements = document.querySelectorAll('[data-loading]');
    loadingElements.forEach(element => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'data-loading') {
            const isLoading = element.getAttribute('data-loading') === 'true';
            element.setAttribute('aria-busy', isLoading ? 'true' : 'false');
            
            if (isLoading) {
              this.announce('Loading...');
            }
          }
        });
      });
      
      observer.observe(element, { attributes: true });
    });
  }
  
  setupKeyboardNavigation() {
    // Tab navigation for skills
    this.setupSkillsKeyboardNav();
    
    // Arrow key navigation for project cards
    this.setupProjectsKeyboardNav();
    
    // Escape key handling
    this.setupEscapeKeyHandling();
  }
  
  setupSkillsKeyboardNav() {
    const skillTabs = document.querySelectorAll('.skill-tab');
    
    skillTabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newIndex = index > 0 ? index - 1 : skillTabs.length - 1;
            break;
          case 'ArrowRight':
            e.preventDefault();
            newIndex = index < skillTabs.length - 1 ? index + 1 : 0;
            break;
          case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            newIndex = skillTabs.length - 1;
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            tab.click();
            return;
          default:
            return;
        }
        
        skillTabs[newIndex].focus();
        this.announce(`Selected ${skillTabs[newIndex].textContent.trim()}`);
      });
    });
  }
  
  setupProjectsKeyboardNav() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View project: ${card.querySelector('.project-title')?.textContent || 'Project'}`);
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  setupEscapeKeyHandling() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          const mobileToggle = document.querySelector('.mobile-nav-toggle');
          if (mobileToggle) {
            mobileToggle.click();
          }
        }
        
        // Close modals
        const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
        openModals.forEach(modal => {
          this.closeModal(modal);
        });
      }
    });
  }
  
  setupScreenReaderSupport() {
    // Add screen reader specific content
    this.addScreenReaderContent();
    
    // Handle dynamic content updates
    this.setupDynamicContentAnnouncements();
    
    // Add landmark roles
    this.addLandmarkRoles();
  }
  
  addScreenReaderContent() {
    // Add descriptive text for complex interactions
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
      const skillName = item.querySelector('h4')?.textContent;
      const skillLevel = item.querySelector('.skill-level')?.textContent;
      const progress = item.querySelector('.progress-bar')?.getAttribute('data-progress');
      
      if (skillName && skillLevel && progress) {
        const description = document.createElement('span');
        description.className = 'sr-only';
        description.textContent = `${skillName}: ${skillLevel} level, ${progress}% proficiency`;
        item.appendChild(description);
      }
    });
    
    // Add context for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      if (section) {
        link.setAttribute('aria-label', `Navigate to ${section} section`);
      }
    });
  }
  
  setupDynamicContentAnnouncements() {
    // Announce form submission results
    document.addEventListener('form-success', (e) => {
      this.announce('Form submitted successfully');
    });
    
    document.addEventListener('form-error', (e) => {
      this.announce('Form submission failed. Please check for errors.');
    });
    
    // Announce navigation changes
    document.addEventListener('section-change', (e) => {
      const sectionName = e.detail.section;
      this.announce(`Navigated to ${sectionName} section`);
    });
  }
  
  addLandmarkRoles() {
    // Add landmark roles for better navigation
    const header = document.querySelector('.portfolio-header');
    if (header) {
      header.setAttribute('role', 'banner');
    }
    
    const main = document.querySelector('.portfolio-main');
    if (main) {
      main.setAttribute('role', 'main');
      main.setAttribute('id', 'main');
    }
    
    const footer = document.querySelector('.portfolio-footer');
    if (footer) {
      footer.setAttribute('role', 'contentinfo');
    }
    
    const nav = document.querySelector('.portfolio-nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
    }
  }
  
  // Utility methods
  announce(message) {
    if (this.announcementRegion) {
      this.announcementRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.announcementRegion.textContent = '';
      }, 1000);
    }
  }
  
  closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    
    // Dispatch close event
    const closeEvent = new CustomEvent('modal-close', {
      detail: { modal }
    });
    document.dispatchEvent(closeEvent);
  }
  
  generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Public methods for other controllers
  updateTabSelection(activeTab, allTabs) {
    allTabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
    });
    activeTab.setAttribute('aria-selected', 'true');
  }
  
  updatePanelVisibility(activePanel, allPanels) {
    allPanels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
    });
    activePanel.setAttribute('aria-hidden', 'false');
  }
  
  announceProgress(current, total, context = '') {
    const message = `${context} ${current} of ${total}`;
    this.announce(message);
  }
}

// ===== COLOR CONTRAST CHECKER =====
class ColorContrastChecker {
  constructor() {
    this.init();
  }
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      this.checkContrast();
    }
  }
  
  checkContrast() {
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;
      
      if (backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrast(backgroundColor, color);
        
        if (contrast < 4.5) {
          console.warn(`Low contrast detected on element:`, element, `Contrast ratio: ${contrast.toFixed(2)}`);
        }
      }
    });
  }
  
  calculateContrast(bg, fg) {
    // Simplified contrast calculation
    // In a real implementation, you'd convert colors to RGB and calculate luminance
    return 4.5; // Placeholder
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accessibility controller
  const accessibilityController = new AccessibilityController();
  
  // Initialize contrast checker (development only)
  const contrastChecker = new ColorContrastChecker();
  
  // Export for global access
  window.AccessibilityController = accessibilityController;
  window.ColorContrastChecker = contrastChecker;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessibilityController,
    ColorContrastChecker
  };
}