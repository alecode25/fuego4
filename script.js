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

    // Chiudi il menu hamburger quando scrolli
    if (hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }

    // Rimuovi tutte le classi se sei in cima
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
                    console.log('Autoplay bloccato dal browser:', error);
                });
            }
        } else {
            video.pause();
        }
    });
}, observerOptions);

if (video) {
    videoObserver.observe(video);

    // Click per attivare/disattivare audio
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        // Toggle mute per attivare audio
        video.muted = !video.muted;
    });
}

// CAROUSEL OTTIMIZZATO CON SCROLL SNAP
const carousel = document.querySelector('.eventi-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const cards = document.querySelectorAll('.evento-card');

if (carousel && cards.length > 0) {
    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 7000;
    const isMobile = window.innerWidth <= 768;

    // Calcola quante card per view
    function getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    let cardsPerView = getCardsPerView();
    let totalPages = Math.ceil(cards.length / cardsPerView);

    // Crea i dots
    function createDots() {
        dotsContainer.innerHTML = '';
        totalPages = Math.ceil(cards.length / cardsPerView);
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

    // Vai a una pagina specifica
    function goToPage(pageIndex) {
        currentIndex = pageIndex;
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        const scrollAmount = (cardWidth + gap) * cardsPerView * currentIndex;
        
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        updateDots();
        resetAutoScroll();
    }

    // Prossima pagina
    function nextPage() {
        currentIndex = (currentIndex + 1) % totalPages;
        goToPage(currentIndex);
    }

    // Pagina precedente
    function prevPage() {
        currentIndex = (currentIndex - 1 + totalPages) % totalPages;
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

    // Event Listeners
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);

    // Touch per fermare autoscroll
    carousel.addEventListener('touchstart', () => {
        clearInterval(autoScrollInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        setTimeout(() => {
            resetAutoScroll();
        }, 300);
    }, { passive: true });

    // Scroll listener per aggiornare dots in base allo scroll nativo
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            const newIndex = Math.round(scrollLeft / (cardWidth + gap));
            
            if (newIndex !== currentIndex && newIndex < totalPages && newIndex >= 0) {
                currentIndex = newIndex;
                updateDots();
            }
        }, 100);
    }, { passive: true });

    // Inizializza
    createDots();
    startAutoScroll();

    // Ricalcola al resize
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
