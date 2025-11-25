const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const video = document.querySelector('.video-section video');
let lastScroll = 0;

// Menu hamburger
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

// Nascondi/mostra navbar quando scrolli
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }

    if (currentScroll <= 50) {
        navbar.classList.remove('scroll-up');
        navbar.classList.remove('scroll-down');
        lastScroll = currentScroll;
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
}, { passive: true });


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







// Auto-play video CON AUDIO quando entra in viewport
const observerOptions = {
    threshold: 0.3
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Prova prima CON audio
            video.muted = false;
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Video avviato con audio!');
                }).catch(error => {
                    // Fallback: prova SENZA audio
                    console.log('⚠️ Audio bloccato, provo muto');
                    video.muted = true;
                    video.play().then(() => {
                        console.log('✅ Video avviato muto');
                    }).catch(e => {
                        console.log('❌ Errore video:', e);
                    });
                });
            }
        } else {
            video.pause();
        }
    });
}, observerOptions);

if (video) {
    videoObserver.observe(video);

    // Singolo click = attiva/disattiva audio E riavvia se è in pausa
    video.addEventListener('click', () => {
        // Se il video è in pausa, fallo ripartire
        if (video.paused) {
            video.muted = false;
            video.play();
            console.log('▶️ Video avviato con audio');
        } else {
            // Toggle audio
            video.muted = !video.muted;
            if (video.muted) {
                console.log('🔇 Audio disattivato');
            } else {
                console.log('🔊 Audio attivato');
            }
        }
    });
}


// CAROUSEL - CON LOOP INFINITO SEAMLESS
const carousel = document.querySelector('.eventi-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const cards = document.querySelectorAll('.evento-card');

if (carousel && cards.length > 0) {
    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 7000;
    let isScrolling = false;
    let userInteracting = false;
    let scrollEndTimer;
    let interactionTimer;

    function getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    let cardsPerView = getCardsPerView();
    let totalPages = cards.length;

    // Crea i dots
    function createDots() {
        dotsContainer.innerHTML = '';
        totalPages = window.innerWidth <= 768 ? cards.length : Math.ceil(cards.length / 2);

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                startUserInteraction();
                goToPage(i, true);
                endUserInteraction();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Aggiorna i dots
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Vai a una card specifica - CON OPZIONE SMOOTH
    function goToPage(pageIndex, smooth = true) {
        if (pageIndex < 0 || pageIndex >= totalPages) return;
        if (isScrolling && smooth) return;

        isScrolling = true;
        currentIndex = pageIndex;

        if (window.innerWidth <= 768) {
            const targetCard = cards[currentIndex];
            const containerWidth = carousel.offsetWidth;
            const cardWidth = targetCard.offsetWidth;
            const cardLeft = targetCard.offsetLeft;

            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);

            if (smooth) {
                carousel.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            } else {
                // INSTANT - senza animazione
                carousel.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'instant'
                });
            }
        } else {
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const scrollAmount = (cardWidth + gap) * 2 * currentIndex;

            carousel.scrollTo({
                left: scrollAmount,
                behavior: smooth ? 'smooth' : 'instant'
            });
        }

        setTimeout(() => {
            isScrolling = false;
            updateDots();
        }, smooth ? 500 : 0);

        resetAutoScroll();
    }

    // Prossima card - CON LOOP
    function nextPage() {
        const maxIndex = window.innerWidth <= 768 ? cards.length - 1 : Math.ceil(cards.length / 2) - 1;

        if (currentIndex >= maxIndex) {
            // Ultima card → torna alla prima SENZA animazione
            currentIndex = 0;
            goToPage(0, false);
        } else {
            currentIndex++;
            goToPage(currentIndex, true);
        }
    }

    // Card precedente - CON LOOP
    function prevPage() {
        const maxIndex = window.innerWidth <= 768 ? cards.length - 1 : Math.ceil(cards.length / 2) - 1;

        if (currentIndex <= 0) {
            // Prima card → vai all'ultima SENZA animazione
            currentIndex = maxIndex;
            goToPage(maxIndex, false);
        } else {
            currentIndex--;
            goToPage(currentIndex, true);
        }
    }

    // Auto-scroll
    function startAutoScroll() {
        if (userInteracting) return;

        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!userInteracting) {
                nextPage();
            }
        }, autoScrollDelay);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    function resetAutoScroll() {
        stopAutoScroll();
        clearTimeout(interactionTimer);
        interactionTimer = setTimeout(() => {
            if (!userInteracting) {
                startAutoScroll();
            }
        }, 1000);
    }

    // Segnala che l'utente sta interagendo
    function startUserInteraction() {
        userInteracting = true;
        stopAutoScroll();
        clearTimeout(interactionTimer);
    }

    // Segnala che l'utente ha finito di interagire
    function endUserInteraction() {
        clearTimeout(interactionTimer);
        interactionTimer = setTimeout(() => {
            userInteracting = false;
            startAutoScroll();
        }, 2000);
    }

    // Bottoni carousel
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            startUserInteraction();
            prevPage();
            endUserInteraction();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            startUserInteraction();
            nextPage();
            endUserInteraction();
        });
    }

    // Touch start
    carousel.addEventListener('touchstart', () => {
        startUserInteraction();
    }, { passive: true });

    // Touch end - CON RILEVAMENTO SWIPE OLTRE I BORDI
    carousel.addEventListener('touchend', () => {
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                const containerCenter = carousel.scrollLeft + (carousel.offsetWidth / 2);
                const scrollLeft = carousel.scrollLeft;
                const maxScroll = carousel.scrollWidth - carousel.offsetWidth;

                let closestIndex = 0;
                let minDistance = Infinity;

                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const distance = Math.abs(containerCenter - cardCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                // Se sei all'ultima card e swipe verso destra → vai alla prima
                if (scrollLeft >= maxScroll - 10 && closestIndex === cards.length - 1) {
                    currentIndex = 0;
                    goToPage(0, false);
                }
                // Se sei alla prima card e swipe verso sinistra → vai all'ultima
                else if (scrollLeft <= 10 && closestIndex === 0) {
                    currentIndex = cards.length - 1;
                    goToPage(cards.length - 1, false);
                }
                else {
                    currentIndex = closestIndex;
                    goToPage(currentIndex, true);
                }
            }
            endUserInteraction();
        }, 100);
    }, { passive: true });

    // Scroll manuale
    carousel.addEventListener('scroll', () => {
        startUserInteraction();

        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            if (window.innerWidth <= 768) {
                const containerCenter = carousel.scrollLeft + (carousel.offsetWidth / 2);
                let closestIndex = 0;
                let minDistance = Infinity;

                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const distance = Math.abs(containerCenter - cardCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                if (closestIndex !== currentIndex) {
                    currentIndex = closestIndex;
                    updateDots();
                }
            }

            endUserInteraction();
        }, 150);
    }, { passive: true });

    // Inizializza
    createDots();
    goToPage(0, false);
    startAutoScroll();

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            stopAutoScroll();
            const newCardsPerView = getCardsPerView();

            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                createDots();
                currentIndex = 0;
                goToPage(0, false);
            }

            if (!userInteracting) {
                startAutoScroll();
            }
        }, 250);
    }, { passive: true });
}
// ==================== FAQ ACCORDION ====================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Chiudi tutti gli altri item
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle dell'item corrente
        item.classList.toggle('active');
    });
});
// ==================== FUNZIONI DI VALIDAZIONE ====================

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[0-9]{9,15}$/;
    return phoneRegex.test(cleanPhone);
}

