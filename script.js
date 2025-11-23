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

// CAROUSEL - SOLO SCROLL NATIVO (NO JAVASCRIPT)
const carousel = document.querySelector('.eventi-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const cards = document.querySelectorAll('.evento-card');

if (carousel && cards.length > 0) {
    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 7000;

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
        if (pageIndex < 0 || pageIndex >= totalPages) return;
        
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

    // Bottoni carousel
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);

    // SOLO fermare autoscroll quando tocchi - NESSUN ALTRO TOUCH LISTENER
    let touchStartTime;
    carousel.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
        clearInterval(autoScrollInterval);
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        const touchDuration = Date.now() - touchStartTime;
        // Riavvia autoscroll dopo un breve delay
        setTimeout(() => {
            resetAutoScroll();
        }, touchDuration < 300 ? 200 : 500);
    }, { passive: true });

    // Aggiorna dots basandoti sullo scroll nativo con debounce ottimizzato
    let scrollTimeout;
    let isScrolling = false;
    
    carousel.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            const cardWidthWithGap = cardWidth + gap;
            
            // Calcolo più preciso dell'indice
            let newIndex;
            if (window.innerWidth <= 768) {
                newIndex = Math.round(scrollLeft / cardWidthWithGap);
            } else {
                newIndex = Math.round(scrollLeft / (cardWidthWithGap * 2));
            }
            
            newIndex = Math.max(0, Math.min(newIndex, totalPages - 1));
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateDots();
            }
            
            isScrolling = false;
        }, 150);
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
                totalPages = Math.ceil(cards.length / cardsPerView);
                createDots();
                currentIndex = 0;
                carousel.scrollLeft = 0;
                updateDots();
                startAutoScroll();
            }
        }, 250);
    }, { passive: true });
}
