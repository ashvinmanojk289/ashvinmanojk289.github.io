document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Background Initialization ---
    function init3DBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || !window.THREE) return;

        // --- Basic Setup ---
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        let mouseX = 0, mouseY = 0;
        const clock = new THREE.Clock();

        // --- Theme-specific objects ---
        let galaxy, dust, crystals, lightDust, pointLight1, pointLight2;

        // --- Dark Theme: Realistic Galaxy ---
        function createDarkBackground() {
            const starCount = 20000;
            const positions = new Float32Array(starCount * 3);
            const colors = new Float32Array(starCount * 3);
            const sizes = new Float32Array(starCount);

            const galaxyColor = new THREE.Color(0x58A6FF);
            const coreColor = new THREE.Color(0xFFDDC1);

            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;
                const radius = Math.random() * 80;
                const spinAngle = radius * 3;
                const branchAngle = (i % 5) / 5 * Math.PI * 2;
                const randomX = (Math.random() - 0.5) ** 3 * (80 - radius) * 0.2;
                const randomY = (Math.random() - 0.5) ** 3 * (80 - radius) * 0.2;
                const randomZ = (Math.random() - 0.5) ** 3 * (80 - radius) * 0.2;

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                const mixedColor = galaxyColor.clone();
                mixedColor.lerp(coreColor, radius / 100);
                colors[i3] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
                sizes[i] = Math.random() * 3 + 1;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.PointsMaterial({
                size: 0.1,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                opacity: 0.9
            });

            galaxy = new THREE.Points(geometry, material);
            scene.add(galaxy);

            // Interstellar Dust
            const dustCount = 500;
            const dustPositions = new Float32Array(dustCount * 3);
            for(let i = 0; i < dustCount; i++) {
                dustPositions[i*3] = (Math.random() - 0.5) * 150;
                dustPositions[i*3+1] = (Math.random() - 0.5) * 150;
                dustPositions[i*3+2] = (Math.random() - 0.5) * 150;
            }
            const dustGeometry = new THREE.BufferGeometry();
            dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
            const dustMaterial = new THREE.PointsMaterial({
                size: 1.5,
                color: 0x21262d,
                transparent: true,
                opacity: 0.3
            });
            dust = new THREE.Points(dustGeometry, dustMaterial);
            scene.add(dust);

            renderer.setClearColor(0x0D1117, 1);
        }

        // --- Light Theme: Ethereal Crystals ---
        function createLightBackground() {
            crystals = new THREE.Group();
            const crystalGeometry = new THREE.IcosahedronGeometry(1, 0);
            
            for (let i = 0; i < 50; i++) {
                const crystalMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    transmission: 1.0,
                    roughness: 0.1,
                    metalness: 0.0,
                    ior: 1.8,
                    thickness: 0.5,
                    specularIntensity: 1.0,
                    opacity: 0.7,
                    transparent: true
                });

                const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
                crystal.position.set(
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 40
                );
                crystal.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                const scale = Math.random() * 0.8 + 0.2;
                crystal.scale.set(scale, scale, scale);
                crystals.add(crystal);
            }
            scene.add(crystals);

            // Light Dust Particles
            const dustCount = 500;
            const dustPositions = new Float32Array(dustCount * 3);
            for(let i = 0; i < dustCount; i++) {
                dustPositions[i * 3] = (Math.random() - 0.5) * 50;
                dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
                dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            }
            const dustGeometry = new THREE.BufferGeometry();
            dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
            const dustMaterial = new THREE.PointsMaterial({
                size: 0.1,
                color: 0x0A66C2,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.5
            });
            lightDust = new THREE.Points(dustGeometry, dustMaterial);
            scene.add(lightDust);

            // Dynamic Lights
            pointLight1 = new THREE.PointLight(0x0A66C2, 2, 100);
            scene.add(pointLight1);
            pointLight2 = new THREE.PointLight(0x057642, 2, 100);
            scene.add(pointLight2);
            
            renderer.setClearColor(0xF8F9FA, 1);
        }

        function updateBackground() {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            const ambientLight = new THREE.AmbientLight(0xffffff, currentTheme === 'lab' ? 0.8 : 0.1);
            scene.add(ambientLight);

            if (currentTheme === 'lab') {
                createLightBackground();
            } else {
                createDarkBackground();
            }
        }

        updateBackground();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const observer = new MutationObserver(() => {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateBackground();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            if (currentTheme === 'lab' && crystals) {
                crystals.rotation.y += 0.0005;
                crystals.children.forEach(c => { c.rotation.x += 0.001; c.rotation.y += 0.001; });
                lightDust.rotation.y += 0.0008;
                pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 10;
                pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 10;
                pointLight2.position.x = Math.cos(elapsedTime * 0.3) * 10;
                pointLight2.position.y = Math.sin(elapsedTime * 0.3) * 10;
            } else if (galaxy) {
                galaxy.rotation.y = elapsedTime * 0.05;
                dust.rotation.y = elapsedTime * 0.03;
            }
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

    init3DBackground();

    // --- Loading Spinner Logic ---
    const spinner = document.getElementById('loadingSpinner');
    window.addEventListener('beforeunload', () => spinner.classList.add('active'));
    window.addEventListener('load', () => spinner.classList.remove('active'));

    // --- Scroll-to-Top Button Logic ---
    const scrollBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
        themeBtn.addEventListener('click', () => triggerTransformersTransition());
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
                    if (entry.target.classList.contains('fade-in')) entry.target.classList.add(direction === 'down' ? 'fade-in-up' : 'fade-in-down');
                    if (entry.target.classList.contains('slide-in-left')) entry.target.classList.add(direction === 'down' ? 'slide-in-left-up' : 'slide-in-left-down');
                    if (entry.target.classList.contains('slide-in-right')) entry.target.classList.add(direction === 'down' ? 'slide-in-right-up' : 'slide-in-right-down');
                    if (entry.target.classList.contains('scale-up')) entry.target.classList.add(direction === 'down' ? 'scale-up-up' : 'scale-up-down');
                    if (entry.target.classList.contains('shadow-pop')) entry.target.classList.add(direction === 'down' ? 'shadow-pop-up' : 'shadow-pop-down');
                } else {
                    entry.target.classList.remove('visible', 'fade-in-up', 'fade-in-down', 'slide-in-left-up', 'slide-in-left-down', 'slide-in-right-up', 'slide-in-right-down', 'scale-up-up', 'scale-up-down', 'shadow-pop-up', 'shadow-pop-down');
                }
            });
            lastScrollY = window.scrollY;
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // --- NEW: Unique Liquid Cursor Effect ---
    function initCustomCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor-container';
        document.body.appendChild(cursorContainer);

        const particleCount = 20;
        const particles = [];
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const el = document.createElement('div');
            el.className = 'cursor-particle';
            cursorContainer.appendChild(el);
            particles.push({
                el: el,
                x: mouseX, y: mouseY, vx: 0, vy: 0,
                size: (particleCount - i) / particleCount * 15 + 5
            });
        }

        function updateCursorStyles() {
            particles.forEach((p, i) => {
                if (currentTheme === 'lab') {
                    // Light theme: Liquid metal
                    p.el.style.background = `radial-gradient(circle at 30% 30%, #E1E5E9, #4A4A4A)`;
                    p.el.style.boxShadow = `none`;
                } else {
                    // Dark theme: Glowing plasma
                    p.el.style.background = `radial-gradient(circle, #58A6FF, transparent)`;
                    p.el.style.boxShadow = `0 0 ${p.size * 0.5}px #1F6FEB`;
                }
            });
        }

        updateCursorStyles();
        
        // Theme change observer
        const themeObserver = new MutationObserver(() => {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateCursorStyles();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Leader particle follows mouse
            let leader = particles[0];
            leader.vx += (mouseX - leader.x) * 0.15;
            leader.vy += (mouseY - leader.y) * 0.15;
            leader.vx *= 0.8;
            leader.vy *= 0.8;
            leader.x += leader.vx;
            leader.y += leader.vy;
            
            // Follower particles chase the one in front
            for (let i = 1; i < particleCount; i++) {
                const follower = particles[i];
                const target = particles[i - 1];
                follower.vx += (target.x - follower.x) * 0.2;
                follower.vy += (target.y - follower.y) * 0.2;
                follower.vx *= 0.8;
                follower.vy *= 0.8;
                follower.x += follower.vx;
                follower.y += follower.vy;
            }

            // Update DOM
            particles.forEach(p => {
                p.el.style.transform = `translate(${p.x - p.size/2}px, ${p.y - p.size/2}px)`;
                p.el.style.width = `${p.size}px`;
                p.el.style.height = `${p.size}px`;
            });

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.querySelectorAll('a, button, .switch, .filter-btn, .slider, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorContainer.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorContainer.classList.remove('cursor-interact'));
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
            if (!isDeleting && charIndex === currentWord.length) setTimeout(() => isDeleting = true, 2000);
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
        const allQuestions = [{ text: "What are Ashvin Manoj’s top technical skills?", followups: [{ text: "What programming languages does Ashvin use most?", followups: ["What cloud and DevOps tools is Ashvin proficient with?", "How does Ashvin use NLP in his work?", "What are Ashvin’s most notable AI/ML projects?"] }, { text: "What cloud and DevOps tools is Ashvin proficient with?", followups: ["What programming languages does Ashvin use most?", "How does Ashvin use NLP in his work?", "What are Ashvin’s top technical skills?"] }, { text: "How does Ashvin use NLP in his work?", followups: ["How has Ashvin applied deep learning in real-world scenarios?", "What cloud and DevOps tools is Ashvin proficient with?", "Can you tell me about Ashvin’s work with computer vision?"] }] }, { text: "Can you describe Ashvin’s experience with robotics?", followups: [{ text: "What are Ashvin’s most notable robotics projects?", followups: ["How has Ashvin applied computer vision in robotics?", "What tools does Ashvin use for robotics?", "What professional experience does Ashvin have?"] }, { text: "How has Ashvin applied computer vision in robotics?", followups: ["What are Ashvin’s most notable robotics projects?", "What tools does Ashvin use for robotics?", "Can you tell me about Ashvin’s work with computer vision?"] }, { text: "What tools does Ashvin use for robotics?", followups: ["What are Ashvin’s most notable robotics projects?", "How has Ashvin applied computer vision in robotics?", "What professional experience does Ashvin have?"] }] }, { text: "What professional experience does Ashvin have?", followups: ["What is Ashvin’s educational background?", "What awards or achievements has Ashvin received?", "How can I contact Ashvin or view his profiles?"] }, { text: "What are Ashvin’s most notable AI/ML projects?", followups: [{ text: "How has Ashvin applied deep learning in real-world scenarios?", followups: ["What are Ashvin’s most notable AI/ML projects?", "How does Ashvin use NLP in his work?", "What cloud and DevOps tools is Ashvin proficient with?"] }, { text: "Can you tell me about Ashvin’s work with computer vision?", followups: ["How has Ashvin applied deep learning in real-world scenarios?", "What are Ashvin’s most notable AI/ML projects?", "What tools does Ashvin use for robotics?"] }, { text: "How does Ashvin use NLP in his work?", followups: ["How has Ashvin applied deep learning in real-world scenarios?", "What cloud and DevOps tools is Ashvin proficient with?", "Can you tell me about Ashvin’s work with computer vision?"] }] }, { text: "How has Ashvin applied deep learning in real-world scenarios?", followups: ["What are Ashvin’s most notable AI/ML projects?", "How does Ashvin use NLP in his work?", "What cloud and DevOps tools is Ashvin proficient with?"] }, { text: "What is Ashvin’s educational background?", followups: ["What awards or achievements has Ashvin received?", "What professional experience does Ashvin have?", "How can I contact Ashvin or view his profiles?"] }, { text: "What awards or achievements has Ashvin received?", followups: ["What is Ashvin’s educational background?", "What professional experience does Ashvin have?", "What are Ashvin’s most notable AI/ML projects?"] }, { text: "How does Ashvin use NLP in his work?", followups: ["How has Ashvin applied deep learning in real-world scenarios?", "What cloud and DevOps tools is Ashvin proficient with?", "Can you tell me about Ashvin’s work with computer vision?"] }, { text: "What cloud and DevOps tools is Ashvin proficient with?", followups: ["What programming languages does Ashvin use most?", "How does Ashvin use NLP in his work?", "What are Ashvin’s top technical skills?"] }, { text: "Can you tell me about Ashvin’s work with computer vision?", followups: ["How has Ashvin applied deep learning in real-world scenarios?", "What are Ashvin’s most notable AI/ML projects?", "What tools does Ashvin use for robotics?"] }, { text: "What programming languages does Ashvin use most?", followups: ["What cloud and DevOps tools is Ashvin proficient with?", "What are Ashvin’s top technical skills?", "How does Ashvin use NLP in his work?"] }, { text: "How can I contact Ashvin or view his profiles?", followups: ["What is Ashvin’s educational background?", "What awards or achievements has Ashvin received?", "What professional experience does Ashvin have?"] }];
        let qaRound = 0;
        let lastChoiceIdx = null;
        let secondChoiceIdx = null;
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
        showSuggestedQuestions(allQuestions.slice(0, 3));
        document.querySelector('.chat-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('suggested-question')) {
                const idx = e.target.dataset.idx;
                let questionObj;
                if (qaRound === 0) { questionObj = allQuestions[idx]; lastChoiceIdx = idx; } 
                else if (qaRound === 1) { questionObj = allQuestions[lastChoiceIdx].followups[idx]; secondChoiceIdx = idx; } 
                else if (qaRound === 2) { questionObj = allQuestions[lastChoiceIdx].followups[secondChoiceIdx].followups[idx]; }
                const questionText = questionObj.text || questionObj;
                input.value = questionText;
                handleChatMessage(questionText);
                e.target.parentElement.remove();
                qaRound++;
                if (qaRound <= 2) {
                    if (qaRound === 1) showSuggestedQuestions(allQuestions[lastChoiceIdx].followups);
                    else if (qaRound === 2) showSuggestedQuestions(allQuestions[lastChoiceIdx].followups[secondChoiceIdx].followups);
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
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        chatBody.appendChild(userMessageDiv);
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
        const loadingOverlay = document.getElementById('chat-loading-overlay');
        loadingOverlay.classList.add('active');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-message bot';
        thinkingDiv.innerHTML = '<span class="thinking-indicator"></span>';
        chatBody.appendChild(thinkingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        setTimeout(() => {
            const response = findResponse(message);
            thinkingDiv.innerHTML = response;
            chatBody.scrollTop = chatBody.scrollHeight;
            loadingOverlay.classList.remove('active');
        }, 2000);
    }

    // --- Our Local "Knowledge Base" and Matching Logic ---
    function findResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        const knowledgeBase = { greeting: { keywords: ['hello', 'hi', 'hey'], answer: "Hello! How can I assist you with information about Ashvin Manoj's professional journey, skills, and achievements?" }, skills: { keywords: ['skills', 'tech', 'technologies', 'proficient', 'stack'], answer: "Ashvin Manoj’s top technical skills include Python, PyTorch, TensorFlow, and ROS for robotics. He is also highly proficient in cloud platforms (AWS), Docker, Git, and advanced deep learning frameworks." }, projects: { keywords: ['projects', 'work', 'built'], answer: "Ashvin has led and contributed to several impactful projects, such as a Multilingual News Audio Translator, an autonomous Weed Detection and Spraying Robot, and a PDF Query Application powered by Generative AI. Each project demonstrates his expertise in AI, ML, and robotics." }, robotics: { keywords: ['robotics', 'robot'], answer: "Ashvin’s robotics experience includes developing an autonomous robot for weed detection and spraying in agriculture, integrating computer vision and ROS, and building a Quadruped Emoji Bot with Arduino and Bluetooth control." }, experience: { keywords: ['experience', 'intern', 'job', 'work'], answer: "Ashvin’s professional experience spans AI/ML engineering, research internships, and hands-on robotics development. He has worked on both academic and industry projects, consistently delivering innovative solutions." }, education: { keywords: ['education', 'degree', 'mtech', 'school', 'rajagiri'], answer: "Ashvin is currently pursuing an M.Tech at Rajagiri School of Engineering and Technology, specializing in artificial intelligence, machine learning, and robotics." }, awards: { keywords: ['award', 'achievement', 'recognition'], answer: "Ashvin has received multiple awards for his work in AI and robotics, including recognition for his autonomous weed detection robot and multilingual news translator. His projects have been celebrated for innovation and real-world impact." }, nlp: { keywords: ['nlp', 'natural language'], answer: "Ashvin applies NLP in projects like the Multilingual News Audio Translator and PDF Query Application, utilizing models such as Wav2Vec 2.0 and mBART for speech recognition and translation, enabling seamless multilingual communication." }, cloud: { keywords: ['cloud', 'aws', 'docker', 'git', 'devops'], answer: "He is skilled in cloud computing (AWS), containerization (Docker), and version control (Git), ensuring scalable, secure, and efficient AI/ML deployments in production environments." }, vision: { keywords: ['vision', 'computer vision'], answer: "Ashvin’s computer vision expertise is showcased in his weed detection robot, which uses EfficientNetV2 and Transformer architectures for high-accuracy image analysis and autonomous decision-making." }, languages: { keywords: ['language', 'python', 'programming'], answer: "His primary programming language is Python, used for AI, ML, and robotics. He also works with C++ for embedded systems and robotics, and has experience with JavaScript for web development." }, contact: { keywords: ['contact', 'linkedin', 'github', 'email'], answer: "You can reach Ashvin at ashvinmanojk@gmail.com, or connect via LinkedIn (linkedin.com/in/ashvinmanojk289) and GitHub (github.com/ashvinmanojk289) for professional inquiries." } };
        for (const key in knowledgeBase) {
            if (knowledgeBase[key].keywords.some(k => lowerCaseMessage.includes(k))) return knowledgeBase[key].answer;
        }
        return "I'm sorry, I don't have information on that topic. Please try asking about Ashvin's skills, projects, or experience.";
    }

    // --- Command Palette ---
    function initCommandPalette() {
        const overlay = document.getElementById('command-palette-overlay');
        const input = document.getElementById('cmdk-input');

        const togglePalette = (show) => {
            if (show) {
                overlay.classList.add('active');
                input.focus();
                // renderCommands(); // Assuming a renderCommands function exists
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
        // input.addEventListener('input', () => renderCommands(input.value)); // Assuming a renderCommands function exists
    }
});