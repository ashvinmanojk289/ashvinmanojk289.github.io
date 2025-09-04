document.addEventListener('DOMContentLoaded', function () {
    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Dynamic Year for Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Scroll Spy for Sticky Navigation ---
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' }); // Activates when section is in the middle of the viewport
    sections.forEach(section => scrollSpyObserver.observe(section));

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavPanel = document.querySelector('.mobile-nav-panel');
    const desktopNavList = document.querySelector('.nav .nav-list');
    const mobileNavContainer = document.querySelector('.mobile-nav-content');

    if (desktopNavList && mobileNavContainer) {
        mobileNavContainer.innerHTML = desktopNavList.outerHTML; // Clone nav for mobile
    }
    
    const toggleMobileNav = () => {
        const isActive = mobileNavPanel.classList.toggle('active');
        mobileNavToggle.classList.toggle('active');
        mobileNavToggle.setAttribute('aria-expanded', isActive);
        document.body.classList.toggle('no-scroll', isActive);
    };

    mobileNavToggle.addEventListener('click', toggleMobileNav);
    mobileNavPanel.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
            toggleMobileNav();
        }
    });

    // --- Intersection Observer for Reveal Animations ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after revealing to prevent re-triggering
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- Modal Logic (largely unchanged) ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    let activeModal = null;

    const openModal = (modal) => {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
        activeModal = modal;
    };
    const closeModal = () => {
        if (activeModal) {
            activeModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            if (!mobileNavPanel.classList.contains('active')) {
                document.body.classList.remove('no-scroll');
            }
            activeModal = null;
        }
    };
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById(button.dataset.modalTarget);
            openModal(modal);
        });
    });
    closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', closeModal);
});
