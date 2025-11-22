// Menu hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Chiudi il menu quando clicchi su un link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Animazione contatore numeri
window.addEventListener('load', function() {
    const statSection = document.querySelector('.stats-section');
    
    if (!statSection) return;
    
    let animated = false;
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function checkAndAnimate() {
        if (animated) return;
        
        if (isInViewport(statSection)) {
            animated = true;
            const counters = document.querySelectorAll('.stat-number');
            
            counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateValue(counter, 0, target, 2000);
            });
            
            window.removeEventListener('scroll', checkAndAnimate);
        }
    }
    
    window.addEventListener('scroll', checkAndAnimate);
    checkAndAnimate(); // Controlla subito se è già visibile
});
