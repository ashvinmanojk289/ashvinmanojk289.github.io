'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initPageNavigation();
    initCaseStudyAccordion();
    initProjectFilter();
    initMoreCertsToggle();
    initMoreProjectsToggle();
    initLoadingSpinner();
    initTypingEffect();
    initCurrentYear();
    initThemeSwitcher();
    initPremiumExperience();
    initPortfolioAssistant();
    fetchGitHubStats();
    initAIBg();
    initSwipeNavigation();
});

function initLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (!spinner) return;

    let hidden = false;
    const doHide = () => {
        if (hidden) return;
        hidden = true;
        spinner.classList.add('hidden');
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 500);
    };

    if (document.readyState === 'complete') {
        requestAnimationFrame(() => doHide());
    } else {
        window.addEventListener('load', () => doHide());
        setTimeout(() => doHide(), 3000);
    }
}

function initTypingEffect() {
    const target = document.querySelector('.typing-effect');
    if (!target) return;

    const words = ['AI Researcher', 'Multimodal AI & ML Engineer', 'Full Stack Developer', 'Robotics Engineer', 'ROS Developer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        target.textContent = currentWord.substring(0, charIndex);

        let typeSpeed = 100;
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            typeSpeed = 100;
        } else if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1800;
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            typeSpeed = 60;
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }
}

function initPremiumExperience() {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar');
    const revealTargets = document.querySelectorAll('.content-card, .service-item, .project-item-no-img, .timeline-item-body, .cert-item-no-img, .pub-item-card, .recognition-item-body');

    const updateScrollState = () => {
        const currentScrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', currentScrollY > 12);
        }
        document.body.classList.toggle('is-scrolled', currentScrollY > 12);
    };

    if (typeof IntersectionObserver !== 'function') {
        revealTargets.forEach(item => item.classList.add('is-visible'));
        enhanceSkillPills();
        updateScrollState();
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((item) => {
        item.classList.add('reveal-card');
        revealObserver.observe(item);
    });

    enhanceSkillPills();
    updateScrollState();

    let frameId = 0;
    const updatePointer = (x, y, width, height) => {
        const normalizedX = ((x / width) - 0.5).toFixed(4);
        const normalizedY = ((y / height) - 0.5).toFixed(4);
        root.style.setProperty('--pointer-x', normalizedX);
        root.style.setProperty('--pointer-y', normalizedY);
    };

    const onPointerMove = (event) => {
        if (frameId) return;
        frameId = window.requestAnimationFrame(() => {
            updatePointer(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
            frameId = 0;
        });
    };

    let scrollFrameId = 0;
    const onScroll = () => {
        if (scrollFrameId) return;
        scrollFrameId = window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            if (navbar) {
                navbar.classList.toggle('scrolled', currentScrollY > 12);
            }
            document.body.classList.toggle('is-scrolled', currentScrollY > 12);
            scrollFrameId = 0;
        });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });

    updateScrollState();
}

function enhanceSkillPills() {
    const skillTextNodes = document.querySelectorAll('section.service:not(.career-focus) .service-item-text');

    skillTextNodes.forEach((node) => {
        const rawText = node.textContent.trim();
        if (!rawText.includes(',')) return;

        const tokens = rawText
            .replace(/\band\b/i, ',')
            .split(',')
            .map(token => token.trim().replace(/[.]+$/g, ''))
            .filter(Boolean);

        if (tokens.length < 2) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'skill-pills';
        tokens.forEach((token) => {
            const pill = document.createElement('span');
            pill.className = 'skill-pill';
            pill.textContent = token;
            wrapper.appendChild(pill);
        });

        node.textContent = '';
        node.appendChild(wrapper);
    });
}

function animateCount(targetNode, targetValue) {
    const duration = 900;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(targetValue * (1 - Math.pow(1 - progress, 3)));
        targetNode.textContent = String(value);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function initThemeSwitcher() {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const storageKey = 'portfolio-theme';
    const validThemes = new Set(['dark', 'light']);
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(storageKey);
    } catch {
        savedTheme = null;
    }

    const getPreferredTheme = () => {
        if (validThemes.has(savedTheme)) {
            return savedTheme;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        const nextTheme = validThemes.has(theme) ? theme : 'dark';
        root.setAttribute('data-theme', nextTheme);
        root.style.colorScheme = nextTheme;
        try {
            localStorage.setItem(storageKey, nextTheme);
        } catch {
            savedTheme = nextTheme;
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', nextTheme === 'light' ? '#F7F4EE' : '#0B0B0F');
        }

        if (toggle) {
            const icon = toggle.querySelector('.theme-toggle-icon');
            const isLight = nextTheme === 'light';
            toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
            toggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');

            if (icon) {
                icon.setAttribute('name', isLight ? 'sunny-outline' : 'moon-outline');
            }
        }
    };

    applyTheme(getPreferredTheme());

    if (toggle) {
        toggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

            // Add transitional hook for elegant synchronized fade
            root.classList.add('theme-transition-active');

            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');

            // Remove after transition duration to avoid hover collision
            setTimeout(() => {
                root.classList.remove('theme-transition-active');
            }, 300);
        });
    }
}

