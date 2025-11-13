'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initPageNavigation();
    initCaseStudyAccordion(); 
    initProjectFilter(); 
    initLoadingSpinner();
    initCustomCursor(); 
    initTypingEffect();
    initCurrentYear();
    initThemeSwitcher(); 
    fetchGitHubStats();
    initChatAssistant();
});

function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        window.addEventListener('load', () => {
            spinner.classList.add('hidden');
        });
    }
}

function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return; 
    const cursorContainer = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    if (!cursorContainer || !dot) return;
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateCursor() {
        dotX += (mouseX - dotX) * 0.9; dotY += (mouseY - dotY) * 0.9;
        if (dot) {
          dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, [data-nav-link], .project-item-no-img, .social-link, .chat-toggle-btn, .suggested-question').forEach(el => {
        el.addEventListener('mouseenter', () => cursorContainer.classList.add('interact'));
        el.addEventListener('mouseleave', () => cursorContainer.classList.remove('interact'));
    });
}

function initTypingEffect() {
    const target = document.querySelector('.typing-effect');
    if (!target) return;
    const words = ["Developer", "Engineer", "Enthusiast", "Student"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
        if (!target) return;
        const currentWord = words[wordIndex];
        target.textContent = currentWord.substring(0, charIndex);
        if (isDeleting) charIndex--; else charIndex++;
        if (!isDeleting && charIndex === currentWord.length) { 
            setTimeout(() => isDeleting = true, 2000); 
        } else if (isDeleting && charIndex === 0) { 
            isDeleting = false; 
            wordIndex = (wordIndex + 1) % words.length; 
        }
        setTimeout(type, isDeleting ? 75 : 150);
    }
    type();
}

function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    const avatarImg = document.getElementById('avatar-img');
    if (!sunIcon || !moonIcon) return;
    let currentTheme = localStorage.getItem('theme') || 'dark'; 
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            if (avatarImg) avatarImg.src = 'assets/profile-dark.jpg';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            if (avatarImg) avatarImg.src = 'assets/profile-light.jpg';
        }
        localStorage.setItem('theme', theme);
    }
    themeBtn.addEventListener('click', () => {
        const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        currentTheme = newTheme;
        applyTheme(newTheme);
    });
    applyTheme(currentTheme);
}

