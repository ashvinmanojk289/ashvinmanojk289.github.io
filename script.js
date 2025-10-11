document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Background Initialization ---
    function init3DBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || !window.THREE) return;
        // Set canvas to cover the viewport
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        // Three.js setup
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x181c20, 1); // dark background
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        // Add animated geometry (e.g., floating spheres)
        const spheres = [];
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0x00bfff, metalness: 0.7, roughness: 0.2 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 4
            );
            scene.add(sphere);
            spheres.push(sphere);
        }
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00bfff, 1, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);
        // Animate
        function animate() {
            requestAnimationFrame(animate);
            spheres.forEach((sphere, i) => {
                sphere.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
                sphere.position.x += Math.cos(Date.now() * 0.001 + i) * 0.001;
                sphere.rotation.x += 0.005;
                sphere.rotation.y += 0.005;
            });
            renderer.render(scene, camera);
        }
        animate();
        // Responsive resize
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    }

    init3DBackground();
    // --- Loading Spinner Logic ---
    const spinner = document.getElementById('loadingSpinner');
    window.addEventListener('beforeunload', () => {
        spinner.classList.add('active');
    });
    window.addEventListener('load', () => {
        spinner.classList.remove('active');
    });
    // --- Scroll-to-Top Button Logic ---
    const scrollBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Master Initialization ---
    initTheme();
    initCurrentYear();
    initMobileNav();
    initHeaderScroll();
    initScrollSpy();
    initIntersectionObserver();
    initCustomCursor();
    initTypingEffect();
    initProjectFilter();
    init3DTiltEffect();
    initModals();
    initChatAssistant();
    initCommandPalette();
    fetchGitHubStats();

    // --- Theme Toggler ---
    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        const iconSun = document.getElementById('theme-icon-sun');
        const iconMoon = document.getElementById('theme-icon-moon');
        const profileImg = document.getElementById('profile-img');
        const currentTheme = localStorage.getItem('theme') || 'lab';
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'lab') {
            iconSun.classList.remove('hidden');
            iconMoon.classList.add('hidden');
            if (profileImg) profileImg.src = 'assets/profile-light.jpg';
        } else {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
            if (profileImg) profileImg.src = 'assets/profile-dark.jpg';
        }
        themeBtn.addEventListener('click', function() {
            triggerTransformersTransition();
        });
    }

    // --- Simple Elegant Theme Transition ---
    function triggerTransformersTransition() {
        const isLab = document.documentElement.getAttribute('data-theme') === 'lab';
        
        if (document.querySelector('.theme-transition')) return;
        
        document.body.classList.add('theme-switching');
        
        const transitionContainer = document.createElement('div');
        transitionContainer.className = 'theme-transition';
        
        const curtain = document.createElement('div');
        curtain.className = 'transition-curtain';
        transitionContainer.appendChild(curtain);
        
        const ripple = document.createElement('div');
        ripple.className = 'transition-ripple';
        transitionContainer.appendChild(ripple);
        
        document.body.appendChild(transitionContainer);
        
        setTimeout(() => {
            const iconSun = document.getElementById('theme-icon-sun');
            const iconMoon = document.getElementById('theme-icon-moon');
            const profileImg = document.getElementById('profile-img');
            
            if (isLab) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                iconSun.classList.add('hidden');
                iconMoon.classList.remove('hidden');
                if (profileImg) profileImg.src = 'assets/profile-dark.jpg';
            } else {
                document.documentElement.setAttribute('data-theme', 'lab');
                localStorage.setItem('theme', 'lab');
                iconSun.classList.remove('hidden');
                iconMoon.classList.add('hidden');
                if (profileImg) profileImg.src = 'assets/profile-light.jpg';
            }
        }, 400); 
        
        setTimeout(() => {
            transitionContainer.remove();
            document.body.classList.remove('theme-switching');
        }, 800);
    }

    // --- Dynamic Copyright Year ---
    function initCurrentYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Navigation Toggle ---
    function initMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // --- Header Hide/Show on Scroll ---
    function initHeaderScroll() {
        const header = document.querySelector('.top-header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (lastScrollY < window.scrollY && window.scrollY > 100) {
                header.style.top = '-80px';
            } else {
                header.style.top = '0';
            }
            lastScrollY = window.scrollY;

            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 15px var(--shadow-color)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // --- Scroll Spy for Active Nav Link Highlighting ---
    function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        const sections = document.querySelectorAll('.section');
        const setActiveLink = () => {
            let currentId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    currentId = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', setActiveLink);
        setActiveLink();
    }

    // --- Animate Elements on Scroll ---
    function initIntersectionObserver() {
        let lastScrollY = window.scrollY;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    let direction = (window.scrollY > lastScrollY) ? 'down' : 'up';
                    if (entry.target.classList.contains('fade-in')) {
                        entry.target.classList.add(direction === 'down' ? 'fade-in-up' : 'fade-in-down');
                    }
                    if (entry.target.classList.contains('slide-in-left')) {
                        entry.target.classList.add(direction === 'down' ? 'slide-in-left-up' : 'slide-in-left-down');
                    }
                    if (entry.target.classList.contains('slide-in-right')) {
                        entry.target.classList.add(direction === 'down' ? 'slide-in-right-up' : 'slide-in-right-down');
                    }
                    if (entry.target.classList.contains('scale-up')) {
                        entry.target.classList.add(direction === 'down' ? 'scale-up-up' : 'scale-up-down');
                    }
                    if (entry.target.classList.contains('shadow-pop')) {
                        entry.target.classList.add(direction === 'down' ? 'shadow-pop-up' : 'shadow-pop-down');
                    }
                } else {
                    entry.target.classList.remove(
                        'visible',
                        'fade-in-up', 'fade-in-down',
                        'slide-in-left-up', 'slide-in-left-down',
                        'slide-in-right-up', 'slide-in-right-down',
                        'scale-up-up', 'scale-up-down',
                        'shadow-pop-up', 'shadow-pop-down'
                    );
                }
            });
            lastScrollY = window.scrollY;
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // --- Custom Cursor Effect ---
    function initCustomCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY, outlineX = mouseX, outlineY = mouseY;
        // Particle trail
        const trailCount = 12;
        const trail = [];
        for (let i = 0; i < trailCount; i++) {
            const el = document.createElement('div');
            el.className = 'cursor-trail';
            el.style.position = 'fixed';
            el.style.width = '6px';
            el.style.height = '6px';
            el.style.borderRadius = '50%';
            el.style.background = 'rgba(0,191,255,0.5)';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9998';
            document.body.appendChild(el);
            trail.push({el, x: mouseX, y: mouseY});
        }
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateCursor() {
            // Smooth follow
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            // Animate trail
            let prevX = dotX, prevY = dotY;
            trail.forEach((t, i) => {
                t.x += (prevX - t.x) * 0.3;
                t.y += (prevY - t.y) * 0.3;
                t.el.style.left = `${t.x}px`;
                t.el.style.top = `${t.y}px`;
                t.el.style.opacity = `${1 - i / trailCount}`;
                prevX = t.x;
                prevY = t.y;
            });
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        document.querySelectorAll('a, button, .switch, .filter-btn, .slider, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    // --- Hero Section Typing Animation ---
    function initTypingEffect() {
        const target = document.querySelector('.typing-effect');
        if (!target) return;
        const words = ["Robotics", "Natural Language Processing", "Computer Vision", "the Real World"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentWord = words[wordIndex];
            target.textContent = currentWord.substring(0, charIndex);
            if (isDeleting) charIndex--; else charIndex++;
            if (!isDeleting && charIndex === currentWord.length) { setTimeout(() => isDeleting = true, 2000); } 
            else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
            setTimeout(type, isDeleting ? 75 : 150);
        }
        type();
    }

    // --- Fetch Live Data from GitHub API ---
    async function fetchGitHubStats() {
        try {
            const user = 'ashvinmanojk289';
            const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`);
            const repos = await repoResponse.json();
            const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            document.getElementById('github-repos').textContent = repos.length;
            document.getElementById('github-stars').textContent = totalStars;
            const activityList = document.getElementById('github-activity');
            activityList.innerHTML = repos.slice(0, 3).map(repo => `<li>Pushed to <strong>${repo.name}</strong></li>`).join('');
        } catch (error) { 
            console.error('Failed to fetch GitHub stats:', error);
            document.getElementById('github-activity').innerHTML = '<li>Could not fetch data.</li>';
        }
    }

    // --- Project Category Filtering Logic ---
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                projectCards.forEach(card => {
                    card.classList.add('hidden');
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        card.classList.remove('hidden');
                    }
                });
            });
        });
    }

    // --- 3D Tilt Effect for Project Cards ---
    function init3DTiltEffect() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 10;
                const rotateY = (rect.width / 2 - x) / 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');
        });
    }

    // --- Accessible Modal Logic (with Focus Trapping) ---
    function initModals() {
        const openModalButtons = document.querySelectorAll('.open-modal-btn');
        const closeModalButtons = document.querySelectorAll('.close-modal-btn');
        const modalOverlay = document.querySelector('.modal-overlay');
        let activeModal = null, lastFocusedElement = null;

        const openModal = (modal, button) => {
            lastFocusedElement = button;
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            activeModal = modal;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
            const focusableElements = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) focusableElements[0].focus();
        };

        const closeModal = () => {
            if (!activeModal) return;
            activeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
            activeModal = null;
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key !== 'Tab' || !activeModal) return;
            const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); } 
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        };
        
        openModalButtons.forEach(button => button.addEventListener('click', () => openModal(document.getElementById(button.dataset.modalTarget), button)));
        closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // --- AI Chat Assistant Widget Logic ---
    function initChatAssistant() {
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        const chatWindow = document.querySelector('.chat-window');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        
        toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
        sendBtn.addEventListener('click', () => handleChatMessage());
        input.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleChatMessage(); });

        // Professional Q&A logic
        const allQuestions = [
            {
                text: "What are Ashvin Manoj’s top technical skills?",
                followups: [
                    "What programming languages does Ashvin use most?",
                    "What cloud and DevOps tools is Ashvin proficient with?",
                    "How does Ashvin use NLP in his work?"
                ]
            },
            {
                text: "Can you describe Ashvin’s experience with robotics?",
                followups: [
                    "What are Ashvin’s most notable robotics projects?",
                    "How has Ashvin applied computer vision in robotics?",
                    "What tools does Ashvin use for robotics?"
                ]
            },
            {
                text: "What professional experience does Ashvin have?",
                followups: [
                    "What is Ashvin’s educational background?",
                    "What awards or achievements has Ashvin received?",
                    "How can I contact Ashvin or view his profiles?"
                ]
            },
            {
                text: "What are Ashvin’s most notable AI/ML projects?",
                followups: [
                    "How has Ashvin applied deep learning in real-world scenarios?",
                    "Can you tell me about Ashvin’s work with computer vision?",
                    "What programming languages does Ashvin use most?"
                ]
            },
            {
                text: "How has Ashvin applied deep learning in real-world scenarios?",
                followups: [
                    "What are Ashvin’s most notable AI/ML projects?",
                    "How does Ashvin use NLP in his work?",
                    "What cloud and DevOps tools is Ashvin proficient with?"
                ]
            },
            {
                text: "What is Ashvin’s educational background?",
                followups: [
                    "What awards or achievements has Ashvin received?",
                    "What professional experience does Ashvin have?",
                    "How can I contact Ashvin or view his profiles?"
                ]
            },
            {
                text: "What awards or achievements has Ashvin received?",
                followups: [
                    "What is Ashvin’s educational background?",
                    "What professional experience does Ashvin have?",
                    "What are Ashvin’s most notable AI/ML projects?"
                ]
            },
            {
                text: "How does Ashvin use NLP in his work?",
                followups: [
                    "How has Ashvin applied deep learning in real-world scenarios?",
                    "What cloud and DevOps tools is Ashvin proficient with?",
                    "Can you tell me about Ashvin’s work with computer vision?"
                ]
            },
            {
                text: "What cloud and DevOps tools is Ashvin proficient with?",
                followups: [
                    "What programming languages does Ashvin use most?",
                    "How does Ashvin use NLP in his work?",
                    "What are Ashvin’s top technical skills?"
                ]
            },
            {
                text: "Can you tell me about Ashvin’s work with computer vision?",
                followups: [
                    "How has Ashvin applied deep learning in real-world scenarios?",
                    "What are Ashvin’s most notable AI/ML projects?",
                    "What tools does Ashvin use for robotics?"
                ]
            },
            {
                text: "What programming languages does Ashvin use most?",
                followups: [
                    "What cloud and DevOps tools is Ashvin proficient with?",
                    "What are Ashvin’s top technical skills?",
                    "How does Ashvin use NLP in his work?"
                ]
            },
            {
                text: "How can I contact Ashvin or view his profiles?",
                followups: [
                    "What is Ashvin’s educational background?",
                    "What awards or achievements has Ashvin received?",
                    "What professional experience does Ashvin have?"
                ]
            }
        ];

        let qaRound = 0;
        let lastChoiceIdx = null;
        function showSuggestedQuestions(questions) {
            const container = document.createElement('div');
            container.className = 'suggested-questions';
            questions.forEach((q, idx) => {
                const btn = document.createElement('button');
                btn.className = 'suggested-question';
                btn.textContent = q.text || q;
                btn.dataset.idx = idx;
                container.appendChild(btn);
            });
            document.querySelector('.chat-body').appendChild(container);
        }

        // Initial 3 questions
        showSuggestedQuestions(allQuestions.slice(0, 3));

        document.querySelector('.chat-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('suggested-question')) {
                const idx = e.target.dataset.idx;
                const questionObj = qaRound === 0 ? allQuestions[idx] : allQuestions[lastChoiceIdx].followups[idx];
                const questionText = questionObj.text || questionObj;
                input.value = questionText;
                handleChatMessage(questionText);
                e.target.parentElement.remove();
                qaRound++;
                if (qaRound <= 3) {
                    if (qaRound === 1) lastChoiceIdx = idx;
                    // Show next 3 followups
                    showSuggestedQuestions((qaRound === 1 ? allQuestions[lastChoiceIdx].followups : allQuestions[lastChoiceIdx].followups));
                }
            }
        });
    }

    // --- Handles Sending and Receiving Chat Messages (NO API) ---
    function handleChatMessage(predefinedMessage = null) {
        const input = document.getElementById('chat-input');
        const message = predefinedMessage || input.value.trim();
        if (!message) return;

        const chatBody = document.querySelector('.chat-body');
        
        // 1. Display User's Message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        chatBody.appendChild(userMessageDiv);
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // 2. Show custom loading overlay
        const loadingOverlay = document.getElementById('chat-loading-overlay');
        loadingOverlay.classList.add('active');
        // Also show a thinking indicator in chat
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-message bot';
        thinkingDiv.innerHTML = '<span class="thinking-indicator"></span>';
        chatBody.appendChild(thinkingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        // 3. Find a response from our local knowledge base
        setTimeout(() => {
            const response = findResponse(message);
            thinkingDiv.innerHTML = response;
            chatBody.scrollTop = chatBody.scrollHeight;
            loadingOverlay.classList.remove('active');
        }, 1000);
    }

    // --- Our Local "Knowledge Base" and Matching Logic ---
    function findResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        const knowledgeBase = {
            greeting: {
                keywords: ['hello', 'hi', 'hey'],
                answer: "Hello! How can I assist you with information about Ashvin Manoj's professional journey, skills, and achievements?"
            },
            skills: {
                keywords: ['skills', 'tech', 'technologies', 'proficient', 'stack'],
                answer: "Ashvin Manoj’s top technical skills include Python, PyTorch, TensorFlow, and ROS for robotics. He is also highly proficient in cloud platforms (AWS), Docker, Git, and advanced deep learning frameworks."
            },
            projects: {
                keywords: ['projects', 'work', 'built'],
                answer: "Ashvin has led and contributed to several impactful projects, such as a Multilingual News Audio Translator, an autonomous Weed Detection and Spraying Robot, and a PDF Query Application powered by Generative AI. Each project demonstrates his expertise in AI, ML, and robotics."
            },
            robotics: {
                keywords: ['robotics', 'robot'],
                answer: "Ashvin’s robotics experience includes developing an autonomous robot for weed detection and spraying in agriculture, integrating computer vision and ROS, and building a Quadruped Emoji Bot with Arduino and Bluetooth control."
            },
            experience: {
                keywords: ['experience', 'intern', 'job', 'work'],
                answer: "Ashvin’s professional experience spans AI/ML engineering, research internships, and hands-on robotics development. He has worked on both academic and industry projects, consistently delivering innovative solutions."
            },
            education: {
                keywords: ['education', 'degree', 'mtech', 'school', 'rajagiri'],
                answer: "Ashvin is currently pursuing an M.Tech at Rajagiri School of Engineering and Technology, specializing in artificial intelligence, machine learning, and robotics."
            },
            awards: {
                keywords: ['award', 'achievement', 'recognition'],
                answer: "Ashvin has received multiple awards for his work in AI and robotics, including recognition for his autonomous weed detection robot and multilingual news translator. His projects have been celebrated for innovation and real-world impact."
            },
            nlp: {
                keywords: ['nlp', 'natural language'],
                answer: "Ashvin applies NLP in projects like the Multilingual News Audio Translator and PDF Query Application, utilizing models such as Wav2Vec 2.0 and mBART for speech recognition and translation, enabling seamless multilingual communication."
            },
            cloud: {
                keywords: ['cloud', 'aws', 'docker', 'git', 'devops'],
                answer: "He is skilled in cloud computing (AWS), containerization (Docker), and version control (Git), ensuring scalable, secure, and efficient AI/ML deployments in production environments."
            },
            vision: {
                keywords: ['vision', 'computer vision'],
                answer: "Ashvin’s computer vision expertise is showcased in his weed detection robot, which uses EfficientNetV2 and Transformer architectures for high-accuracy image analysis and autonomous decision-making."
            },
            languages: {
                keywords: ['language', 'python', 'programming'],
                answer: "His primary programming language is Python, used for AI, ML, and robotics. He also works with C++ for embedded systems and robotics, and has experience with JavaScript for web development."
            },
            contact: {
                keywords: ['contact', 'linkedin', 'github', 'email'],
                answer: "You can reach Ashvin at ashvinmanojk@gmail.com, or connect via LinkedIn (linkedin.com/in/ashvinmanojk289) and GitHub (github.com/ashvinmanojk289) for professional inquiries."
            }
        };

        const togglePalette = (show) => {
            if (show) {
                overlay.classList.add('active');
                input.focus();
                renderCommands();
            } else {
                overlay.classList.remove('active');
                input.value = '';
            }
        };

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                togglePalette(!overlay.classList.contains('active'));
            }
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                togglePalette(false);
            }
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) togglePalette(false); });
        input.addEventListener('input', () => renderCommands(input.value));
    }
});