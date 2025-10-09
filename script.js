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

    // Initialize micro-interactions after main init
    initButtonRipples();
    initProgressAnimations();

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
        // Sticky navbar logic
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.sticky-navbar');
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

    // --- Button Ripple Micro-interaction ---
    function initButtonRipples() {
        const buttons = document.querySelectorAll('.button, .button-secondary, .filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    // --- Animate progress bars when visible ---
    function initProgressAnimations() {
        const progressFills = document.querySelectorAll('.progress-fill');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // read width style classes (progress-25 etc.) and animate
                    if (el.classList.contains('progress-25')) el.style.width = '25%';
                    if (el.classList.contains('progress-50')) el.style.width = '50%';
                    if (el.classList.contains('progress-75')) el.style.width = '75%';
                    if (el.classList.contains('progress-85')) el.style.width = '85%';
                    if (el.classList.contains('progress-90')) el.style.width = '90%';
                    if (el.classList.contains('progress-95')) el.style.width = '95%';
                    if (el.classList.contains('progress-100')) el.style.width = '100%';
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.3 });
        progressFills.forEach(p => {
            // collapse initially to allow animation
            p.style.width = '0%';
            obs.observe(p);
        });
    }

    // --- Testimonials carousel ---
    function initTestimonials() {
        const track = document.querySelector('.testimonials-track');
        const prevBtn = document.querySelector('.test-nav.prev');
        const nextBtn = document.querySelector('.test-nav.next');
        const indicatorsContainer = document.querySelector('.test-indicators');
        if (!track) return;
        let index = 0;
        const cards = Array.from(track.children);
        let autoTimer = null;

        function cardWidth() {
            const gap = parseInt(getComputedStyle(track).gap) || 18;
            return (cards[0].getBoundingClientRect().width + gap);
        }

        function update() {
            const w = cardWidth();
            track.style.transform = `translateX(${-(w * index)}px)`;
            // update indicators
            if (indicatorsContainer) {
                Array.from(indicatorsContainer.children).forEach((btn, i) => {
                    btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
                    btn.tabIndex = i === index ? 0 : -1;
                });
            }
            // announce to screen readers
            const live = document.getElementById('testimonials-live');
            if (live && cards[index]) {
                const author = cards[index].querySelector('.testimonial-author')?.textContent || `Testimonial ${index+1}`;
                const excerpt = cards[index].querySelector('p')?.textContent?.slice(0, 120) || '';
                live.textContent = `${author}: ${excerpt}`;
            }
        }

        function goto(i) {
            index = Math.max(0, Math.min(cards.length - 1, i));
            update();
            resetAuto();
        }

        prevBtn.addEventListener('click', () => goto(index - 1));
        nextBtn.addEventListener('click', () => goto(index + 1));

        // create indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            cards.forEach((_, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', `Show testimonial ${i + 1}`);
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                btn.tabIndex = i === 0 ? 0 : -1;
                btn.addEventListener('click', () => goto(i));
                indicatorsContainer.appendChild(btn);
            });
        }

        // auto advance with pause on interaction
        function resetAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(() => { goto((index + 1) % cards.length); }, 6000);
        }
        resetAuto();

        // keyboard support
        track.parentElement.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goto(index - 1);
            if (e.key === 'ArrowRight') goto(index + 1);
        });

        // touch support (simple swipe)
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const dx = (e.changedTouches[0].clientX - touchStartX);
            if (dx > 40) goto(index - 1);
            else if (dx < -40) goto(index + 1);
        });

        window.addEventListener('resize', update);
        // initial layout call
        setTimeout(update, 50);
    }

    // --- Floating Action Button (FAB) behavior ---
    function initFAB() {
        // Create and append a FAB for quick contact if not present
        if (document.querySelector('.fab')) return;
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.setAttribute('aria-label', 'Contact');
        fab.innerHTML = '<i class="fas fa-envelope"></i>';
        document.body.appendChild(fab);
        fab.addEventListener('click', () => { window.location.href = '#contact'; });
    }

    // --- Hero parallax subtle effect ---
    function initHeroParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = `${scrolled * 0.06}px`;
        });
    }

    // --- Ensure section headings get unified tile styles ---
    function initHeadingTiles() {
        document.querySelectorAll('.section-title').forEach(el => el.classList.add('heading-tile'));
    }

    // Final initialization for added features
    initTestimonials();
    initFAB();
    initHeroParallax();
    initHeadingTiles();

    // --- Avatar fallback & initialization ---
    function initAvatarFallbacks() {
        document.querySelectorAll('.testimonial-avatar').forEach(img => {
            // hide fallback when image loads
            img.addEventListener('load', () => {
                const fallback = img.parentElement.querySelector('.avatar-fallback');
                if (fallback) fallback.style.display = 'none';
            });
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const fallback = img.parentElement.querySelector('.avatar-fallback');
                if (fallback) fallback.style.display = 'inline-flex';
            });
        });

        // Set initial avatar sources based on theme
        const isLab = document.documentElement.getAttribute('data-theme') === 'lab';
        document.querySelectorAll('.testimonial-avatar').forEach(img => {
            const light = img.dataset.light;
            const dark = img.dataset.dark;
            if (isLab && light) img.src = light;
            if (!isLab && dark) img.src = dark;
        });
    }
    initAvatarFallbacks();

    // --- Dynamic initials for avatar-fallback elements ---
    function initAvatarInitials() {
        document.querySelectorAll('.testimonial-card').forEach(card => {
            const authorEl = card.querySelector('.testimonial-author');
            const fallback = card.querySelector('.avatar-fallback');
            if (!authorEl || !fallback) return;
            const text = authorEl.textContent || '';
            // Extract initials from common patterns — take first letters of first two words
            const name = text.replace(/^—\s*/, '').split(',')[0].trim();
            const parts = name.split(/\s+/).filter(Boolean);
            let initials = '';
            if (parts.length === 1) initials = parts[0].slice(0,2).toUpperCase();
            else initials = (parts[0][0] + (parts[1][0] || '')).toUpperCase();
            fallback.textContent = initials;
        });
    }
    initAvatarInitials();

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
                // swap testimonial avatars to darker variants if available
                document.querySelectorAll('.testimonial-avatar').forEach((img, i) => {
                    // fallback: keep same if dark variant unavailable
                    const darkSrc = img.dataset.dark || img.src;
                    img.src = darkSrc;
                });
            } else {
                document.documentElement.setAttribute('data-theme', 'lab');
                localStorage.setItem('theme', 'lab');
                iconSun.classList.remove('hidden');
                iconMoon.classList.add('hidden');
                if (profileImg) profileImg.src = 'assets/profile-light.jpg';
                // swap testimonial avatars back to light variants if available
                document.querySelectorAll('.testimonial-avatar').forEach((img, i) => {
                    const lightSrc = img.dataset.light || img.src;
                    img.src = lightSrc;
                });
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
});