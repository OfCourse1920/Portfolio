// Modern Portfolio Website - Projects Gallery Controller

// ===== PROJECT DATA =====
const projectData = {
  'todo-app': {
    title: 'Multi-Functional To-Do Web App',
    description: 'A comprehensive productivity application inspired by Microsoft To-Do, featuring advanced task management, categorization, and an intuitive user interface designed for maximum efficiency.',
    image: 'https://via.placeholder.com/800x400/2a2a2a/00d4ff?text=To-Do+App+Screenshot',
    status: 'completed',
    technologies: ['HTML5', 'CSS3', 'JavaScript ES6', 'Local Storage API', 'Responsive Design'],
    features: [
      'Create, edit, and delete tasks with ease',
      'Organize tasks into custom categories',
      'Set due dates and priority levels',
      'Mark tasks as completed with visual feedback',
      'Search and filter functionality',
      'Dark/light theme toggle',
      'Data persistence using localStorage',
      'Responsive design for all devices'
    ],
    links: {
      live: '#',
      code: '#'
    }
  },
  'student-app': {
    title: 'Student Productivity Web App',
    description: 'A comprehensive student management system designed to help students organize their academic life, manage lectures, notes, tasks, and revision schedules effectively.',
    image: 'https://via.placeholder.com/800x400/2a2a2a/00d4ff?text=Student+App+Screenshot',
    status: 'completed',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Calendar API'],
    features: [
      'Lecture schedule management',
      'Note-taking with rich text editor',
      'Assignment and task tracking',
      'Revision schedule planner',
      'Grade tracking and analytics',
      'Study time tracker',
      'Reminder notifications',
      'Export data functionality'
    ],
    links: {
      live: '#',
      code: '#'
    }
  },
  'cartex-app': {
    title: 'E-Commerce App - CarteX',
    description: 'A modern grocery e-commerce platform featuring Razorpay payment integration, smooth animations, and an exceptional user experience designed for seamless online shopping.',
    image: 'https://via.placeholder.com/800x400/2a2a2a/00d4ff?text=CarteX+E-Commerce+Screenshot',
    status: 'completed',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Razorpay API', 'Node.js', 'Express'],
    features: [
      'Product catalog with search and filters',
      'Shopping cart with real-time updates',
      'Secure payment processing with Razorpay',
      'User authentication and profiles',
      'Order tracking and history',
      'Responsive design for mobile shopping',
      'Admin dashboard for inventory management',
      'Email notifications for orders'
    ],
    links: {
      live: '#',
      code: '#'
    }
  },
  'expense-manager': {
    title: 'Expense Manager',
    description: 'A clean and intuitive expense tracking application with dashboard-style interface, data visualization, and comprehensive financial management tools.',
    image: 'https://via.placeholder.com/800x400/2a2a2a/00d4ff?text=Expense+Manager+Screenshot',
    status: 'completed',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Local Storage'],
    features: [
      'Add and categorize expenses',
      'Visual charts and graphs',
      'Monthly and yearly reports',
      'Budget setting and tracking',
      'Export data to CSV',
      'Expense categories management',
      'Search and filter transactions',
      'Data backup and restore'
    ],
    links: {
      live: '#',
      code: '#'
    }
  }
};

// ===== PROJECTS GALLERY CONTROLLER =====
class ProjectsGalleryController {
  constructor() {
    this.modal = document.getElementById('projectModal');
    this.modalTitle = document.querySelector('.modal-title');
    this.modalImage = document.querySelector('.modal-project-image');
    this.modalStatus = document.querySelector('.modal-status .status-badge');
    this.modalDescription = document.querySelector('.modal-project-description');
    this.featuresList = document.querySelector('.features-list');
    this.modalTechTags = document.querySelector('.modal-tech-tags');
    this.modalLinks = document.querySelectorAll('.modal-btn');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initLazyLoading();
  }
  
  bindEvents() {
    // Project detail buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.view-details')) {
        const projectId = e.target.closest('.view-details').getAttribute('data-project');
        this.openModal(projectId);
      }
      
