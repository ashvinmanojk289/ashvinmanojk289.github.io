document.addEventListener('DOMContentLoaded', function () {
    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';

    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Scroll Spy ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    function setActiveLink() {
        if (window.innerWidth <= 992) {
            navLinks.forEach(link => link.classList.remove('active'));
            return;
        }
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                currentId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.hash === '#' + currentId) {
                link.classList.add('active');
            }
        });
    }

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .timeline').forEach(el => observer.observe(el));


    // --- 3D Tilt Effect for Project Cards (Subtler Effect) ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20; // Changed from 10 to 20
            const rotateY = (centerX - x) / 20; // Changed from 10 to 20
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- Modal Logic with Accessibility ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    let activeModal = null;
    let lastFocusedElement = null;

    const openModal = (modal, button) => {
        lastFocusedElement = button;
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        activeModal = modal;
        document.body.classList.add('no-scroll'); // Prevent background scrolling
        document.addEventListener('keydown', handleKeyDown);
        const focusableElements = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    };

    const closeModal = () => {
        if (activeModal) {
            activeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Restore scrolling
            document.removeEventListener('keydown', handleKeyDown);
            activeModal = null;
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key !== 'Tab' || !activeModal) return;
        const focusableElements = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };
    
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById(button.dataset.modalTarget);
            openModal(modal, button);
        });
    });

    closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', closeModal);

    // --- Mobile Navigation Logic ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavPanel = document.querySelector('.mobile-nav-panel');
    const closeMobileNavBtn = document.querySelector('.close-mobile-nav');
    const desktopNav = document.querySelector('.nav .nav-list');
    const mobileNavContainer = document.querySelector('.mobile-nav');

    if (desktopNav && mobileNavContainer) {
        // Clone desktop nav list for the mobile panel
        mobileNavContainer.innerHTML = desktopNav.outerHTML;
    }
    
    const openMobileNav = () => {
        mobileNavPanel.classList.add('active');
        document.body.classList.add('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMobileNav = () => {
        mobileNavPanel.classList.remove('active');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
    };

    mobileNavToggle.addEventListener('click', openMobileNav);
    closeMobileNavBtn.addEventListener('click', closeMobileNav);
    
    // Close mobile nav when a link is clicked
    mobileNavPanel.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
            closeMobileNav();
        }
    });

    // Event Listeners
    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('resize', setActiveLink);
    setActiveLink();
});
