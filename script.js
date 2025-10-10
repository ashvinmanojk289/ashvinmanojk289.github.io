document.addEventListener('DOMContentLoaded', () => {

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
    fetchDataAndInit();
    initVanta();
    registerSW();
    initParallax();

    function initPageLoader() {
        const loader = document.getElementById('page-loader');
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
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

    function initCurrentYear() { document.getElementById('current-year').textContent = new Date().getFullYear(); }

    function initMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    function initHeaderScroll() {
        const header = document.querySelector('.main-header');
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) { header.style.top = '-100px'; } 
            else { header.style.top = '0'; }
            lastScrollY = window.scrollY;
        });
    }

    function initScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        window.addEventListener('scroll', () => {
            let currentId = '';
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 150) { currentId = section.id; }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) { link.classList.add('active'); }
            });
        });
    }

    function initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
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
        document.querySelectorAll('a, button, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-interact'));
        });
    }

    function initTypingEffect() {
        const target = document.querySelector('.typing-effect');
        if (!target) return;
        const words = ["Robotics", "Natural Language Processing", "Computer Vision", "Multimodal AI", "AgTech Innovation"];
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

    function initMarquee() {
        const marquee = document.querySelector('.marquee-inner');
        if (marquee) {
            const content = marquee.querySelector('.marquee-content');
            if (content) marquee.appendChild(content.cloneNode(true));
        }
    }

    async function fetchGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/ashvinmanojk289/repos');
            const repos = await response.json();
            const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            document.getElementById('github-repos').textContent = repos.length || 0;
            document.getElementById('github-stars').textContent = totalStars || 0;
        } catch (error) { console.error('Failed to fetch GitHub stats:', error); }
    }

    async function fetchDataAndInit() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            initProjects(data.projects);
            initTestimonials(data.testimonials);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    function initProjects(projectData) {
        const projectList = document.querySelector('.project-list');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('project-search');
        const modal = document.getElementById('project-modal');
        const closeBtn = document.querySelector('.close-btn');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalLink = document.getElementById('modal-link');
        const modalImage = document.getElementById('modal-image');
        const modalCaseStudy = document.getElementById('modal-case-study');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        const renderProjects = (filter = 'all', search = '') => {
            projectList.innerHTML = '';
            let filtered = (filter === 'all') ? projectData : projectData.filter(p => p.category === filter);
            if (search) {
                filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
            }
            filtered.forEach(p => {
                const card = document.createElement('div');
                card.className = 'project-card reveal';
                card.innerHTML = `
                    <div class="project-details"><h3>${p.title}</h3><p>${p.description}</p></div>
                    <div class="project-buttons">
                        <button class="case-study-btn button" data-case-study="${p.caseStudy ? p.caseStudy.replace(/\n/g, '\\n') : ''}">Case Study</button>
                        <a href="${p.link}" target="_blank" rel="noopener" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>`;
                
                const caseStudyBtn = card.querySelector('.case-study-btn');
                caseStudyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    modalTitle.textContent = p.title;
                    modalDescription.textContent = p.description;
                    modalLink.href = p.link;
                    modalImage.src = p.image || '';
                    modalTech.innerHTML = p.tech ? p.tech.map(t => `<span class="tile">${t}</span>`).join('') : '';
                    modalCaseStudy.textContent = p.caseStudy || 'Case study not available.';
                    modal.style.display = 'block';
                });

                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    modalTitle.textContent = p.title;
                    modalDescription.textContent = p.description;
                    modalLink.href = p.link;
                    modalImage.src = p.image || '';
                    modalTech.innerHTML = p.tech ? p.tech.map(t => `<span class="tile">${t}</span>`).join('') : '';
                    modalCaseStudy.textContent = p.caseStudy || 'Case study not available.';
                    modal.style.display = 'block';
                });

                projectList.appendChild(card);
                observer.observe(card);
            });
        };

        filterBtns.forEach(btn => btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter, searchInput.value);
        }));

        searchInput.addEventListener('input', () => {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            renderProjects(activeFilter, searchInput.value);
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });

        renderProjects();
    }
    
    function initTestimonials(testimonialData) {
        const track = document.querySelector('.testimonial-track');
        if (!track) return;
        testimonialData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `<p>"${item.quote}"</p><span>— ${item.author}</span>`;
            track.appendChild(card);
        });
        let index = 0;
        const update = () => { track.style.transform = `translateX(-${index * 100}%)`; };
        document.querySelector('.test-nav.prev').addEventListener('click', () => {
            index = (index === 0) ? testimonialData.length - 1 : index - 1;
            update();
        });
        document.querySelector('.test-nav.next').addEventListener('click', () => {
            index = (index === testimonialData.length - 1) ? 0 : index + 1;
            update();
        });
    }

    function initVanta() {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x58a6ff,
            backgroundColor: 0x111111,
            points: 10.00,
            maxDistance: 25.00,
            spacing: 15.00
        });
    }

    function registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW registration failed'));
        }
    }

    function initParallax() {
        const sections = document.querySelectorAll('.section');
        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                const speed = 0.5;
                const yPos = -(window.pageYOffset * speed);
                section.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    initParallax();
});
