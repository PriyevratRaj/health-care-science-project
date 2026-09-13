// ===== DOCTORS PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== SEARCH FUNCTIONALITY =====
  const searchInput = document.getElementById('doctor-search');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const doctorCount = document.getElementById('doctor-count');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // ===== SEARCH BY TEXT =====
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      filterDoctors(query, getActiveFilter());
      updateCount();
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.toLowerCase().trim();
        filterDoctors(query, getActiveFilter());
        updateCount();
      }
    });
  }

  // ===== FILTER BY SPECIALTY =====
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
      filterDoctors(query, filter);
      updateCount();
    });
  });

  // ===== FILTER DOCTORS FUNCTION =====
  function filterDoctors(query, specialty) {
    doctorCards.forEach(card => {
      const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const specialtyText = card.querySelector('.specialty')?.textContent.toLowerCase() || '';
      const bio = card.querySelector('.bio')?.textContent.toLowerCase() || '';
      const cardSpecialty = card.dataset.specialty || '';

      const matchesSearch = !query || 
        name.includes(query) || 
        specialtyText.includes(query) || 
        bio.includes(query);

      const matchesFilter = specialty === 'all' || cardSpecialty === specialty;

      if (matchesSearch && matchesFilter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // ===== UPDATE COUNT =====
  function updateCount() {
    if (doctorCount) {
      const visible = document.querySelectorAll('.doctor-card:not(.hidden)').length;
      doctorCount.textContent = visible;
    }
  }

  // ===== GET ACTIVE FILTER =====
  function getActiveFilter() {
    const active = document.querySelector('.filter-btn.active');
    return active ? active.dataset.filter : 'all';
  }

  // ===== INITIAL COUNT =====
  updateCount();

  // ===== SMOOTH SCROLL TO TOP WHEN OPENING PROFILE =====
  document.querySelectorAll('a[href^="#profile-doctor"]').forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    });
  });

  // ===== CHAT FUNCTIONALITY =====
  document.querySelectorAll('.chat-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const input = this.querySelector('input');
      const message = input.value.trim();
      if (!message) return;

      const chatMessages = this.closest('.chat-section').querySelector('.chat-messages');
      if (!chatMessages) return;

      // Add sent message
      const sentMsg = document.createElement('div');
      sentMsg.className = 'chat-message sent';
      sentMsg.innerHTML = `<span class="msg-sender">You:</span> <span class="msg-text">${escapeHtml(message)}</span>`;
      chatMessages.appendChild(sentMsg);
      
      input.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate typing indicator
      const typingMsg = document.createElement('div');
      typingMsg.className = 'chat-message received';
      typingMsg.innerHTML = `<span class="msg-sender">Doctor:</span> <span class="msg-text">Typing...</span>`;
      chatMessages.appendChild(typingMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Auto-reply after delay
      setTimeout(() => {
        typingMsg.remove();
        
        const replies = [
          'Thank you for reaching out. This is a demo chat — in a real scenario, a doctor would respond to your query.',
          'I understand your concern. Please note this is a demonstration chat feature.',
          'Thank you for your message. This is a demo interface — no real medical advice is being provided.',
          'Your message has been received. Remember, this is a fictional demo platform.'
        ];
        
        const reply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMsg = document.createElement('div');
        replyMsg.className = 'chat-message received';
        replyMsg.innerHTML = `<span class="msg-sender">Doctor:</span> <span class="msg-text">${reply}</span>`;
        chatMessages.appendChild(replyMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1200 + Math.random() * 800);
    });
  });

  // ===== HTML ESCAPE FUNCTION =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});