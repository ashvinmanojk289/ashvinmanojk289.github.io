document.addEventListener('DOMContentLoaded', () => {
    
    // --- Master Initialization Call ---
    // This function runs once the DOM is fully loaded.
    function main() {
        initTheme();
        initCurrentYear();
        initMobileNav();
        initHeaderScroll();
        initScrollSpy();
        initIntersectionObserver();
        initTypingEffect();
        initProjectFilter();
        init3DTiltEffect();
        initModals();
        initContactForm();
        fetchGitHubStats();
        initChatAssistant();
        initCommandPalette();
        initFloatingActionButton();
        initScrollToTopButton();
        init3DBackground(); // Placed after other UI elements
        initAnimatedCursor(); // Best to run last
    }

    // --- Theme Toggler ---
    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (!themeBtn) return;
        
        const iconSun = document.getElementById('theme-icon-sun');
        const iconMoon = document.getElementById('theme-icon-moon');
        const profileImg = document.getElementById('profile-img');

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'lab') {
                iconSun.classList.remove('hidden');
                iconMoon.classList.add('hidden');
                if (profileImg) profileImg.src = 'assets/profile-light.jpg';
            } else {
                iconSun.classList.add('hidden');
                iconMoon.classList.remove('hidden');
                if (profileImg) profileImg.src = 'assets/profile-dark.jpg';
            }
        };

        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'lab' ? 'dark' : 'lab';
            applyTheme(newTheme);
        });

        // Apply saved theme on initial load
        const savedTheme = localStorage.getItem('theme') || 'lab';
        applyTheme(savedTheme);
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

        if (!navToggle || !navMenu) return;

        const toggleMenu = () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        };
        
        navToggle.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
    
    // --- Header Hide/Show on Scroll ---
    function initHeaderScroll() {
        const header = document.querySelector('.top-header');
        if (!header) return;
        
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            if (lastScrollY < window.scrollY && window.scrollY > 100) {
                header.style.top = '-80px';
            } else {
                header.style.top = '0';
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // --- Scroll Spy for Active Nav Link Highlighting ---
    function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        const sections = document.querySelectorAll('section[id]');
        if (navLinks.length === 0 || sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // --- Animate Elements on Scroll ---
    function initIntersectionObserver() {
        const elementsToReveal = document.querySelectorAll('.reveal');
        if (elementsToReveal.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after revealing to save resources
                    // observer.unobserve(entry.target); 
                } else {
                    // Optional: remove class to re-animate on scroll up
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        elementsToReveal.forEach(el => observer.observe(el));
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
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }
    
    // --- Fetch Live Data from GitHub API ---
    async function fetchGitHubStats() {
        const reposEl = document.getElementById('github-repos');
        const starsEl = document.getElementById('github-stars');
        const activityEl = document.getElementById('github-activity');
        if (!reposEl || !starsEl || !activityEl) return;

        try {
            const user = 'ashvinmanojk289';
            const response = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=5`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const repos = await response.json();

            // Fetch all repos to count stars accurately (this is a bit more intensive)
            const allReposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
            const allRepos = await allReposResponse.json();
            
            reposEl.textContent = allRepos.length;
            starsEl.textContent = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

            if (repos.length > 0) {
                activityEl.innerHTML = repos.slice(0, 3).map(repo => 
                    `<li>
                        <span class="commit-msg">${repo.name}</span>
                        <span class="commit-date">${new Date(repo.pushed_at).toLocaleDateString()}</span>
                    </li>`
                ).join('');
            } else {
                activityEl.innerHTML = '<li>No recent public activity.</li>';
            }

        } catch (error) { 
            console.error('Failed to fetch GitHub stats:', error);
            activityEl.innerHTML = '<li>Could not fetch GitHub data.</li>';
        }
    }

    // --- Project Category Filtering Logic ---
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                
                projectCards.forEach(card => {
                    const isVisible = filter === 'all' || card.dataset.category.includes(filter);
                    card.style.display = isVisible ? 'block' : 'none';
                });
            });
        });
    }

    // --- 3D Tilt Effect for Project Cards ---
    function init3DTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .bento-box, .achievement-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = (y - rect.height / 2) / 15; // Reduced intensity
                const rotateY = (rect.width / 2 - x) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                card.style.transition = 'transform 0.1s ease-out';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.transition = 'transform 0.4s ease-in-out';
            });
        });
    }

    // --- Accessible Modal Logic ---
    function initModals() {
        const openButtons = document.querySelectorAll('.open-modal-btn');
        const closeButtons = document.querySelectorAll('.close-modal-btn');
        const overlay = document.querySelector('.modal-overlay');
        if (!overlay) return;

        let activeModal = null;
        let lastFocusedElement = null;

        const openModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            lastFocusedElement = document.activeElement;
            activeModal = modal;
            modal.style.display = 'block';
            overlay.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
                overlay.classList.add('active');
            }, 10);
            
            document.body.style.overflow = 'hidden';
            modal.querySelector('.close-modal-btn').focus();
        };

        const closeModal = () => {
            if (!activeModal) return;
            
            activeModal.classList.remove('active');
            overlay.classList.remove('active');
            setTimeout(() => {
                activeModal.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                if (lastFocusedElement) lastFocusedElement.focus();
                activeModal = null;
            }, 300);
        };

        openButtons.forEach(button => {
            button.addEventListener('click', () => openModal(button.dataset.modalTarget));
        });

        closeButtons.forEach(button => button.addEventListener('click', closeModal));
        overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeModal) closeModal();
        });
    }
    
    // --- Contact Form Submission Handling ---
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const sendingContainer = form.querySelector('.form-sending');
            const successMessage = document.getElementById('form-success-message');

            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Sending<span class="sending">...</span>';
            sendingContainer.classList.add('form-sending');
            submitButton.disabled = true;

            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    form.reset();
                    successMessage.classList.add('show');
                    setTimeout(() => successMessage.classList.remove('show'), 5000);
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                alert('An unexpected error occurred. Please check your connection.');
            })
            .finally(() => {
                submitButton.innerHTML = originalButtonText;
                sendingContainer.classList.remove('form-sending');
                submitButton.disabled = false;
            });
        });
    }

    // --- AI Chat Assistant Logic ---
    function initChatAssistant() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const chatWindow = document.getElementById('chat-window');
        const closeBtn = document.getElementById('chat-close-btn');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');

        if (!toggleBtn || !chatWindow || !closeBtn || !form) return;

        const showChat = () => { chatWindow.style.display = 'flex'; setTimeout(() => input.focus(), 50); };
        const hideChat = () => chatWindow.style.display = 'none';
        
        toggleBtn.addEventListener('click', showChat);
        closeBtn.addEventListener('click', hideChat);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatWindow.style.display === 'flex') hideChat();
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                chatWindow.style.display === 'flex' ? hideChat() : showChat();
            }
        });
        
        const addMessage = (text, sender = 'assistant') => {
            const msg = document.createElement('div');
            msg.className = `chat-message ${sender}`;
            msg.textContent = text;
            messagesContainer.appendChild(msg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const handleUserInput = (query) => {
            const cleanQuery = query.trim();
            if (!cleanQuery) return;
            addMessage(cleanQuery, 'user');
            
            // Basic command matching
            const commands = {
                'home': () => { addMessage('Navigating to Home.'); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); },
                'about': () => { addMessage('Navigating to About.'); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); },
                'experience': () => { addMessage('Navigating to Experience.'); document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); },
                'projects': () => { addMessage('Navigating to Projects.'); document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' }); },
                'skills': () => { addMessage('Navigating to Skills.'); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); },
                'awards': () => { addMessage('Navigating to Awards.'); document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }); },
                'contact': () => { addMessage('Navigating to Contact.'); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); },
                'theme': () => { addMessage('Toggling the theme.'); document.getElementById('theme-toggle-btn')?.click(); },
                'github': () => { addMessage('Opening GitHub profile...'); window.open('https://github.com/ashvinmanojk289', '_blank'); },
                'linkedin': () => { addMessage('Opening LinkedIn profile...'); window.open('https://linkedin.com/in/ashvinmanojk289', '_blank'); },
                'help': () => { addMessage('You can ask me to navigate (e.g., "go to projects"), toggle the theme, or open social profiles!'); },
            };

            const lowerQuery = cleanQuery.toLowerCase();
            const command = Object.keys(commands).find(key => lowerQuery.includes(key));
            
            if (command) {
                commands[command]();
            } else {
                addMessage('Sorry, I can only help with navigation and basic commands right now. Try "Go to projects" or "help".');
            }
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUserInput(input.value);
            input.value = '';
        });

        // Initial greeting
        addMessage('Hi there! I can help you navigate the site. Try typing "go to projects" or "toggle theme".');
    }

    // --- Command Palette Logic ---
    function initCommandPalette() {
        const palette = document.getElementById('command-palette');
        const input = document.getElementById('command-palette-input');
        const list = document.getElementById('command-palette-list');
        if (!palette || !input || !list) return;

        const commands = [
            { label: 'Go to Home', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Projects', action: () => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Skills', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Awards', action: () => document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Toggle Theme', action: () => document.getElementById('theme-toggle-btn')?.click() },
            { label: 'Download Resume', action: () => document.querySelector('a[href="assets/resume.pdf"]')?.click() },
            { label: 'Open GitHub Profile', action: () => window.open('https://github.com/ashvinmanojk289', '_blank') },
            { label: 'Open LinkedIn Profile', action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank') },
        ];

        let filteredCommands = [...commands];
        let selectedIndex = 0;

        const closePalette = () => { palette.style.display = 'none'; };
        const openPalette = () => {
            palette.style.display = 'flex';
            input.value = '';
            filterCommands('');
            setTimeout(() => input.focus(), 50);
        };

        const renderList = () => {
            list.innerHTML = '';
            filteredCommands.forEach((cmd, i) => {
                const li = document.createElement('li');
                li.textContent = cmd.label;
                li.setAttribute('role', 'option');
                li.setAttribute('aria-selected', i === selectedIndex);
                if (i === selectedIndex) li.classList.add('selected');
                
                li.addEventListener('click', () => {
                    cmd.action();
                    closePalette();
                });
                list.appendChild(li);
            });
        };

        const filterCommands = (query) => {
            filteredCommands = commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));
            selectedIndex = 0;
            renderList();
        };

        input.addEventListener('input', () => filterCommands(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderList();
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderList();
                e.preventDefault();
            } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                closePalette();
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openPalette();
            }
        });

        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });
    }

    // --- Floating Action Button to scroll to contact ---
    function initFloatingActionButton() {
        const fab = document.getElementById('fab-contact');
        if (!fab) return;
        fab.addEventListener('click', () => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Scroll-to-Top Button ---
    function initScrollToTopButton() {
        const btn = document.getElementById('scrollToTopBtn');
        if (!btn) return;
        
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }, { passive: true });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- Unique Animated Mouse Cursor ---
    function initAnimatedCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) return; // Disable on touch devices

        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;
        
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            dotX += (mouseX - dotX) * 0.6;
            dotY += (mouseY - dotY) * 0.6;
            outlineX += (mouseX - outlineX) * 0.2;
            outlineY += (mouseY - outlineY) * 0.2;

            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;

            requestAnimationFrame(animate);
        };
        
        animate();

        document.querySelectorAll('a, button, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => outline.classList.remove('cursor-interact'));
        });
    }

    // --- 3D Background with Three.js ---
    function init3DBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 5;

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.005 });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            particlesMesh.rotation.y = -0.1 * elapsedTime;

            if (mouseX > 0) {
                particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
                particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
            }
            
            renderer.render(scene, camera);
            window.requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- Run the master initializer ---
    main();
});