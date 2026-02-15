/**
 * Feedback System - Manuale {{ clinic.name }}
 * Sistema di raccolta feedback per migliorare il manuale
 */

(function() {
    'use strict';

    // Configurazione API
    const API_BASE = 'https://api-test.geniusmile.com/api/v1';

    // Stato
    let isModalOpen = false;
    let authToken = null;
    let currentUser = null;

    // Recupera token da localStorage (se l'utente ha fatto login nel CRM)
    function getAuthToken() {
        try {
            return localStorage.getItem('auth_token') || null;
        } catch (e) {
            return null;
        }
    }

    // Recupera info utente
    function getUserInfo() {
        try {
            const userJson = localStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            return null;
        }
    }

    // Crea il pulsante flottante
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'feedback-fab';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;
        button.title = 'Suggerisci modifiche';
        button.setAttribute('aria-label', 'Apri form feedback');

        button.addEventListener('click', openModal);

        document.body.appendChild(button);
    }

    // Crea il modal
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-modal-overlay"></div>
            <div class="feedback-modal-content">
                <div class="feedback-modal-header">
                    <h3>Suggerisci Modifiche</h3>
                    <button class="feedback-modal-close" aria-label="Chiudi">&times;</button>
                </div>
                <div class="feedback-modal-body">
                    <form id="feedback-form">
                        <div class="feedback-field">
                            <label for="feedback-tipo">Tipo di contributo *</label>
                            <select id="feedback-tipo" name="tipo" required>
                                <option value="">Seleziona...</option>
                                <option value="correzione">Correzione errore</option>
                                <option value="nuovo_contenuto">Aggiungi contenuto</option>
                                <option value="nuova_sezione">Proponi nuova sezione</option>
                                <option value="altro">Altro</option>
                            </select>
                        </div>
                        <div class="feedback-field">
                            <label for="feedback-titolo">Titolo *</label>
                            <input type="text" id="feedback-titolo" name="titolo" required
                                   placeholder="Breve descrizione del suggerimento" maxlength="255">
                        </div>
                        <div class="feedback-field">
                            <label for="feedback-descrizione">Descrizione *</label>
                            <textarea id="feedback-descrizione" name="descrizione" required rows="5"
                                      placeholder="Descrivi in dettaglio il tuo suggerimento o la correzione..."></textarea>
                        </div>
                        <div class="feedback-field">
                            <label for="feedback-priorita">Priorità</label>
                            <select id="feedback-priorita" name="priorita">
                                <option value="bassa">Bassa</option>
                                <option value="media" selected>Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                        <div class="feedback-field feedback-page-info">
                            <label>Pagina corrente</label>
                            <input type="text" id="feedback-pagina" name="pagina" readonly>
                        </div>
                        <div class="feedback-actions">
                            <button type="button" class="feedback-btn feedback-btn-secondary" id="feedback-cancel">
                                Annulla
                            </button>
                            <button type="submit" class="feedback-btn feedback-btn-primary" id="feedback-submit">
                                Invia Feedback
                            </button>
                        </div>
                    </form>
                    <div id="feedback-success" class="feedback-success" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h4>Grazie per il tuo contributo!</h4>
                        <p>Il tuo feedback è stato inviato e verrà esaminato dal team.</p>
                        <button class="feedback-btn feedback-btn-primary" id="feedback-close-success">Chiudi</button>
                    </div>
                    <div id="feedback-error" class="feedback-error" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <h4>Errore nell'invio</h4>
                        <p id="feedback-error-message">Si è verificato un errore. Riprova più tardi.</p>
                        <button class="feedback-btn feedback-btn-primary" id="feedback-retry">Riprova</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.feedback-modal-overlay').addEventListener('click', closeModal);
        modal.querySelector('.feedback-modal-close').addEventListener('click', closeModal);
        modal.querySelector('#feedback-cancel').addEventListener('click', closeModal);
        modal.querySelector('#feedback-form').addEventListener('submit', handleSubmit);
        modal.querySelector('#feedback-close-success').addEventListener('click', closeModal);
        modal.querySelector('#feedback-retry').addEventListener('click', showForm);

        // Chiudi con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        });
    }

    // Apri modal
    function openModal() {
        const modal = document.getElementById('feedback-modal');
        modal.classList.add('open');
        isModalOpen = true;

        // Imposta la pagina corrente
        const pagina = window.location.pathname;
        const titoloPagina = document.title;
        document.getElementById('feedback-pagina').value = pagina;

        // Focus sul primo campo
        setTimeout(() => {
            document.getElementById('feedback-tipo').focus();
        }, 100);

        // Mostra il form (nascondi success/error)
        showForm();
    }

    // Chiudi modal
    function closeModal() {
        const modal = document.getElementById('feedback-modal');
        modal.classList.remove('open');
        isModalOpen = false;

        // Reset form
        document.getElementById('feedback-form').reset();
    }

    // Mostra form
    function showForm() {
        document.getElementById('feedback-form').style.display = 'block';
        document.getElementById('feedback-success').style.display = 'none';
        document.getElementById('feedback-error').style.display = 'none';
    }

    // Mostra successo
    function showSuccess() {
        document.getElementById('feedback-form').style.display = 'none';
        document.getElementById('feedback-success').style.display = 'flex';
        document.getElementById('feedback-error').style.display = 'none';
    }

    // Mostra errore
    function showError(message) {
        document.getElementById('feedback-form').style.display = 'none';
        document.getElementById('feedback-success').style.display = 'none';
        document.getElementById('feedback-error').style.display = 'flex';
        document.getElementById('feedback-error-message').textContent = message || 'Si è verificato un errore. Riprova più tardi.';
    }

    // Gestisci invio form
    async function handleSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('feedback-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio in corso...';

        const formData = {
            pagina: document.getElementById('feedback-pagina').value,
            titolo_pagina: document.title,
            tipo: document.getElementById('feedback-tipo').value,
            titolo: document.getElementById('feedback-titolo').value,
            descrizione: document.getElementById('feedback-descrizione').value,
            priorita: document.getElementById('feedback-priorita').value
        };

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            // Aggiungi token auth se presente
            const token = getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE}/manuale/feedback`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccess();
            } else {
                showError(data.error || data.message || 'Errore durante l\'invio del feedback.');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            showError('Errore di connessione. Verifica la tua connessione internet.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Inizializza
    function init() {
        // Aspetta che il DOM sia pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    function setup() {
        createFloatingButton();
        createModal();

        // Recupera auth
        authToken = getAuthToken();
        currentUser = getUserInfo();
    }

    // Avvia
    init();
})();
