// ===== DOCTORS PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
// Track used replies per doctor (prevents repeats in same session)
  const usedReplies = {};
  
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

      // ===== SMART AUTO-REPLY =====
      setTimeout(() => {
        typingMsg.remove();
        
        // Get doctor info for context
        const profileId = form.closest('.profile-page')?.id || '';
        const doctorName = form.closest('.profile-page')?.querySelector('.profile-avatar h3')?.textContent || 'Doctor';
        
        // ===== DOCTOR-SPECIFIC REPLY BANKS =====
        const doctorReplies = {
          'profile-doctor1': [
            'Have you experienced any chest pain, shortness of breath, or palpitations recently?',
            'Please monitor your blood pressure regularly and share the readings with me.',
            'A heart-healthy diet rich in fruits, vegetables, and whole grains is essential.',
            'Regular cardiovascular exercise strengthens your heart. Aim for 30 minutes most days.',
            'If symptoms persist, I recommend an ECG and stress test for a proper evaluation.',
            'How would you describe the chest discomfort — sharp, dull, or pressure-like?',
            'Do you have a family history of heart disease? This is important for risk assessment.',
            'Smoking significantly increases cardiovascular risk. Quitting is one of the best things you can do.',
            'Keep your cholesterol levels in check with regular blood work.',
            'Managing stress is crucial for heart health. Consider meditation or yoga.',
            'If you experience severe chest pain radiating to your arm or jaw, seek emergency care immediately.',
            'Do you notice symptoms more during physical activity or at rest?',
            'Adequate sleep — 7 to 9 hours — supports healthy heart function.',
            'Limiting salt intake helps control blood pressure naturally.',
            'Have you had a recent cholesterol panel done? Knowing your numbers is key.',
            'Moderate alcohol consumption is recommended for heart health.',
            'Sudden swelling in your legs or ankles could indicate a heart concern — please note it.',
            'Aim for a resting heart rate between 60 and 100 beats per minute.',
            'Regular checkups help catch heart issues early, when they are most treatable.',
            'Would you like to schedule an appointment for a comprehensive cardiac evaluation?',
            'Please share any medications you are currently taking for a full picture.',
            'Take care of your heart — it takes care of you. Reach out anytime.'
          ],
          'profile-doctor2': [
            'How old is your child, and how long have the symptoms been present?',
            'Ensure your child stays hydrated and gets plenty of rest.',
            'Has your child had any recent changes in appetite or behavior?',
            'Keep a record of your child\'s temperature and any medications given.',
            'Is your child up to date on vaccinations? This is important to check.',
            'For mild fevers, keep the child comfortable and monitor the temperature.',
            'Children need 9-12 hours of sleep depending on age for proper development.',
            'Encourage outdoor play — it supports both physical and mental growth.',
            'Balanced meals with fruits, vegetables, and proteins support healthy growth.',
            'How is your child doing in school? Any changes in focus or mood?',
            'Limit screen time to support healthy sleep and development.',
            'If your child has a persistent cough, a humidifier may help.',
            'Watch for signs of dehydration: dry mouth, fewer wet diapers, or lethargy.',
            'Newborns and infants should be fed on demand, not on a fixed schedule.',
            'Introduce new foods one at a time to watch for allergies.',
            'Regular pediatric checkups track growth and developmental milestones.',
            'If your child has trouble breathing, seek immediate medical care.',
            'Reading together daily supports language and cognitive development.',
            'Handwashing is one of the best ways to prevent childhood illnesses.',
            'Does your child have any known allergies or chronic conditions?',
            'A calm, consistent routine helps children feel secure and thrive.',
            'Trust your instincts — if something feels off, please bring them in.'
          ],
          'profile-doctor3': [
            'Could you describe your symptoms in more detail? When did they start?',
            'Have you experienced this before? Any changes in your routine recently?',
            'I recommend keeping a symptom diary to track patterns.',
            'Staying hydrated, getting adequate sleep, and managing stress help many conditions.',
            'A balanced diet and regular physical activity are foundations of good health.',
            'If symptoms persist for more than a few days, please consider an in-person visit.',
            'Are you currently taking any medications or supplements?',
            'Do you have any chronic conditions like diabetes or hypertension?',
            'Routine blood work can reveal a lot about your overall health.',
            'Preventive care is better than cure — regular checkups matter.',
            'What is your typical day like? Stress and sleep affect everything.',
            'Do you smoke or consume alcohol? This helps me assess risk factors.',
            'Have you noticed any unexplained weight changes recently?',
            'Hydration, nutrition, and rest are the three pillars of recovery from most illnesses.',
            'If you have a fever, monitor it and stay hydrated. Seek care if it exceeds 103°F.',
            'A yearly physical exam helps catch issues before they become serious.',
            'Please describe any pain — location, intensity, and duration.',
            'Do you have any allergies to medications? Important to note.',
            'Managing stress through exercise or hobbies improves overall health.',
            'Gut health affects immunity, mood, and energy. Consider a fiber-rich diet.',
            'Would you like to schedule a full health screening?',
            'Your health is a marathon, not a sprint. Small steps add up.'
          ],
          'profile-doctor4': [
            'How often do you brush and floss daily? Twice a day is ideal.',
            'Any sensitivity to hot or cold foods or drinks?',
            'Regular dental checkups every six months help prevent issues.',
            'Avoid sugary drinks and snacks between meals.',
            'Bleeding gums can be a sign of gingivitis — please do not ignore it.',
            'Do you grind your teeth at night? A night guard may help.',
            'Bad breath that persists could indicate an underlying dental issue.',
            'Replace your toothbrush every three months for best results.',
            'Are you experiencing any tooth pain or discomfort right now?',
            'Fluoride toothpaste strengthens enamel and prevents cavities.',
            'Drink water after meals to help wash away food particles.',
            'Do you use a mouthwash? It can complement brushing and flossing.',
            'A balanced diet with calcium supports strong teeth and bones.',
            'For sensitive teeth, try a desensitizing toothpaste.',
            'Wisdom teeth may need removal if they cause pain or crowding.',
            'Cosmetic treatments like whitening can boost confidence — we can discuss options.',
            'Have you had any dental work done recently?',
            'If you notice swelling or bleeding, please book an appointment.',
            'Routine cleanings remove plaque that brushing alone cannot.',
            'Avoid tobacco products — they stain teeth and increase gum disease risk.',
            'A beautiful smile starts with good daily habits.',
            'Would you like to schedule a cleaning and checkup?'
          ],
          'profile-doctor5': [
            'How frequent are your headaches? Any triggers you have noticed?',
            'Maintain a consistent sleep schedule for better brain health.',
            'Keep a headache diary — it helps identify patterns and triggers.',
            'If symptoms worsen or change suddenly, seek care immediately.',
            'Are you experiencing any dizziness, tingling, or numbness?',
            'Stay hydrated — dehydration is a common headache trigger.',
            'Limit caffeine and alcohol, both of which can affect neurological health.',
            'Regular exercise improves blood flow to the brain and mood.',
            'Have you noticed any changes in memory or concentration?',
            'Stress management techniques like meditation can reduce neurological symptoms.',
            'Do you have a family history of migraines, epilepsy, or stroke?',
            'Avoid skipping meals — low blood sugar can trigger headaches.',
            'Sudden severe headaches could indicate a serious issue. Please seek immediate care.',
            'Sleep hygiene — dark, cool room, no screens before bed — supports brain recovery.',
            'Certain foods like aged cheese or processed meats can trigger migraines.',
            'Are you on any medications for neurological symptoms?',
            'Cognitive exercises and reading support long-term brain health.',
            'If you have seizures, ensure you have a safety plan in place.',
            'Vision problems can be linked to neurological issues — a checkup may help.',
            'Managing blood pressure and cholesterol supports brain health.',
            'Neurological symptoms deserve careful attention. Please do not ignore them.',
            'Would you like to schedule a neurological consultation?'
          ],
          'profile-doctor6': [
            'Where exactly is the pain? Does it radiate anywhere?',
            'Rest, ice, compression, and elevation can help with acute injuries.',
            'Strengthening exercises and stretching are important for joint health.',
            'Avoid high-impact activities until we evaluate further.',
            'How long have you had this pain? Did it start suddenly or gradually?',
            'Maintain a healthy weight to reduce stress on your joints.',
            'Do you experience stiffness in the morning? This can indicate arthritis.',
            'Proper posture and ergonomics reduce back and neck pain.',
            'Warm-up before exercise and cool down after — this prevents injuries.',
            'Calcium and vitamin D support strong bones.',
            'Have you had any recent falls or injuries?',
            'If pain is accompanied by swelling or bruising, ice and elevate.',
            'Do you hear a popping or grinding sound in the joint?',
            'Low-impact exercises like swimming are joint-friendly.',
            'Avoid prolonged sitting — take breaks and stretch.',
            'Orthopedic issues often respond well to physical therapy.',
            'Have you had an X-ray or MRI for this issue?',
            'If pain interferes with daily activities, please seek evaluation.',
            'Wearing proper footwear supports foot and knee health.',
            'Joint pain that persists beyond a few weeks warrants a checkup.',
            'Recovery takes time — patience and consistency are key.',
            'Would you like to schedule an orthopedic consultation?'
          ],
          'profile-doctor7': [
            'How long have you had this skin concern?',
            'Always use sunscreen — even on cloudy days.',
            'Avoid harsh soaps and hot water for sensitive skin.',
            'Keep a photo diary to track changes over time.',
            'Are you experiencing itching, redness, or scaling?',
            'A gentle cleanser and moisturizer are the foundation of good skincare.',
            'Hydration from within — drink plenty of water — supports skin health.',
            'Have you tried any new products or foods recently?',
            'Acne can be managed with consistent skincare and sometimes medication.',
            'Do not pick or squeeze pimples — it can cause scarring.',
            'Eczema and psoriasis benefit from fragrance-free moisturizers.',
            'Certain medications can cause skin reactions — note any changes.',
            'Hair loss can have many causes — stress, diet, or hormonal.',
            'Sun protection prevents premature aging and skin cancer.',
            'Antioxidant-rich foods support healthy skin from within.',
            'If a mole changes shape, color, or size, get it checked.',
            'A balanced diet and good sleep improve skin appearance.',
            'Cosmetic treatments like chemical peels can address various concerns.',
            'Avoid tanning beds — they damage skin and increase cancer risk.',
            'Wearing protective clothing outdoors reduces sun exposure.',
            'Skin issues can affect confidence — we are here to help.',
            'Would you like to schedule a dermatology consultation?'
          ],
          'profile-doctor8': [
            'When was your last routine checkup?',
            'Routine screenings are important for women\'s health.',
            'Track your cycle and note any irregularities.',
            'If you have concerns, please schedule a visit soon.',
            'How regular is your menstrual cycle? Any changes recently?',
            'Regular Pap smears help detect cervical issues early.',
            'Maintain a healthy weight — it affects hormonal balance.',
            'Folic acid is essential if you are planning pregnancy.',
            'Are you experiencing any pelvic pain or discomfort?',
            'Routine breast self-exams support early detection.',
            'Managing stress supports hormonal and reproductive health.',
            'Adequate calcium and vitamin D support bone health.',
            'Menopause brings changes — we can discuss management options.',
            'Birth control options vary — we can find the right fit for you.',
            'If you notice unusual bleeding, please seek evaluation.',
            'PCOS and endometriosis are manageable with proper care.',
            'A balanced diet and exercise support reproductive health.',
            'Have you had your HPV vaccination? It prevents certain cancers.',
            'Yearly checkups are recommended for women over 21.',
            'Open communication with your doctor leads to better outcomes.',
            'Do not hesitate to ask questions — your health matters.',
            'Would you like to schedule a women\'s health consultation?'
          ],
          'profile-doctor9': [
            'How have you been feeling lately? Sleep and appetite changes?',
            'It is okay to not be okay. Seeking help is a strength.',
            'Simple practices like deep breathing can help with anxiety.',
            'Please reach out if things feel overwhelming.',
            'How long have you been feeling this way?',
            'Sleep hygiene — regular schedule, no screens before bed — supports mood.',
            'Regular exercise is a powerful mood booster.',
            'Are you experiencing any thoughts of self-harm? Please be honest.',
            'Talking to a trusted friend or family member can help.',
            'Mindfulness and meditation reduce anxiety and improve focus.',
            'Chronic stress affects both mind and body. Let us address it.',
            'Do you have a support system in place?',
            'Limiting alcohol and caffeine can improve mental well-being.',
            'Journaling helps process thoughts and track moods.',
            'If you are on medication, do not stop without consulting me.',
            'Therapy combined with lifestyle changes is often most effective.',
            'You are not alone — millions face similar challenges.',
            'Small daily habits build long-term mental resilience.',
            'Nature walks and sunlight boost serotonin naturally.',
            'If symptoms worsen, please reach out immediately.',
            'Remember, recovery is a journey, not a race.',
            'Would you like to schedule a consultation to discuss further?'
          ],
          'profile-doctor10': [
            'How is your vision? Any blurriness, dryness, or discomfort?',
            'Follow the 20-20-20 rule: every 20 min, look 20 ft away for 20 sec.',
            'Wear sunglasses to protect your eyes from UV rays.',
            'Regular eye exams catch issues early. When was your last one?',
            'Do you spend long hours on screens? This can cause digital eye strain.',
            'A diet rich in vitamin A, C, and omega-3 supports eye health.',
            'Are you experiencing any eye pain or redness?',
            'Do not rub your eyes — it can cause damage or infection.',
            'Proper lighting when reading reduces eye strain.',
            'If you wear contacts, follow hygiene rules strictly.',
            'Blinking regularly while using screens keeps eyes moist.',
            'Dry eye can be managed with artificial tears and lifestyle changes.',
            'Have you noticed any floaters or flashes of light?',
            'Cataracts and glaucoma are more common with age — regular checks help.',
            'Diabetes can affect vision — keep blood sugar in check.',
            'Family history of eye disease increases your risk — note it.',
            'Children should have vision screenings before starting school.',
            'If you notice sudden vision loss, seek emergency care immediately.',
            'Quitting smoking benefits eye health significantly.',
            'Regular breaks from screens reduce digital eye strain.',
            'Protective eyewear during sports prevents injuries.',
            'Would you like to schedule a comprehensive eye exam?'
          ]
        };
        
        // Fallback generic replies
        const genericReplies = [
          'Thank you for your message. Could you share more details?',
          'I understand. Please describe your concern in more detail.',
          'Thank you for reaching out. How long have you been experiencing this?',
          'Would you like to schedule an appointment for a proper consultation?',
          'Please note this is a demo — for real concerns, please visit in person.',
          'I appreciate you sharing that. Let me know if you have more questions.',
          'Please feel free to reach out anytime. Take care!',
          'Is there anything else I can help you with today?',
          'Thank you for your message. Wishing you good health!',
          'Take care of yourself. Do not hesitate to ask more questions.'
        ];
        
        // ===== SMART DETECTION + NO-REPEAT LOGIC =====
        const lower = message.toLowerCase();
        let reply;

        if (/^(hi|hello|hey|good morning|good afternoon||good evening)/i.test(lower)) {
          reply = `Hello! I'm ${doctorName}. How can I help you today?`;
        } else if (lower.includes('thank')) {
          reply = 'You are very welcome! Take care of yourself.';
        } else if (lower.includes('bye') || lower.includes('goodbye')) {
          reply = 'Take care! Reach out anytime if you need anything.';
        } else {
          // No-repeat logic
          const bank = doctorReplies[profileId] || genericReplies;
          if (!usedReplies[profileId]) usedReplies[profileId] = [];
          const available = bank.filter(r => !usedReplies[profileId].includes(r));
          if (available.length > 0) {
            reply = available[Math.floor(Math.random() * available.length)];
            usedReplies[profileId].push(reply);
          } else {
            usedReplies[profileId] = [];
            reply = bank[Math.floor(Math.random() * bank.length)];
            usedReplies[profileId].push(reply);
          }
        }
        
        // Display reply
        const replyMsg = document.createElement('div');
        replyMsg.className = 'chat-message received';
        replyMsg.innerHTML = `<span class="msg-sender">${doctorName}:</span> <span class="msg-text">${escapeHtml(reply)}</span>`;
        chatMessages.appendChild(replyMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1200 + Math.random() * 800);    });
  });

  // ===== HTML ESCAPE FUNCTION =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});