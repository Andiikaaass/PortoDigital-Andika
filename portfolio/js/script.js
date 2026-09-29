/* ============================================================
   PORTFOLIO — ANDIKA PRATAMA — UI/UX DESIGNER
   Complete JavaScript (Vanilla)
   ============================================================ */

/* ----------------------------------------------------------
   ✏️ CONFIGURATION — Edit these values to personalize
   ---------------------------------------------------------- */
const CONFIG = {
    // WhatsApp number (include country code, no + sign, no spaces)
    whatsappNumber: '6281234567890',

    // Your email address (used by the mailto form)
    email: 'andika.pratama@email.com',

    // WhatsApp default message
    whatsappMessage: 'Halo Andika! Saya tertarik untuk berdiskusi tentang project desain.',

    // Scroll offset for sticky nav highlighting
    scrollOffset: 100,
};

/* ----------------------------------------------------------
   DOM READY
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initHamburgerMenu();
    initPortfolioFilter();
    initPortfolioModal();
    initContactForm();
    initWhatsApp();
    initScrollReveal();
    initSkillBars();
    initBackToTop();
    initFooterYear();
});

/* ----------------------------------------------------------
   1. NAVBAR — Sticky shadow & active link
   ---------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Add shadow on scroll
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run on load
}

/* ----------------------------------------------------------
   2. SMOOTH SCROLL — Anchor links
   ---------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ----------------------------------------------------------
   3. HAMBURGER MENU — Mobile toggle
   ---------------------------------------------------------- */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* ----------------------------------------------------------
   4. PORTFOLIO FILTER — Category filtering
   ---------------------------------------------------------- */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (!filterBtns.length || !portfolioCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    // Trigger re-animation
                    card.style.animation = 'none';
                    card.offsetHeight; // Force reflow
                    card.style.animation = '';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ----------------------------------------------------------
   5. PORTFOLIO MODAL — Open/close project details
   ---------------------------------------------------------- */
function initPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');

    if (!modal) return;

    // Open modal from view button or link
    document.querySelectorAll('.portfolio-view-btn, .portfolio-link').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = trigger.closest('.portfolio-card');
            if (!card) return;

            const title = card.dataset.title;
            const description = card.dataset.description;
            const image = card.dataset.image;
            const category = card.querySelector('.portfolio-category')?.textContent || '';

            modalImage.src = image;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalDescription.textContent = description;

            modal.removeAttribute('hidden');
            // Force reflow before adding active class for transition
            modal.offsetHeight;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus trap
            modalClose.focus();
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.setAttribute('hidden', '');
        }, 300);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ----------------------------------------------------------
   6. CONTACT FORM — Validation + mailto
   ---------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName');
        const email = document.getElementById('formEmail');
        const subject = document.getElementById('formSubject');
        const message = document.getElementById('formMessage');

        // Reset errors
        clearErrors();

        let isValid = true;

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'nameError', 'Please enter your name.');
            isValid = false;
        }

        // Validate email
        if (!email.value.trim()) {
            showError(email, 'emailError', 'Please enter your email.');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'emailError', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate subject
        if (!subject.value.trim()) {
            showError(subject, 'subjectError', 'Please enter a subject.');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'messageError', 'Please enter your message.');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'messageError', 'Message must be at least 10 characters.');
            isValid = false;
        }

        if (!isValid) return;

        // Build mailto link
        const mailSubject = encodeURIComponent(subject.value.trim());
        const mailBody = encodeURIComponent(
            `Name: ${name.value.trim()}\n` +
            `Email: ${email.value.trim()}\n\n` +
            `${message.value.trim()}`
        );

        const mailtoLink = `mailto:${CONFIG.email}?subject=${mailSubject}&body=${mailBody}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success feedback
        showFormSuccess();
    });

    function showError(input, errorId, message) {
        input.classList.add('error');
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.textContent = message;
    }

    function clearErrors() {
        form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormSuccess() {
        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Opening Email Client…';
        btn.style.background = '#25D366';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 3000);
    }
}

/* ----------------------------------------------------------
   7. WHATSAPP BUTTON
   ---------------------------------------------------------- */
function initWhatsApp() {
    const waBtn = document.getElementById('whatsappBtn');
    if (!waBtn) return;

    waBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const message = encodeURIComponent(CONFIG.whatsappMessage);
        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
}

/* ----------------------------------------------------------
   8. SCROLL REVEAL — IntersectionObserver animations
   ---------------------------------------------------------- */
function initScrollReveal() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for child elements
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
                    siblings.forEach((sibling, index) => {
                        if (sibling === entry.target) {
                            entry.target.style.transitionDelay = `${index * 0.1}s`;
                        }
                    });
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   9. SKILL BARS — Animate on scroll
   ---------------------------------------------------------- */
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (!skillItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                const bar = entry.target.querySelector('.skill-progress');
                if (bar) {
                    // Small delay for visual effect
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                        bar.classList.add('animate');
                    }, 200);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillItems.forEach(item => observer.observe(item));
}

/* ----------------------------------------------------------
   10. BACK TO TOP
   ---------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ----------------------------------------------------------
   11. FOOTER YEAR — Dynamic copyright
   ---------------------------------------------------------- */
function initFooterYear() {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