      // External link buttons
      if (e.target.closest('.view-code') || e.target.closest('.view-live')) {
        const url = e.target.closest('button').getAttribute('data-url');
        if (url && url !== '#') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
      
      // Modal close buttons
      if (e.target.closest('[data-close-modal]')) {
        this.closeModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
    
    // Prevent modal close when clicking inside modal content
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
          this.closeModal();
        }
      });
    }
  }
  
  openModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    
    // Populate modal content
    this.modalTitle.textContent = project.title;
    this.modalImage.src = project.image;
    this.modalImage.alt = project.title;
    this.modalDescription.textContent = project.description;
    
    // Set status badge
    this.modalStatus.textContent = project.status.charAt(0).toUpperCase() + project.status.slice(1);
    this.modalStatus.className = `status-badge ${project.status}`;
    
    // Populate features list
    this.featuresList.innerHTML = '';
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      this.featuresList.appendChild(li);
    });
    
    // Populate technology tags
    this.modalTechTags.innerHTML = '';
    project.technologies.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      this.modalTechTags.appendChild(tag);
    });
    
    // Update links
    this.modalLinks.forEach(link => {
      const linkType = link.getAttribute('data-link');
      if (linkType && project.links[linkType]) {
        link.href = project.links[linkType];
      }
    });
    
    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    this.modal.querySelector('.modal-close').focus();
    
    // Announce to screen readers
    if (window.PortfolioNavigation && window.PortfolioNavigation.announcePageChange) {
      window.PortfolioNavigation.announcePageChange(`Opened project details for ${project.title}`);
    }
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to the button that opened the modal
    const activeButton = document.querySelector('.view-details:focus');
    if (activeButton) {
      activeButton.focus();
    }
  }
  
  // ===== LAZY LOADING IMPLEMENTATION =====
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => this.loadImage(img));
    }
  }
  
  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Image loaded successfully
      img.src = src;
      img.classList.add('loaded');
      
      // Remove data-src attribute
      img.removeAttribute('data-src');
      
      // Add fade-in animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-out';
      
      // Trigger reflow and fade in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
    };
    
    imageLoader.onerror = () => {
      // Handle image load error
      img.classList.add('error');
      console.warn('Failed to load image:', src);
    };
    
    // Start loading the image
    imageLoader.src = src;
  }
}

// ===== PROJECT CARD HOVER EFFECTS =====
class ProjectCardEffects {
  constructor() {
    this.init();
  }
  
  init() {
    this.addHoverEffects();
    this.addKeyboardNavigation();
  }
  
  addHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const overlay = card.querySelector('.project-overlay');
      const image = card.querySelector('.project-img');
      
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
      
      // Touch support for mobile devices
      card.addEventListener('touchstart', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('touchend', () => {
        setTimeout(() => {
          this.animateCardHover(card, false);
        }, 2000); // Keep hover state for 2 seconds on touch
      });
    });
  }
  
  animateCardHover(card, isHovering) {
    const overlay = card.querySelector('.project-overlay');
    const image = card.querySelector('.project-img');
    const actions = card.querySelectorAll('.action-btn');
    
    if (isHovering) {
      // Stagger animation for action buttons
      actions.forEach((btn, index) => {
        setTimeout(() => {
          btn.style.transform = 'scale(1) translateY(0)';
          btn.style.opacity = '1';
        }, index * 100);
      });
    } else {
      actions.forEach(btn => {
        btn.style.transform = 'scale(0.8) translateY(10px)';
        btn.style.opacity = '0.8';
      });
    }
  }
  
  addKeyboardNavigation() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class ProjectsPerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.optimizeImages();
    this.addPreloadHints();
    this.optimizeAnimations();
  }
  
  optimizeImages() {
    // Add will-change property to images that will be animated
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach(img => {
      img.style.willChange = 'transform';
    });
  }
  
  addPreloadHints() {
    // Preload critical project images
    const criticalImages = document.querySelectorAll('.project-img[data-src]');
    const preloadedCount = Math.min(2, criticalImages.length); // Preload first 2 images
    
    for (let i = 0; i < preloadedCount; i++) {
      const img = criticalImages[i];
      const src = img.getAttribute('data-src');
      if (src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    }
  }
  
  optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        requestAnimationFrame(() => {
          card.style.transform = 'translateY(-10px)';
        });
      });
      
      card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          card.style.transform = 'translateY(0)';
        });
      });
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Initialize projects gallery
  new ProjectsGalleryController();
  
  if (!prefersReducedMotion) {
    new ProjectCardEffects();
    new ProjectsPerformanceOptimizer();
  }
});

// ===== EXPORT FOR USE IN OTHER MODULES =====
window.ProjectsGallery = {
  ProjectsGalleryController,
  ProjectCardEffects,
  ProjectsPerformanceOptimizer,
  projectData
};