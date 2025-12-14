// Add at the beginning of your script.js file:
let isAnimating = false;
let lastScrollY = 0;
let ticking = false;

// Optimized scroll handler
function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Update animations here if needed
            ticking = false;
        });
        ticking = true;
    }
}

// Optimized resize handler
function onResize() {
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.style.display = 'flex';
    }
}

// Update the initMobileMenu function:
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                // Add hardware acceleration class
                navLinks.classList.add('hardware-accelerate');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !navLinks.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) &&
                navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        });
    }
}

// Update the DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with reduced animations if preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
    }
    
    if (typeof initLanguage === 'function') initLanguage();
    if (typeof renderMenuItems === 'function') renderMenuItems();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initTouchImageInteraction === 'function') initTouchImageInteraction();
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if ((currentPage === '' || currentPage === 'index.html') && linkPage === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    
    // Initial check
    onResize();
});

// Clean up event listeners when page unloads
window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
});

// Initialize touch-friendly image interactions (tap to 'pop' on phones)
function initTouchImageInteraction() {
    const touchSupported = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!touchSupported) return;

    // Delegated click handler: toggle 'is-active' on tapped .menu-card
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (card) {
            const wasActive = card.classList.contains('is-active');
            document.querySelectorAll('.menu-card.is-active').forEach(c => c.classList.remove('is-active'));
            if (!wasActive) {
                card.classList.add('is-active');
                card.setAttribute('aria-expanded', 'true');
            } else {
                card.setAttribute('aria-expanded', 'false');
            }
        } else {
            // Click outside: close any active cards
            document.querySelectorAll('.menu-card.is-active').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-expanded', 'false'); });
        }
    });
}

// Called when an image fails to load. Keeps a visible fallback and logs details for debugging.
function handleImageError(img) {
    try {
        console.warn('Image failed to load:', img.src);
        img.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'menu-card-image-fallback';
        fallback.innerHTML = '<i class="fas fa-drumstick-bite"></i><span class="fallback-text">Image unavailable</span>';
        img.parentElement.appendChild(fallback);
    } catch (e) {
        console.error('handleImageError failed', e);
    }
}
