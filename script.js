document.addEventListener('DOMContentLoaded', () => {

    // --- Global Initializations ---
    initTheme();
    initCurrentYear();
    initScrollSpy();
    initIntersectionObserver();
    initCustomCursor();
    initTypingEffect();
    initProjectFilter();
    initChatAssistant();
    initCommandPalette();
    fetchGitHubStats();

    // --- Theme Toggler ---
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle-checkbox');
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.checked = currentTheme === 'dark';
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Set Current Year in Footer ---
    function initCurrentYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    // --- Custom Cursor ---
    function initCustomCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        window.addEventListener('mousemove', e => {
            const { clientX: x, clientY: y } = e;
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            cursorOutline.style.left = `${x}px`;
            cursorOutline.style.top = `${y}px`;
        });
        document.querySelectorAll('a, button, .switch, .filter-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    // --- Hero Section Typing Effect ---
    function initTypingEffect() {
        const target = document.querySelector('.typing-effect');
        const words = ["Robotics", "Natural Language Processing", "Computer Vision", "the Real World"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const typeSpeed = isDeleting ? 75 : 150;

            target.textContent = currentWord.substring(0, charIndex);

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- GitHub API Fetch ---
    async function fetchGitHubStats() {
        try {
            const user = 'ashvinmanojk289';
            const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`);
            const repos = await repoResponse.json();
            
            const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            document.getElementById('github-repos').textContent = repos.length;
            document.getElementById('github-stars').textContent = totalStars;

            const activityList = document.getElementById('github-activity');
            const recentCommits = repos.slice(0, 3); // Get 3 most recently pushed repos
            activityList.innerHTML = recentCommits.map(repo => 
                `<li>Pushed to <strong>${repo.name}</strong></li>`
            ).join('');

        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
            document.getElementById('github-activity').innerHTML = '<li>Could not fetch data.</li>';
        }
    }

    // --- Project Filtering ---
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                projectCards.forEach(card => {
                    card.style.display = 'none'; // Hide all first
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        card.style.display = 'flex'; // Show matching
                    }
                });
            });
        });
    }

    // --- AI Chat Assistant ---
    function initChatAssistant() {
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        const chatWindow = document.querySelector('.chat-window');
        toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));

        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');
        sendBtn.addEventListener('click', () => handleChatMessage());
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleChatMessage();
        });
    }

    function handleChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;
        
        const chatBody = document.querySelector('.chat-body');
        chatBody.innerHTML += `<div class="chat-message user">${message}</div>`;
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom

        // **Placeholder for AI Logic**
        setTimeout(() => {
            const botResponse = "I'm a demo bot! For a real implementation, Ashvin would connect me to a model trained on his resume data using RAG.";
            chatBody.innerHTML += `<div class="chat-message bot">${botResponse}</div>`;
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    // --- Command Palette ---
    function initCommandPalette() {
        const overlay = document.getElementById('command-palette-overlay');
        const input = document.getElementById('cmdk-input');
        const list = document.getElementById('cmdk-list');
        const commands = [
            { icon: 'fas fa-home', name: 'Go to Home', action: () => window.location.href = '#home' },
            { icon: 'fas fa-user', name: 'Go to About', action: () => window.location.href = '#about' },
            { icon: 'fas fa-project-diagram', name: 'Go to Projects', action: () => window.location.href = '#projects' },
            { icon: 'fas fa-envelope', name: 'Go to Contact', action: () => window.location.href = '#contact' },
            { icon: 'fab fa-github', name: 'Open GitHub', action: () => window.open('https://github.com/ashvinmanojk289') },
            { icon: 'fab fa-linkedin', name: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/ashvinmanojk289') },
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

    // --- Scroll Spy & Intersection Observer (Refined) ---
    // [Logic from original file can be retained and placed here]
    function initScrollSpy() { /* ... */ }
    function initIntersectionObserver() { /* ... */ }
});
