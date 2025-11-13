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
        initAIBg();
        initSwipeNavigation();
});

function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        let hidden = false;
        const doHide = () => {
            if (hidden) return;
            hidden = true;
            spinner.classList.add('hidden');
        };

        // Hide as soon as the document is interactive and we get a paint
        if (document.readyState === 'complete') {
            // already loaded
            requestAnimationFrame(() => doHide());
        } else {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    // next paint
                    requestAnimationFrame(() => doHide());
                }
            });
            // also hide on full load
            window.addEventListener('load', () => doHide());
        }

        // Fallback: ensure spinner hides after 1500ms even if load hasn't fired
        setTimeout(() => doHide(), 1500);
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
            ctx.clearRect(0, 0, width, height);

            const cs = getComputedStyle(document.documentElement);
            const nodeColor = (cs.getPropertyValue('--ai-node-color') || 'rgba(120,200,255,0.95)').trim();
            const lineColor = (cs.getPropertyValue('--ai-line-color') || 'rgba(120,200,255,0.18)').trim();

            // background soft gradient overlay (subtle, using node color at very low alpha)
            const g = ctx.createLinearGradient(0, 0, width, height);
            g.addColorStop(0, hexOrColorWithAlpha(nodeColor, 0.03));
            g.addColorStop(1, hexOrColorWithAlpha(nodeColor, 0.02));
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, width, height);

            // draw connections
            const maxDist = Math.min(width, height) * 0.18;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist);
                        ctx.strokeStyle = mixAlpha(lineColor, alpha);
                        ctx.lineWidth = Math.max(0.3, 1 * (1 - dist / maxDist));
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // draw nodes (pulsing)
            const time = Date.now() * 0.002;
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.phase += 0.002 + (i % 5) * 0.0002;
                const pulse = n.baseSize + Math.sin(time + n.phase) * 0.8;
                // glow
                ctx.beginPath();
                const rg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(8, pulse * 6));
                rg.addColorStop(0, mixAlpha(nodeColor, 1));
                rg.addColorStop(0.4, mixAlpha(nodeColor, 0.25));
                rg.addColorStop(1, mixAlpha(nodeColor, 0));
                ctx.fillStyle = rg;
                ctx.fillRect(n.x - 20, n.y - 20, 40, 40);

                // small center dot
                ctx.beginPath();
                ctx.fillStyle = mixAlpha(nodeColor, 1);
                ctx.arc(n.x, n.y, Math.max(1, pulse), 0, Math.PI * 2);
                ctx.fill();

                // update positions
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;
            }

            rafId = requestAnimationFrame(draw);
    const nodes = [];

        // helper: try to mix alpha into color string. If color is rgba(...) replace alpha, if hex/hsl just return as-is with a wrapper using globalAlpha fallback.
        function mixAlpha(colorStr, alpha) {
            colorStr = (colorStr || '').trim();
            if (!colorStr) return `rgba(120,200,255,${alpha})`;
            if (colorStr.startsWith('rgba')) {
                // replace last value
                return colorStr.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${alpha.toFixed(3)})`);
            }
            if (colorStr.startsWith('rgb(')) {
                return colorStr.replace('rgb(', 'rgba(').replace(')', `,${alpha.toFixed(3)})`);
            }
            // fallback: return color string (canvas will use it) but we can't change alpha reliably
            return colorStr;
        }

        function hexOrColorWithAlpha(colorStr, alpha) {
            // if color is rgba or rgb, convert accordingly
            colorStr = (colorStr || '').trim();
            if (!colorStr) return `rgba(120,200,255,${alpha})`;
            if (colorStr.startsWith('rgba')) return colorStr.replace(/rgba\(([^)]+)\)/, `rgba($1)`).replace(/,\s*[^,^)]+\)$/, `, ${alpha})`);
            if (colorStr.startsWith('rgb(')) return colorStr.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
            // else return color with alpha applied in a simple way (may not always be valid for hex)
            return colorStr;
        }
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
    function openChat() {
        // ensure any pending closing state removed
        chatWindow.classList.remove('closing');
        if (!chatWindow.classList.contains('active')) {
            chatWindow.classList.add('active');
            chatBody.innerHTML = `
              <div class="chat-message bot">
                Hi there! I'm Ashvin's AI assistant. Please select a topic to learn more.
              </div>
            `;
            // small timeout to allow active class to apply before rendering conversation
            requestAnimationFrame(() => renderNode('root'));
        }
    }

    function closeChat() {
        // add closing state to animate out
        if (!chatWindow.classList.contains('active')) return;
        chatWindow.classList.add('closing');
        chatWindow.classList.remove('active');
        function onTransitionEnd(e) {
            if (e.target !== chatWindow) return;
            chatWindow.classList.remove('closing');
            chatWindow.removeEventListener('transitionend', onTransitionEnd);
        }
        chatWindow.addEventListener('transitionend', onTransitionEnd);
    }

    toggleBtn.addEventListener('click', () => {
        if (chatWindow.classList.contains('active')) {
            closeChat();
        } else {
            openChat();
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

/* Swipe left/right to navigate between sections (touch and pointer) */
function initSwipeNavigation() {
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
    if (!navLinks.length) return;

    const threshold = 60; // minimum px for a swipe
    const restraint = 80; // maximum vertical deviation allowed
    const allowedTime = 600; // max time allowed to consider it a swipe

    let startX = 0, startY = 0, startTime = 0;

    function handleSwipe(direction) {
        // find current active index
        let activeIndex = navLinks.findIndex(n => n.classList.contains('active'));
        if (activeIndex === -1) activeIndex = 0;
        let targetIndex = activeIndex;
        if (direction === 'left') targetIndex = Math.min(navLinks.length - 1, activeIndex + 1);
        if (direction === 'right') targetIndex = Math.max(0, activeIndex - 1);
        if (targetIndex !== activeIndex) {
            // simulate click to reuse existing navigation logic
            navLinks[targetIndex].click();
        }
    }

    // Touch events
    window.addEventListener('touchstart', function(e) {
        const t = e.changedTouches[0];
        startX = t.pageX;
        startY = t.pageY;
        startTime = new Date().getTime();
    }, { passive: true });

    window.addEventListener('touchend', function(e) {
        const t = e.changedTouches[0];
        const distX = t.pageX - startX;
        const distY = t.pageY - startY;
        const elapsed = new Date().getTime() - startTime;
        if (elapsed <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX < 0) handleSwipe('left'); else handleSwipe('right');
        }
    }, { passive: true });

    // Pointer events fallback (for some devices/browsers)
    let pDown = false;
    window.addEventListener('pointerdown', function(e) {
        if (e.pointerType !== 'touch') return;
        pDown = true;
        startX = e.pageX; startY = e.pageY; startTime = new Date().getTime();
    });
    window.addEventListener('pointerup', function(e) {
        if (!pDown) return; pDown = false;
        if (e.pointerType !== 'touch') return;
        const distX = e.pageX - startX;
        const distY = e.pageY - startY;
        const elapsed = new Date().getTime() - startTime;
        if (elapsed <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX < 0) handleSwipe('left'); else handleSwipe('right');
        }
    });

}