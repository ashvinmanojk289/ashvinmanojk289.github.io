'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initPageNavigation();
    initCaseStudyAccordion(); 
    initProjectFilter(); 
    initCertAccordion();
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
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        };

        if (document.readyState === 'complete') {
            requestAnimationFrame(() => doHide());
        } else {
            window.addEventListener('load', () => doHide());
            setTimeout(() => doHide(), 3000);
        }
    }
}

function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return; 
    const cursorContainer = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    if (!cursorContainer || !dot) return;
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
    let lastCursor = 0;
    const CURSOR_FRAME_INTERVAL = 1000 / 45;
    function animateCursor(timestamp) {
        if (!lastCursor) lastCursor = timestamp;
        const elapsed = timestamp - lastCursor;
        if (elapsed >= CURSOR_FRAME_INTERVAL) {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
            lastCursor = timestamp;
        }
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
    document.querySelectorAll('a, button, [data-nav-link], .project-item-no-img, .social-link, .chat-toggle-btn, .suggested-question').forEach(el => {
        el.addEventListener('mouseenter', () => cursorContainer.classList.add('interact'));
        el.addEventListener('mouseleave', () => cursorContainer.classList.remove('interact'));
    });
}

function initTypingEffect() {
    const target = document.querySelector('.typing-effect');
    if (!target) return;
    const words = ["Engineer", "Developer", "Researcher", "Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    function type() {
        const currentWord = words[wordIndex];
        target.textContent = currentWord.substring(0, charIndex);
        let typeSpeed = 100;
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            typeSpeed = 100; 
        } else if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; 
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            typeSpeed = 50; 
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
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
    applyTheme(currentTheme);
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
        applyTheme(currentTheme);
    });
}