async function fetchGitHubStats() {
  const reposEl = document.getElementById('github-repos');
  const starsEl = document.getElementById('github-stars');
  const activityList = document.getElementById('github-activity');  
  const starsItemEl = starsEl ? starsEl.closest('.service-item') : null;
  try {
    const userResponse = await fetch(`https://api.github.com/users/ashvinmanojk289`);
    if (!userResponse.ok) throw new Error('GitHub user API request failed');
    const userData = await userResponse.json();
    if (reposEl) reposEl.textContent = userData.public_repos || 0;
    const reposResponse = await fetch(`https://api.github.com/users/ashvinmanojk289/repos?sort=pushed&per_page=3`);
    if (!reposResponse.ok) throw new Error('GitHub repos API request failed');
    const repos = await reposResponse.json();
    if (activityList) {
        if (repos.length > 0) {
            activityList.innerHTML = repos.slice(0, 3).map(repo => `<li>Pushed to <strong>${repo.name}</strong></li>`).join('');
        } else {
            activityList.innerHTML = '<li>No recent activity.</li>';
        }
    }
    if (starsItemEl) {
        starsItemEl.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    if(activityList) {
        activityList.innerHTML = '<li>Could not fetch data.</li>';
    }
    if (reposEl) reposEl.textContent = 'N/A';
    if (starsItemEl) {
        starsItemEl.style.display = 'none';
    }
  }
}

function initChatAssistant() {
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    const chatWindow = document.querySelector('.chat-window');
    const chatBody = document.querySelector('.chat-body');
    const aiStatus = document.getElementById('ai-status');
    if (!toggleBtn || !chatWindow || !chatBody || !aiStatus) {
        console.error("Chat assistant elements not found. Skipping init.");
        return;
    }
    const conversationTree = {
        'root': {
            'isAnswer': false,
            'questions': [
                { 'text': "What are his top skills?", 'next': 'skills_1' },
                { 'text': "Tell me about his projects.", 'next': 'projects_1' },
                { 'text': "What's his professional experience?", 'next': 'experience_1' }
            ]
        },
        'skills_1': {
            'isAnswer': true,
            'answer': "Ashvin's technical skills include Python, C++, SQL, TensorFlow, PyTorch, Transformers, ROS, Git, and Flask.",
            'questions': [
                { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
                { 'text': "What programming languages?", 'next': 'skills_2_lang' },
                { 'text': "What about his publications?", 'next': 'achievements_1' }
            ]
        },
        'projects_1': {
            'isAnswer': true,
            'answer': "He has built a Multilingual News Audio Translator (92% accuracy) [cite: 497], a GenAI-powered PDF Query app (89% time reduction) [cite: 499], and an autonomous Weed Detection Robot (97% accuracy)[cite: 501].", // <-- UPDATED with citations
            'questions': [
                { 'text': "How does the Weed Robot work?", 'next': 'projects_2_robot' },
                { 'text': "Tell me about the PDF Query app.", 'next': 'projects_2_pdf' },
                { 'text': "More on the Audio Translator.", 'next': 'projects_2_audio' }
            ]
        },
        'experience_1': {
            'isAnswer': true,
            'answer': "He's a Data Science Intern at Mastermine (Aug 2025-Present) [cite: 487, 488] and was a Hardware Systems Intern at Sunlux (Feb-Apr 2024)[cite: 491, 492].", // <-- UPDATED with citations
            'questions': [
                { 'text': "What does he do at Mastermine?", 'next': 'experience_2_mastermine' },
                { 'text': "What did he do at Sunlux?", 'next': 'experience_2_sunlux' },
                { 'text': "What's his education?", 'next': 'education_1' }
            ]
        },
        'skills_2_ml': {
            'isAnswer': true,
            'answer': "He's proficient with AI frameworks like PyTorch, TensorFlow, Scikit-learn, Pandas, and NumPy, as well as the Transformers library for NLP[cite: 480].", // <-- UPDATED (added Pandas, NumPy)
            'questions': [
                { 'text': "See other skills", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'skills_2_lang': {
            'isAnswer': true,
            'answer': "His main languages are Python, C++, C, SQL, and R[cite: 479].", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other skills", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'achievements_1': {
            'isAnswer': true,
            'answer': "He co-authored 'A Hybrid Transformer Model Approach for Precision Weed Detection' (2025 ACCESS conference) [cite: 503] and has certifications from NPTEL, Infosys, and Coursera (including Google Data Analytics)[cite: 505].", // <-- UPDATED (added Coursera/Google)
            'questions': [
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_robot': {
            'isAnswer': true,
            'answer': "It's an AI-powered robot using ROS and a custom EfficientNetV2-Transformer hybrid model (97% accuracy) for eco-friendly herbicide application[cite: 501].", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_pdf': {
            'isAnswer': true,
            'answer': "It's a scalable, voice-enabled PDF query system using NLP and Streamlit, which reduced information retrieval time by over 89%[cite: 499].", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_audio': {
            'isAnswer': true,
            'answer': "A full-stack app using Wav2Vec 2.0 (92% accuracy) for speech recognition and a fine-tuned mBART model for fluent translation[cite: 497].", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_mastermine': {
            'isAnswer': true,
            'answer': "At Mastermine, he's engineering a full-stack desktop app for photographers (Java, React, Electron.js) [cite: 489] and designing a multi-agent LLM framework for data analysis[cite: 490].", // <-- UPDATED with citations
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_sunlux': {
            'isAnswer': true,
            'answer': "At Sunlux, he developed and debugged microprocessor programs in Assembly for industrial automation, improving process efficiency by 15%[cite: 493].", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'education_1': {
            'isAnswer': true,
            'answer': "He's pursuing an M.Tech in AI/ML from Rajagiri (CGPA 9.49) [cite: 482, 483] and holds a B.Tech in Robotics from Adi Shankara (CGPA 9.54)[cite: 484, 485].", // <-- UPDATED with citations
            'questions': [
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        }
    };
    aiStatus.textContent = "Ready";
    function renderNode(nodeId) {
        const node = conversationTree[nodeId];
        if (!node) { console.error(`No node found for ID: ${nodeId}`); return; }
        if (node.isAnswer) {
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'chat-message bot';
            thinkingDiv.innerHTML = '<div class="chat-spinner"></div>'; 
            chatBody.appendChild(thinkingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            setTimeout(() => {
                thinkingDiv.innerHTML = node.answer;
                thinkingDiv.innerHTML = thinkingDiv.innerHTML.replace(/\[cite:\s*([^\]]+)\]/g, '<sup class="chat-citation">[cite: $1]</sup>');
                chatBody.scrollTop = chatBody.scrollHeight;
                showQuestions(node.questions);
            }, 1000); 
        } else {
            showQuestions(node.questions);
        }
    }
    function showQuestions(questions) {
        const oldQuestions = chatBody.querySelector('.suggested-questions');
        if(oldQuestions) oldQuestions.remove();
        const questionsDiv = document.createElement('div');
        questionsDiv.className = 'suggested-questions';
        questions.forEach(q => {
            const qButton = document.createElement('button');
            qButton.className = 'suggested-question';
            qButton.textContent = q.text;
            qButton.dataset.next = q.next;
            questionsDiv.appendChild(qButton);
        });
        chatBody.appendChild(questionsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    chatBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggested-question')) {
            const nextNodeId = e.target.dataset.next;
            const questionText = e.target.textContent;
            const oldQuestions = chatBody.querySelector('.suggested-questions');
            if(oldQuestions) oldQuestions.remove();
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = questionText;
            chatBody.appendChild(userMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            renderNode(nextNodeId);
        }
    });
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active'); 
        if (chatWindow.classList.contains('active')) {
            chatBody.innerHTML = `
              <div class="chat-message bot">
                Hi there! I'm Ashvin's AI assistant. Please select a topic to learn more.
              </div>
            `;
            renderNode('root');
        }
    });
}

function initPageNavigation() {
    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");
    if (!navigationLinks.length || !pages.length) return;
    for (let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].addEventListener("click", function () {
        let clickedPage = this.innerHTML.toLowerCase();
        for (let j = 0; j < pages.length; j++) {
          if (clickedPage === pages[j].dataset.page) {
            pages[j].classList.add("active");
          } else {
            pages[j].classList.remove("active");
          }
        }
        navigationLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        window.scrollTo(0, 0);
      });
    }
}

function initCaseStudyAccordion() {
  const caseStudyBtns = document.querySelectorAll(".case-study-btn");
  if (!caseStudyBtns.length) {
    console.log("No case study buttons found; skipping accordion init.");
    return;
  }
  caseStudyBtns.forEach(btn => {
    const projectItem = btn.closest('.project-item-no-img');
    if (!projectItem) return;
    const caseStudyContent = projectItem.querySelector(".project-case-study-content");
    if (!caseStudyContent) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('active');
      caseStudyContent.classList.toggle('active');
      const btnText = this.querySelector('span');
      if (this.classList.contains('active')) {
        if (btnText) btnText.textContent = 'Hide Details';
        caseStudyContent.style.maxHeight = caseStudyContent.scrollHeight + "px";
      } else {
        if (btnText) btnText.textContent = 'Case Study';
        caseStudyContent.style.maxHeight = '0px';
      }
    });
  });
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-list .filter-btn");
  const projectItems = document.querySelectorAll(".project-grid .project-item-no-img");
  if (!filterBtns.length || !projectItems.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const filterValue = this.dataset.filter;
            projectItems.forEach(item => {
                const itemCategories = (item.dataset.category || '').split(/\s+/);
        if (filterValue === "all" || itemCategories.includes(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.classList.remove("hidden");
          }, 0);
        } else {
          item.classList.add("hidden");
          setTimeout(() => {
            item.style.display = 'none';
          }, 300); 
        }
      });
    });
  });
}