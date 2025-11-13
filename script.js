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

    initScrollAnimations();
    initTiltEffect();
    initProgressBars();
    initParticleNetwork();
    initAIBg();
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

    const data = [
        { text: "Engineer", isCode: false },
        { text: "import tensorflow as tf", isCode: true },
        { text: "Developer", isCode: false },
        { text: "print('Hello World!')", isCode: true },
        { text: "Robotics Enthusiast", isCode: false },
        { text: "<Coder />", isCode: true }
    ];

    let wordIndex = 0, charIndex = 0, isDeleting = false;
    let currentIsCode = false;

    function type() {
        const currentItem = data[wordIndex];
        const fullText = currentItem.text;

        if (currentItem.isCode !== currentIsCode) {
            currentIsCode = currentItem.isCode;
            if (currentIsCode) {
                target.classList.add('code-mode');
            } else {
                target.classList.remove('code-mode');
            }
        }

        if (isDeleting) {
            target.textContent = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = fullText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100; 
        if (isDeleting) typeSpeed /= 2; 
        if (currentIsCode) typeSpeed = 80; 

        if (!isDeleting && charIndex === fullText.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % data.length;
            typeSpeed = 500; 
        }

        setTimeout(type, typeSpeed);
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

function initAIBg() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.getElementById('ai-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, rafId = null;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const NODE_COUNT = Math.max(12, Math.round((window.innerWidth * window.innerHeight) / 80000));
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            baseSize: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, 'rgba(20,30,60,0.02)');
        g.addColorStop(1, 'rgba(10,10,20,0.02)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        const maxDist = Math.min(width, height) * 0.18;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist) {
                    const alpha = 0.18 * (1 - dist / maxDist);
                    ctx.strokeStyle = `rgba(120,200,255,${alpha})`;
                    ctx.lineWidth = 1 * (1 - dist / maxDist);
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        const time = Date.now() * 0.002;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.phase += 0.002 + (i % 5) * 0.0002;
            const pulse = n.baseSize + Math.sin(time + n.phase) * 0.8;
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(8, pulse * 6));
            gradient.addColorStop(0, 'rgba(120,200,255,0.95)');
            gradient.addColorStop(0.4, 'rgba(120,200,255,0.25)');
            gradient.addColorStop(1, 'rgba(120,200,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(n.x - 20, n.y - 20, 40, 40);

            ctx.beginPath();
            ctx.fillStyle = 'rgba(200,240,255,0.95)';
            ctx.arc(n.x, n.y, Math.max(1, pulse), 0, Math.PI * 2);
            ctx.fill();

            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
        }

        rafId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        clearTimeout(window._aiBgResizeTimer);
        window._aiBgResizeTimer = setTimeout(() => resize(), 120);
    });

    window.addEventListener('mousemove', (e) => {
        const mx = e.clientX, my = e.clientY;
        for (let i = 0; i < Math.min(3, nodes.length); i++) {
            const n = nodes[(i * 7) % nodes.length];
            n.vx += (mx - n.x) * 0.00002;
            n.vy += (my - n.y) * 0.00002;
        }
    });

    start();
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
            'answer': "He has built a Multilingual News Audio Translator (92% accuracy), a GenAI-powered PDF Query app (89% time reduction), and an autonomous Weed Detection Robot (97% accuracy).", // <-- UPDATED with citations
            'questions': [
                { 'text': "How does the Weed Robot work?", 'next': 'projects_2_robot' },
                { 'text': "Tell me about the PDF Query app.", 'next': 'projects_2_pdf' },
                { 'text': "More on the Audio Translator.", 'next': 'projects_2_audio' }
            ]
        },
        'experience_1': {
            'isAnswer': true,
            'answer': "He's a Data Science Intern at Mastermine (Aug 2025-Present) and was a Hardware Systems Intern at Sunlux (Feb-Apr 2024).", // <-- UPDATED with citations
            'questions': [
                { 'text': "What does he do at Mastermine?", 'next': 'experience_2_mastermine' },
                { 'text': "What did he do at Sunlux?", 'next': 'experience_2_sunlux' },
                { 'text': "What's his education?", 'next': 'education_1' }
            ]
        },
        'skills_2_ml': {
            'isAnswer': true,
            'answer': "He's proficient with AI frameworks like PyTorch, TensorFlow, Scikit-learn, Pandas, and NumPy, as well as the Transformers library for NLP.", // <-- UPDATED (added Pandas, NumPy)
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
            'answer': "He co-authored 'A Hybrid Transformer Model Approach for Precision Weed Detection' (2025 ACCESS conference) and has certifications from NPTEL, Infosys, and Coursera (including Google Data Analytics).", // <-- UPDATED (added Coursera/Google)
            'questions': [
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_robot': {
            'isAnswer': true,
            'answer': "It's an AI-powered robot using ROS and a custom EfficientNetV2-Transformer hybrid model (97% accuracy) for eco-friendly herbicide application.", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_pdf': {
            'isAnswer': true,
            'answer': "It's a scalable, voice-enabled PDF query system using NLP and Streamlit, which reduced information retrieval time by over 89%.", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_audio': {
            'isAnswer': true,
            'answer': "A full-stack app using Wav2Vec 2.0 (92% accuracy) for speech recognition and a fine-tuned mBART model for fluent translation.", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_mastermine': {
            'isAnswer': true,
            'answer': "At Mastermine, he's engineering a full-stack desktop app for photographers (Java, React, Electron.js) and designing a multi-agent LLM framework for data analysis.", // <-- UPDATED with citations
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_sunlux': {
            'isAnswer': true,
            'answer': "At Sunlux, he developed and debugged microprocessor programs in Assembly for industrial automation, improving process efficiency by 15%.", // <-- UPDATED with citation
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'education_1': {
            'isAnswer': true,
            'answer': "He's pursuing an M.Tech in AI/ML from Rajagiri (CGPA 9.49) and holds a B.Tech in Robotics from Adi Shankara (CGPA 9.54).", // <-- UPDATED with citations
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
                thinkingDiv.innerHTML = thinkingDiv.innerHTML.replace(/\[(\d+)\]/g, '<sup class="chat-citation">$1</sup>');
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

        navigationLinks.forEach(link => {
                link.addEventListener('click', function () {
                        const clickedPage = this.innerHTML.toLowerCase().trim();

                        pages.forEach(page => {
                                if (clickedPage === page.dataset.page) {
                                        page.classList.add('active');
                                        const heading = page.querySelector('.article-title');
                                        if (heading) {
                                                heading.classList.remove('heading-animate');
                                                void heading.offsetWidth;
                                                heading.classList.add('heading-animate');
                                        }
                                } else {
                                        page.classList.remove('active');
                                }
                        });

                        navigationLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        window.scrollTo(0, 0);
                });
        });
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

function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.service-item, .project-item-no-img, .timeline-item, .h2, .h3, .about-text p, .resume-download-inner'
    );

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-item');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', 
        threshold: 0.0 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach((el, index) => {
        const delay = Math.min(index * 40, 400);
        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);
    });

    elementsToAnimate.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
            el.classList.add('active');
            observer.unobserve(el);
        }
    });

    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    navigationLinks.forEach(link => {
        link.addEventListener("click", () => {
            setTimeout(() => {
                const activePage = document.querySelector("article.active");
                if(activePage) {
                    const newElements = activePage.querySelectorAll('.animate-item');
                    newElements.forEach(el => {
                        el.classList.remove('active'); 
                        observer.observe(el); 
                    });
                }
            }, 100);
        });
    });
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.resume-download-inner');

    cards.forEach(card => {
        card.classList.add('tilt-card'); 

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  

            const xPct = x / rect.width;
            const yPct = y / rect.height;
            
            const xRotation = (0.5 - yPct) * 30; 
            const yRotation = (xPct - 0.5) * 30; 

            card.style.transform = `
                perspective(1000px)
                scale3d(1.05, 1.05, 1.05)
                rotateX(${xRotation}deg)
                rotateY(${yRotation}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `
                perspective(1000px)
                scale3d(1, 1, 1)
                rotateX(0)
                rotateY(0)
            `;
        });
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.project-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.progress-fill');
                const label = entry.target.querySelector('.progress-label span:last-child');
                
                if (label && fill) {
                    const targetWidth = label.textContent.trim();
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 200);
                }
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 

    progressBars.forEach(bar => observer.observe(bar));
}

function initParticleNetwork() {
  if (document.getElementById('sidebar-particles')) {
    particlesJS('sidebar-particles',
      {
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#999999" 
          },
          "shape": {
            "type": "circle",
          },
          "opacity": {
            "value": 0.4,
            "random": true,
          },
          "size": {
            "value": 3,
            "random": true,
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#999999", 
            "opacity": 0.2,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "repulse": {
              "distance": 80,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
          }
        },
        "retina_detect": true
      }
    );
  }
}