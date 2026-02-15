# Feedback e Contributi

Questa pagina mostra tutti i feedback e i contributi inviati dagli utenti per migliorare il manuale.

<div id="feedback-dashboard">
    <div class="feedback-loading">
        <p>Caricamento feedback in corso...</p>
    </div>
</div>

<style>
.feedback-loading {
    text-align: center;
    padding: 40px;
    color: var(--md-default-fg-color--light);
}

.feedback-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.feedback-stat-card {
    background: var(--md-default-fg-color--lightest);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
}

.feedback-stat-card .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #00bcd4;
    line-height: 1.2;
}

.feedback-stat-card .stat-label {
    font-size: 0.85rem;
    color: var(--md-default-fg-color--light);
    margin-top: 4px;
}

.feedback-filters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    padding: 16px;
    background: var(--md-default-fg-color--lightest);
    border-radius: 8px;
}

.feedback-filters select {
    padding: 8px 12px;
    border: 1px solid var(--md-default-fg-color--lighter);
    border-radius: 6px;
    background: var(--md-default-bg-color);
    color: var(--md-default-fg-color);
    font-size: 0.9rem;
}

.feedback-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.feedback-item {
    background: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 12px;
    padding: 20px;
    transition: box-shadow 0.2s;
}

.feedback-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.feedback-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
}

.feedback-item-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--md-default-fg-color);
    margin: 0;
}

.feedback-item-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.feedback-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
}

.feedback-badge-tipo {
    background: #e3f2fd;
    color: #1976d2;
}

.feedback-badge-priorita-alta {
    background: #ffebee;
    color: #c62828;
}

.feedback-badge-priorita-media {
    background: #fff3e0;
    color: #ef6c00;
}

.feedback-badge-priorita-bassa {
    background: #e8f5e9;
    color: #2e7d32;
}

.feedback-badge-stato-aperto {
    background: #fff9c4;
    color: #f9a825;
}

.feedback-badge-stato-in_lavorazione {
    background: #e1f5fe;
    color: #0288d1;
}

.feedback-badge-stato-risolto {
    background: #c8e6c9;
    color: #388e3c;
}

.feedback-badge-stato-rifiutato {
    background: #ffcdd2;
    color: #c62828;
}

.feedback-item-description {
    color: var(--md-default-fg-color--light);
    margin-bottom: 12px;
    line-height: 1.6;
}

.feedback-item-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: var(--md-default-fg-color--lighter);
    flex-wrap: wrap;
}

.feedback-item-meta a {
    color: #00bcd4;
    text-decoration: none;
}

.feedback-item-meta a:hover {
    text-decoration: underline;
}

.feedback-empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--md-default-fg-color--light);
}

.feedback-empty svg {
    width: 64px;
    height: 64px;
    opacity: 0.3;
    margin-bottom: 16px;
}

.feedback-pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
}

.feedback-pagination button {
    padding: 8px 16px;
    border: 1px solid var(--md-default-fg-color--lighter);
    border-radius: 6px;
    background: var(--md-default-bg-color);
    color: var(--md-default-fg-color);
    cursor: pointer;
    transition: all 0.2s;
}

.feedback-pagination button:hover:not(:disabled) {
    background: #00bcd4;
    color: white;
    border-color: #00bcd4;
}

.feedback-pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Dark mode */
[data-md-color-scheme="slate"] .feedback-badge-tipo {
    background: #1e3a5f;
}

[data-md-color-scheme="slate"] .feedback-badge-priorita-alta {
    background: #5c1a1a;
}

[data-md-color-scheme="slate"] .feedback-badge-priorita-media {
    background: #5c3d1a;
}

[data-md-color-scheme="slate"] .feedback-badge-priorita-bassa {
    background: #1a3d1a;
}
</style>

