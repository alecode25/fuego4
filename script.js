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

// CAROUSEL - VERSIONE FINALE CON CENTRATURA PERFETTA
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

    function getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    let cardsPerView = getCardsPerView();
    let totalPages = cards.length; // Mobile: 1 card = 1 page

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

    // Vai a una card specifica - CENTRATURA MATEMATICA
    function goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= totalPages) return;
        if (isScrolling) return;

        isScrolling = true;
        currentIndex = pageIndex;

        if (window.innerWidth <= 768) {
            // Mobile: centra la card selezionata
            const targetCard = cards[currentIndex];
            const containerWidth = carousel.offsetWidth;
            const cardWidth = targetCard.offsetWidth;
            const cardLeft = targetCard.offsetLeft;

            // Formula: posizione card - metà container + metà card
            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);

            carousel.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        } else {
            // Desktop: 2 card alla volta
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
        autoScrollInterval = setInterval(nextPage, autoScrollDelay);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    // Bottoni carousel
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);

    // Touch: ferma autoscroll
    let touchStartTime;
    carousel.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
        clearInterval(autoScrollInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        const touchDuration = Date.now() - touchStartTime;
        setTimeout(() => {
            // Trova la card più vicina al centro dopo lo swipe
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
            resetAutoScroll();
        }, 100);
    }, { passive: true });

    // Inizializza
    createDots();
    goToPage(0);
    startAutoScroll();

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            clearInterval(autoScrollInterval);
            const newCardsPerView = getCardsPerView();

            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                createDots();
                currentIndex = 0;
                goToPage(0);
            }
        }, 250);
    }, { passive: true });
}

