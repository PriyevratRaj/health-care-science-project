// ===== HOME PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== FAQ ACCORDION (Optional Enhancement) =====
  const faqDetails = document.querySelectorAll('.faq details');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        // Close other open FAQs
        faqDetails.forEach(other => {
          if (other !== this && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ===== TESTIMONIAL CAROUSEL (Auto-rotate) =====
  const testimonials = document.querySelectorAll('.testimonial-grid blockquote');
  if (testimonials.length > 1) {
    let currentIndex = 0;
    
    // Only auto-rotate on larger screens
    if (window.innerWidth > 768) {
      setInterval(() => {
        testimonials.forEach((t, i) => {
          t.style.opacity = i === currentIndex ? '1' : '0.5';
          t.style.transform = i === currentIndex ? 'scale(1)' : 'scale(0.98)';
        });
        currentIndex = (currentIndex + 1) % testimonials.length;
      }, 4000);
    }
  }

  // ===== APPOINTMENT FORM VALIDATION =====
  const appointmentForm = document.querySelector('.appointment-form');
  if (appointmentForm) {
    const dateInput = appointmentForm.querySelector('#date');
    if (dateInput) {
      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // Custom validation feedback
    appointmentForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', function() {
        if (this.required && !this.value.trim()) {
          this.style.borderColor = '#ef4444';
        } else {
          this.style.borderColor = '#e2e8f0';
        }
      });

      field.addEventListener('input', function() {
        if (this.value.trim()) {
          this.style.borderColor = '#16A6A0';
        }
      });
    });
  }

  // ===== DEPARTMENT SELECT AUTO-FILL =====
  const departmentSelect = document.getElementById('department');
  const messageField = document.getElementById('message');
  
  if (departmentSelect && messageField) {
    departmentSelect.addEventListener('change', function() {
      const dept = this.value;
      if (dept && !messageField.value) {
        const messages = {
          'General Consultation': 'I would like to schedule a general consultation.',
          'Cardiology': 'I would like to consult a cardiologist.',
          'Pediatrics': 'I would like to book a pediatric appointment.',
          'Dental Care': 'I would like to schedule a dental appointment.',
          'Mental Wellness': 'I would like to speak with a mental wellness professional.',
          'Diagnostic': 'I would like to schedule diagnostic services.'
        };
        messageField.value = messages[dept] || '';
      }
    });
  }

  // ===== DOCTOR CARD HOVER EFFECT =====
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });

  // ===== SMOOTH REVEAL ON SCROLL =====
  const revealElements = document.querySelectorAll('.section-header, .service-card, .tip-card, .feature-card');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      revealObserver.observe(el);
    });
  }

  // ===== EMERGENCY BANNER CLOSE =====
  const emergencyBanner = document.querySelector('.emergency-banner');
  if (emergencyBanner) {
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.className = 'emergency-close';
    closeBtn.setAttribute('aria-label', 'Dismiss emergency notice');
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 20px;
      background: transparent;
      border: 2px solid #B45309;
      color: #B45309;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
    `;
    
    emergencyBanner.style.position = 'relative';
    emergencyBanner.appendChild(closeBtn);
    
    closeBtn.addEventListener('click', () => {
      emergencyBanner.style.display = 'none';
    });
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#B45309';
      closeBtn.style.color = 'white';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = '#B45309';
    });
  }
});