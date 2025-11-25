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

// ==================== COUNTDOWN FISSO ====================

// ==================== COUNTDOWN FISSO ====================

document.addEventListener('DOMContentLoaded', function() {
    const countdownBar = document.getElementById('countdownBar');
    const closeBtn = document.getElementById('closeCountdown');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    console.log('Countdown bar:', countdownBar);
    console.log('Close button:', closeBtn);

    // Data target del prossimo evento
    const targetDate = new Date('2025-12-31T23:59:59').getTime();

    // Mostra il countdown
    if (countdownBar) {
        countdownBar.style.display = 'block';
        setTimeout(() => {
            countdownBar.classList.add('show');
        }, 500);
    }

    // Funzione per aggiornare il countdown
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (countdownBar) {
                countdownBar.style.display = 'none';
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Gestione chiusura
    if (closeBtn) {
        console.log('✅ Pulsante chiusura trovato!');
        closeBtn.addEventListener('click', function(e) {
            console.log('🔴 Click sul pulsante X');
            e.preventDefault();
            e.stopPropagation();
            
            if (countdownBar) {
                countdownBar.classList.remove('show');
                setTimeout(() => {
                    countdownBar.style.display = 'none';
                    console.log('✅ Countdown nascosto');
                }, 300);
            }
        });
    } else {
        console.error('❌ Pulsante chiusura NON trovato!');
    }
});

// Funzione globale alternativa
window.closeCountdown = function() {
    console.log('🔴 Funzione closeCountdown chiamata');
    const countdownBar = document.getElementById('countdownBar');
    if (countdownBar) {
        countdownBar.classList.remove('show');
        setTimeout(() => {
            countdownBar.style.display = 'none';
        }, 300);
    }
}


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
