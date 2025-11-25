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
}// ==================== COUNTDOWN TIMER FISSO ====================

const EVENTO_CONFIG = {
    data: "2025-12-31T23:00:00",
    nome: "Capodanno 2026"
};

function updateCountdown() {
    const now = new Date().getTime();
    const eventDate = new Date(EVENTO_CONFIG.data).getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        const bar = document.getElementById('countdownBar');
        if (bar) {
            bar.style.display = 'none';
            bar.classList.remove('show');
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

function closeCountdown() {
    const bar = document.getElementById('countdownBar');
    if (bar) {
        bar.classList.remove('show');
        setTimeout(() => {
            bar.style.display = 'none';
        }, 300);
        localStorage.setItem('countdownClosed', 'true');
    }
}

function initCountdown() {
    const bar = document.getElementById('countdownBar');
    if (!bar) return;

    // Controlla se l'utente ha già chiuso il countdown
    if (localStorage.getItem('countdownClosed') === 'true') {
        return; // Rimane nascosto
    }

    // Mostra il countdown con fade in
    bar.style.display = 'block';
    setTimeout(() => {
        bar.classList.add('show');
    }, 50);

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Avvia immediatamente
initCountdown();

// ==================== IL TUO CODICE ESISTENTE CONTINUA QUI ====================


// Animazione contatore numeri
window.addEventListener('load', function () {
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
