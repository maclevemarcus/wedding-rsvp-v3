(function() {
  'use strict';

  // ===================================
  // STATE MANAGEMENT
  // ===================================

  const state = {
    splashShown: false,
    modalOpen: false
  };

  // ===================================
  // SPLASH SCREEN
  // ===================================

  function initSplash() {
    const splash = document.getElementById('splash');
    const mainContent = document.getElementById('main-content');

    if (!splash || !mainContent) return;

    // Show splash for 2.5 seconds
    setTimeout(() => {
      splash.classList.add('hidden');
      mainContent.classList.remove('hidden');
      state.splashShown = true;
      
      // Trigger scroll animations
      initScrollAnimations();
    }, 2500);
  }

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation delays
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
        }
      });
    }, observerOptions);

    // Observe detail cards
    const cards = document.querySelectorAll('[data-animate]');
    cards.forEach(card => observer.observe(card));
  }

  // ===================================
  // SCROLL INDICATOR
  // ===================================

  function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    // Hide on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
      } else {
        indicator.style.opacity = '1';
        indicator.style.pointerEvents = 'auto';
      }
    }, { passive: true });

    // Click to scroll
    indicator.addEventListener('click', () => {
      const invitationSection = document.querySelector('.invitation-section');
      if (invitationSection) {
        invitationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ===================================
  // PDF MODAL
  // ===================================

  function initPDFModal() {
    const modal = document.getElementById('pdf-modal');
    const tentativeCard = document.getElementById('tentative-card');
    const closeBtn = modal?.querySelector('.modal-close');
    const overlay = modal?.querySelector('.modal-overlay');

    if (!modal || !tentativeCard) return;

    // Open modal
    function openModal() {
      modal.classList.remove('hidden');
      state.modalOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Trap focus in modal
      trapFocus(modal);
    }

    // Close modal
    function closeModal() {
      modal.classList.add('hidden');
      state.modalOpen = false;
      document.body.style.overflow = '';
    }

    // Event listeners
    tentativeCard.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.modalOpen) {
        closeModal();
      }
    });
  }

  // ===================================
  // FOCUS TRAP (Accessibility)
  // ===================================

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    // Focus first element
    firstFocusable?.focus();
  }

  // ===================================
  // RSVP FORM
  // ===================================

  function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const successDiv = document.getElementById('rsvp-success');

    if (!form || !successDiv) return;

    // Enhanced form validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Focus effects
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
      });

      // Validation feedback
      input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
      });

      input.addEventListener('input', function() {
        this.classList.remove('error');
      });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      console.log('RSVP Submission:', data);

      // Animate form out
      form.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      form.style.opacity = '0';
      form.style.transform = 'translateY(-20px)';

      // Show success message
      setTimeout(() => {
        form.style.display = 'none';
        successDiv.classList.remove('hidden');
        
        // Scroll to success message
        successDiv.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });

        // Confetti effect
        createConfetti();
      }, 600);
    });
  }

  // ===================================
  // CONFETTI EFFECT
  // ===================================

  function createConfetti() {
    const colors = ['#9ec5b8', '#a8b896', '#5f7359', '#e8dcc8'];
    const shapes = ['circle', 'square'];
    const container = document.body;

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 6 + Math.random() * 8;

        confetti.style.cssText = `
          position: fixed;
          left: 50%;
          top: 30%;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: ${shape === 'circle' ? '50%' : '0'};
          pointer-events: none;
          z-index: 10000;
        `;

        container.appendChild(confetti);

        // Animation
        const angle = Math.random() * Math.PI * 2;
        const velocity = 150 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 50;
        const rotation = Math.random() * 720 - 360;

        confetti.animate([
          { 
            transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', 
            opacity: 1 
          },
          { 
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rotation}deg) scale(0)`, 
            opacity: 0 
          }
        ], {
          duration: 2000 + Math.random() * 1000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
      }, i * 30);
    }
  }

  // ===================================
  // PARALLAX EFFECT (Desktop only)
  // ===================================

  function initParallax() {
    // Only run on desktop
    if (window.innerWidth < 1024) return;

    const hero = document.querySelector('.hero-image');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        const yPos = scrolled * 0.5;
        hero.style.transform = `translateY(${yPos}px)`;
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===================================
  // CARD HOVER EFFECTS (Desktop)
  // ===================================

  function initCardHoverEffects() {
    // Only on devices that support hover
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cards = document.querySelectorAll('.detail-card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });

      // Subtle tilt on mouse move
      card.addEventListener('mousemove', function(e) {
        if (window.innerWidth < 1024) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;

        this.style.transform = `
          translateY(-5px) 
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // ===================================
  // FORM INPUT ANIMATIONS
  // ===================================

  function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
      const input = group.querySelector('input, select, textarea');
      const label = group.querySelector('label');

      if (!input || !label) return;

      // Floating label effect
      function checkValue() {
        if (input.value.trim() !== '') {
          label.style.transform = 'translateY(-1.5rem) scale(0.85)';
          label.style.color = 'var(--moss)';
        } else {
          label.style.transform = '';
          label.style.color = '';
        }
      }

      input.addEventListener('focus', () => {
        label.style.transform = 'translateY(-1.5rem) scale(0.85)';
        label.style.color = 'var(--seafoam)';
      });

      input.addEventListener('blur', checkValue);
      input.addEventListener('input', checkValue);

      // Check initial value
      checkValue();
    });
  }

  // ===================================
  // LAZY LOAD IMAGES
  // ===================================

  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ===================================
  // VIEWPORT HEIGHT FIX (Mobile)
  // ===================================

  function initViewportFix() {
    // Fix for mobile browsers where 100vh includes address bar
    function setVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
  }

  // ===================================
  // PERFORMANCE: Debounce Function
  // ===================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===================================
  // CONSOLE MESSAGE
  // ===================================

  function initConsoleMessage() {
    const styles = {
      title: 'font-family: "Playfair Display", serif; font-size: 24px; font-weight: 600; color: #5f7359;',
      subtitle: 'font-family: "Bodoni Moda", serif; font-size: 16px; color: #a8b896; font-style: italic;',
      message: 'font-size: 14px; color: #9ec5b8;'
    };

    console.log('%cCarolinegel & Macleve', styles.title);
    console.log('%cJune 14, 2025', styles.subtitle);
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e8dcc8;');
    console.log('%cWishing you love and happiness ✨', styles.message);
  }

  // ===================================
  // ACCESSIBILITY: Focus Visible
  // ===================================

  function initFocusVisible() {
    // Add focus-visible class for keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // ===================================
  // INITIALIZATION
  // ===================================

  function init() {
    console.log('🌿 Initializing Wedding Invitation...');

    initSplash();
    initScrollIndicator();
    initPDFModal();
    initRSVPForm();
    initSmoothScroll();
    initCardHoverEffects();
    initParallax();
    initFormAnimations();
    initLazyLoad();
    initViewportFix();
    initFocusVisible();
    initConsoleMessage();

    console.log('✨ Everything is ready!');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===================================
  // SERVICE WORKER (Optional PWA)
  // ===================================

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Uncomment to enable PWA features
      // navigator.serviceWorker.register('/sw.js');
    });
  }

})();
