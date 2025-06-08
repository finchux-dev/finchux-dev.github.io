// CareKeeper Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initSmoothScrolling();
    initLazyLoading();
    initScrollAnimations();
    initAccessibility();
    
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Smooth scroll to target
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.focus({ preventScroll: true });
            }
        });
    });
}

// Lazy Loading Images with Intersection Observer
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading class for smooth transition
                    img.classList.add('loading');
                    
                    // Load the image
                    img.addEventListener('load', () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    });
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Start observing all lazy images
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Scroll-triggered Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-item, .problem-item, .security-feature');
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Skip animations if user prefers reduced motion
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        return;
    }
    
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
}

// Accessibility Enhancements
function initAccessibility() {
    
    // Skip to main content link
    createSkipLink();
    
    // Keyboard navigation for CTAs
    enhanceKeyboardNavigation();
    
    // Focus management for smooth scroll
    manageFocusForSmoothScroll();
    
}

// Create skip to main content link
function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    // Show on focus
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
        skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
        skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Enhance keyboard navigation
function enhanceKeyboardNavigation() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        // Add keyboard event listeners
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Ensure proper focus indicators
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-blue)';
            this.style.outlineOffset = '2px';
        });
        
        button.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Focus management for smooth scroll navigation
function manageFocusForSmoothScroll() {
    // Ensure focusable elements are properly handled
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('tabindex')) {
        main.setAttribute('tabindex', '-1');
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        // Log performance metrics for debugging
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    });
    
    // Monitor image loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.display = 'none';
        });
    });
}

// Contact form link analytics (privacy-friendly)
function trackContactEngagement() {
    const contactLinks = document.querySelectorAll('a[href*="forms.gle"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Simple engagement tracking without personal data
            if ('sessionStorage' in window) {
                const engagement = sessionStorage.getItem('contact_clicks') || '0';
                sessionStorage.setItem('contact_clicks', (parseInt(engagement) + 1).toString());
            }
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceMonitoring();
    trackContactEngagement();
});

// Utility function for debouncing scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Back to top functionality (if needed in future)
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    // Show/hide based on scroll position
    const toggleBackToTop = debounce(() => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopButton);
}

// Error handling for missing elements
function handleMissingElements() {
    const requiredElements = [
        '.header',
        '.hero-section',
        '.features-section',
        '.contact-section'
    ];
    
    requiredElements.forEach(selector => {
        if (!document.querySelector(selector)) {
            console.warn(`Required element missing: ${selector}`);
        }
    });
} 