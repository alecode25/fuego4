
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const video = document.querySelector('.video-section video');
let lastScroll = 0;
let videoPlayed = false;

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
            // Scroll giù - nascondi navbar
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll su - mostra navbar
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });
    // Rimuovi tutte le classi se sei in cima
    if (currentScroll <= 50) {
        navbar.classList.remove('scroll-up');
        navbar.classList.remove('scroll-down');
        lastScroll = currentScroll;
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll giù - nascondi navbar
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll su - mostra navbar
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
});

// Auto-play video quando entra in viewport (solo una volta)
const observerOptions = {
    threshold: 0.5
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !videoPlayed) {
            video.play();
            videoPlayed = true;
            videoObserver.disconnect();
        }
    });
}, observerOptions);

if (video) {
    videoObserver.observe(video);

    // Play/Pause al click sul video
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}
// Carousel Eventi con Auto-Scroll e Touch Swipe
const carousel = document.querySelector('.eventi-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const cards = document.querySelectorAll('.evento-card');

let currentIndex = 0;
let autoScrollInterval;
const autoScrollDelay = 7000; // 7 secondi
const cardsPerView = window.innerWidth > 768 ? 2 : 1;
let totalPages = Math.ceil(cards.length / cardsPerView);

// Variabili per touch/swipe
let startX = 0;
let endX = 0;
let isDragging = false;

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

// Touch Events per swipe su mobile
function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(autoScrollInterval);
}

function handleTouchMove(e) {
    if (!isDragging) return;
    endX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    const swipeThreshold = 50; // Distanza minima per registrare uno swipe
    const difference = startX - endX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swipe verso sinistra - prossima pagina
            nextPage();
        } else {
            // Swipe verso destra - pagina precedente
            prevPage();
        }
    } else {
        resetAutoScroll();
    }
}

// Mouse Events per drag su desktop
function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    carousel.style.cursor = 'grabbing';
    clearInterval(autoScrollInterval);
}

function handleMouseMove(e) {
    if (!isDragging) return;
    endX = e.clientX;
}

function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    
    const swipeThreshold = 50;
    const difference = startX - endX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            nextPage();
        } else {
            prevPage();
        }
    } else {
        resetAutoScroll();
    }
}

// Event Listeners
if (prevBtn) prevBtn.addEventListener('click', prevPage);
if (nextBtn) nextBtn.addEventListener('click', nextPage);

// Touch events per mobile
if (carousel) {
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events per desktop
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            resetAutoScroll();
        }
    });
    
    // Ferma auto-scroll quando l'utente interagisce
    carousel.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carousel.addEventListener('mouseleave', () => {
        if (!isDragging) startAutoScroll();
    });
}

// Inizializza
if (carousel && cards.length > 0) {
    carousel.style.cursor = 'grab';
    createDots();
    startAutoScroll();
    
    // Ricalcola al resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            clearInterval(autoScrollInterval);
            const newCardsPerView = window.innerWidth > 768 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                createDots();
                goToPage(0);
            }
        }, 250);
    });
}
