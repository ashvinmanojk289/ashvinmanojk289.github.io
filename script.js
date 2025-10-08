document.addEventListener('DOMContentLoaded', () => {

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

    // --- Advanced Feature Initializations ---
    initThreeHero();
    initParticlesBG();
    initVoiceNav();
    initGitHubVisuals();
    initPWA();
    initGSAPScroll();
    initEnhancedCommandPalette();
    initRAGAssistant();

    });

// --- Three.js 3D Hero Section ---
function initThreeHero() {
    const container = document.getElementById('three-hero');
    if (!container) return;
    
    // Load Three.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.skypack.dev/three@0.150.1';
    script.onload = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x0A66C2, metalness: 0.7, roughness: 0.3 });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(20, 20, 20);
        scene.add(light);

        camera.position.z = 30;

        function animate() {
            requestAnimationFrame(animate);
            knot.rotation.x += 0.01;
            knot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    };
    document.head.appendChild(script);
}

// --- Particle Background ---
function initParticlesBG() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    
    let particles = Array.from({length: 80}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        r: Math.random() * 2 + 1
    }));
    
    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = '#0A66C2';
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        requestAnimationFrame(draw);
    }
    draw();
    
    window.addEventListener('resize', () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    });
}

// --- Voice Navigation ---
function initVoiceNav() {
    if (!('webkitSpeechRecognition' in window)) return;
    
    const voiceBtn = document.getElementById('voice-nav-btn');
    if (!voiceBtn) return;
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('about')) location.hash = '#about';
        else if (transcript.includes('projects')) location.hash = '#featured-projects';
        else if (transcript.includes('skills')) location.hash = '#skills';
        else if (transcript.includes('contact')) location.hash = '#contact';
        else if (transcript.includes('resume')) location.hash = '#resume';
        else if (transcript.includes('experience')) location.hash = '#experience';
        else if (transcript.includes('achievements')) location.hash = '#achievements';
    };
    
    recognition.onerror = function(event) {
        console.log('Speech recognition error:', event.error);
    };
    
    voiceBtn.onclick = () => {
        voiceBtn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        recognition.start();
        setTimeout(() => {
            voiceBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))';
        }, 3000);
    };
}

// --- GitHub Live Visualizations ---
async function initGitHubVisuals() {
    try {
        const response = await fetch('https://api.github.com/users/ashvinmanojk289/repos');
        const repos = await response.json();
        
        const langCount = {};
        repos.forEach(repo => {
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        });
        
        const chartContainer = document.getElementById('github-lang-chart');
        if (chartContainer && Object.keys(langCount).length > 0) {
            // Load Chart.js dynamically
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                new Chart(chartContainer.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(langCount),
                        datasets: [{
                            data: Object.values(langCount),
                            backgroundColor: ['#0A66C2', '#057642', '#F59E0B', '#8B5CF6', '#3B82F6', '#34D399', '#FBBF24'],
                        }]
                    },
                    options: {
                        plugins: { legend: { position: 'bottom' } },
                        responsive: true
                    }
                });
            };
            document.head.appendChild(script);
        }
    } catch (error) {
        console.log('GitHub API error:', error);
    }
}

// --- PWA Install Prompt ---
function initPWA() {
    // Service Worker Registration with inline worker
    if ('serviceWorker' in navigator) {
        const swCode = `
            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open('portfolio-cache-v1').then(cache => {
                        return cache.addAll([
                            '/',
                            '/index.html',
                            '/style.css',
                            '/script.js',
                            '/assets/favicon.png',
                            '/assets/profile-light.jpg',
                            '/assets/profile-dark.jpg',
                            '/assets/resume.jpg',
                            '/assets/resume.pdf'
                        ]);
                    })
                );
            });
            
            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request).then(response => {
                        return response || fetch(event.request);
                    })
                );
            });
        `;
        
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl);
    }
    
    // Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        const installBtn = document.createElement('button');
        installBtn.className = 'fab';
        installBtn.innerHTML = '<i class="fas fa-download"></i>';
        installBtn.title = 'Install App';
        installBtn.style.bottom = '160px';
        installBtn.style.right = '32px';
        installBtn.onclick = () => {
            e.prompt();
            e.userChoice.then(() => {
                installBtn.remove();
            });
        };
        document.body.appendChild(installBtn);
    });
}

