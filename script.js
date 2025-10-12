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
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        let mouseX = 0, mouseY = 0;
        const clock = new THREE.Clock();
        
        // --- Theme-specific objects ---
        let nebulaParticles, starParticles;

        // --- Dark Theme: Ethereal Cosmic Nebula ---
        function createDarkBackground() {
            scene.fog = new THREE.Fog(0x0D1117, 10, 30);
            
            // Nebula Cloud
            const nebulaGeometry = new THREE.BufferGeometry();
            const nebulaCount = 3000;
            const positions = new Float32Array(nebulaCount * 3);
            const scales = new Float32Array(nebulaCount);
            
            for(let i = 0; i < nebulaCount; i++) {
                positions[i*3+0] = (Math.random() - 0.5) * 15;
                positions[i*3+1] = (Math.random() - 0.5) * 15;
                positions[i*3+2] = (Math.random() - 0.5) * 15;
                scales[i] = Math.random() * 2;
            }
            nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            nebulaGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

            const nebulaMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uSize: { value: 30 * renderer.getPixelRatio() },
                    uColor1: { value: new THREE.Color('#58A6FF')},
                    uColor2: { value: new THREE.Color('#3f32a8')}
                },
                vertexShader: `
                    uniform float uTime;
                    uniform float uSize;
                    attribute float aScale;
                    
                    void main() {
                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                        
                        // Swirling animation
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
                fragmentShader: `
                    uniform vec3 uColor1;
                    uniform vec3 uColor2;

                    void main() {
                        float strength = distance(gl_PointCoord, vec2(0.5));
                        strength = 1.0 - strength * 2.0;
                        
                        vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 1.0, gl_FragCoord.z));

                        gl_FragColor = vec4(color, strength * 0.3);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            nebulaParticles = new THREE.Points(nebulaGeometry, nebulaMaterial);
            scene.add(nebulaParticles);

            // Subtle Starfield
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 2000;
            const starPositions = new Float32Array(starCount * 3);
            for(let i=0; i < starCount; i++){
                starPositions[i*3+0] = (Math.random() - 0.5) * 50;
                starPositions[i*3+1] = (Math.random() - 0.5) * 50;
                starPositions[i*3+2] = (Math.random() - 0.5) * 50;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.05,
                transparent: true,
                opacity: 0.8
            });
            starParticles = new THREE.Points(starGeometry, starMaterial);
            scene.add(starParticles);
        }

        // --- Light Theme: Ethereal Nebula ---
        function createLightBackground() {
            scene.fog = new THREE.Fog(0xF8F9FA, 10, 30);

            // Nebula Cloud
            const nebulaGeometry = new THREE.BufferGeometry();
            const nebulaCount = 2500;
            const positions = new Float32Array(nebulaCount * 3);
            const scales = new Float32Array(nebulaCount);
            
            for(let i = 0; i < nebulaCount; i++) {
                positions[i*3+0] = (Math.random() - 0.5) * 15;
                positions[i*3+1] = (Math.random() - 0.5) * 15;
                positions[i*3+2] = (Math.random() - 0.5) * 15;
                scales[i] = Math.random() * 2.5;
            }
            nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            nebulaGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

            const nebulaMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uSize: { value: 40 * renderer.getPixelRatio() },
                    uColor1: { value: new THREE.Color('#0A66C2')}, // Accent Blue
                    uColor2: { value: new THREE.Color('#057642')}  // Accent Green
                },
                vertexShader: `
                    uniform float uTime;
                    uniform float uSize;
                    attribute float aScale;
                    
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
                fragmentShader: `
                    uniform vec3 uColor1;
                    uniform vec3 uColor2;

                    void main() {
                        float strength = distance(gl_PointCoord, vec2(0.5));
                        strength = 1.0 - strength * 2.0;
                        
                        vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 1.0, gl_FragCoord.z));

                        gl_FragColor = vec4(color, strength * 0.5);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            nebulaParticles = new THREE.Points(nebulaGeometry, nebulaMaterial);
            scene.add(nebulaParticles);

            // Subtle "Starfield" (dark specks)
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 1000;
            const starPositions = new Float32Array(starCount * 3);
            for(let i=0; i < starCount; i++){
                starPositions[i*3+0] = (Math.random() - 0.5) * 50;
                starPositions[i*3+1] = (Math.random() - 0.5) * 50;
                starPositions[i*3+2] = (Math.random() - 0.5) * 50;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const starMaterial = new THREE.PointsMaterial({
                color: 0x4A4A4A, // Dark gray color for specks
                size: 0.05,
                transparent: true,
                opacity: 0.3
            });
            starParticles = new THREE.Points(starGeometry, starMaterial);
            scene.add(starParticles);
        }

        function updateBackground() {
            while (scene.children.length > 0) scene.remove(scene.children[0]);
            scene.fog = null;

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

            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            // This logic now works for both themes
            if (nebulaParticles) {
                nebulaParticles.material.uniforms.uTime.value = elapsedTime;
            }
            if (starParticles) {
                starParticles.rotation.y += 0.0001;
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

    // --- NEW: High-Performance Orbital Cursor ---
    function initCustomCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorContainer = document.querySelector('.custom-cursor');
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Easing (Lerp) for smooth follow
            dotX += (mouseX - dotX) * 0.9; // Dot follows fast
            dotY += (mouseY - dotY) * 0.9;

            ringX += (mouseX - ringX) * 0.25; // Ring follows slower
            ringY += (mouseY - ringY) * 0.25;

            dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .filter-btn, .theme-btn, .project-card, .chat-toggle-btn, .scroll-to-top, input, textarea, .suggested-question').forEach(el => {
            el.addEventListener('mouseenter', () => cursorContainer.classList.add('interact'));
            el.addEventListener('mouseleave', () => cursorContainer.classList.remove('interact'));
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
            if (!repoResponse.ok) throw new Error('GitHub API request failed');
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
                const rotateX = (y - rect.height / 2) / 15; // Reduced intensity
                const rotateY = (rect.width / 2 - x) / 15; // Reduced intensity
                card.style.transition = 'transform 0.1s'; // Smooth transition
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'; // Spring back
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
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
        }, 1500); // Reduced delay
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
    }
});