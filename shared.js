// ===== MOBILE NAVIGATION TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (navToggle) {
    navToggle.addEventListener('change', function() {
      if (this.checked) {
        mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
      } else {
        mainNav.style.maxHeight = '0';
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
          mainNav.style.maxHeight = '0';
        }
      }
    });
  });

  // ===== FORM SUBMISSION HANDLING =====
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show success message
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Sent!';
        submitBtn.style.background = '#16A6A0';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }, 2000);
      }

      // Show alert for demo
      if (this.classList.contains('appointment-form')) {
        alert('Demo form: Your appointment request has been noted. This is a demonstration — no real appointment was booked.');
      } else if (this.classList.contains('chat-form')) {
        const input = this.querySelector('input');
        if (input && input.value.trim()) {
          addChatMessage(this, input.value, 'sent');
          input.value = '';
          
          // Auto-reply
          setTimeout(() => {
            addChatMessage(this, 'Thank you for your message. This is a demo — a real doctor would respond here.', 'received');
          }, 1000);
        }
      } else if (this.classList.contains('contact-form') || this.querySelector('#cname')) {
        alert('Demo form: Your message has been noted. This is a demonstration — no real message was sent.');
      }
    });
  });

  // ===== CHAT FUNCTIONALITY =====
  function addChatMessage(form, text, type) {
    const chatMessages = form.closest('.chat-section').querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'msg-sender';
    senderSpan.textContent = type === 'sent' ? 'You:' : 'Doctor:';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'msg-text';
    textSpan.textContent = text;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(textSpan);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ===== HERO STATS COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const match = text.match(/(\d+)/);
          
          if (match && !el.dataset.animated) {
            el.dataset.animated = 'true';
            const target = parseInt(match[1]);
            const suffix = text.replace(match[1], '');
            let current = 0;
            const increment = Math.ceil(target / 50);
            const duration = 1500;
            const stepTime = duration / (target / increment);
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current + suffix;
            }, stepTime);
          }
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    statNumbers.forEach(num => observer.observe(num));
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== LAZY LOAD IMAGES =====
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
} 
}); 