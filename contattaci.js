// Menu hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ========================================
// CONFIGURAZIONE GOOGLE SHEETS
// ========================================
// SOSTITUISCI QUESTO URL CON QUELLO CHE HAI COPIATO DA GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_G_V1L7PufN6RKBg3h-4IbTVDgtjt517MMmObAV0Oogg_GEsaSC5i5fOkRnzQFXb6/exec';

// Gestione form contatto
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = contactForm.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Raccogli dati dal form
        const nome = document.getElementById('nome').value.trim();
        const cognome = document.getElementById('cognome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const motivo = document.getElementById('motivo').value;
        const messaggio = document.getElementById('messaggio').value.trim();
        const privacy = document.getElementById('privacy').checked;

        // Validazione
        if (!nome || !cognome || !email || !motivo || !messaggio) {
            showMessage('⚠️ Compila tutti i campi obbligatori', 'error');
            return;
        }

        if (!privacy) {
            showMessage('⚠️ Devi accettare la Privacy Policy', 'error');
            return;
        }

        // Validazione email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('⚠️ Inserisci un indirizzo email valido', 'error');
            return;
        }

        // Disabilita il pulsante durante l'invio
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        // Prepara i dati per Google Sheets
        const formData = {
            nome: nome,
            cognome: cognome,
            email: email,
            telefono: telefono || 'Non fornito',
            motivo: getMotivioLabel(motivo),
            messaggio: messaggio
        };

        console.log('Invio dati:', formData); // Per debug

        // Invia i dati a Google Sheets
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante per Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Risposta ricevuta'); // Per debug
            showMessage('✅ Messaggio inviato e salvato con successo! Ti risponderemo entro 24 ore.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Errore invio:', error);
            showMessage('❌ Errore durante l\'invio. Riprova o contattaci via WhatsApp al +39 333 123 4567', 'error');
            
        } finally {
            // Riabilita il pulsante
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

// Mostra messaggio di feedback
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    
    // Nascondi il messaggio dopo 6 secondi
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 6000);
}

// Converti il valore del motivo in testo leggibile
function getMotivioLabel(value) {
    const labels = {
        'prenotazione': 'Prenotazione Evento',
        'info': 'Richiesta Informazioni',
        'collaborazione': 'Collaborazione/Partnership',
        'pr': 'Diventa PR',
        'altro': 'Altro'
    };
    return labels[value] || value;
}
