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

// Auto-play video quando entra in viewport
const observerOptions = {
    threshold: 0.5
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay bloccato:', error);
                });
            }
        } else {
            video.pause();
        }
    });
}, observerOptions);

if (video) {
    videoObserver.observe(video);

    // Click per attivare audio
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        video.muted = !video.muted;
    });
}

// CAROUSEL - CON RILEVAMENTO INTERAZIONE UTENTE INTELLIGENTE
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
            dot.addEventListener('click', () => goToPage(i));
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

    // Vai a una card specifica
    function goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= totalPages) return;
        if (isScrolling) return;

        isScrolling = true;
        currentIndex = pageIndex;

        if (window.innerWidth <= 768) {
            const targetCard = cards[currentIndex];
            const containerWidth = carousel.offsetWidth;
            const cardWidth = targetCard.offsetWidth;
            const cardLeft = targetCard.offsetLeft;

            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);

            carousel.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        } else {
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const scrollAmount = (cardWidth + gap) * 2 * currentIndex;

            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }

        setTimeout(() => {
            isScrolling = false;
            updateDots();
        }, 500);

        resetAutoScroll();
    }

    // Prossima card
    function nextPage() {
        const maxIndex = window.innerWidth <= 768 ? cards.length - 1 : Math.ceil(cards.length / 2) - 1;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        goToPage(currentIndex);
    }

    // Card precedente
    function prevPage() {
        const maxIndex = window.innerWidth <= 768 ? cards.length - 1 : Math.ceil(cards.length / 2) - 1;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        goToPage(currentIndex);
    }

    // Auto-scroll
    function startAutoScroll() {
        // Non partire se l'utente sta interagendo
        if (userInteracting) return;

        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            // Controlla ancora se l'utente sta interagendo
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
        // Aspetta un po' prima di ripartire
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
        }, 2000); // 2 secondi dopo l'ultima interazione
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

    // Touch start - utente inizia a toccare
    carousel.addEventListener('touchstart', () => {
        startUserInteraction();
    }, { passive: true });

    // Touch end - utente ha rilasciato
    carousel.addEventListener('touchend', () => {
        setTimeout(() => {
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

                currentIndex = closestIndex;
                goToPage(currentIndex);
            }
            endUserInteraction();
        }, 100);
    }, { passive: true });

    // Scroll manuale - l'utente sta scrollando
    carousel.addEventListener('scroll', () => {
        startUserInteraction();

        // Debounce: aspetta che l'utente smetta di scrollare
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            // L'utente ha smesso di scrollare
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
        }, 150); // 150ms dopo l'ultimo evento scroll
    }, { passive: true });

    // Click sui dots
    const originalGoToPage = goToPage;
    goToPage = function (pageIndex) {
        startUserInteraction();
        originalGoToPage(pageIndex);
        endUserInteraction();
    };

    // Inizializza
    createDots();
    goToPage(0);
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
                originalGoToPage(0);
            }

            if (!userInteracting) {
                startAutoScroll();
            }
        }, 250);
    }, { passive: true });
}
