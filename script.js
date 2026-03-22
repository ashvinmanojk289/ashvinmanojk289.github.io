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

    const words = ['Engineer', 'Developer', 'Researcher', 'Builder'];
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

function initThemeSwitcher() {
    // Dark mode only - no theme switching
    document.documentElement.setAttribute('data-theme', 'dark');
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
            reposCountEl.textContent = String(data.public_repos || 0);
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
                starsCountEl.textContent = String(stars);
            }

            if (activityListEl) {
                activityListEl.innerHTML = '';
                repos.slice(0, 3).forEach(repo => {
                    const li = document.createElement('li');
                    const date = repo.pushed_at ? new Date(repo.pushed_at).toLocaleDateString() : 'unknown date';
                    li.innerHTML = `<strong>${repo.name}</strong>: Updated on ${date}`;
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
    const FRAME_INTERVAL = 1000 / 30;
    const nodeCount = window.innerWidth < 768 ? 8 : 24;
    const nodes = [];
    const maxConnPerNode = 4;
    let mousePos = { x: -9999, y: -9999 };
    let mouseMoveTimeout;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function themeColor(alpha) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const r = isDark ? 255 : 215;
        const g = isDark ? 122 : 59;
        const b = isDark ? 0 : 47;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            baseSize: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2
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
        const maxDist = Math.min(width, height) * 0.2;
        ctx.lineWidth = 1;

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += a.vx;
            a.y += a.vy;

            if (a.x < 0 || a.x > width) a.vx *= -1;
            if (a.y < 0 || a.y > height) a.vy *= -1;

            const time = Date.now() * 0.002;
            const pulse = a.baseSize + Math.sin(time + a.phase) * 0.5;

            ctx.fillStyle = themeColor(0.6);
            ctx.beginPath();
            ctx.arc(a.x, a.y, Math.max(0, pulse), 0, Math.PI * 2);
            ctx.fill();

            if (mousePos.x > -9000) {
                const dxm = a.x - mousePos.x;
                const dym = a.y - mousePos.y;
                const distm = Math.hypot(dxm, dym);
                if (distm < 150 && distm > 0.1) {
                    const force = (150 - distm) / 150;
                    a.vx += (dxm / distm) * force * 0.03;
                    a.vy += (dym / distm) * force * 0.03;
                }
            }

            let connections = 0;
            for (let j = i + 1; j < nodes.length; j++) {
                if (connections >= maxConnPerNode) break;
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    ctx.strokeStyle = themeColor(0.15 * (1 - dist / maxDist));
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

