document.addEventListener('DOMContentLoaded', () => {
    // --- Chatbot/AI Assistant Logic ---
    function initChatAssistant() {
        const chatToggleBtn = document.getElementById('chat-toggle-btn');
        const chatWindow = document.getElementById('chat-window');
        const chatCloseBtn = document.getElementById('chat-close-btn');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        if (!chatToggleBtn || !chatWindow || !chatCloseBtn || !chatForm || !chatInput || !chatMessages) return;

        function showChat() {
            chatWindow.style.display = 'flex';
            chatInput.focus();
        }
        function hideChat() {
            chatWindow.style.display = 'none';
        }
        chatToggleBtn.addEventListener('click', showChat);
        chatCloseBtn.addEventListener('click', hideChat);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWindow.style.display === 'flex') hideChat();
        });

        function addMessage(text, sender = 'assistant') {
            const msg = document.createElement('div');
            msg.className = 'chat-message ' + sender;
            msg.textContent = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleUserInput(input) {
            const val = input.trim().toLowerCase();
            addMessage(input, 'user');
            // Navigation commands
            if (val.includes('home')) {
                addMessage('Navigating to Home section...');
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('about')) {
                addMessage('Navigating to About section...');
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('experience')) {
                addMessage('Navigating to Experience section...');
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('project')) {
                addMessage('Navigating to Projects section...');
                document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('skill')) {
                addMessage('Navigating to Skills section...');
                document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('award')) {
                addMessage('Navigating to Awards section...');
                document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('contact')) {
                addMessage('Navigating to Contact section...');
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            } else if (val.includes('theme')) {
                addMessage('Toggling theme...');
                document.getElementById('theme-toggle-btn')?.click();
            } else if (val.includes('github')) {
                addMessage('Opening GitHub profile...');
                window.open('https://github.com/ashvinmanojk289', '_blank');
            } else if (val.includes('linkedin')) {
                addMessage('Opening LinkedIn profile...');
                window.open('https://linkedin.com/in/ashvinmanojk289', '_blank');
            } else if (val.includes('help')) {
                addMessage('You can ask me to navigate to any section, toggle theme, or open social profiles. Try "Go to Projects" or "Toggle theme".');
            } else {
                addMessage('Sorry, I can help you navigate, toggle theme, or open profiles. Try "Go to Contact" or "Open GitHub".');
            }
        }

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = chatInput.value;
            if (val) handleUserInput(val);
            chatInput.value = '';
        });

        // Initial greeting
        addMessage('Hi! I am your AI assistant. Ask me to navigate, toggle theme, or open profiles. Type "help" for options.');
    }
    // --- Command Palette Logic ---
    function initCommandPalette() {
        const palette = document.getElementById('command-palette');
        const input = document.getElementById('command-palette-input');
        const list = document.getElementById('command-palette-list');
        if (!palette || !input || !list) return;

        // Command definitions
        const commands = [
            { label: 'Go to Home', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Projects', action: () => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Skills', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Awards', action: () => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Toggle Theme', action: () => document.getElementById('theme-toggle-btn')?.click() },
            { label: 'Open GitHub', action: () => window.open('https://github.com/ashvinmanojk289', '_blank') },
            { label: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank') },
        ];

        let filtered = [...commands];
        let selectedIdx = 0;

        function renderList() {
            list.innerHTML = '';
            filtered.forEach((cmd, i) => {
                const li = document.createElement('li');
                li.textContent = cmd.label;
                if (i === selectedIdx) li.classList.add('selected');
                li.addEventListener('click', () => {
                    cmd.action();
                    closePalette();
                });
                list.appendChild(li);
            });
        }

        function openPalette() {
            palette.style.display = 'flex';
            input.value = '';
            filtered = [...commands];
            selectedIdx = 0;
            renderList();
            setTimeout(() => input.focus(), 100);
        }

        function closePalette() {
            palette.style.display = 'none';
        }

        input.addEventListener('input', () => {
            const val = input.value.toLowerCase();
            filtered = commands.filter(cmd => cmd.label.toLowerCase().includes(val));
            selectedIdx = 0;
            renderList();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                selectedIdx = Math.min(selectedIdx + 1, filtered.length - 1);
                renderList();
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                selectedIdx = Math.max(selectedIdx - 1, 0);
                renderList();
                e.preventDefault();
            } else if (e.key === 'Enter') {
                if (filtered[selectedIdx]) {
                    filtered[selectedIdx].action();
                    closePalette();
                }
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                openPalette();
                e.preventDefault();
            }
        });

        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });
    }
    // --- Floating Action Button Logic ---
    function initFloatingActionButton() {
        const fab = document.getElementById('fab-contact');
        if (!fab) return;
        fab.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                fab.classList.add('bounce');
                setTimeout(() => fab.classList.remove('bounce'), 600);
            }
        });
    }
    // --- Parallax Scrolling for Hero/Background ---
    function initParallaxScrolling() {
        const hero = document.querySelector('.hero');
        const bgCanvas = document.getElementById('bg-canvas');
        if (!hero || !bgCanvas) return;
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Parallax for hero section
            hero.style.transform = `translateY(${scrollY * 0.18}px)`;
            // Parallax for background canvas
            bgCanvas.style.transform = `translateY(${scrollY * 0.08}px)`;
            lastScrollY = scrollY;
        });
        // Mouse parallax for hero text
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;
                heroText.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
            window.addEventListener('mouseleave', () => {
                heroText.style.transform = '';
            });
        }
    }
    // --- 3D Background Initialization ---
    function init3DBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || !window.THREE) return;
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
        // Theme colors
        function getThemeColors() {
            const theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'lab') {
                return {
                    bg: 0xf5f7fa,
                    grid: 0xcccccc,
                    accent: 0x0077ff,
                    cube: 0x0077ff
                };
            } else {
                return {
                    bg: 0x181c20,
                    grid: 0x222a35,
                    accent: 0x00bfff,
                    cube: 0x00bfff
                };
            }
        }
        let colors = getThemeColors();
        renderer.setClearColor(colors.bg, 1);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;
        // Tech grid
        const grid = new THREE.GridHelper(20, 40, colors.grid, colors.grid);
        grid.position.y = -2.5;
        scene.add(grid);
        // Floating cubes
        const cubes = [];
        for (let i = 0; i < 18; i++) {
            const geometry = new THREE.BoxGeometry(Math.random() * 0.5 + 0.2, Math.random() * 0.5 + 0.2, Math.random() * 0.5 + 0.2);
            const material = new THREE.MeshStandardMaterial({ color: colors.cube, metalness: 0.8, roughness: 0.25, emissive: colors.accent, emissiveIntensity: 0.3 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 6
            );
            scene.add(cube);
            cubes.push(cube);
        }
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const accentLight = new THREE.PointLight(colors.accent, 1.2, 30);
        accentLight.position.set(0, 5, 10);
        scene.add(accentLight);
        // Mouse movement responsiveness
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        // Theme change responsiveness
        const observer = new MutationObserver(() => {
            colors = getThemeColors();
            renderer.setClearColor(colors.bg, 1);
            grid.material.color.setHex(colors.grid);
            accentLight.color.setHex(colors.accent);
            cubes.forEach(cube => {
                cube.material.color.setHex(colors.cube);
                cube.material.emissive.setHex(colors.accent);
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        // Animate
        function animate() {
            requestAnimationFrame(animate);
            // Camera follows mouse
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.08;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.08;
            camera.lookAt(0, 0, 0);
            // Animate cubes
            cubes.forEach((cube, i) => {
                cube.rotation.x += 0.008 + i * 0.0005;
                cube.rotation.y += 0.01 + i * 0.0007;
                cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.003;
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
    initParallaxScrolling();
    initFloatingActionButton();
    initCommandPalette();
    initChatAssistant();
// --- FAB Bounce Animation ---
const style = document.createElement('style');
style.innerHTML = `
    .floating-action-btn.bounce {
        animation: fabBounce 0.6s;
    }
    @keyframes fabBounce {
        0% { transform: scale(1); }
        30% { transform: scale(1.18); }
        50% { transform: scale(0.92); }
        70% { transform: scale(1.08); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
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
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
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