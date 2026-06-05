// Reset scroll to top whenever the page first loads
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0 });
});

// Select all sections and nav links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.page-nav a');

// Intersection Observer to detect which section is on screen
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to the currently intersecting section's link
            const id = entry.target.getAttribute('id');
            const currentLink = document.querySelector(`.page-nav a[href="#${id}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    });
}, {
    // Triggers when the section is mostly visible in the viewport
    threshold: 0.65 
});

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

const cursorHalo = document.querySelector('.cursor-halo');

if (cursorHalo) {
    window.addEventListener('mousemove', (event) => {
        cursorHalo.style.left = `${event.clientX}px`;
        cursorHalo.style.top = `${event.clientY}px`;
        cursorHalo.classList.add('visible');
    });

    window.addEventListener('mouseleave', () => {
        cursorHalo.classList.remove('visible');
    });

    window.addEventListener('mouseenter', () => {
        cursorHalo.classList.add('visible');
    });
}

// Initialize clickable cards and project links using `data-link` attributes.
// Leave `data-link=""` in the HTML and fill with your URL(s).
(() => {
    const linkables = document.querySelectorAll('[data-link]');
    linkables.forEach(el => {
        const url = (el.dataset.link || '').trim();
        if (!url) return; // skip placeholders

        // If element is an anchor, set its href and target so default behavior works.
        if (el.tagName.toLowerCase() === 'a') {
            el.setAttribute('href', url);
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
        } else {
            // Make non-anchor cards keyboard-accessible and clickable.
            el.style.cursor = 'pointer';
            el.setAttribute('tabindex', '0');
            el.addEventListener('click', () => {
                window.open(url, '_blank', 'noopener');
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(url, '_blank', 'noopener');
                }
            });
        }
    });
})();