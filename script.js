document.addEventListener('DOMContentLoaded', () => {

    // --- Loading Spinner Logic ---
    const spinner = document.getElementById('loadingSpinner');
    // Hide spinner after page is fully loaded
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
    initIntersectionObserver(); // Simplified version
    initCustomCursor();
    initTypingEffect();
    initProjectFilter();
    init3DTiltEffect();
    initModals();
    initChatAssistant();
    initCommandPalette();
    fetchGitHubStats();

    // Initialize advanced features if their libraries are loaded
    if (typeof THREE !== 'undefined') {
        initializeThreeHero();
    }
    if (typeof Chart !== 'undefined') {
        initializeGitHubChart();
    }
});

// --- Theme Toggler ---
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
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
    
    const currentTheme = localStorage.getItem('theme') || 'lab';
    applyTheme(currentTheme);

    themeBtn.addEventListener('click', function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'lab' ? 'dark' : 'lab';
        triggerThemeTransition(() => applyTheme(newTheme));
    });
}

// --- Elegant Theme Transition ---
function triggerThemeTransition(changeThemeCallback) {
    if (document.body.classList.contains('theme-switching')) return;

    document.body.classList.add('theme-switching');
    
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'theme-transition';
    const curtain = document.createElement('div');
    curtain.className = 'transition-curtain';
    transitionContainer.appendChild(curtain);
    document.body.appendChild(transitionContainer);
    
    setTimeout(changeThemeCallback, 400); 
    
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
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.top = '-80px';
        } else {
            header.style.top = '0';
        }
        lastScrollY = window.scrollY;

        header.style.boxShadow = window.scrollY > 50 ? '0 2px 15px var(--shadow-color)' : 'none';
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

// --- SIMPLIFIED: Animate Elements on Scroll (One-Time Trigger) ---
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// --- Custom Cursor Effect ---
function initCustomCursor() {
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
                card.style.display = 'none'; // Use display none for filtering
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'flex';
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

// --- Accessible Modal Logic ---
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

// --- Handles Sending and Receiving Chat Messages (FIXED) ---
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
        // IMPORTANT: The fetch call is commented out as the URL is a placeholder.
        // Replace with your actual backend service when ready.
        // const response = await fetch('https://your-service-name.onrender.com/ask', { ... });
        // const data = await response.json();
        // thinkingDiv.textContent = data.answer;
        
        // Using a temporary response to avoid errors.
        setTimeout(() => {
            thinkingDiv.textContent = "This AI assistant is currently under development. Please check back later!";
        }, 1000);

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
        { icon: 'fas fa-briefcase', name: 'Experience', action: () => window.location.href = '#experience' },
        { icon: 'fas fa-star', name: 'Featured Projects', action: () => window.location.href = '#featured-projects' },
        { icon: 'fas fa-code', name: 'Skills', action: () => window.location.href = '#skills' },
        { icon: 'fas fa-trophy', name: 'Awards', action: () => window.location.href = '#achievements' },
        { icon: 'fas fa-envelope', name: 'Contact', action: () => window.location.href = '#contact' },
        { icon: 'fas fa-file-alt', name: 'Resume', action: () => window.location.href = '#resume' },
        { icon: 'fab fa-github', name: 'Open GitHub', action: () => window.open('https://github.com/ashvinmanojk289', '_blank') },
        { icon: 'fab fa-linkedin', name: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/ashvinmanojk289', '_blank') },
        { icon: 'fas fa-moon', name: 'Toggle Theme', action: () => document.getElementById('theme-toggle-btn').click() },
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


// --- Functions for dynamically loaded libraries ---

function initializeThreeHero() {
    const container = document.getElementById('three-hero');
    if (!container) return;
    
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
}

async function initializeGitHubChart() {
    try {
        const response = await fetch('https://api.github.com/users/ashvinmanojk289/repos');
        const repos = await response.json();
        
        const langCount = {};
        repos.forEach(repo => {
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        });
        
        const chartContainer = document.getElementById('github-lang-chart');
        if (chartContainer && Object.keys(langCount).length > 0) {
            new Chart(chartContainer.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(langCount),
                    datasets: [{
                        data: Object.values(langCount),
                        backgroundColor: ['#0A66C2', '#057642', '#F59E0B', '#8B5CF6', '#3B82F6', '#34D399', '#FBBF24'],
                        borderColor: 'var(--bg-secondary)',
                        borderWidth: 2
                    }]
                },
                options: {
                    plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-secondary)' } } },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    } catch (error) {
        console.log('GitHub API error for chart:', error);
    }
}