// ===== ABOUT PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ANIMATED COUNTERS =====
  const statNumbers = document.querySelectorAll('.story-stat .stat-number');
  
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }

  function animateNumber(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    
    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, duration / steps);
  }

  // ===== TEAM MEMBER CARD HOVER =====
  document.querySelectorAll('.team-member').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });

  // ===== REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll(
    '.story-text, .story-image, .mission-card, .team-member, .why-about-item, .testimonials-about blockquote'
  );

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

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `all 0.6s ease ${index * 0.05}s`;
      revealObserver.observe(el);
    });
  }

  // ===== CTA BUTTON CLICK TRACKING =====
  document.querySelectorAll('.cta-buttons .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});