<script>
(function() {
    const API_BASE = 'https://api-test.geniusmile.com/api/v1';

    let currentFilters = {
        stato: '',
        tipo: '',
        priorita: '',
        page: 1
    };

    let stats = null;
    let feedbackList = [];
    let pagination = null;

    async function fetchStats() {
        try {
            const response = await fetch(`${API_BASE}/manuale/feedback/stats`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                stats = data.data;
            }
        } catch (e) {
            console.error('Error fetching stats:', e);
        }
    }

    async function fetchFeedback() {
        try {
            const params = new URLSearchParams();
            if (currentFilters.stato) params.set('stato', currentFilters.stato);
            if (currentFilters.tipo) params.set('tipo', currentFilters.tipo);
            if (currentFilters.priorita) params.set('priorita', currentFilters.priorita);
            params.set('page', currentFilters.page);
            params.set('limit', 20);

            const response = await fetch(`${API_BASE}/manuale/feedback?${params}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                feedbackList = data.data;
                pagination = data.pagination;
            }
        } catch (e) {
            console.error('Error fetching feedback:', e);
            feedbackList = [];
        }
    }

    function renderStats() {
        if (!stats) return '';
        return `
            <div class="feedback-stats">
                <div class="feedback-stat-card">
                    <div class="stat-value">${stats.totale}</div>
                    <div class="stat-label">Totale Feedback</div>
                </div>
                <div class="feedback-stat-card">
                    <div class="stat-value">${stats.per_stato.aperti}</div>
                    <div class="stat-label">Aperti</div>
                </div>
                <div class="feedback-stat-card">
                    <div class="stat-value">${stats.per_stato.in_lavorazione}</div>
                    <div class="stat-label">In Lavorazione</div>
                </div>
                <div class="feedback-stat-card">
                    <div class="stat-value">${stats.per_stato.risolti}</div>
                    <div class="stat-label">Risolti</div>
                </div>
            </div>
        `;
    }

    function renderFilters() {
        return `
            <div class="feedback-filters">
                <select id="filter-stato" onchange="window.feedbackFilterChange('stato', this.value)">
                    <option value="">Tutti gli stati</option>
                    <option value="aperto" ${currentFilters.stato === 'aperto' ? 'selected' : ''}>Aperti</option>
                    <option value="in_lavorazione" ${currentFilters.stato === 'in_lavorazione' ? 'selected' : ''}>In Lavorazione</option>
                    <option value="risolto" ${currentFilters.stato === 'risolto' ? 'selected' : ''}>Risolti</option>
                    <option value="rifiutato" ${currentFilters.stato === 'rifiutato' ? 'selected' : ''}>Rifiutati</option>
                </select>
                <select id="filter-tipo" onchange="window.feedbackFilterChange('tipo', this.value)">
                    <option value="">Tutti i tipi</option>
                    <option value="correzione" ${currentFilters.tipo === 'correzione' ? 'selected' : ''}>Correzione</option>
                    <option value="nuovo_contenuto" ${currentFilters.tipo === 'nuovo_contenuto' ? 'selected' : ''}>Nuovo Contenuto</option>
                    <option value="nuova_sezione" ${currentFilters.tipo === 'nuova_sezione' ? 'selected' : ''}>Nuova Sezione</option>
                    <option value="altro" ${currentFilters.tipo === 'altro' ? 'selected' : ''}>Altro</option>
                </select>
                <select id="filter-priorita" onchange="window.feedbackFilterChange('priorita', this.value)">
                    <option value="">Tutte le priorità</option>
                    <option value="alta" ${currentFilters.priorita === 'alta' ? 'selected' : ''}>Alta</option>
                    <option value="media" ${currentFilters.priorita === 'media' ? 'selected' : ''}>Media</option>
                    <option value="bassa" ${currentFilters.priorita === 'bassa' ? 'selected' : ''}>Bassa</option>
                </select>
            </div>
        `;
    }

    function getTipoLabel(tipo) {
        const labels = {
            'correzione': 'Correzione',
            'nuovo_contenuto': 'Nuovo Contenuto',
            'nuova_sezione': 'Nuova Sezione',
            'altro': 'Altro'
        };
        return labels[tipo] || tipo;
    }

    function getStatoLabel(stato) {
        const labels = {
            'aperto': 'Aperto',
            'in_lavorazione': 'In Lavorazione',
            'risolto': 'Risolto',
            'rifiutato': 'Rifiutato'
        };
        return labels[stato] || stato;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderFeedbackItem(item) {
        return `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <h4 class="feedback-item-title">${escapeHtml(item.titolo)}</h4>
                    <div class="feedback-item-badges">
                        <span class="feedback-badge feedback-badge-tipo">${getTipoLabel(item.tipo)}</span>
                        <span class="feedback-badge feedback-badge-priorita-${item.priorita}">${item.priorita}</span>
                        <span class="feedback-badge feedback-badge-stato-${item.stato}">${getStatoLabel(item.stato)}</span>
                    </div>
                </div>
                <p class="feedback-item-description">${escapeHtml(item.descrizione)}</p>
                <div class="feedback-item-meta">
                    <span>Pagina: <a href="${item.pagina}">${item.titolo_pagina || item.pagina}</a></span>
                    <span>Inviato il: ${formatDate(item.created_at)}</span>
                    ${item.user_name ? `<span>Da: ${escapeHtml(item.user_name)}</span>` : ''}
                </div>
                ${item.risposta_admin ? `
                    <div style="margin-top: 12px; padding: 12px; background: var(--md-default-fg-color--lightest); border-radius: 8px;">
                        <strong>Risposta:</strong> ${escapeHtml(item.risposta_admin)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderList() {
        if (feedbackList.length === 0) {
            return `
                <div class="feedback-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>Nessun feedback trovato con i filtri selezionati.</p>
                </div>
            `;
        }
        return `<div class="feedback-list">${feedbackList.map(renderFeedbackItem).join('')}</div>`;
    }

    function renderPagination() {
        if (!pagination || pagination.last_page <= 1) return '';
        return `
            <div class="feedback-pagination">
                <button onclick="window.feedbackChangePage(${pagination.current_page - 1})" ${pagination.current_page <= 1 ? 'disabled' : ''}>
                    Precedente
                </button>
                <span style="padding: 8px 16px;">Pagina ${pagination.current_page} di ${pagination.last_page}</span>
                <button onclick="window.feedbackChangePage(${pagination.current_page + 1})" ${pagination.current_page >= pagination.last_page ? 'disabled' : ''}>
                    Successivo
                </button>
            </div>
        `;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function render() {
        const container = document.getElementById('feedback-dashboard');
        if (!container) return;

        await Promise.all([fetchStats(), fetchFeedback()]);

        container.innerHTML = `
            ${renderStats()}
            ${renderFilters()}
            ${renderList()}
            ${renderPagination()}
        `;
    }

    window.feedbackFilterChange = function(filter, value) {
        currentFilters[filter] = value;
        currentFilters.page = 1;
        render();
    };

    window.feedbackChangePage = function(page) {
        currentFilters.page = page;
        render();
    };

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
</script>
