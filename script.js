document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Spinner ---
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        window.addEventListener('load', () => {
            spinner.classList.add('hidden');
        });
    }
    
    // --- Master Initialization ---
    init3DBackground();
    initTheme();
    initCustomCursor();
    initChatAssistant();
    initMobileNav();
    initHeaderScroll();
    initScrollSpy();
    initIntersectionObserver();
    initTypingEffect();
    initModals();
    initScrollToTop();
    fetchGitHubStats();
    initCurrentYear();

    function init3DBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || !window.THREE) return;
        canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
        canvas.style.width = '100vw'; canvas.style.height = '100vh';
        canvas.style.zIndex = '0'; canvas.style.pointerEvents = 'none';

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        let mouseX = 0, mouseY = 0;
        const clock = new THREE.Clock();
        
        let nebulaParticles, starParticles;

        const shaderLogic = {
            vertex: `
                uniform float uTime; uniform float uSize; attribute float aScale;
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    float angle = atan(modelPosition.x, modelPosition.z);
                    float distanceToCenter = length(modelPosition.xz);
                    angle += distanceToCenter * 0.1 + uTime * 0.1;
                    modelPosition.x = cos(angle) * distanceToCenter;
                    modelPosition.z = sin(angle) * distanceToCenter;
                    modelPosition.y += sin(uTime + distanceToCenter * 0.5) * 0.5;
                    vec4 viewPosition = viewMatrix * modelPosition;
                    gl_Position = projectionMatrix * viewPosition;
                    gl_PointSize = uSize * aScale / -viewPosition.z;
                }
            `,
            fragment: `
                uniform vec3 uColor1; uniform vec3 uColor2; uniform float uOpacity;
                void main() {
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - strength * 2.0;
                    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 1.0, gl_FragCoord.z));
                    gl_FragColor = vec4(color, strength * uOpacity);
                }
            `
        };

        function createNebula(config) {
            scene.fog = new THREE.Fog(config.fogColor, 10, 30);
            
            const nebulaGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(config.particleCount * 3);
            const scales = new Float32Array(config.particleCount);
            for(let i = 0; i < config.particleCount; i++) {
                positions[i*3+0] = (Math.random() - 0.5) * 15;
                positions[i*3+1] = (Math.random() - 0.5) * 15;
                positions[i*3+2] = (Math.random() - 0.5) * 15;
                scales[i] = Math.random() * config.particleScale;
            }
            nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            nebulaGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

            nebulaParticles = new THREE.Points(nebulaGeometry, new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 }, uSize: { value: config.particleSize * renderer.getPixelRatio() },
                    uColor1: { value: new THREE.Color(config.color1)}, uColor2: { value: new THREE.Color(config.color2)},
                    uOpacity: { value: config.opacity }
                },
                vertexShader: shaderLogic.vertex, fragmentShader: shaderLogic.fragment,
                transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
            }));
            scene.add(nebulaParticles);

            const starGeometry = new THREE.BufferGeometry();
            const starPositions = new Float32Array(config.starCount * 3);
            for(let i=0; i < config.starCount; i++){
                starPositions[i*3+0] = (Math.random() - 0.5) * 50;
                starPositions[i*3+1] = (Math.random() - 0.5) * 50;
                starPositions[i*3+2] = (Math.random() - 0.5) * 50;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            starParticles = new THREE.Points(starGeometry, new THREE.PointsMaterial({
                color: new THREE.Color(config.starColor), size: 0.05,
                transparent: true, opacity: config.starOpacity
            }));
            scene.add(starParticles);
        }

        function updateBackground() {
            while (scene.children.length > 0) scene.remove(scene.children[0]);
            scene.fog = null;
            if (currentTheme === 'lab') {
                createNebula({
                    fogColor: 0xF8F9FA, particleCount: 2500, particleScale: 2.5, particleSize: 40,
                    color1: '#0A66C2', color2: '#057642', opacity: 0.6,
                    starCount: 1000, starColor: '#4A4A4A', starOpacity: 0.3
                });
            } else {
                createNebula({
                    fogColor: 0x0D1117, particleCount: 3000, particleScale: 2.0, particleSize: 30,
                    color1: '#58A6FF', color2: '#3f32a8', opacity: 0.4,
                    starCount: 2000, starColor: '#FFFFFF', starOpacity: 0.8
                });
            }
        }

        updateBackground();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        new MutationObserver(() => {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateBackground();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            if (nebulaParticles) nebulaParticles.material.uniforms.uTime.value = elapsedTime;
            if (starParticles) starParticles.rotation.y += 0.0001;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        const sunIcon = document.getElementById('theme-icon-sun');
        const moonIcon = document.getElementById('theme-icon-moon');
        const profileImg = document.getElementById('profile-img');

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'lab') {
                sunIcon.classList.remove('hidden'); moonIcon.classList.add('hidden');
                if (profileImg) profileImg.src = 'assets/profile-light.jpg';
            } else {
                sunIcon.classList.add('hidden'); moonIcon.classList.remove('hidden');
                if (profileImg) profileImg.src = 'assets/profile-dark.jpg';
            }
        }
        
        themeBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'lab' ? 'dark' : 'lab';
            applyTheme(newTheme);
        });
        
        applyTheme(localStorage.getItem('theme') || 'lab');
    }

    function initCustomCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) {
            document.documentElement.style.cursor = 'auto';
            return;
        }

        const cursorContainer = document.querySelector('.custom-cursor');
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');

        let mouseX = -100, mouseY = -100;
        let dotX = -100, dotY = -100;
        let ringX = -100, ringY = -100;

        window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

        function animateCursor() {
            dotX += (mouseX - dotX) * 0.9; dotY += (mouseY - dotY) * 0.9;
            ringX += (mouseX - ringX) * 0.25; ringY += (mouseY - ringY) * 0.25;
            dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .filter-btn, .theme-btn, .chat-toggle-btn, .scroll-to-top, .suggested-question, .close-modal-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursorContainer.classList.add('interact'));
            el.addEventListener('mouseleave', () => cursorContainer.classList.remove('interact'));
        });
    }

    function initChatAssistant() {
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        const chatWindow = document.querySelector('.chat-window');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        const aiStatus = document.getElementById('ai-status');
        
        toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
        sendBtn.addEventListener('click', () => handleChatMessage());
        input.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleChatMessage(); });

        let nlpManager;
        const knowledgeBase = {
            greeting: "Hello! I'm Ashvin's AI assistant. You can ask me about his skills, experience, projects, and more.",
            goodbye: "You're welcome! Have a great day.",
            about: "Ashvin is a results-oriented AI/ML Engineer and PG Student with a strong foundation in deep learning, NLP, and computer vision. He aims to solve complex business problems by developing and deploying scalable machine learning solutions.",
            name: "This is the portfolio of Ashvin Manoj, an AI/ML Engineer and PG Student.",
            skills: "Ashvin's technical skills include languages like Python, C++, and SQL; AI/ML frameworks such as TensorFlow, PyTorch, and Transformers; and tools like ROS, Git, Streamlit, and Flask.",
            projects: "He has developed several key projects, including a Multilingual News Audio Translator with 92% accuracy, a GenAI-powered PDF Query app that reduced retrieval time by 89%, and an autonomous Weed Detection Robot using a custom Transformer model with 97% accuracy.",
            experience: "Ashvin is currently a Data Science Intern at Mastermine Technologies, where he is engineering a full-stack app and designing a multi-agent LLM framework. Previously, as a Hardware Systems Intern at Sunlux Technovations, he improved process efficiency by 15% by developing programs for industrial automation.",
            education: "He is currently pursuing an M.Tech in Computer Science (AI/ML) from Rajagiri School of Engineering and Technology with a 9.49 CGPA. He holds a B.Tech with Honours in Robotics and Automation from Adi Shankara Institute with a 9.54 CGPA.",
            achievements: "His achievements include co-authoring the paper 'A Hybrid Transformer Model Approach for Precision Weed Detection' for the 2025 ACCESS conference. He also holds certifications from Google in Data Analytics, NPTEL in Python, and Infosys in Prompt Engineering.",
            contact: "You can contact Ashvin via email at ashvinmanojk@gmail.com or by phone at (+91) 88482 36253. You can also find him on LinkedIn and GitHub."
        };
        
        async function loadNlpModel() {
            try {
                const response = await fetch('assets/model.nlp');
                if (!response.ok) throw new Error('Model file not found');
                const modelData = await response.text();
                const { NlpManager } = window.nlpjs;
                nlpManager = new NlpManager();
                nlpManager.import(modelData);
                console.log("AI Assistant Model Loaded!");
                aiStatus.textContent = "AI Ready";
            } catch (error) {
                console.error("Failed to load AI model:", error);
                aiStatus.textContent = "Error loading AI";
            }
        }
        loadNlpModel();

        async function findResponseWithAI(userMessage) {
            if (!nlpManager || nlpManager.ner.settings.en.rules === undefined) {
                return "My AI brain is still warming up. Please try again in a moment!";
            }
            const result = await nlpManager.process('en', userMessage);
            const intent = result.intent;
            const score = result.score;
            if (intent && score > 0.65 && knowledgeBase[intent]) {
                return knowledgeBase[intent];
            } else {
                return "I'm not quite sure how to answer that. Could you try asking about Ashvin's skills, projects, or professional experience?";
            }
        }

        async function handleChatMessage(predefinedMessage = null) {
            const message = predefinedMessage || input.value.trim();
            if (!message) return;
            const chatBody = document.querySelector('.chat-body');
            
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            chatBody.appendChild(userMessageDiv);
            input.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;
            
            const suggestedQs = document.querySelector('.suggested-questions');
            if(suggestedQs) suggestedQs.remove();

            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'chat-message bot';
            thinkingDiv.innerHTML = '<span class="thinking-indicator"></span>';
            chatBody.appendChild(thinkingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            const response = await findResponseWithAI(message);
            setTimeout(() => {
                thinkingDiv.innerHTML = response;
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 500);
        }

        document.querySelector('.chat-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('suggested-question')) {
                handleChatMessage(e.target.textContent);
            }
        });
    }

    function initMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navLinks.forEach(link => link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    function initHeaderScroll() {
        const header = document.querySelector('.top-header');
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.style.boxShadow = '0 2px 15px var(--shadow-color)';
            else header.style.boxShadow = 'none';
            if (lastScrollY < window.scrollY && window.scrollY > 100) header.style.top = '-80px';
            else header.style.top = '0';
            lastScrollY = window.scrollY;
        });
    }

    function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let currentId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) currentId = section.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) link.classList.add('active');
            });
        });
    }

    function initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

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
    
    function initModals() {
        const openModalButtons = document.querySelectorAll('.open-modal-btn');
        const closeModalButtons = document.querySelectorAll('.close-modal-btn');
        const modalOverlay = document.querySelector('.modal-overlay');
        let activeModal = null;

        function openModal(modal) {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            activeModal = modal;
        }

        function closeModal() {
            if (!activeModal) return;
            activeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            activeModal = null;
        }

        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = document.querySelector(button.dataset.modalTarget);
                if (modal) openModal(modal);
            });
        });

        closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
        modalOverlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => { if (e.key === "Escape") closeModal(); });
    }

    function initScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollBtn.classList.add('visible');
            else scrollBtn.classList.remove('visible');
        });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/ashvinmanojk289/repos?sort=pushed&per_page=5`);
            if (!response.ok) throw new Error('GitHub API request failed');
            const repos = await response.json();
            
            const userResponse = await fetch(`https://api.github.com/users/ashvinmanojk289`);
            const userData = await userResponse.json();

            const allReposResponse = await fetch(userData.repos_url + '?per_page=100');
            const allRepos = await allReposResponse.json();
            
            document.getElementById('github-repos').textContent = userData.public_repos || 0;
            document.getElementById('github-stars').textContent = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            
            const activityList = document.getElementById('github-activity');
            activityList.innerHTML = repos.slice(0, 3).map(repo => `<li>Pushed to <strong>${repo.name}</strong></li>`).join('');
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
            document.getElementById('github-activity').innerHTML = '<li>Could not fetch data.</li>';
        }
    }

    function initCurrentYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }
});