// --- GSAP Scroll Animations ---
function initGSAPScroll() {
    // Load GSAP dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
        const scrollScript = document.createElement('script');
        scrollScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        scrollScript.onload = () => {
            gsap.registerPlugin(ScrollTrigger);
            
            gsap.from('.section-title', {
                scrollTrigger: {
                    trigger: '.section-title',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.2
            });
            
            gsap.from('.reveal', {
                scrollTrigger: {
                    trigger: '.reveal',
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                stagger: 0.1
            });
        };
        document.head.appendChild(scrollScript);
    };
    document.head.appendChild(script);
}

// --- Enhanced Command Palette ---
function initEnhancedCommandPalette() {
    const input = document.getElementById('cmdk-input');
    const list = document.getElementById('cmdk-list');
    
    if (!input || !list) return;
    
    const commands = [
        { label: 'Go to About', action: () => location.hash = '#about', icon: 'fas fa-user' },
        { label: 'Go to Projects', action: () => location.hash = '#featured-projects', icon: 'fas fa-code' },
        { label: 'Go to Skills', action: () => location.hash = '#skills', icon: 'fas fa-cogs' },
        { label: 'Go to Resume', action: () => location.hash = '#resume', icon: 'fas fa-file-alt' },
        { label: 'Go to Experience', action: () => location.hash = '#experience', icon: 'fas fa-briefcase' },
        { label: 'Go to Achievements', action: () => location.hash = '#achievements', icon: 'fas fa-trophy' },
        { label: 'Switch to Dark Theme', action: () => document.documentElement.setAttribute('data-theme', 'dark'), icon: 'fas fa-moon' },
        { label: 'Switch to Light Theme', action: () => document.documentElement.setAttribute('data-theme', 'lab'), icon: 'fas fa-sun' },
        { label: 'Download Resume', action: () => window.open('assets/resume.pdf', '_blank'), icon: 'fas fa-download' },
        { label: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank'), icon: 'fab fa-linkedin' },
        { label: 'Open GitHub', action: () => window.open('https://github.com/ashvinmanojk289', '_blank'), icon: 'fab fa-github' },
        { label: 'Start Voice Navigation', action: () => document.getElementById('voice-nav-btn')?.click(), icon: 'fas fa-microphone' }
    ];
    
    input.oninput = () => {
        list.innerHTML = '';
        const val = input.value.toLowerCase();
        commands.filter(cmd => cmd.label.toLowerCase().includes(val)).forEach(cmd => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${cmd.icon}"></i> ${cmd.label}`;
            li.onclick = () => {
                cmd.action();
                document.getElementById('command-palette-overlay').style.display = 'none';
            };
            list.appendChild(li);
        });
    };
}

// --- RAG Assistant Enhancement ---
function initRAGAssistant() {
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send-btn');
    const chatBody = document.querySelector('.chat-body');
    
    if (!chatInput || !chatSend || !chatBody) return;
    
    function askRAG(query) {
        // Simulate RAG response based on portfolio content
        let response = "I'm Ashvin's AI assistant! ";
        
        if (query.toLowerCase().includes('experience')) {
            response += "Ashvin is currently a Data Science Intern at Mastermine Technologies, working on multi-agent LLM frameworks and full-stack applications. He previously worked as a Hardware Systems Intern at Sunlux Technovations.";
        } else if (query.toLowerCase().includes('skills')) {
            response += "Ashvin specializes in AI/ML with expertise in Python, PyTorch, TensorFlow, ROS, and various deep learning frameworks. He's proficient in computer vision, NLP, and robotics.";
        } else if (query.toLowerCase().includes('projects')) {
            response += "Notable projects include a Multilingual News Audio Translator using Wav2Vec 2.0, a Weed Detection Robot with 97% accuracy, and various AI/ML applications in agriculture and automation.";
        } else if (query.toLowerCase().includes('education')) {
            response += "Ashvin is pursuing MTech in Computer Science (AI/ML) at Rajagiri School of Engineering with a CGPA of 9.49. He completed BTech in Robotics and Automation with a CGPA of 9.54.";
        } else {
            response += "I can help you learn about Ashvin's experience, skills, projects, education, or achievements. What would you like to know?";
        }
        
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.textContent = response;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    function handleChat() {
        const query = chatInput.value.trim();
        if (!query) return;
        
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.textContent = query;
        chatBody.appendChild(userMsg);
        
        chatInput.value = '';
        setTimeout(() => askRAG(query), 500);
    }
    
    chatSend.onclick = handleChat;
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') handleChat();
    };
}

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
        
        // Prevent multiple clicks during transition
        if (document.querySelector('.theme-transition')) return;
        
        // Add transition blocker
        document.body.classList.add('theme-switching');
        
        // Create transition container
        const transitionContainer = document.createElement('div');
        transitionContainer.className = 'theme-transition';
        
        // Create curtain effect
        const curtain = document.createElement('div');
        curtain.className = 'transition-curtain';
        transitionContainer.appendChild(curtain);
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'transition-ripple';
        transitionContainer.appendChild(ripple);
        
        document.body.appendChild(transitionContainer);
        
        // Trigger actual theme change at middle of animation
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
        }, 400); // Middle of curtain animation
        
        // Clean up after animation
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

        // Close menu when a link is clicked
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
                // Scrolling down
                header.style.top = '-80px';
            } else {
                // Scrolling up
                header.style.top = '0';
            }
            lastScrollY = window.scrollY;

            // Add shadow on scroll for depth
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
                    // Detect scroll direction
                    let direction = (window.scrollY > lastScrollY) ? 'down' : 'up';
                    // Add animation classes based on direction and element type
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
                    // MODIFIED: Reset element by removing classes when it's not intersecting
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
        // Disable on touch devices for better user experience
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        window.addEventListener('mousemove', e => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        });
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

        // This function traps the focus within the active modal for accessibility
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
        sendBtn.addEventListener('click', handleChatMessage);
        input.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleChatMessage(); });
    }

    // --- Handles Sending and Receiving Chat Messages ---
    async function handleChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        const chatBody = document.querySelector('.chat-body');
        
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        chatBody.appendChild(userMessageDiv);
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-message bot';
        thinkingDiv.innerHTML = '<span class="thinking-indicator"></span>';
        chatBody.appendChild(thinkingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // IMPORTANT: Replace this placeholder URL with your actual backend service URL!
            const response = await fetch('https://your-service-name.onrender.com/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            thinkingDiv.textContent = data.answer;

        } catch (error) {
            thinkingDiv.textContent = 'Sorry, I am having trouble connecting right now.';
            console.error('Error fetching AI response:', error);
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // --- Command Palette (Cmd/Ctrl + K) Logic ---
    function initCommandPalette() {
        const overlay = document.getElementById('command-palette-overlay');
        const input = document.getElementById('cmdk-input');
        const list = document.getElementById('cmdk-list');
        const commands = [
            { icon: 'fas fa-home', name: 'Home', action: () => window.location.href = '#home' },
            { icon: 'fas fa-user', name: 'About', action: () => window.location.href = '#about' },
            { icon: 'fas fa-clock', name: 'Current Work', action: () => window.location.href = '#current-work' },
            { icon: 'fas fa-briefcase', name: 'Experience', action: () => window.location.href = '#experience' },
            { icon: 'fas fa-star', name: 'Featured Projects', action: () => window.location.href = '#featured-projects' },
            { icon: 'fas fa-project-diagram', name: 'All Projects', action: () => window.location.href = '#projects' },
            { icon: 'fas fa-book-open', name: 'Publications', action: () => window.location.href = '#publications' },
            { icon: 'fas fa-code', name: 'Skills', action: () => window.location.href = '#skills' },
            { icon: 'fas fa-trophy', name: 'Awards & Achievements', action: () => window.location.href = '#achievements' },
            { icon: 'fas fa-graduation-cap', name: 'Education', action: () => window.location.href = '#education' },
            { icon: 'fas fa-certificate', name: 'Certifications', action: () => window.location.href = '#certifications' },
            { icon: 'fas fa-heart', name: 'Personal Interests', action: () => window.location.href = '#interests' },
            { icon: 'fas fa-envelope', name: 'Contact', action: () => window.location.href = '#contact' },
            { icon: 'fas fa-file-alt', name: 'Resume', action: () => window.location.href = '#resume' },
            { icon: 'fab fa-github', name: 'Open GitHub', action: () => window.open('https://github.com/ashvinmanojk289', '_blank') },
            { icon: 'fab fa-linkedin', name: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank') },
            { icon: 'fas fa-moon', name: 'Toggle Theme', action: () => document.getElementById('theme-toggle-checkbox').click() },
        ];
        
        const renderCommands = (filter = '') => {
            list.innerHTML = commands
                .filter(cmd => cmd.name.toLowerCase().includes(filter.toLowerCase()))
                .map(cmd => `<li data-action="${cmd.name}"><i class="${cmd.icon}"></i> ${cmd.name}</li>`)
                .join('');
            
            list.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', () => {
                    const actionName = li.dataset.action;
                    const command = commands.find(c => c.name === actionName);
                    if (command) {
                        command.action();
                        togglePalette(false);
                    }
                });
            });
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