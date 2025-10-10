document.addEventListener('DOMContentLoaded', () => {

    const projectData = [
        { title: 'Hybrid EfficientNetV2-Transformer Model', description: 'Advanced deep learning model for precision weed detection with comprehensive model comparison and analysis.', link: 'https://github.com/ashvinmanojk289/Hybrid-EfficientNetV2-Transformer-Model-and-Other-Model-Comparison-for-Weed-Detection', category: 'cv' },
        { title: 'PDF Query Application', description: 'Developed a scalable, voice-enabled PDF query system using NLP and Streamlit, transforming static documents into conversational hubs.', link: 'https://github.com/ashvinmanojk289/PDF-Query-Application', category: 'nlp' },
        { title: 'Simple Google PageRank Algorithm', description: 'Implementation of Google\'s PageRank algorithm, demonstrating fundamental concepts of link analysis and graph-based ranking systems.', link: 'https://github.com/ashvinmanojk289/Simple-Google-PageRank-Algorithm', category: 'nlp' },
        { title: 'Quadruped Emoji Bot', description: 'A fun, interactive 4-legged robot that displays random emojis on an OLED screen, controlled wirelessly via a custom mobile app.', link: 'https://github.com/ashvinmanojk289/Quadrobot', category: 'robotics' }
    ];

    const testimonialData = [
        { quote: "Ashvin consistently delivers production-ready ML systems with clean engineering and reproducible experiments. Highly recommended for applied AI work.", author: "Dr. Meera Krishnan, Research Supervisor" },
        { quote: "Ashvin is a dependable ML engineer who balances model innovation with production constraints—excellent collaboration and technical delivery.", author: "Rahul Menon, Product Lead" },
        { quote: "His ability to quickly grasp complex systems and his contribution to improving our process efficiency was invaluable. He is a dedicated and resourceful engineer.", author: "HR, Sunlux Technovations" }
    ];

    // --- Master Initialization ---
    initPageLoader();
    initTheme();
    initCurrentYear();
    initMobileNav();
    initHeaderScroll();
    initScrollSpy();
    initIntersectionObserver();
    initCustomCursor();
    initTypingEffect();
    initMarquee();
    fetchGitHubStats();
    initProjects();
    initTestimonials();

    function initPageLoader() {
        const loader = document.getElementById('page-loader');
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        });
    }

    function initTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        const profileImg = document.getElementById('profile-img');
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (profileImg) {
                profileImg.src = theme === 'dark' ? 'assets/profile-dark.jpg' : 'assets/profile-light.jpg';
            }
        };
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);
        themeBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    function initCurrentYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    function initMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    function initHeaderScroll() {
        const header = document.querySelector('.main-header');
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.style.top = '-100px';
            } else {
                header.style.top = '0';
            }
            lastScrollY = window.scrollY;
        });
    }

    function initScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        window.addEventListener('scroll', () => {
            let currentId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    currentId = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    function initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

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
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    function initTypingEffect() {
        const target = document.querySelector('.typing-effect');
        if (!target) return;
        const words = ["Robotics", "Natural Language Processing", "Computer Vision", "the Real World"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentWord = words[wordIndex];
            target.textContent = currentWord.substring(0, charIndex);
            if (isDeleting) charIndex--; else charIndex++;
            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, isDeleting ? 75 : 150);
        }
        type();
    }

    function initMarquee() {
        const marqueeInner = document.querySelector('.marquee-inner');
        if (marqueeInner) {
            const content = marqueeInner.querySelector('.marquee-content');
            if (content) marqueeInner.appendChild(content.cloneNode(true));
        }
    }

    async function fetchGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/ashvinmanojk289/repos');
            const repos = await response.json();
            const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            document.getElementById('github-repos').textContent = repos.length || 0;
            document.getElementById('github-stars').textContent = totalStars || 0;
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
        }
    }

    function initProjects() {
        const projectList = document.querySelector('.project-list');
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (!projectList || !filterBtns) return;

        const renderProjects = (filter = 'all') => {
            projectList.innerHTML = '';
            const filteredProjects = (filter === 'all') ? projectData : projectData.filter(p => p.category === filter);
            
            filteredProjects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card reveal';
                card.innerHTML = `
                    <div class="project-details">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    <div class="project-link">
                        <a href="${project.link}" target="_blank" rel="noopener">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                projectList.appendChild(card);
            });
            // Re-run observer for new elements
            document.querySelectorAll('.project-list .reveal').forEach(el => new IntersectionObserver(entries => {
                entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
            }, {threshold: 0.1}).observe(el));
        };
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProjects(btn.dataset.filter);
            });
        });
        
        renderProjects();
    }
    
    function initTestimonials() {
        const track = document.querySelector('.testimonial-track');
        const prevBtn = document.querySelector('.test-nav.prev');
        const nextBtn = document.querySelector('.test-nav.next');
        if (!track) return;

        testimonialData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `<p>"${item.quote}"</p><span>— ${item.author}</span>`;
            track.appendChild(card);
        });

        let currentIndex = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalCards - 1 : currentIndex - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalCards - 1) ? 0 : currentIndex + 1;
            updateSlider();
        });
    }
});