// ==================== NEWSLETTER FORM ====================

document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        console.log('✅ Newsletter form trovato!');

        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('📩 Form newsletter inviato!');

            const email = document.getElementById('newsletter-email').value.trim();
            const phone = document.getElementById('newsletter-phone').value.trim();
            const privacy = document.getElementById('privacy').checked;

            // Validazione
            if (!validateEmail(email)) {
                showErrorPopup('Inserisci un indirizzo email valido');
                return false;
            }

            if (!validatePhone(phone)) {
                showErrorPopup('Inserisci un numero WhatsApp valido (9-15 cifre)');
                return false;
            }

            if (!privacy) {
                showErrorPopup('Devi accettare di ricevere comunicazioni');
                return false;
            }

            // Invia a Google Sheets
            sendNewsletterToGoogleSheets(email, phone);

            return false;
        });
    }
});

function sendNewsletterToGoogleSheets(email, phone) {
    const btn = document.querySelector('.newsletter-btn');
    const originalText = btn.textContent;

    btn.textContent = 'Iscrizione in corso...';
    btn.disabled = true;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwLsqIZUl223ngalemsOvTwENHdn6nG50qZFyj9jnrqPSQkNOdv09MpBfua67dJQb8F/exec';

    const formData = {
        email: email,
        telefono: phone
    };

    console.log('📤 Invio dati a:', scriptURL);
    console.log('📦 Dati:', formData);

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Dati risposta:', data);
            if (data.result === 'success') {
                showNewsletterPopup();
                document.getElementById('newsletterForm').reset();
            } else {
                throw new Error(data.error || 'Errore sconosciuto');
            }
        })
        .catch(error => {
            console.error('❌ Errore:', error);
            showErrorPopup('Si è verificato un errore. Riprova più tardi.');
        })
        .finally(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        });
}

// ==================== POPUP FUNCTIONS ====================

function showNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.classList.add('show');
    }
}

function closeNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

function showErrorPopup(message) {
    const popup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    if (popup && errorMessage) {
        errorMessage.textContent = message || 'Si è verificato un errore. Riprova più tardi.';
        popup.classList.add('show');
    }
}

function closeErrorPopup() {
    const popup = document.getElementById('errorPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// Chiudi popup cliccando fuori (solo se esiste)
window.addEventListener('click', function (e) {
    const successPopup = document.getElementById('newsletterPopup');
    const errorPopup = document.getElementById('errorPopup');

    if (successPopup && e.target === successPopup) {
        closeNewsletterPopup();
    }
    if (errorPopup && e.target === errorPopup) {
        closeErrorPopup();
    }
});


