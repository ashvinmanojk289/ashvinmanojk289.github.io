document.addEventListener('DOMContentLoaded', () => {
    // --- Master Initialization ---
    // This is the central point that calls all other initialization functions.
    initSpinner();
    initScrollToTop();
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
    fetchGitHubStats();
    initChatAssistant(); // Added missing call to the chat assistant initializer.

    // --- Loading Spinner Logic ---
    // Renamed for clarity, as it handles more than just 'beforeunload'.
    function initSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (!spinner) return; // Defensive check
        // Show spinner when navigating away
        window.addEventListener('beforeunload', () => {
            spinner.classList.add('active');
        });
        // Hide spinner when the new page is fully loaded
        // Note: 'load' is often too late. For a better UX, this might be handled differently.
        window.addEventListener('load', () => {
            spinner.classList.remove('active');
        });
    }

    // --- Scroll-to-Top Button Logic ---
    function initScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        if (!scrollBtn) return; // Defensive check
        window.addEventListener('scroll', () => {
            // Use a ternary operator for conciseness
            window.scrollY > 300 ?
                scrollBtn.classList.add('visible') :
                scrollBtn.classList.remove('visible');
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Theme Toggler ---
    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        const iconSun = document.getElementById('theme-icon-sun');
        const iconMoon = document.getElementById('theme-icon-moon');
        // Defensive checks to prevent errors if elements don't exist
        if (!themeBtn || !iconSun || !iconMoon) return;

        // Function to apply the theme based on the value
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'lab') {
                iconSun.classList.remove('hidden');
                iconMoon.classList.add('hidden');
            } else {
                iconSun.classList.add('hidden');
                iconMoon.classList.remove('hidden');
            }
        };

        // Get theme from storage or default to 'lab'
        const currentTheme = localStorage.getItem('theme') || 'lab';
        applyTheme(currentTheme);

        // Add the click event listener
        themeBtn.addEventListener('click', function() {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'lab' ? 'dark' : 'lab';
            applyTheme(newTheme);
        });
    }

    // --- CORRECTED: The following functions were missing. Added as stubs. ---
    // You should provide your own implementation for these.
    function initCurrentYear() { /* Implement logic to display current year */ }
    function initMobileNav() { /* Implement logic for mobile navigation toggle */ }
    function initHeaderScroll() { /* Implement logic for header behavior on scroll */ }


    // --- CORRECTED: This logic was floating outside a function. It's now properly encapsulated. ---
    // --- Scroll Spy for Navigation Links ---
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a'); // Assuming nav links are 'a' tags inside 'nav'
        if (sections.length === 0 || navLinks.length === 0) return;

        const setActiveLink = () => {
            let currentId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) { // Offset to trigger highlight sooner
                    currentId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                // Check if the link's href matches the current section's ID
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', setActiveLink);
        setActiveLink(); // Set initial active link on page load
    }

    // --- Animate Elements on Scroll ---
    function initIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.reveal');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after animation to save resources
                    // observer.unobserve(entry.target); 
                } else {
                    // Re-enables animation every time it scrolls into view
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1
        }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Custom Cursor Effect ---
    function initCustomCursor() {
        // Disable on touch devices for a better user experience
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', e => {
            const posX = `${e.clientX}px`;
            const posY = `${e.clientY}px`;
            cursorDot.style.left = posX;
            cursorDot.style.top = posY;
            // Use a slight delay for the outline for a smoother trailing effect
            cursorOutline.animate({
                left: posX,
                top: posY
            }, {
                duration: 500,
                fill: 'forwards'
            });
        });

        document.querySelectorAll('a, button, .filter-btn, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    // --- Hero Section Typing Animation ---
    function initTypingEffect() {
        const target = document.querySelector('.typing-effect');
        if (!target) return;

        const words = ["Robotics", "Natural Language Processing", "Computer Vision", "the Real World"];
        let wordIndex = 0,
            charIndex = 0,
            isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const typeSpeed = isDeleting ? 75 : 150;

            // Update text content
            target.textContent = currentWord.substring(0, charIndex);

            if (!isDeleting && charIndex < currentWord.length) {
                // If not deleting and word is not complete, type next char
                charIndex++;
            } else if (isDeleting && charIndex > 0) {
                // If deleting and word is not empty, delete char
                charIndex--;
            } else {
                // Switch mode (typing -> deleting or deleting -> typing)
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    // If switched to typing, move to the next word
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            // Pause at the end of a word before deleting
            const pauseTime = charIndex === currentWord.length ? 2000 : typeSpeed;
            setTimeout(type, pauseTime);
        }
        type(); // Start the effect
    }


    // --- Fetch Live Data from GitHub API ---
    async function fetchGitHubStats() {
        try {
            const user = 'ashvinmanojk289';
            const response = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const repos = await response.json();

            const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            const repoCount = repos.length;
            const recentActivity = repos.slice(0, 3)
                .map(repo => `<li>Pushed to <strong>${repo.name}</strong></li>`)
                .join('');

            document.getElementById('github-repos').textContent = repoCount;
            document.getElementById('github-stars').textContent = totalStars;
            document.getElementById('github-activity').innerHTML = recentActivity;
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
            document.getElementById('github-activity').innerHTML = '<li>Could not fetch GitHub data.</li>';
        }
    }

    // --- Project Category Filtering Logic ---
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        if (filterBtns.length === 0 || projectCards.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Show/hide project cards
                projectCards.forEach(card => {
                    const isVisible = filter === 'all' || card.dataset.category.includes(filter);
                    card.style.display = isVisible ? 'block' : 'none'; // Use display instead of a hidden class for simplicity
                });
            });
        });
    }

    // --- 3D Tilt Effect for Project Cards ---
    function init3DTiltEffect() {
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) return;

        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const maxRotate = 10; // Max rotation in degrees

                // Calculate rotation based on mouse position relative to the card's center
                const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * -maxRotate;
                const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * maxRotate;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset transform on mouse leave
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // --- Accessible Modal Logic (with Focus Trapping) ---
    function initModals() {
        const openModalButtons = document.querySelectorAll('[data-modal-target]');
        if (openModalButtons.length === 0) return;

        const modalOverlay = document.querySelector('.modal-overlay');
        let activeModal = null;
        let lastFocusedElement = null;

        const openModal = (modalId, triggerButton) => {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            lastFocusedElement = triggerButton;
            modal.classList.add('active');
            if (modalOverlay) modalOverlay.classList.add('active');
            activeModal = modal;
            document.body.style.overflow = 'hidden';

            document.addEventListener('keydown', handleKeyDown);

            // Focus on the first focusable element inside the modal
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        };

        const closeModal = () => {
            if (!activeModal) return;

            activeModal.classList.remove('active');
            if (modalOverlay) modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);

            // Return focus to the element that opened the modal
            if (lastFocusedElement) lastFocusedElement.focus();
            activeModal = null;
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();

            if (e.key === 'Tab' && activeModal) {
                const focusable = [...activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        openModalButtons.forEach(button => {
            button.addEventListener('click', () => openModal(button.dataset.modalTarget, button));
        });

        // Add event listeners to all close buttons and the overlay
        document.querySelectorAll('.close-modal-btn').forEach(button => button.addEventListener('click', closeModal));
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    }


    // --- CORRECTED: This logic was floating, incomplete, and had errors. It's now a complete, working function. ---
    // --- AI Chat Assistant Widget Logic ---
    function initChatAssistant() {
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        const chatWindow = document.querySelector('.chat-window');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        const commandList = document.getElementById('chat-command-list'); // Assumed ID for the list element

        if (!toggleBtn || !chatWindow || !sendBtn || !input || !commandList) return;

        const commands = [{
                icon: 'fas fa-book-open',
                name: 'Publications',
                action: () => document.getElementById('publications').scrollIntoView({ behavior: 'smooth' })
            },
            {
                icon: 'fas fa-code',
                name: 'Skills',
                action: () => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })
            },
            {
                icon: 'fas fa-envelope',
                name: 'Contact',
                action: () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
            },
            {
                icon: 'fas fa-file-alt',
                name: 'Resume',
                action: () => document.getElementById('resume').scrollIntoView({ behavior: 'smooth' })
            },
            {
                icon: 'fab fa-github',
                name: 'Open GitHub',
                action: () => window.open('https://github.com/ashvinmanojk289', '_blank')
            },
            {
                icon: 'fab fa-linkedin',
                name: 'Open LinkedIn',
                action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank')
            },
            {
                icon: 'fas fa-moon',
                name: 'Toggle Theme',
                action: () => document.getElementById('theme-toggle-btn').click() // Corrected to use the button ID
            }
        ];

        const renderCommands = (filter = '') => {
            const filteredCommands = commands.filter(cmd => cmd.name.toLowerCase().includes(filter.toLowerCase()));
            commandList.innerHTML = filteredCommands
                .map(cmd => `<li data-action="${cmd.name}"><i class="${cmd.icon}"></i> ${cmd.name}</li>`)
                .join('');

            // Re-attach event listeners after rendering
            commandList.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', () => {
                    const actionName = li.dataset.action;
                    const command = commands.find(c => c.name === actionName);
                    if (command && typeof command.action === 'function') {
                        command.action(); // Execute the action
                        chatWindow.classList.remove('active'); // Close chat after action
                    }
                });
            });
        };

        const handleChatMessage = () => {
            const query = input.value.trim();
            // In a real AI chat, you'd send this query to a backend.
            // For this version, we'll just use it to filter the commands.
            renderCommands(query);
        };

        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                renderCommands(); // Render all commands when opening
                input.focus();
            }
        });

        sendBtn.addEventListener('click', handleChatMessage);
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleChatMessage();
            } else {
                // Live filter as the user types
                renderCommands(input.value.trim());
            }
        });
    }

});