function fetchGitHubStats() {
    const username = 'ashvinmanojk289';
    const reposCountEl = document.getElementById('github-repos');
    const starsCountEl = document.getElementById('github-stars');
    const activityListEl = document.getElementById('github-activity');
    if (!reposCountEl) return;
    fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json())
        .then(data => {
            if (reposCountEl) reposCountEl.textContent = data.public_repos || 0;
        })
        .catch(err => console.error("GitHub API Error:", err));
    fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`)
        .then(res => res.json())
        .then(repos => {
            if (!Array.isArray(repos)) return;
            const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            if (starsCountEl) starsCountEl.textContent = stars;
            if (activityListEl) {
                activityListEl.innerHTML = '';
                repos.slice(0, 3).forEach(repo => {
                    const li = document.createElement('li');
                    const date = new Date(repo.pushed_at).toLocaleDateString();
                    li.innerHTML = `<strong>${repo.name}</strong>: Updated on ${date}`;
                    activityListEl.appendChild(li);
                });
            }
        })
        .catch(err => console.error("GitHub API Error:", err));
}

function initAIBg() {
    const canvas = document.getElementById('ai-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let rafId;
    const NODE_COUNT = window.innerWidth < 768 ? 8 : 24;
    const nodes = [];
    let lastDraw = 0;
    const FRAME_INTERVAL = 1000 / 60; 
    let mousePos = { x: -9999, y: -9999 };
    const MAX_CONN_PER_NODE = 4; 
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    function mixAlpha(colorStr, alpha) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const r = isDark ? 255 : 215;
        const g = isDark ? 122 : 59;
        const b = isDark ? 0 : 47;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            baseSize: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2
        });
    }
    function draw() {
        const now = Date.now();
        if (now - lastDraw < FRAME_INTERVAL) {
            rafId = requestAnimationFrame(draw);
            return;
        }
        lastDraw = now;
        ctx.clearRect(0, 0, width, height);
        const maxDist = Math.min(width, height) * 0.2;
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += a.vx;
            a.y += a.vy;
            if (a.x < 0 || a.x > width) a.vx *= -1;
            if (a.y < 0 || a.y > height) a.vy *= -1;
            const time = Date.now() * 0.002;
            const pulse = a.baseSize + Math.sin(time + a.phase) * 0.5;
            ctx.fillStyle = mixAlpha(null, 0.6);
            ctx.beginPath();
            ctx.arc(a.x, a.y, Math.max(0, pulse), 0, Math.PI * 2);
            ctx.fill();
            const mx = mousePos.x;
            const my = mousePos.y;
            if (mx > -9000) {
                const dxm = a.x - mx;
                const dym = a.y - my;
                const distm = Math.hypot(dxm, dym);
                if (distm < 150 && distm > 0.1) {
                    const force = (150 - distm) / 150;
                    a.vx += (dxm / distm) * force * 0.03;
                    a.vy += (dym / distm) * force * 0.03;
                }
            }
            let connections = 0;
            for (let j = i + 1; j < nodes.length; j++) {
                if (connections >= MAX_CONN_PER_NODE) break;
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    ctx.strokeStyle = mixAlpha(null, 0.15 * (1 - dist / maxDist));
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
        rafId = requestAnimationFrame(draw);
    }
    function start() {
        resize();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else {
            if (!rafId) rafId = requestAnimationFrame(draw);
        }
    });
    window.addEventListener('resize', () => {
        resize();
    });
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }, { passive: true });
    start();
}

function initChatAssistant() {
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    const chatWindow = document.querySelector('.chat-window');
    const chatBody = document.querySelector('.chat-body');
    const aiStatus = document.getElementById('ai-status');
    if (!toggleBtn || !chatWindow || !chatBody || !aiStatus) return;
    const conversationTree = {
        'root': {
            'isAnswer': false,
            'questions': [
                { 'text': "What are his top skills?", 'next': 'skills_1' },
                { 'text': "Tell me about his projects.", 'next': 'projects_1' },
                { 'text': "What's his professional experience?", 'next': 'experience_1' },
                { 'text': "What are his achievements?", 'next': 'achievements_1' }
            ]
        },
        'skills_1': {
            'isAnswer': true,
            'answer': "Ashvin specializes in AI/ML, Deep Learning, NLP, Computer Vision, and Robotics. His tech stack includes PyTorch, TensorFlow, ROS, Python, C++, Java, JavaScript, and cloud platforms.",
            'questions': [
                { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
                { 'text': "What programming languages?", 'next': 'skills_2_lang' },
                { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_1': {
            'isAnswer': true,
            'answer': "His key projects include: Alzheimer's Disease Classification (Multimodal Graph Learning), Weed Detection Robot (97% accuracy), Multilingual Audio Translator (92% accuracy), and PDF Query Application.",
            'questions': [
                { 'text': "Alzheimer's Disease project?", 'next': 'projects_2_alzheimers' },
                { 'text': "How does the Weed Robot work?", 'next': 'projects_2_robot' },
                { 'text': "Tell me about the PDF Query app.", 'next': 'projects_2_pdf' },
                { 'text': "More on the Audio Translator.", 'next': 'projects_2_audio' }
            ]
        },
        'experience_1': {
            'isAnswer': true,
            'answer': "Currently a Data Science Intern at Mastermine Technologies (Aug 2025-Present). Previously worked at Sunlux Technovations (Feb-Apr 2024), SMEC Automation, and Sinro Robotics.",
            'questions': [
                { 'text': "What does he do at Mastermine?", 'next': 'experience_2_mastermine' },
                { 'text': "What did he do at Sunlux?", 'next': 'experience_2_sunlux' },
                { 'text': "What's his education?", 'next': 'education_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'skills_2_ml': {
            'isAnswer': true,
            'answer': "He's proficient in Generative AI, LLMs, Computer Vision, NLP, and Prompt Engineering. Frameworks include PyTorch, TensorFlow, Scikit-learn, Transformers, Pandas, NumPy, and Facenet.",
            'questions': [
                { 'text': "What programming languages?", 'next': 'skills_2_lang' },
                { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'skills_2_lang': {
            'isAnswer': true,
            'answer': "Primary languages: Python, C++, C, Java, JavaScript, SQL, R. Also proficient in HTML, CSS, and Assembly language for embedded systems.",
            'questions': [
                { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
                { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'skills_2_robotics': {
            'isAnswer': true,
            'answer': "Experienced with ROS (Robot Operating System), Arduino, industrial automation (PLCs, SCADA, HMI), and KUKA robot control. Also skilled in Git, Linux, Streamlit, Flask, and Electron.js.",
            'questions': [
                { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
                { 'text': "What programming languages?", 'next': 'skills_2_lang' },
                { 'text': "View robotics projects", 'next': 'projects_2_robot' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'achievements_1': {
            'isAnswer': true,
            'answer': "Published 'A Hybrid Transformer Model Approach for Precision Weed Detection' at IEEE ACCESS 2025. Completed certifications in LLMs (NPTEL IIT Madras), Google Data Analytics, GenAI (Google Cloud), and more.",
            'questions': [
                { 'text': "Tell me about the publication", 'next': 'achievements_2_publication' },
                { 'text': "What certifications does he have?", 'next': 'achievements_2_certs' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'achievements_2_publication': {
            'isAnswer': true,
            'answer': "Co-authored with S. Krishnan and M. Karuppasamypandiyan, published in 2025 4th International Conference on ACCESS (DOI: 10.1109/ACCESS65134.2025.11135583). The paper presents a hybrid transformer model for precision weed detection.",
            'questions': [
                { 'text': "What certifications does he have?", 'next': 'achievements_2_certs' },
                { 'text': "See related project", 'next': 'projects_2_robot' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'achievements_2_certs': {
            'isAnswer': true,
            'answer': "Recent certifications: Introduction to LLMs (NPTEL IIT Madras), Software Engineering (IBM), Google Data Analytics, GenAI for UX, GenAI Learning Path (Google Cloud), Prompt Engineering (Infosys), and more from NPTEL and Siemens.",
            'questions': [
                { 'text': "Tell me about the publication", 'next': 'achievements_2_publication' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "View all projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_alzheimers': {
            'isAnswer': true,
            'answer': "An ongoing deep learning project (85% complete) using multimodal graph learning to classify Cognitively Normal (CN), Mild Cognitive Impairment (MCI), and Alzheimer's Disease subjects for early diagnosis.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his AI/ML expertise?", 'next': 'skills_2_ml' },
                { 'text': "What's his education?", 'next': 'education_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_robot': {
            'isAnswer': true,
            'answer': "An autonomous robot using ROS and a custom EfficientNetV2-Transformer hybrid model achieving 97% accuracy for weed detection. Enables precision agriculture and eco-friendly herbicide application.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "View the publication", 'next': 'achievements_2_publication' },
                { 'text': "What's his robotics experience?", 'next': 'skills_2_robotics' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_pdf': {
            'isAnswer': true,
            'answer': "A scalable, voice-enabled PDF query system using NLP and Streamlit that reduced information retrieval time by over 89%. Users can ask natural language questions about PDF documents.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his NLP expertise?", 'next': 'skills_2_ml' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'projects_2_audio': {
            'isAnswer': true,
            'answer': "A full-stack multilingual audio translator using Wav2Vec 2.0 (92% speech recognition accuracy) and fine-tuned mBART for translation. Includes Flask UI and supports multiple languages.",
            'questions': [
                { 'text': "See other projects", 'next': 'projects_1' },
                { 'text': "What's his NLP expertise?", 'next': 'skills_2_ml' },
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_mastermine': {
            'isAnswer': true,
            'answer': "At Mastermine Technologies, he's building a cross-platform desktop app for photographers using Java Spring, React.js, and Electron.js. Also developed an async photo-matching system with RabbitMQ and a multi-agent LLM framework for data insights.",
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What are his AI/ML skills?", 'next': 'skills_2_ml' },
                { 'text': "View his projects", 'next': 'projects_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'experience_2_sunlux': {
            'isAnswer': true,
            'answer': "At Sunlux Technovations, he developed and debugged microprocessor programs in Assembly language for industrial automation, gaining hands-on experience with hardware-level logic and embedded solutions.",
            'questions': [
                { 'text': "See other experience", 'next': 'experience_1' },
                { 'text': "What programming languages?", 'next': 'skills_2_lang' },
                { 'text': "What's his education?", 'next': 'education_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        },
        'education_1': {
            'isAnswer': true,
            'answer': "Currently pursuing M.Tech in Computer Science & Engineering (AI/ML) at Rajagiri School of Engineering (CGPA: 9.49). Holds B.Tech (Honours) in Robotics & Automation from Adi Shankara Institute (CGPA: 9.54).",
            'questions': [
                { 'text': "What's his experience?", 'next': 'experience_1' },
                { 'text': "What are his achievements?", 'next': 'achievements_1' },
                { 'text': "What are his skills?", 'next': 'skills_1' },
                { 'text': "Back to start", 'next': 'root' }
            ]
        }
    };
    aiStatus.textContent = "Ready";
    function renderNode(nodeId) {
        const node = conversationTree[nodeId];
        if (!node) return;
        if (node.isAnswer) {
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'chat-message bot';
            thinkingDiv.innerHTML = '<div class="chat-spinner"></div>'; 
            chatBody.appendChild(thinkingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            setTimeout(() => {
                thinkingDiv.innerHTML = node.answer;
                chatBody.scrollTop = chatBody.scrollHeight;
                showQuestions(node.questions);
            }, 800); 
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
        chatWindow.classList.remove('closing');
        if (!chatWindow.classList.contains('active')) {
            chatWindow.classList.add('active');
            chatBody.innerHTML = `
              <div class="chat-message bot">
                Hi there! I'm Ashvin's AI assistant. Please select a topic to learn more.
              </div>
            `;
            requestAnimationFrame(() => renderNode('root'));
        }
    }
    function closeChat() {
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
  if (!caseStudyBtns.length) return;
  caseStudyBtns.forEach(btn => {
    const projectItem = btn.closest('.project-item-no-img');
    if (!projectItem) return;
    const caseStudyContent = projectItem.querySelector(".project-case-study-content");
    if (!caseStudyContent) return;
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpening = !caseStudyContent.classList.contains('active');
            caseStudyBtns.forEach(otherBtn => {
                const otherProject = otherBtn.closest('.project-item-no-img');
                if (!otherProject) return;
                const otherContent = otherProject.querySelector('.project-case-study-content');
                if (!otherContent) return;
                if (otherBtn === btn) return; 
                otherBtn.classList.remove('active');
                otherBtn.setAttribute('aria-expanded', 'false');
                if (otherContent.style.maxHeight === 'none' || getComputedStyle(otherContent).maxHeight === 'none') {
                    otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                    otherContent.offsetHeight;
                }
                otherContent.style.overflow = 'hidden';
                otherContent.style.maxHeight = '0px';
                otherContent.classList.remove('active');
                const otherText = otherBtn.querySelector('span');
                if (otherText) otherText.textContent = 'Case Study';
            });
            const btnText = this.querySelector('span');
            if (isOpening) {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                caseStudyContent.classList.add('active');
                caseStudyContent.style.maxHeight = caseStudyContent.scrollHeight + "px";
                const csHandler = function (ev) {
                    if (ev.target !== caseStudyContent) return;
                    if (ev.propertyName && ev.propertyName.indexOf('max-height') === -1) return;
                    caseStudyContent.style.maxHeight = 'none';
                    caseStudyContent.removeEventListener('transitionend', csHandler);
                };
                caseStudyContent.addEventListener('transitionend', csHandler);
                if (btnText) btnText.textContent = 'Hide Details';
            } else {
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                caseStudyContent.classList.remove('active');
                if (caseStudyContent.style.maxHeight === 'none' || getComputedStyle(caseStudyContent).maxHeight === 'none') {
                    caseStudyContent.style.maxHeight = caseStudyContent.scrollHeight + 'px';
                    caseStudyContent.offsetHeight;
                }
                caseStudyContent.style.overflow = 'hidden';
                caseStudyContent.style.maxHeight = '0px';
                if (btnText) btnText.textContent = 'Case Study';
            }
        });
  });
}

function initCertAccordion() {
    const certBtns = document.querySelectorAll('.cert-toggle-btn');
    if (!certBtns.length) return;
    certBtns.forEach(btn => {
        const certItem = btn.closest('.cert-item');
        if (!certItem) return;
        const content = certItem.querySelector('.cert-content');
        if (!content) return;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpening = !content.classList.contains('active');
            certBtns.forEach(otherBtn => {
                if (otherBtn === btn) return;
                const otherItem = otherBtn.closest('.cert-item');
                if (!otherItem) return;
                const otherContent = otherItem.querySelector('.cert-content');
                if (!otherContent) return;
                otherBtn.classList.remove('active');
                otherBtn.setAttribute('aria-expanded', 'false');
                if (otherContent.style.maxHeight === 'none' || getComputedStyle(otherContent).maxHeight === 'none') {
                    otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                    otherContent.offsetHeight;
                }
                otherContent.style.overflow = 'hidden';
                otherContent.style.maxHeight = '0px';
                otherContent.classList.remove('active');
            });
            btn.classList.toggle('active', isOpening);
            btn.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
            if (isOpening) {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.overflow = 'hidden';
                const certHandler = function (ev) {
                    if (ev.target !== content) return;
                    if (ev.propertyName && ev.propertyName.indexOf('max-height') === -1) return;
                    content.style.maxHeight = 'none';
                    content.style.overflow = 'visible';
                    certItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    content.removeEventListener('transitionend', certHandler);
                };
                content.addEventListener('transitionend', certHandler);
            } else {
                content.classList.remove('active');
                if (content.style.maxHeight === 'none' || getComputedStyle(content).maxHeight === 'none') {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.offsetHeight;
                }
                content.style.overflow = 'hidden';
                content.style.maxHeight = '0px';
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

function initSwipeNavigation() {
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
    if (!navLinks.length) return;
    const threshold = 60; 
    const restraint = 80; 
    const allowedTime = 600; 
    let startX = 0, startY = 0, startTime = 0;
    function handleSwipe(direction) {
        let activeIndex = navLinks.findIndex(n => n.classList.contains('active'));
        if (activeIndex === -1) activeIndex = 0;
        let targetIndex = activeIndex;
        if (direction === 'left') targetIndex = Math.min(navLinks.length - 1, activeIndex + 1);
        if (direction === 'right') targetIndex = Math.max(0, activeIndex - 1);
        if (targetIndex !== activeIndex) {
            navLinks[targetIndex].click();
        }
    }
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
}