function fetchGitHubStats() {
    const username = 'ashvinmanojk289';
    const reposCountEl = document.getElementById('github-repos');
    const starsCountEl = document.getElementById('github-stars');
    const activityListEl = document.getElementById('github-activity');

    if (!reposCountEl) return;

    fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json())
        .then(data => {
            animateCount(reposCountEl, Number(data.public_repos || 0));
        })
        .catch(() => {
            reposCountEl.textContent = 'N/A';
        });

    fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`)
        .then(res => res.json())
        .then(repos => {
            if (!Array.isArray(repos)) return;

            const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
            if (starsCountEl) {
                animateCount(starsCountEl, stars);
            }

            if (activityListEl) {
                activityListEl.innerHTML = '';
                repos.slice(0, 3).forEach(repo => {
                    const li = document.createElement('li');
                    const date = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString() : 'unknown date';
                    li.innerHTML = `<strong>${repo.name}</strong><span>Updated on ${date}</span>`;
                    activityListEl.appendChild(li);
                });

                if (!activityListEl.children.length) {
                    activityListEl.innerHTML = '<li>No recent public activity found.</li>';
                }
            }
        })
        .catch(() => {
            if (starsCountEl) starsCountEl.textContent = 'N/A';
            if (activityListEl) activityListEl.innerHTML = '<li>Could not load GitHub activity.</li>';
        });
}

function initAIBg() {
    const canvas = document.getElementById('ai-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width;
    let height;
    let rafId;
    let lastDraw = 0;
    const FRAME_INTERVAL = 1000 / 60;
    const nodeCount = window.innerWidth < 768 ? 24 : 64;
    const nodes = [];
    const maxConnPerNode = 3;
    let mousePos = { x: -9999, y: -9999 };
    let mouseMoveTimeout;

    // Cache theme state and colors dynamically
    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Theme-specific colors: Deep gold/purple in dark mode, rich high-contrast bronze/dark violet in light mode
    let r1 = isDark ? 255 : 180;
    let g1 = isDark ? 122 : 110;
    let b1 = isDark ? 0 : 5;
    
    let r2 = isDark ? 139 : 100;
    let g2 = isDark ? 92 : 45;
    let b2 = isDark ? 246 : 210;

    // Use a MutationObserver to listen for changes on data-theme attribute on <html>
    const themeObserver = new MutationObserver(() => {
        isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        r1 = isDark ? 255 : 180;
        g1 = isDark ? 122 : 110;
        b1 = isDark ? 0 : 5;
        r2 = isDark ? 139 : 100;
        g2 = isDark ? 92 : 45;
        b2 = isDark ? 246 : 210;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function getParticleColor(blend, alpha) {
        const r = Math.round(r1 + (r2 - r1) * blend);
        const g = Math.round(g1 + (g2 - g1) * blend);
        const b = Math.round(b1 + (b2 - b1) * blend);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    resize();

    // Populate particles with physics, organic phases, and trail history arrays
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: isDark ? (1.2 + Math.random() * 2.2) : (1.8 + Math.random() * 2.8), // Slightly larger in light mode for contrast
            phase: Math.random() * Math.PI * 2,
            colorBlend: Math.random(), // Dynamic gradient blend factor
            history: [] // Motion trail cache
        });
    }

    function draw() {
        const now = Date.now();
        if (now - lastDraw < FRAME_INTERVAL) {
            rafId = requestAnimationFrame(draw);
            return;
        }
        lastDraw = now;

        ctx.clearRect(0, 0, width, height);

        // Slowly shifting flow field values using trigonometric wave layers
        const flowTime = now * 0.0002;
        const maxDist = Math.min(width, height) * 0.16;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];

            // 1. Organic Vector Flow Field
            const flowAngle = Math.sin(a.x * 0.003 + flowTime) * Math.cos(a.y * 0.003 - flowTime) * Math.PI * 2;
            const targetVx = Math.cos(flowAngle) * 0.32;
            const targetVy = Math.sin(flowAngle) * 0.32;

            // Smoothly drift towards current vectors
            a.vx += (targetVx - a.vx) * 0.04;
            a.vy += (targetVy - a.vy) * 0.04;

            // 2. Cursor Swirling Attraction Vortex
            if (mousePos.x > -9000) {
                const dx = mousePos.x - a.x;
                const dy = mousePos.y - a.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 220) {
                    const force = (220 - dist) / 220; // 0 (far) to 1 (near)
                    
                    // Gravitational attraction
                    const pullX = (dx / dist) * force * 0.08;
                    const pullY = (dy / dist) * force * 0.08;

                    // Swirling vortex (perpendicular force)
                    const vortexX = (-dy / dist) * force * 0.72;
                    const vortexY = (dx / dist) * force * 0.72;

                    a.vx += pullX + vortexX;
                    a.vy += pullY + vortexY;
                }
            }

            // Cap velocity to maintain smooth animation flow
            const speed = Math.hypot(a.vx, a.vy);
            if (speed > 2.0) {
                a.vx = (a.vx / speed) * 2.0;
                a.vy = (a.vy / speed) * 2.0;
            }

            // Update particle position
            a.x += a.vx;
            a.y += a.vy;

            // Boundary wrapping with clean borders
            if (a.x < -30) a.x = width + 20;
            if (a.x > width + 30) a.x = -20;
            if (a.y < -30) a.y = height + 20;
            if (a.y > height + 30) a.y = -20;

            // Update motion history
            a.history.push({ x: a.x, y: a.y });
            if (a.history.length > 5) {
                a.history.shift();
            }

            // Draw motion trails with higher opacity in light mode
            if (a.history.length > 1) {
                ctx.beginPath();
                ctx.moveTo(a.history[0].x, a.history[0].y);
                for (let h = 1; h < a.history.length; h++) {
                    ctx.lineTo(a.history[h].x, a.history[h].y);
                }
                ctx.lineWidth = a.size * 0.7;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = getParticleColor(a.colorBlend, isDark ? 0.12 : 0.28);
                ctx.stroke();
            }

            // Pulse particle core size dynamically
            const pulse = a.size + Math.sin(now * 0.003 + a.phase) * 0.25;

            // Dynamic concentric glowing core - higher opacity and visibility in light mode
            ctx.beginPath();
            ctx.arc(a.x, a.y, Math.max(0, pulse * 3.5), 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor(a.colorBlend, isDark ? 0.04 : 0.10); // Broad glowing halo
            ctx.fill();

            ctx.beginPath();
            ctx.arc(a.x, a.y, Math.max(0, pulse), 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor(a.colorBlend, isDark ? 0.65 : 0.90); // Crisp core
            ctx.fill();
        }

        // 3. Synaptic Neural Connections
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            let connections = 0;

            for (let j = i + 1; j < nodes.length; j++) {
                if (connections >= maxConnPerNode) break;
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    
                    // High-contrast opacity calculation for light mode vs dark mode
                    const baseAlpha = isDark ? 0.12 : 0.26;
                    let alpha = baseAlpha * (1 - dist / maxDist);

                    // Proximity check to cursor for the connection link
                    const midX = (a.x + b.x) * 0.5;
                    const midY = (a.y + b.y) * 0.5;
                    let isLit = false;

                    if (mousePos.x > -9000) {
                        const distToCursor = Math.hypot(mousePos.x - midX, mousePos.y - midY);
                        if (distToCursor < 180) {
                            const litFactor = (180 - distToCursor) / 180;
                            alpha += (isDark ? 0.24 : 0.38) * litFactor; // Dynamically light up connection
                            isLit = true;
                        }
                    }

                    const avgBlend = (a.colorBlend + b.colorBlend) * 0.5;
                    ctx.strokeStyle = getParticleColor(avgBlend, alpha);
                    ctx.lineWidth = isLit ? (isDark ? 1.2 : 1.6) : (isDark ? 0.6 : 0.95);

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    
                    connections++;
                }
            }
        }

        rafId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else if (!rafId) {
            rafId = requestAnimationFrame(draw);
        }
    });

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        if (mouseMoveTimeout) return;
        mouseMoveTimeout = setTimeout(() => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
            mouseMoveTimeout = null;
        }, 16);
    }, { passive: true });

    start();
}

function initPageNavigation() {
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    if (!navigationLinks.length || !pages.length) return;

    navigationLinks.forEach(link => {
        link.addEventListener('click', function () {
            const clickedPage = this.textContent.toLowerCase().trim();

            pages.forEach(page => {
                if (clickedPage === page.dataset.page) {
                    page.classList.add('active');
                    const heading = page.querySelector('.article-title');
                    if (heading) {
                        heading.classList.remove('heading-animate');
                        void heading.offsetWidth;
                        heading.classList.add('heading-animate');
                    }
                } else {
                    page.classList.remove('active');
                }
            });

            navigationLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            navigationLinks.forEach(link => link.setAttribute('aria-pressed', link.classList.contains('active') ? 'true' : 'false'));
            window.scrollTo(0, 0);
        });
    });
}

function initCaseStudyAccordion() {
    const caseStudyBtns = document.querySelectorAll('.case-study-btn');
    if (!caseStudyBtns.length) return;

    caseStudyBtns.forEach(btn => {
        const projectItem = btn.closest('.project-item-no-img');
        if (!projectItem) return;

        const caseStudyContent = projectItem.querySelector('.project-case-study-content');
        if (!caseStudyContent) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isOpening = !caseStudyContent.classList.contains('active');

            caseStudyBtns.forEach(otherBtn => {
                if (otherBtn === btn) return;

                const otherProject = otherBtn.closest('.project-item-no-img');
                if (!otherProject) return;

                const otherContent = otherProject.querySelector('.project-case-study-content');
                if (!otherContent) return;

                otherBtn.classList.remove('active');
                otherBtn.setAttribute('aria-expanded', 'false');
                otherContent.setAttribute('aria-hidden', 'true');

                if (otherContent.style.maxHeight === 'none' || getComputedStyle(otherContent).maxHeight === 'none') {
                    otherContent.style.maxHeight = `${otherContent.scrollHeight}px`;
                    otherContent.offsetHeight;
                }

                otherContent.style.overflow = 'hidden';
                otherContent.style.maxHeight = '0px';
                otherContent.classList.remove('active');

                const otherText = otherBtn.querySelector('span');
                if (otherText) otherText.textContent = 'Case Study';
            });

            const btnText = this.querySelector('span');

            if (isOpening) {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                caseStudyContent.classList.add('active');
                caseStudyContent.setAttribute('aria-hidden', 'false');
                caseStudyContent.style.maxHeight = `${caseStudyContent.scrollHeight}px`;

                const handler = function (ev) {
                    if (ev.target !== caseStudyContent) return;
                    if (ev.propertyName && ev.propertyName.indexOf('max-height') === -1) return;
                    caseStudyContent.style.maxHeight = 'none';
                    caseStudyContent.removeEventListener('transitionend', handler);
                };

                caseStudyContent.addEventListener('transitionend', handler);
                if (btnText) btnText.textContent = 'Hide Details';
            } else {
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                caseStudyContent.classList.remove('active');
                caseStudyContent.setAttribute('aria-hidden', 'true');

                if (caseStudyContent.style.maxHeight === 'none' || getComputedStyle(caseStudyContent).maxHeight === 'none') {
                    caseStudyContent.style.maxHeight = `${caseStudyContent.scrollHeight}px`;
                    caseStudyContent.offsetHeight;
                }

                caseStudyContent.style.overflow = 'hidden';
                caseStudyContent.style.maxHeight = '0px';
                if (btnText) btnText.textContent = 'Case Study';
            }
        });
    });
}

function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-list .filter-btn');
    const projectItems = document.querySelectorAll('.project-grid .project-item-no-img');
    if (!filterBtns.length || !projectItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBtns.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false'));

            const filterValue = this.dataset.filter;
            projectItems.forEach(item => {
                const itemCategories = (item.dataset.category || '').split(/\s+/);

                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.remove('hidden'), 0);
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initSwipeNavigation() {
    const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
    if (!navLinks.length) return;

    const threshold = 60;
    const restraint = 80;
    const allowedTime = 600;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    function handleSwipe(direction) {
        let activeIndex = navLinks.findIndex(n => n.classList.contains('active'));
        if (activeIndex === -1) activeIndex = 0;

        let targetIndex = activeIndex;
        if (direction === 'left') targetIndex = Math.min(navLinks.length - 1, activeIndex + 1);
        if (direction === 'right') targetIndex = Math.max(0, activeIndex - 1);

        if (targetIndex !== activeIndex) {
            navLinks[targetIndex].click();
        }
    }

    window.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        startX = t.pageX;
        startY = t.pageY;
        startTime = Date.now();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const t = e.changedTouches[0];
        const distX = t.pageX - startX;
        const distY = t.pageY - startY;
        const elapsed = Date.now() - startTime;

        if (elapsed <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX < 0) handleSwipe('left');
            else handleSwipe('right');
        }
    }, { passive: true });
}

function initMoreCertsToggle() {
    const btn = document.getElementById('more-certs-btn');
    const list = document.getElementById('additional-moocs');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
        const isHidden = list.classList.contains('hidden');
        if (isHidden) {
            list.classList.remove('hidden');
            btn.textContent = 'Hide Additional MOOCs';
            list.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => {
                list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        } else {
            list.classList.add('hidden');
            btn.textContent = 'Show Additional MOOCs';
            setTimeout(() => {
                list.setAttribute('aria-hidden', 'true');
            }, 400);
        }
    });
}

function initMoreProjectsToggle() {
    const btn = document.getElementById('more-projects-btn');
    const list = document.getElementById('additional-projects');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
        const isHidden = list.classList.contains('hidden');
        if (isHidden) {
            list.classList.remove('hidden');
            btn.textContent = 'Hide Additional Projects';
            list.setAttribute('aria-hidden', 'false');
            btn.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => {
                list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        } else {
            list.classList.add('hidden');
            btn.textContent = 'Show Additional Projects';
            setTimeout(() => {
                list.setAttribute('aria-hidden', 'true');
                btn.setAttribute('aria-expanded', 'false');
            }, 400);
        }
    });
}

function initPortfolioAssistant() {
    const assistant = document.getElementById('portfolioAssistant');
    const fab = document.getElementById('assistantFab');
    const panel = document.getElementById('assistantPanel');
    const backdrop = document.getElementById('assistantBackdrop');
    const closeBtn = document.getElementById('assistantCloseBtn');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');
    const messages = document.getElementById('assistantMessages');
    const typing = document.getElementById('assistantTyping');

    if (!assistant || !fab || !panel || !backdrop || !closeBtn || !form || !input || !messages || !typing) {
        return;
    }

    const storageKey = 'portfolio-assistant-open';

    const knowledgeBase = [
        {
            id: 'about_ashvin',
            title: 'About Ashvin Manoj',
            keywords: ['about', 'who is', 'ashvin', 'manoj', 'background', 'biography', 'profile', 'engineer', 'researcher'],
            summary: 'Ashvin Manoj is a premier **AI/ML Engineer and Researcher** currently completing his **M.Tech in Computer Science and Engineering (AI/ML)** at the Rajagiri School of Engineering and Technology. He holds a CGPA of **9.64** and possesses a strong systems engineering pedigree blended with advanced academic research in deep learning, transformer models, and graph representation.',
            bullets: [
                '**M.Tech (AI/ML)**: CGPA 9.64, Rajagiri School of Engineering and Technology (2024 - Present).',
                '**B.Tech (Honours) in Robotics & Automation**: CGPA 9.54, Adi Shankara Institute (2020 - 2024).',
                '**Engineering TA**: Mentors undergraduate projects and conducts AI/ML laboratories.'
            ],
            techStack: ['PyTorch', 'GNNs', 'Transformers', 'FastAPI', 'Spring Boot', 'ROS'],
            actions: [{ label: 'View Experience', type: 'section', target: 'experience' }],
            suggestions: ['Research Interests', 'Recognition & Achievements', 'Technical Skills', 'AI Projects']
        },
        {
            id: 'research_interests',
            title: 'Research Interests',
            keywords: ['research', 'interests', 'focus', 'topics', 'GNNs', 'medical ai', 'explainable ai', 'graphs'],
            summary: 'Ashvin\'s research aims to develop **clinical-grade predictive intelligence tools** using deep graph representations and explainable architectures. His target is to solve complex clinical modeling challenges by bridging high-dimensional medical imaging (MRI, DTI connectivity) and structural genomic vectors.',
            bullets: [
                '**Multimodal Deep Learning**: Integrating heterogeneous data sources (imaging, genomics, and clinical reports).',
                '**Structured Graph Models**: Designing custom Graph Neural Networks and Graph Transformers to capture structural connectivity.',
                '**Explainable Artificial Intelligence (XAI)**: Centering research around feature-importance tracking and salient node/edge reasoning.'
            ],
            techStack: ['PyTorch Geometric', 'Graph Transformers', 'Multimodal Fusion', 'XAI'],
            actions: [{ label: 'View Certifications', type: 'section', target: 'certifications' }],
            suggestions: ['MAGMF-Net', 'Current Research Focus', 'Medical AI']
        },
        {
            id: 'magmf_net',
            title: 'MAGMF-Net',
            keywords: ['magmf', 'magmf-net', 'alzheimer', 'prediction', 'graph learning', 'modal', 'mri', 'dti', 'genetic'],
            summary: '**MAGMF-Net** is a state-of-the-art multimodal graph learning framework designed for early prediction of Alzheimer\'s Disease progression. It models clinical states by fusing structural MRI datasets, DTI tractography (anatomical brain structural networks), and genomic single nucleotide polymorphisms (SNPs).',
            bullets: [
                '**Graph Modeling**: Represents each patient\'s anatomical connectivity as a structural graph with brain-region features.',
                '**Modality Fusion**: Employs dynamic self-attention to fuse imaging features with high-dimensional SNP markers.',
                '**Node Selection**: Integrates a custom representational pooling layer to pinpoint disease-salient brain regions.'
            ],
            techStack: ['PyTorch Geometric', 'Graph Transformers', 'DTI Tractography', 'Attention Fusion'],
            actions: [{ label: 'Open Projects Section', type: 'section', target: 'projects' }],
            suggestions: ['Multimodal AI', 'Graph Neural Networks', 'Medical AI']
        },
        {
            id: 'multimodal_ai',
            title: 'Multimodal AI Integration',
            keywords: ['multimodal', 'fusion', 'imaging', 'genetic', 'cross-attention', 'modalities', 'heterogeneous'],
            summary: 'Ashvin specializes in designing **multimodal architectures** that process and align highly heterogeneous datasets. His work focuses on establishing robust cross-modality representation alignment (e.g., mapping tabular genetic vectors onto 3D neuroimaging structures) and building multi-sensory intelligence platforms.',
            bullets: [
                '**Neuro-Genomic Fusion**: Co-embedding structural MRI, diffusion tensor tractography, and gene sequence alignments.',
                '**Multilingual Speech-Text Translation**: Fusing audio signals with text representations for speech recognition and machine translation.',
                '**Attention-Guided Co-embedding**: Employing cross-attention layers to weight and extract salient feature correlations.'
            ],
            techStack: ['Cross-Attention', 'PyTorch', 'mBART', 'Wav2Vec 2.0', 'Modality Alignment'],
            actions: [{ label: 'View Publications', type: 'section', target: 'certifications' }],
            suggestions: ['MAGMF-Net', 'Transformer Architectures', 'NLP Systems']
        },
        {
            id: 'graph_neural_networks',
            title: 'Graph Neural Networks (GNNs)',
            keywords: ['graph', 'gnn', 'networks', 'convolutional', 'geometric', 'pyg', 'pooling', 'tractography'],
            summary: 'Ashvin leverages **Graph Neural Networks (GNNs)** and **Graph Transformers** to reason over non-Euclidean data. He has applied GNNs directly to brain structural connectivity networks (DTI tractography matrices) and biological pathways to improve predictive accuracy for neurological disorders.',
            bullets: [
                '**PyTorch Geometric (PyG)**: Proficient in building custom message-passing and graph attention (GAT) layers.',
                '**Graph Representation Learning**: Constructing structural brain graphs where nodes represent anatomical brain regions and edges map diffusion tract connectivity.',
                '**Salient Node Selection**: Utilizing graph pooling architectures to highlight disease-relevant topological markers.'
            ],
            techStack: ['PyTorch Geometric', 'GCN / GAT', 'Graph Pooling', 'Graph Transformers'],
            actions: [{ label: 'Open Projects Section', type: 'section', target: 'projects' }],
            suggestions: ['MAGMF-Net', 'Current Research Focus', 'Technical Skills']
        },
        {
            id: 'nlp_systems',
            title: 'NLP Systems Engineering',
            keywords: ['nlp', 'language', 'processing', 'translation', 'translator', 'pdf query', 'indexing', 'embeddings'],
            summary: 'Ashvin has engineered robust, scalable **NLP systems** that focus on conversational intelligence, multilingual translation, and document search. His projects emphasize semantic-vector indexing, document parsing, and local model orchestration.',
            bullets: [
                '**PDF Query Application**: A semantic search tool that parses large PDFs and allows natural-language queries using vector embeddings.',
                '**Multilingual News Audio Translator**: A Flask-based pipeline integrating speech-to-text, machine translation, and text-to-speech elements.',
                '**Prompt Design & Engineering**: Formulating prompt topologies (system, chain-of-thought) to maximize LLM response accuracy.'
            ],
            techStack: ['FastAPI', 'ChromaDB', 'Flask UI', 'Wav2Vec 2.0', 'mBART', 'Hugging Face'],
            actions: [{ label: 'View NLP Translator Source', type: 'link', href: 'https://github.com/ashvinmanojk289/FLASK_UI_FOR_MULTILINGUAL_NEWS_AUDIO_TRANSLATOR' }],
            suggestions: ['Transformer Architectures', 'AI Projects', 'Technical Stack']
        },
        {
            id: 'transformer_architectures',
            title: 'Transformer Architectures',
            keywords: ['transformer', 'architectures', 'attention', 'self-attention', 'llms', 'vision transformer', 'fine-tuning'],
            summary: 'Experienced with self-attention paradigms, positional encoding strategies, and multi-headed attention modules. Ashvin applies **Transformer Architectures** across both computer vision and language modalities to improve structural modeling in AI.',
            bullets: [
                '**Vision Transformers (ViTs)**: Researching Hybrid EfficientNetV2-Transformer models for precision weed detection.',
                '**Neural Machine Translation**: Fine-tuning pre-trained sequence-to-sequence transformers (mBART) for highly localized audio translation.',
                '**Pre-training & Fine-tuning**: Custom pipelines using Hugging Face tools for domain-specific fine-tuning (LLMs, prompt engineering).'
            ],
            techStack: ['Vision Transformers', 'mBART', 'Self-Attention', 'Hugging Face Space'],
            actions: [{ label: 'View Hybrid Transformer Project', type: 'link', href: 'https://github.com/ashvinmanojk289/Hybrid-EfficientNetV2-Transformer-Model-and-Other-Model-Comparison-for-Weed-Detection' }],
            suggestions: ['NLP Systems', 'Publications', 'Technical Stack']
        },
        {
            id: 'medical_ai',
            title: 'Medical AI & Digital Health',
            keywords: ['medical', 'ai', 'healthcare', 'clinical', 'diagnostics', 'health mind', 'prediction', 'privacy'],
            summary: 'Ashvin\'s work in **Medical AI** bridges state-of-the-art academic deep learning with zero-trust engineering standards. He focuses on secure, local clinical assistance and explainable diagnostic reasoning.',
            bullets: [
                '**Alzheimer prediction**: Creating GNN pipelines to estimate early predictive risk scores based on MRI, DTI, and DNA genotypes.',
                '**Health Mind AI**: Engineering a privacy-aware health intelligence desktop assistant using local model inference.',
                '**Explainable Diagnostics**: Ensuring decision paths are traceable via attention-weight visualization and salient region mapping.'
            ],
            techStack: ['Local Inference', 'Secure Data Sandboxing', 'Explainable AI', 'Biomedical Fusion'],
            actions: [{ label: 'View Experience', type: 'section', target: 'experience' }],
            suggestions: ['MAGMF-Net', 'Research Interests', 'Current Research Focus']
        },
        {
            id: 'technical_skills',
            title: 'Technical Skills Stack',
            keywords: ['skills', 'technical', 'stack', 'languages', 'frameworks', 'tools', 'libraries', 'databases'],
            summary: 'Ashvin has a multi-disciplinary technical stack combining **AI Research** toolkits, **Enterprise Backend Systems**, and **Edge/Desktop Product Engineering** frameworks.',
            bullets: [
                '**AI/ML**: PyTorch, PyTorch Geometric, Hugging Face Transformers, OpenCV, Scikit-Learn.',
                '**Languages**: Python, Java, JavaScript (ES6+), R, C/C++, Assembly.',
                '**Frameworks**: FastAPI, Spring Boot, Flask, Electron, React.js, TailwindCSS.',
                '**Systems**: Docker, ROS, RabbitMQ, Linux, SQLite, PostgreSQL, Git.'
            ],
            techStack: ['Deep Learning', 'Backend Engineering', 'Edge Computing', 'Robotics Systems'],
            actions: [{ label: 'Open About Section', type: 'section', target: 'about' }],
            suggestions: ['Technical Stack', 'Certifications', 'Experience']
        },
        {
            id: 'certifications',
            title: 'Professional Certifications',
            keywords: ['certifications', 'courses', 'moocs', 'nptel', 'coursera', 'iit', 'google', 'ibm'],
            summary: 'His credentials demonstrate a commitment to continuous learning and academic rigor in **Core Computer Science**, **Generative AI systems**, and **Data Systems Analytics**.',
            bullets: [
                '**IIT Madras (NPTEL)**: Large Language Models (LLMs) (Oct 2025) and Python Programming & Data Structures (Sept 2021).',
                '**Google Cloud**: Generative AI Learning Path Specialization (April 2025).',
                '**IBM (Coursera)**: Software Engineering Fundamentals (October 2025).',
                '**Google**: Google Data Analytics Specialization (July 2025).'
            ],
            techStack: ['LLMs Specialization', 'Software Engineering Fundamentals', 'Cloud GenAI', 'SQL / R Data Science'],
            actions: [{ label: 'Open Certifications Page', type: 'section', target: 'certifications' }],
            suggestions: ['Technical Skills', 'Publications', 'Experience']
        },
        {
            id: 'experience',
            title: 'Professional Experience',
            keywords: ['experience', 'work', 'intern', 'mastermine', 'ta', 'teaching assistant', 'sunlux', 'smec'],
            summary: 'His career spans **Applied Software Product Engineering**, **Embedded Systems Development**, and **Academic Mentorship**, reinforcing his profile as a well-rounded technical builder.',
            bullets: [
                '**Software Engineer Intern** at *Mastermine Technologies* (Aug 2025 - Present): Developed Java Spring backends, React modules, and Electron packaging. Built asynchronous photo-matching with Spring Scheduler, RabbitMQ, and Python workers.',
                '**Teaching Assistant** at *Rajagiri School of Engineering (RSET)* (Dec 2025 - Mar 2026): Guided undergraduate labs in AI/ML, conducted assessments, and mentored project architectures.',
                '**Embedded Hardware Intern** at *Sunlux Technovations* (Feb - Apr 2024): Debugged Assembly code for microprocessor controls.'
            ],
            techStack: ['Java Spring Boot', 'RabbitMQ', 'Electron Packaging', 'React.js', 'Python Workers'],
            actions: [{ label: 'Open Experience Section', type: 'section', target: 'experience' }],
            suggestions: ['Technical Skills', 'IndiaAI Fellowship', 'Career Direction']
        },
        {
            id: 'publications',
            title: 'Publications & Research Papers',
            keywords: ['publications', 'papers', 'access', 'weed detection', 'krishnan', 'conference', 'ieee'],
            summary: 'Co-authored a premium peer-reviewed research paper detailing neural networks applied directly to autonomous systems for sustainable precision agriculture.',
            bullets: [
                '**Paper Title**: *"A Hybrid Transformer Model Approach for Precision Weed Detection"*',
                '**Venue**: published in IEEE ACCESS 2025 conference (Ernakulam, India, pp. 1-7).',
                '**Contribution**: Explored EfficientNetV2 and Vision Transformer (ViT) co-embeddings for edge-capable real-time weed targeting in agricultural robotics.'
            ],
            techStack: ['Vision Transformers', 'EfficientNetV2', 'Edge AI', 'Precision Agriculture'],
            actions: [{ label: 'Read Paper via DOI', type: 'link', href: 'https://doi.org/10.1109/ACCESS65134.2025.11135583' }],
            suggestions: ['Research Interests', 'Transformer Architectures', 'Current Research Focus']
        },
        {
            id: 'indiaai_fellowship',
            title: 'IndiaAI Fellowship Award',
            keywords: ['indiaai', 'fellowship', 'government', 'meity', 'ministry', 'award', 'scholarship', 'scholar'],
            summary: 'Ashvin has been selected under the prestigious **IndiaAI Fellowship** program (awarded by the **IndiaAI Mission, Government of India**) for outstanding machine learning research capabilities.',
            bullets: [
                '**Research Focus**: Designing advanced pipelines for **Multimodal Graph Learning for Early Alzheimer’s Disease Classification**.',
                '**Methodologies**: Co-embedding structural MRI, diffusion tensor tractographies (DTI), and genetic SNP microarrays with Graph Neural Networks and Transformers.',
                '**National Distinction**: Awarded to premier machine learning scholars across the nation by the Ministry of Electronics and Information Technology (MeitY).'
            ],
            techStack: ['Clinical AI Research', 'MeitY Government', 'Graph Neural Networks', 'Multimodal Fusion'],
            actions: [{ label: 'View Academic & Recognition Journey', type: 'section', target: 'education' }],
            suggestions: ['Recognition & Achievements', 'Research Interests', 'MAGMF-Net']
        },
        {
            id: 'recognition_achievements',
            title: 'Recognition & Achievements',
            keywords: ['recognition', 'achievements', 'awards', 'rank', 'fellowship', 'merit', 'topper', 'honours', 'distinction', 'indiaai'],
            summary: 'Ashvin has earned premium academic, research, and national-level AI distinctions highlighting his technical maturity and machine learning research capabilities.',
            bullets: [
                '**IndiaAI Fellowship 2025**: Selected by the Government of India for advanced research on Multimodal Graph Learning for Early Alzheimer’s Disease Classification.',
                '**M.Tech Merit Topper**: Secured **First Rank** in M.Tech Computer Science and Engineering (AI & ML) at Rajagiri School of Engineering & Technology.',
                '**B.Tech Rank Holder**: Graduated with **Honours** and secured University Rank in B.Tech Robotics & Automation at APJ Abdul Kalam Technological University.'
            ],
            techStack: ['National AI Mission', 'University Rank', 'Academic Topper', 'Research Excellence'],
            actions: [{ label: 'Open Recognition Section', type: 'section', target: 'education' }],
            suggestions: ['IndiaAI Fellowship', 'Research Interests', 'MAGMF-Net']
        },
        {
            id: 'resume',
            title: 'Resume & Curriculum Vitae Overview',
            keywords: ['resume', 'cv', 'pdf', 'download resume', 'ashvin resume', 'profile sheet'],
            summary: 'Ashvin Manoj\'s technical resume covers his full academic milestones, publication details, product internships, and system engineering profile. Feel free to explore his research interests and technical skills directly in this panel.',
            bullets: [
                '**Education**: M.Tech (CGPA 9.64), B.Tech Honours (CGPA 9.54).',
                '**Key Research**: Alzheimer prediction via MAGMF-Net, hybrid transformers in agriculture.',
                '**Industry Work**: Java Spring, React, Electron, and RabbitMQ enterprise system engineering.'
            ],
            techStack: ['Academic Milestones', 'Research Projects', 'Full Stack ML & Software'],
            actions: [{ label: 'View Research Interests', type: 'prompt', value: 'Research Interests' }],
            suggestions: ['Technical Skills', 'Experience', 'Research Interests']
        },
        {
            id: 'linkedin',
            title: 'LinkedIn Professional Profile',
            keywords: ['linkedin', 'connect', 'social', 'profile link', 'network', 'messaging'],
            summary: 'Ashvin\'s LinkedIn profile highlights his professional communication, networking, career updates, and research collaborations. You can find his username as @ashvinmanojk289.',
            bullets: [
                '**Profile**: /in/ashvinmanojk289',
                '**Direct Contact**: Reach out for engineering roles, technical advisory, or academic partnership.',
                '**Updates**: Showcases prototypes, TA milestones, and research paper publications.'
            ],
            techStack: ['Professional Network', 'Contact', 'Updates'],
            actions: [{ label: 'About Ashvin', type: 'prompt', value: 'About Ashvin' }],
            suggestions: ['Technical Skills', 'About Ashvin', 'Research Interests']
        },
        {
            id: 'github',
            title: 'GitHub Repositories Overview',
            keywords: ['github', 'git', 'profile', 'code repos', 'open source', 'projects source'],
            summary: 'Ashvin\'s projects, ML training workflows, research notebooks, and custom system tools are documented inside his code repositories. Feel free to ask about specific projects directly in this chat.',
            bullets: [
                '**Major Projects**: Multilingual Audio News Translator, PDF Query Application, Fraudulent Transaction Imbalance model.',
                '**Robotics**: Weed-detection edge navigation scripts (ROS) and hardware controllers.'
            ],
            techStack: ['Code Pipelines', 'ML Workflows', 'Reproducible Repositories'],
            actions: [{ label: 'View Selected AI Projects', type: 'prompt', value: 'Selected AI Projects' }],
            suggestions: ['AI Projects', 'Technical Skills', 'Research Interests']
        },
        {
            id: 'current_research_focus',
            title: 'Current Research Focus',
            keywords: ['current research', 'focus', 'active thesis', 'active research', 'current work', 'ongoing studies'],
            summary: 'His current master\'s thesis research focuses on designing an end-to-end clinical platform for **predicting early-stage Alzheimer\'s progression**. The system maps multimodal data onto a unified topological representation using graph attention models.',
            bullets: [
                '**Modality Alignment**: Aligning genetic SNP microarrays with high-dimensional 3D MRI brain matrices.',
                '**Structural Brain Connectivity**: Constructing node-feature representations from DTI tractographies.',
                '**Dynamic pooling**: Implementing custom GNN pooling techniques to track structural degeneration trends.'
            ],
            techStack: ['Alzheimer Predictor', 'PyTorch Geometric', 'Attention Co-embedding', 'DTI Structural Mapping'],
            actions: [{ label: 'Open Projects Page', type: 'section', target: 'projects' }],
            suggestions: ['MAGMF-Net', 'IndiaAI Fellowship', 'Research Interests']
        },
        {
            id: 'ai_projects',
            title: 'Selected AI Projects',
            keywords: ['projects', 'ai projects', 'applications', 'portfolio projects', 'prototypes', 'health mind', 'translator', 'fraud'],
            summary: 'Ashvin bridges theoretical modeling with clean client-side delivery. His project portfolio features medical diagnostics, conversational translators, class-imbalance classifiers, and robotics controllers.',
            bullets: [
                '**Health Mind AI**: Local, offline wellness desktop prototype with Zero-Trust local orchestration.',
                '**Wav2Vec news translator**: Integrates speech recognition, mBART language translation, and sound synthesis in a Flask client.',
                '**Weed detection bot**: Bridges ROS navigation controls with a vision-transformer pipeline running on mobile edge hardware.'
            ],
            techStack: ['Deep Learning', 'Client-Side Orchestration', 'Local Inference', 'ROS Navigation'],
            actions: [{ label: 'View Major Projects List', type: 'section', target: 'projects' }],
            suggestions: ['MAGMF-Net', 'Technical Stack', 'Experience']
        },
        {
            id: 'technical_stack',
            title: 'Software & Machine Learning Stack',
            keywords: ['technical stack', 'stack', 'software stack', 'frameworks', 'libraries', 'environment'],
            summary: 'Ashvin\'s development environment is optimized for **reproducible deep learning experiments** and **scalable, high-performance backends**.',
            bullets: [
                '**Deep Learning & Math**: PyTorch, PyTorch Geometric, Hugging Face, NumPy, Pandas, Scikit-Learn.',
                '**Backends & Pipelines**: Java Spring Boot, Spring Security, FastAPI, Flask, RabbitMQ, Docker, Git.',
                '**Front-end & Edge**: React.js, Electron, Electron-Builder, TailwindCSS, ROS navigation stacks.'
            ],
            techStack: ['Machine Learning Tools', 'Backend Architectures', 'Edge & Client Systems'],
            actions: [{ label: 'View Technical Skills', type: 'prompt', value: 'Technical Skills' }],
            suggestions: ['Technical Skills', 'AI Projects', 'Experience']
        },
        {
            id: 'career_direction',
            title: 'Career Direction & Objective',
            keywords: ['career direction', 'objective', 'future roles', 'next steps', 'industry positions', 'job target'],
            summary: 'Ashvin aims to transition his deep learning thesis research and software backend internships into a high-impact role inside an **Applied AI engineering or Research Systems laboratory**.',
            bullets: [
                '**Target Roles**: Applied Machine Learning Engineer, Research Scientist (AI/ML), Intelligent Systems Developer.',
                '**Mission**: Deploying highly sophisticated, secure, and explainable models into product environments.',
                '**Sectors**: Healthcare diagnostics, advanced natural language systems, enterprise intelligence backends.'
            ],
            techStack: ['Applied AI Engineer', 'Research Specialist', 'Systems Developer'],
            actions: [{ label: 'View About Me', type: 'section', target: 'about' }],
            suggestions: ['About Ashvin', 'Technical Skills', 'Research Interests']
        },
        {
            id: 'greetings',
            title: 'Welcome!',
            keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'welcome', 'test', 'yo'],
            summary: 'Hello! I am Ashvin\'s **AI Research Portfolio Assistant**. I am here to guide you through his work in multimodal clinical models, graph neural networks, NLP systems, and enterprise engineering internships.',
            bullets: [
                'Try asking about **MAGMF-Net** or his **IndiaAI Fellowship** research.',
                'You can inspect his **Technical Skills** stack or **Experience** logs.',
                'Or ask about his publication record.'
            ],
            techStack: ['Multimodal AI', 'Clinical Prediction', 'Zero-Trust Orchestration'],
            actions: [
                { label: 'Explain MAGMF-Net', type: 'prompt', value: 'Explain MAGMF-Net' },
                { label: 'Technical Skills', type: 'prompt', value: 'Technical Skills' }
            ],
            suggestions: ['Explain MAGMF-Net', 'IndiaAI Fellowship', 'Research Interests', 'Technical Skills']
        },
        {
            id: 'courtesy',
            title: 'At Your Service',
            keywords: ['thanks', 'thank you', 'awesome', 'great', 'cool', 'perfect', 'bye', 'goodbye', 'exit', 'close'],
            summary: 'You are very welcome! It is a pleasure assisting you. Let me know if you would like to deep-dive into any other aspects of Ashvin\'s AI/ML research or software internships.',
            bullets: [
                'Type **Explain MAGMF-Net** to see his multimodal AD predictor.',
                'Type **Technical Stack** to inspect his frameworks.',
                'Or ask about his **Selected AI Projects**.'
            ],
            techStack: ['Deep Graph Learning', 'Transformers', 'Conversational Guides'],
            actions: [
                { label: 'Explain MAGMF-Net', type: 'prompt', value: 'Explain MAGMF-Net' }
            ],
            suggestions: ['MAGMF-Net', 'IndiaAI Fellowship', 'Research Interests', 'Technical Skills']
        }
    ];

    const fallbackResponse = {
        id: 'guidance',
        title: 'Portfolio Guidance',
        summary: 'I am here to guide you through Ashvin\'s projects, publications, expertise, and research accomplishments. Ask me in plain language, or pick a suggested topic below.',
        bullets: [
            'Try asking about **MAGMF-Net**, **IndiaAI Fellowship**, or his work at **Mastermine Technologies**.',
            'You can also request details about his projects, publications, or career direction.'
        ],
        techStack: ['Clinical AI', 'Deep Graph Learning', 'Transformers', 'Multimodal Systems'],
        actions: [
            { label: 'Explain MAGMF-Net', type: 'prompt', value: 'Explain MAGMF-Net' },
            { label: 'Technical Skills', type: 'prompt', value: 'Technical Skills' },
            { label: 'Publications overview', type: 'prompt', value: 'Tell me about publications' }
        ],
        suggestions: ['Explain MAGMF-Net', 'IndiaAI Fellowship', 'Research Interests', 'Technical Skills']
    };

    let isOpen = false;
    let replyTimer = null;

    // Fuzzy Relevance Engine Initialization (Fuse.js)
    let fuse = null;
    if (window.Fuse) {
        fuse = new window.Fuse(knowledgeBase, {
            keys: [
                { name: 'keywords', weight: 0.6 },
                { name: 'title', weight: 0.3 },
                { name: 'summary', weight: 0.1 }
            ],
            threshold: 0.38,
            includeScore: true
        });
    }

    const getStorage = (key) => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    const setStorage = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            return;
        }
    };

    const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const scrollMessagesToBottom = () => {
        requestAnimationFrame(() => {
            messages.scrollTop = messages.scrollHeight;
        });
    };

    const setTyping = (visible) => {
        typing.hidden = !visible;
        if (visible) {
            scrollMessagesToBottom();
        }
    };

    const setAssistantState = (open) => {
        isOpen = open;
        assistant.classList.toggle('open', open);
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        backdrop.hidden = !open;
        setStorage(storageKey, open ? 'open' : 'closed');

        if (open) {
            document.body.classList.add('assistant-active');
            scrollMessagesToBottom();
            setTimeout(() => input.focus(), 40);
        } else {
            document.body.classList.remove('assistant-active');
        }
    };

    const openAssistant = () => setAssistantState(true);
    const closeAssistant = () => setAssistantState(false);

    const createMessage = (role, html, actions = []) => {
        const article = document.createElement('article');
        article.className = `assistant-message assistant-message-${role}`;

        if (role === 'bot') {
            const badge = document.createElement('div');
            badge.className = 'assistant-message-badge';
            badge.textContent = 'AI';
            article.appendChild(badge);
        }

        const body = document.createElement('div');
        body.className = 'assistant-message-body';
        body.innerHTML = html;
        article.appendChild(body);

        if (actions.length) {
            const actionRow = document.createElement('div');
            actionRow.className = 'assistant-message-actions';

            actions.forEach((action) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'assistant-message-action';
                button.textContent = action.label;
                button.dataset.actionType = action.type;
                if (action.target) button.dataset.actionTarget = action.target;
                if (action.href) button.dataset.actionHref = action.href;
                if (action.value) button.dataset.actionValue = action.value;
                actionRow.appendChild(button);
            });

            article.appendChild(actionRow);
        }

        messages.appendChild(article);
        scrollMessagesToBottom();
        return article;
    };

    // Advanced response formatter using Marked.js for inline markdown compilation
    const buildResponseHtml = (chunk) => {
        let compiledSummary = '';
        if (window.marked && window.marked.parse) {
            compiledSummary = window.marked.parse(chunk.summary);
        } else {
            compiledSummary = `<p>${escapeHtml(chunk.summary)}</p>`;
        }

        let compiledBullets = '';
        if (chunk.bullets && chunk.bullets.length) {
            compiledBullets = `<ul>${chunk.bullets.map(bullet => {
                if (window.marked && window.marked.parseInline) {
                    return `<li>${window.marked.parseInline(bullet)}</li>`;
                } else {
                    return `<li>${escapeHtml(bullet)}</li>`;
                }
            }).join('')}</ul>`;
        }

        const techPills = chunk.techStack && chunk.techStack.length
            ? `<div class="assistant-tech-pills">${chunk.techStack.map(tech => `<span class="assistant-tech-pill">${escapeHtml(tech)}</span>`).join('')}</div>`
            : '';

        const isProjectCard = ['magmf_net', 'ai_projects'].includes(chunk.id);
        const cardClass = isProjectCard ? ' assistant-project-card' : '';

        return `
            <div class="${cardClass}">
                ${chunk.title ? `<p class="assistant-response-title">${escapeHtml(chunk.title)}</p>` : ''}
                ${compiledSummary}
                ${techPills}
                ${compiledBullets}
            </div>
        `;
    };

    const activatePortfolioPage = (pageName) => {
        const target = pageName.toLowerCase();
        const navButton = Array.from(document.querySelectorAll('[data-nav-link]')).find(button => button.textContent.toLowerCase().trim() === target);

        if (navButton) {
            navButton.click();
        }
    };

    // Intent detection and fuzzy context selector
    const resolveResponse = (rawText) => {
        const text = rawText.trim().toLowerCase();
        if (!text) return fallbackResponse;

        // 1. Fuzzy Retrieval via Fuse.js
        if (fuse) {
            const results = fuse.search(text);
            if (results && results.length > 0) {
                return results[0].item;
            }
        }

        // 2. Direct Semantic Keyword Fallback matching
        for (const chunk of knowledgeBase) {
            for (const kw of chunk.keywords) {
                if (text.includes(kw.toLowerCase())) {
                    return chunk;
                }
            }
        }

        return fallbackResponse;
    };

    // Swap recommendations rail dynamically after each interaction
    const updatePromptChips = (suggestions = []) => {
        const promptsContainer = assistant.querySelector('.assistant-prompts');
        if (!promptsContainer) return;

        promptsContainer.innerHTML = '';
        const listToUse = suggestions && suggestions.length ? suggestions : fallbackResponse.suggestions;

        listToUse.forEach((label) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'assistant-prompt';
            btn.textContent = label;
            btn.dataset.assistantPrompt = label;

            btn.addEventListener('click', () => {
                input.value = label;
                openAssistant();
                submitUserMessage(label);
            });

            promptsContainer.appendChild(btn);
        });
    };

    const submitUserMessage = (text) => {
        const cleanText = text.trim();
        if (!cleanText) return;

        createMessage('user', `<p>${escapeHtml(cleanText)}</p>`);

        input.value = '';
        input.focus();

        if (replyTimer) {
            clearTimeout(replyTimer);
        }

        setTyping(true);

        const delay = Math.max(700, Math.min(1600, 520 + cleanText.length * 18));
        replyTimer = window.setTimeout(() => {
            setTyping(false);
            const response = resolveResponse(cleanText);
            const actions = response.actions || [];
            createMessage('bot', buildResponseHtml(response), actions);
            updatePromptChips(response.suggestions || []);
        }, delay);
    };

    assistant.addEventListener('click', (event) => {
        const actionButton = event.target.closest('.assistant-message-action');
        if (!actionButton) return;

        const actionType = actionButton.dataset.actionType;
        const actionTarget = actionButton.dataset.actionTarget;
        const actionHref = actionButton.dataset.actionHref;
        const actionValue = actionButton.dataset.actionValue;

        if (actionType === 'section' && actionTarget) {
            activatePortfolioPage(actionTarget);
            closeAssistant();
            return;
        }

        if (actionType === 'link' && actionHref) {
            window.open(actionHref, '_blank', 'noopener,noreferrer');
            return;
        }

        if (actionType === 'prompt' && actionValue) {
            input.value = actionValue;
            submitUserMessage(actionValue);
        }
    });

    fab.addEventListener('click', () => {
        setAssistantState(!isOpen);
    });

    closeBtn.addEventListener('click', closeAssistant);
    backdrop.addEventListener('click', closeAssistant);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitUserMessage(input.value);
    });

    panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAssistant();
            return;
        }

        const isInput = event.target === input;

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const scrollAmount = 40;
            if (event.key === 'ArrowUp') {
                messages.scrollTop -= scrollAmount;
            } else {
                messages.scrollTop += scrollAmount;
            }
        } else if (!isInput && ['PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
            event.preventDefault();
            if (event.key === 'PageUp') {
                messages.scrollTop -= messages.clientHeight * 0.8;
            } else if (event.key === 'PageDown') {
                messages.scrollTop += messages.clientHeight * 0.8;
            } else if (event.key === 'Home') {
                messages.scrollTop = 0;
            } else if (event.key === 'End') {
                messages.scrollTop = messages.scrollHeight;
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeAssistant();
        }
    });

    // Populate initial suggestion prompt chips
    updatePromptChips(fallbackResponse.suggestions);

    const restoredState = getStorage(storageKey);
    if (restoredState === 'open') {
        setAssistantState(true);
    } else {
        setAssistantState(false);
    }
}

