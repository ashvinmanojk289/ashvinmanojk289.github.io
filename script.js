'use strict';

// --- Master Function to Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initialize all features ---
    initPageNavigation();
    initSidebarToggle();
    initPortfolioModals();
    
    initLoadingSpinner();
    initCustomCursor();
    initTypingEffect();
    initCurrentYear();
    initThemeSwitcher();
    
    fetchGitHubStats(); // This is async, fine to call here
    initChatAssistant(); // This is also self-contained
});


// --- Feature 1: Loading Spinner (New) ---
function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        // Hide spinner once the main content is loaded
        window.addEventListener('load', () => {
            spinner.classList.add('hidden');
        });
    }
}

// --- Feature 2: Custom Cursor (New) ---
function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return; // No cursor on touch devices

    const cursorContainer = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (!cursorContainer || !dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.9; dotY += (mouseY - dotY) * 0.9;
        ringX += (mouseX - ringX) * 0.25; ringY += (mouseY - ringY) * 0.25;

        if (dot && ring) {
          dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
          ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Select all interactive elements
    document.querySelectorAll('a, button, [data-nav-link], [data-sidebar-btn], .project-item, .social-link, .chat-toggle-btn, .suggested-question').forEach(el => {
        el.addEventListener('mouseenter', () => cursorContainer.classList.add('interact'));
        el.addEventListener('mouseleave', () => cursorContainer.classList.remove('interact'));
    });
}

// --- Feature 3: Typing Effect (New) ---
function initTypingEffect() {
    const target = document.querySelector('.typing-effect');
    if (!target) return;
    
    // Words from your original site, slightly adapted
    const words = ["AI/ML Engineer", "Robotics Enthusiast", "Deep Learning Dev", "PG Student"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        if (!target) return; // Safeguard
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

// --- Feature 4: Current Year (New) ---
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// --- Feature 5: Theme Switcher (New) ---
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    
    if (!sunIcon || !moonIcon) return;

    // Helper function to apply the theme and update icons/storage
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
        // Save the user's preference
        localStorage.setItem('theme', theme);
    }

    // Event listener for the toggle button
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // On page load, check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);
}


// --- Feature 6: (Existing) GitHub Stats ---
async function fetchGitHubStats() {
  try {
    const response = await fetch(`https://api.github.com/users/ashvinmanojk289/repos?sort=pushed&per_page=5`);
    if (!response.ok) throw new Error('GitHub API repo request failed');
    const repos = await response.json();

    const userResponse = await fetch(`https://api.github.com/users/ashvinmanojk289`);
    if (!userResponse.ok) throw new Error('GitHub API user request failed');
    const userData = await userResponse.json();

    const allReposResponse = await fetch(userData.repos_url + '?per_page=100');
    if (!allReposResponse.ok) throw new Error('GitHub API all repos request failed');
    const allRepos = await allReposResponse.json();

    const reposEl = document.getElementById('github-repos');
    const starsEl = document.getElementById('github-stars');
    const activityList = document.getElementById('github-activity');

    if (reposEl) reposEl.textContent = userData.public_repos || 0;
    if (starsEl) starsEl.textContent = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    if (activityList) {
        activityList.innerHTML = repos.slice(0, 3).map(repo => `<li class="timeline-item-bullet">Pushed to <strong>${repo.name}</strong></li>`).join('');
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    const activityList = document.getElementById('github-activity');
    if(activityList) {
        activityList.innerHTML = '<li class="timeline-item-bullet">Could not fetch data.</li>';
    }
  }
}

// --- Feature 7: (Existing) Chat Assistant ---
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
            'answer': "He has built a Multilingual News Audio Translator (92% accuracy), a GenAI-powered PDF Query app, and an autonomous Weed Detection Robot (97% accuracy).",
            'questions': [
                { 'text': "How does the Weed Robot work?", 'next': 'projects_2_robot' },
                { 'text': "Tell me about the PDF Query app.", 'next': 'projects_2_pdf' },
                { 'text': "More on the Audio Translator.", 'next': 'projects_2_audio' }
            ]
        },
        'experience_1': {
            'isAnswer': true,
            'answer': "He's a Data Science Intern at Mastermine (Aug 2025-Present) and was a Hardware Systems Intern at Sunlux (Feb-Apr 2024).",
            'questions': [
                { 'text': "What does he do at Mastermine?", 'next': 'experience_2_mastermine' },
                { 'text': "What did he do at Sunlux?", 'next': 'experience_2_sunlux' },
                { 'text': "What's his education?", 'next': 'education_1' }
            ]
        },
        'skills_2_ml': {
            'isAnswer': true,
            'answer': "He's proficient with AI frameworks like PyTorch, TensorFlow, and Scikit-learn, as well as the Transformers library for NLP.",
            'questions': [
                { 'text': "See other skills", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'skills_2_lang': {
            'isAnswer': true,
            'answer': "His main languages are Python, C++, C, SQL, and R.",
            'questions': [
                { 'text': "See other skills", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'achievements_1': {
            'isAnswer': true,
            'answer': "He co-authored 'A Hybrid Transformer Model Approach for Precision Weed Detection' (2025 ACCESS conference) and has certifications from Google, NPTEL, and Infosys.",
            'questions': [
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_robot': {
            'isAnswer': true,
            'answer': "It's an AI-powered robot using ROS and a custom EfficientNetV2-Transformer hybrid model (97% accuracy) for eco-friendly herbicide application.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_pdf': {
            'isAnswer': true,
            'answer': "It's a scalable, voice-enabled PDF query system using NLP and Streamlit, which reduced information retrieval time by over 89%.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_audio': {
            'isAnswer': true,
            'answer': "A full-stack app using Wav2Vec 2.0 (92% accuracy) for speech recognition and a fine-tuned mBART model for fluent translation.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_mastermine': {
            'isAnswer': true,
            'answer': "At Mastermine, he's engineering a full-stack desktop app for photographers (Java, React, Electron.js) and designing a multi-agent LLM framework for data analysis.",
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_sunlux': {
            'isAnswer': true,
            'answer': "At Sunlux, he developed and debugged microprocessor programs in Assembly for industrial automation, improving process efficiency by 15%.",
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'education_1': {
            'isAnswer': true,
            'answer': "He's pursuing an M.Tech in AI/ML from Rajagiri (CGPA 9.49) and holds a B.Tech in Robotics from Adi Shankara (CGPA 9.54).",
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
            thinkingDiv.innerHTML = '<span class="thinking-indicator"></span>';
            chatBody.appendChild(thinkingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                thinkingDiv.innerHTML = node.answer;
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

// --- Feature 8: (Original vcard) Page Navigation ---
function initPageNavigation() {
    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    if (!navigationLinks.length || !pages.length) return;

    for (let i = 0; i < navigationLinks.length; i++) {
      navigationLinks[i].addEventListener("click", function () {

        for (let j = 0; j < pages.length; j++) {
          if (navigationLinks[i].innerHTML.toLowerCase() === pages[j].dataset.page) {
            pages[j].classList.add("active");
            navigationLinks[i].classList.add("active");
            window.scrollTo(0, 0);
          } else {
            pages[j].classList.remove("active");
            navigationLinks[i].classList.remove("active");
          }
        }
      });
    }
}

// --- Feature 9: (Original vcard) Sidebar Toggle ---
function initSidebarToggle() {
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");
    
    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", function () { 
            sidebar.classList.toggle("active"); 
        });
    }
}

// --- Feature 10: (Original vcard) Portfolio Modals ---
function initPortfolioModals() {
    const projectItems = document.querySelectorAll(".project-item");
    const modalContainer = document.querySelector("[data-modal-container]");
    const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
    const overlay = document.querySelector("[data-overlay]");

    if (!modalContainer || !modalCloseBtn || !overlay || !projectItems.length) return;

    const portfolioModalFunc = function () {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }

    projectItems.forEach(item => {
      item.addEventListener("click", function (e) {
        e.preventDefault(); // Stop link behavior
        
        const title = item.querySelector(".project-title").innerText;
        const category = item.querySelector(".project-category").innerText;
        const description = item.querySelector(".project-modal-description").innerHTML;
        
        const modalTitle = modalContainer.querySelector(".modal-title");
        let modalTextElement = modalContainer.querySelector('.modal-content p');
        
        if (modalTitle) modalTitle.innerText = title;

        if (!modalTextElement) {
            modalTextElement = document.createElement('p');
            if (modalTitle) modalTitle.after(modalTextElement);
        }
        
        modalTextElement.innerHTML = `<strong>${category}</strong><br><br>${description}`;

        portfolioModalFunc();
      });
    });

    modalCloseBtn.addEventListener("click", portfolioModalFunc);
    overlay.addEventListener("click", portfolioModalFunc);
}