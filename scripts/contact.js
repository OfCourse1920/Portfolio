// Modern Portfolio Website - Contact Form Controller

// ===== CONTACT FORM CONTROLLER =====
class ContactFormController {
  constructor() {
    this.form = document.querySelector('.contact-form');
    this.formGroups = document.querySelectorAll('.form-group');
    this.inputs = document.querySelectorAll('.form-input, .form-textarea');
    this.submitButton = document.querySelector('.form-submit');
    this.successMessage = document.querySelector('.form-success');
    
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name (letters and spaces only)'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      subject: {
        required: true,
        minLength: 5,
        maxLength: 100,
        message: 'Subject must be between 5 and 100 characters'
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'Message must be between 10 and 1000 characters'
      }
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initializeAnimations();
  }
  
  bindEvents() {
    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Input validation
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
      input.addEventListener('focus', () => this.handleFocus(input));
    });
    
    // Real-time validation for better UX
    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.length > 0) {
          this.validateField(input, true);
        }
      });
    });
  }
  
  initializeAnimations() {
    // Animate form elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateFormElements();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    if (this.form) {
      observer.observe(this.form);
    }
  }
  
  animateFormElements() {
    this.formGroups.forEach((group, index) => {
      setTimeout(() => {
        group.classList.add('animation-complete');
      }, index * 100);
    });
  }
  
  handleFocus(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('focused');
    }
  }
  
  handleBlur(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup && !input.value) {
      formGroup.classList.remove('focused');
    }
  }
  
  validateField(input, isRealTime = false) {
    const fieldName = input.name;
    const value = input.value.trim();
    const rules = this.validationRules[fieldName];
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !value) {
      isValid = false;
      errorMessage = `${this.capitalizeFirst(fieldName)} is required`;
    }
    
    // Pattern validation
    else if (value && rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.message;
    }
    
    // Length validation
    else if (value && rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`;
    }
    
    else if (value && rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `${this.capitalizeFirst(fieldName)} must be less than ${rules.maxLength} characters`;
    }
    
    // Update UI
    this.updateFieldValidation(formGroup, errorElement, isValid, errorMessage, isRealTime);
    
    return isValid;
  }
  
  updateFieldValidation(formGroup, errorElement, isValid, errorMessage, isRealTime) {
    if (isValid) {
      formGroup.classList.remove('invalid');
      formGroup.classList.add('valid');
      if (errorElement) {
        errorElement.textContent = '';
      }
    } else if (!isRealTime) {
      formGroup.classList.remove('valid');
      formGroup.classList.add('invalid');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    }
  }
  
  clearErrors(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup.classList.contains('invalid')) {
      formGroup.classList.remove('invalid');
      const errorElement = formGroup.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
  }
  
  validateForm() {
    let isFormValid = true;
    
    this.inputs.forEach(input => {
      const isFieldValid = this.validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.validateForm()) {
      this.showFormError('Please fix the errors above');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Simulate form submission (replace with actual API call)
      await this.submitForm();
      
      // Show success message
      this.showSuccess();
      
      // Reset form
      this.resetForm();
      
    } catch (error) {
      this.showFormError('Failed to send message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      this.setLoadingState(false);
    }
  }
  
  async submitForm() {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% success rate for demo)
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Simulated network error'));
        }
      }, 2000);
    });
  }
  
  setLoadingState(isLoading) {
    if (this.submitButton) {
      this.submitButton.setAttribute('data-loading', isLoading.toString());
      this.submitButton.disabled = isLoading;
    }
  }
  
  showSuccess() {
    if (this.successMessage) {
      this.successMessage.classList.add('show');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.successMessage.classList.remove('show');
      }, 5000);
    }
  }
  
  showFormError(message) {
    // Create or update error message
    let errorElement = this.form.querySelector('.form-general-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-general-error';
      this.form.insertBefore(errorElement, this.submitButton);
    }
    
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--accent-secondary);
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid var(--accent-secondary);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin-bottom: var(--space-4);
      font-size: var(--text-sm);
      text-align: center;
    `;
    
    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorElement && errorElement.parentNode) {
        errorElement.parentNode.removeChild(errorElement);
      }
    }, 5000);
  }
  
  resetForm() {
    if (this.form) {
      this.form.reset();
      
      // Clear validation states
      this.formGroups.forEach(group => {
        group.classList.remove('valid', 'invalid', 'focused');
      });
    }
  }
  
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ===== CONTACT ANIMATIONS CONTROLLER =====
class ContactAnimationsController {
  constructor() {
    this.contactItems = document.querySelectorAll('.contact-item');
    this.socialLinks = document.querySelectorAll('.social-link');
    this.init();
  }
  
  init() {
    this.observeElements();
    this.addHoverEffects();
  }
  
  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe contact items
    this.contactItems.forEach((item, index) => {
      setTimeout(() => {
        observer.observe(item);
      }, index * 100);
    });
    
    // Observe social links
    this.socialLinks.forEach((link, index) => {
      setTimeout(() => {
        observer.observe(link);
      }, (index + this.contactItems.length) * 100);
    });
  }
  
  animateElement(element) {
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    element.classList.add('animation-complete');
  }
  
  addHoverEffects() {
    // Enhanced hover effects for social links
    this.socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.createRippleEffect(link);
      });
    });
    
    // Enhanced hover effects for contact items
    this.contactItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.enhanceContactItem(item);
      });
      
      item.addEventListener('mouseleave', () => {
        this.resetContactItem(item);
      });
    });
  }
  
  createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: contactRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  enhanceContactItem(item) {
    const icon = item.querySelector('.contact-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  }
  
  resetContactItem(item) {
    const icon = item.querySelector('.contact-icon');
    if (icon) {
      icon.style.transform = '';
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize contact form controller
  const contactFormController = new ContactFormController();
  
  // Initialize contact animations
  const contactAnimationsController = new ContactAnimationsController();
  
  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes contactRipple {
      0% {
        width: 0;
        height: 0;
        opacity: 1;
      }
      100% {
        width: 120px;
        height: 120px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Export for global access
  window.ContactFormController = contactFormController;
  window.ContactAnimationsController = contactAnimationsController;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ContactFormController,
    ContactAnimationsController
  };
}