document.addEventListener('DOMContentLoaded', () => {
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
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 7;
        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        let stars, nebula, planet, lightParticles, rays;

        function createDarkBackground() {
            // Realistic space: stars, nebula, and a planet
            const starCount = 1500;
            const starGeometry = new THREE.BufferGeometry();
            const starPositions = new Float32Array(starCount * 3);
            const starColors = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount; i++) {
                starPositions[i * 3] = (Math.random() - 0.5) * 300;
                starPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
                starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
                // Random star colors: white, blue, yellow
                const colorType = Math.random();
                if (colorType < 0.7) {
                    starColors[i * 3] = 1; starColors[i * 3 + 1] = 1; starColors[i * 3 + 2] = 1; // white
                } else if (colorType < 0.9) {
                    starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1; // blue
                } else {
                    starColors[i * 3] = 1; starColors[i * 3 + 1] = 1; starColors[i * 3 + 2] = 0.8; // yellow
                }
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
            const starMaterial = new THREE.PointsMaterial({
                size: 1.5,
                transparent: true,
                opacity: 0.9,
                vertexColors: true
            });
            stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);

            // Nebula particles
            const nebulaCount = 800;
            const nebulaGeometry = new THREE.BufferGeometry();
            const nebulaPositions = new Float32Array(nebulaCount * 3);
            const nebulaColors = new Float32Array(nebulaCount * 3);
            for (let i = 0; i < nebulaCount; i++) {
                // Concentrate around center
                const radius = Math.random() * 50 + 20;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                nebulaPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                nebulaPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                nebulaPositions[i * 3 + 2] = radius * Math.cos(phi);
                // Nebula colors: purple, pink, blue
                nebulaColors[i * 3] = 0.5 + Math.random() * 0.5; // R
                nebulaColors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G
                nebulaColors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
            }
            nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
            nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
            const nebulaMaterial = new THREE.PointsMaterial({
                size: 3,
                transparent: true,
                opacity: 0.4,
                vertexColors: true
            });
            const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
            scene.add(nebula);

            // Planet
            const planetGeometry = new THREE.SphereGeometry(5, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a90e2,
                roughness: 0.8,
                metalness: 0.1
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.set(15, -5, -20);
            scene.add(planet);

            // Point light near planet
            const planetLight = new THREE.PointLight(0x4a90e2, 0.5, 50);
            planetLight.position.set(15, -5, -15);
            scene.add(planetLight);

            renderer.setClearColor(0x000011, 1);
        }

        function createLightBackground() {
            // Serene light theme: floating bubbles and light rays
            const bubbleCount = 300;
            const bubbleGeometry = new THREE.BufferGeometry();
            const bubblePositions = new Float32Array(bubbleCount * 3);
            const bubbleSizes = new Float32Array(bubbleCount);
            for (let i = 0; i < bubbleCount; i++) {
                bubblePositions[i * 3] = (Math.random() - 0.5) * 100;
                bubblePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
                bubbleSizes[i] = Math.random() * 2 + 0.5;
            }
            bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
            bubbleGeometry.setAttribute('size', new THREE.BufferAttribute(bubbleSizes, 1));
            const bubbleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    attribute float size;
                    varying float vSize;
                    void main() {
                        vSize = size;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying float vSize;
                    void main() {
                        float alpha = 1.0 - length(gl_PointCoord - vec2(0.5));
                        gl_FragColor = vec4(0.8, 0.9, 1.0, alpha * 0.6);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            lightParticles = new THREE.Points(bubbleGeometry, bubbleMaterial);
            scene.add(lightParticles);

            // Light rays
            const rayCount = 50;
            const rayGeometry = new THREE.BufferGeometry();
            const rayPositions = new Float32Array(rayCount * 6); // lines
            for (let i = 0; i < rayCount; i++) {
                const angle = (i / rayCount) * Math.PI * 2;
                const radius = 50;
                rayPositions[i * 6] = Math.cos(angle) * radius;
                rayPositions[i * 6 + 1] = -20;
                rayPositions[i * 6 + 2] = Math.sin(angle) * radius;
                rayPositions[i * 6 + 3] = Math.cos(angle) * (radius + 20);
                rayPositions[i * 6 + 4] = 20;
                rayPositions[i * 6 + 5] = Math.sin(angle) * (radius + 20);
            }
            rayGeometry.setAttribute('position', new THREE.BufferAttribute(rayPositions, 3));
            const rayMaterial = new THREE.LineBasicMaterial({
                color: 0xfff8dc,
                transparent: true,
                opacity: 0.3
            });
            const rays = new THREE.LineSegments(rayGeometry, rayMaterial);
            scene.add(rays);

            renderer.setClearColor(0xe6f7ff, 1); // Light blue sky
        }

        function updateBackground() {
            // Clear scene
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, currentTheme === 'lab' ? 0.8 : 0.1);
            scene.add(ambientLight);
            if (currentTheme === 'lab') {
                createLightBackground();
            } else {
                createDarkBackground();
            }
        }

        updateBackground();
        // Mouse movement responsiveness
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        // Theme change responsiveness
        const observer = new MutationObserver(() => {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateBackground();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        // Animate
        function animate() {
            requestAnimationFrame(animate);
            // Camera follows mouse
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.08;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.08;
            camera.lookAt(0, 0, 0);
            if (currentTheme === 'lab') {
                // Animate bubbles rising and shader
                if (lightParticles) {
                    lightParticles.material.uniforms.time.value += 0.01;
                    const positions = lightParticles.geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 1] += 0.02; // Rise up
                        if (positions[i + 1] > 50) positions[i + 1] = -50; // Reset
                    }
                    lightParticles.geometry.attributes.position.needsUpdate = true;
                    lightParticles.rotation.y += 0.0005;
                }
                if (rays) {
                    rays.rotation.z += 0.0002;
                }
            } else {
                // Animate stars, nebula, planet
                if (stars) {
                    stars.rotation.x += 0.0005;
                    stars.rotation.y += 0.0005;
                }
                if (nebula) {
                    nebula.rotation.x += 0.0003;
                    nebula.rotation.y += 0.0003;
                }
                if (planet) {
                    planet.rotation.y += 0.005;
                }
            }
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
        // Comet trail
        const trailCount = 20;
        const trail = [];
        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        function updateTrailStyles() {
            trail.forEach((t, i) => {
                if (currentTheme === 'lab') {
                    // Light theme: sparkling particles
                    t.el.style.width = '6px';
                    t.el.style.height = '6px';
                    t.el.style.borderRadius = '50%';
                    t.el.style.background = `radial-gradient(circle, rgba(255,215,0,${0.8 - i * 0.03}), rgba(255,215,0,0))`;
                } else {
                    // Dark theme: comet trail
                    t.el.style.width = `${8 - i * 0.3}px`;
                    t.el.style.height = `${20 - i}px`;
                    t.el.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
                    t.el.style.background = `linear-gradient(to bottom, rgba(0,191,255,${0.8 - i * 0.03}), rgba(0,191,255,0))`;
                }
            });
        }

        for (let i = 0; i < trailCount; i++) {
            const el = document.createElement('div');
            el.className = 'cursor-trail';
            el.style.position = 'fixed';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9998';
            el.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(el);
            trail.push({el, x: mouseX, y: mouseY, vx: 0, vy: 0});
        }
        updateTrailStyles();

        // Theme change observer
        const themeObserver = new MutationObserver(() => {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            updateTrailStyles();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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
                const dx = prevX - t.x;
                const dy = prevY - t.y;
                if (currentTheme === 'lab') {
                    // Light theme: sparkling dots
                    t.vx += dx * 0.05;
                    t.vy += dy * 0.05;
                    t.vx *= 0.95;
                    t.vy *= 0.95;
                    t.x += t.vx;
                    t.y += t.vy;
                    t.el.style.left = `${t.x}px`;
                    t.el.style.top = `${t.y}px`;
                    t.el.style.opacity = `${1 - i / trailCount}`;
                    t.el.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.01 + i) * 0.2})`;
                } else {
                    // Dark theme: comet trail
                    t.vx += dx * 0.1;
                    t.vy += dy * 0.1;
                    t.vx *= 0.9;
                    t.vy *= 0.9;
                    t.x += t.vx;
                    t.y += t.vy;
                    t.el.style.left = `${t.x}px`;
                    t.el.style.top = `${t.y}px`;
                    t.el.style.opacity = `${1 - i / trailCount}`;
                    t.el.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
                }
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
                    {
                        text: "What programming languages does Ashvin use most?",
                        followups: [
                            "What cloud and DevOps tools is Ashvin proficient with?",
                            "How does Ashvin use NLP in his work?",
                            "What are Ashvin’s most notable AI/ML projects?"
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
                        text: "How does Ashvin use NLP in his work?",
                        followups: [
                            "How has Ashvin applied deep learning in real-world scenarios?",
                            "What cloud and DevOps tools is Ashvin proficient with?",
                            "Can you tell me about Ashvin’s work with computer vision?"
                        ]
                    }
                ]
            },
            {
                text: "Can you describe Ashvin’s experience with robotics?",
                followups: [
                    {
                        text: "What are Ashvin’s most notable robotics projects?",
                        followups: [
                            "How has Ashvin applied computer vision in robotics?",
                            "What tools does Ashvin use for robotics?",
                            "What professional experience does Ashvin have?"
                        ]
                    },
                    {
                        text: "How has Ashvin applied computer vision in robotics?",
                        followups: [
                            "What are Ashvin’s most notable robotics projects?",
                            "What tools does Ashvin use for robotics?",
                            "Can you tell me about Ashvin’s work with computer vision?"
                        ]
                    },
                    {
                        text: "What tools does Ashvin use for robotics?",
                        followups: [
                            "What are Ashvin’s most notable robotics projects?",
                            "How has Ashvin applied computer vision in robotics?",
                            "What professional experience does Ashvin have?"
                        ]
                    }
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
                    {
                        text: "How has Ashvin applied deep learning in real-world scenarios?",
                        followups: [
                            "What are Ashvin’s most notable AI/ML projects?",
                            "How does Ashvin use NLP in his work?",
                            "What cloud and DevOps tools is Ashvin proficient with?"
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
                        text: "How does Ashvin use NLP in his work?",
                        followups: [
                            "How has Ashvin applied deep learning in real-world scenarios?",
                            "What cloud and DevOps tools is Ashvin proficient with?",
                            "Can you tell me about Ashvin’s work with computer vision?"
                        ]
                    }
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

        // Initial 3 questions
        showSuggestedQuestions(allQuestions.slice(0, 3));

        document.querySelector('.chat-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('suggested-question')) {
                const idx = e.target.dataset.idx;
                let questionObj;
                if (qaRound === 0) {
                    questionObj = allQuestions[idx];
                    lastChoiceIdx = idx;
                } else if (qaRound === 1) {
                    questionObj = allQuestions[lastChoiceIdx].followups[idx];
                    secondChoiceIdx = idx;
                } else if (qaRound === 2) {
                    questionObj = allQuestions[lastChoiceIdx].followups[secondChoiceIdx].followups[idx];
                }
                const questionText = questionObj.text || questionObj;
                input.value = questionText;
                handleChatMessage(questionText);
                e.target.parentElement.remove();
                qaRound++;
                if (qaRound <= 2) {
                    if (qaRound === 1) {
                        showSuggestedQuestions(allQuestions[lastChoiceIdx].followups);
                    } else if (qaRound === 2) {
                        showSuggestedQuestions(allQuestions[lastChoiceIdx].followups[secondChoiceIdx].followups);
                    }
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
        }, 2000);
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