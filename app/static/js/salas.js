/**
 * Módulo de Gestión de Salas
 * Sistema de Gestión de Salas
 */

// API_BASE está definido en auth.js

/**
 * Mostrar alerta en el dashboard
 * @param {string} type - 'success' o 'error'
 * @param {string} message
 */
function showDashboardAlert(type, message) {
    const container = document.getElementById('dashboardAlerts');
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-${type}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

/**
 * Mostrar alerta dentro de un modal
 * @param {string} containerId - ID del contenedor de alerta
 * @param {string} type - 'success' o 'error'
 * @param {string} message
 */
function showModalAlert(containerId, type, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-${type}" style="margin-bottom: 1rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
}

/**
 * Limpiar alerta de un modal
 * @param {string} containerId
 */
function clearModalAlert(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Abrir modal para crear sala
 */
function openCreateModal() {
    clearModalAlert('createModalAlert');
    const modal = document.getElementById('createSalaModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('salaName').focus();
    }
}

/**
 * Cerrar modal de crear sala
 */
function closeCreateModal() {
    const modal = document.getElementById('createSalaModal');
    if (modal) {
        modal.classList.remove('active');
        // Limpiar formulario
        document.getElementById('salaForm').reset();
        // Limpiar errores
        clearModalAlert('createModalAlert');
        document.querySelectorAll('#salaForm .form-error').forEach(el => {
            el.classList.remove('visible');
        });
        document.querySelectorAll('#salaForm input').forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
}

/**
 * Abrir modal para buscar sala
 */
function openSearchModal() {
    clearModalAlert('searchModalAlert');
    const resultContainer = document.getElementById('searchResult');
    if (resultContainer) resultContainer.classList.add('hidden');
    
    const modal = document.getElementById('searchSalaModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('searchCode').value = '';
        document.getElementById('searchCode').focus();
    }
}

/**
 * Cerrar modal de buscar sala
 */
function closeSearchModal() {
    const modal = document.getElementById('searchSalaModal');
    if (modal) {
        modal.classList.remove('active');
        clearModalAlert('searchModalAlert');
        const resultContainer = document.getElementById('searchResult');
        if (resultContainer) resultContainer.classList.add('hidden');
    }
}

/**
 * Crear una nueva sala
 * @param {Event} event
 */
async function handleCreateSala(event) {
    event.preventDefault();
    clearModalAlert('createModalAlert');
    
    if (!validateSalaForm()) {
        return;
    }
    
    const nombre = document.getElementById('salaName').value.trim();
    const codigo = document.getElementById('salaCodigo').value.trim();
    const capacidad = parseInt(document.getElementById('salaCapacidad').value);
    const user = getUserSession();
    
    if (!user) {
        window.location.href = '/login';
        return;
    }
    
    const submitBtn = document.getElementById('createSalaBtn');
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/sala/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                codigo,
                capacidad,
                userid: user.userid
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeCreateModal();
            showDashboardAlert('success', '¡Sala creada exitosamente!');
            loadAllSalas(); // Recargar lista
        } else {
            // Mostrar error DENTRO del modal
            showModalAlert('createModalAlert', 'error', data.error || 'Error al crear la sala');
        }
    } catch (error) {
        console.error('Error:', error);
        showModalAlert('createModalAlert', 'error', 'Error de conexión. Por favor, intenta de nuevo.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Buscar sala por código
 */
async function searchSalaByCode() {
    const searchInput = document.getElementById('searchCode');
    const codigo = searchInput.value.trim();
    const resultContainer = document.getElementById('searchResult');
    
    clearModalAlert('searchModalAlert');
    
    if (!codigo) {
        showModalAlert('searchModalAlert', 'error', 'Por favor ingresa un código de sala');
        resultContainer.classList.add('hidden');
        return;
    }
    
    const searchBtn = document.getElementById('searchBtn');
    setButtonLoading(searchBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/sala/codigo/${encodeURIComponent(codigo)}`);
        const data = await response.json();
        
        if (response.ok) {
            resultContainer.classList.remove('hidden');
            resultContainer.innerHTML = `
                <div class="search-result-card">
                    <div class="search-result-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Sala encontrada
                    </div>
                    <h3 class="search-result-name">${escapeHtml(data.nombre)}</h3>
                    <div class="search-result-info">
                        <span class="sala-code">${escapeHtml(data.codigo)}</span>
                        <span class="search-result-capacity">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                            ${data.capacidad} personas
                        </span>
                    </div>
                </div>
            `;
        } else {
            resultContainer.classList.remove('hidden');
            resultContainer.innerHTML = `
                <div class="search-result-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                        <line x1="8" y1="8" x2="14" y2="14"></line>
                        <line x1="14" y1="8" x2="8" y2="14"></line>
                    </svg>
                    <p>No se encontró ninguna sala con el código <strong>"${escapeHtml(codigo)}"</strong></p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        showModalAlert('searchModalAlert', 'error', 'Error de conexión al buscar la sala');
    } finally {
        setButtonLoading(searchBtn, false);
    }
}

/**
 * Cerrar resultado de búsqueda
 */
function closeSearchResult() {
    const resultContainer = document.getElementById('searchResult');
    resultContainer.classList.add('hidden');
    document.getElementById('searchCode').value = '';
}

/**
 * Cargar todas las salas
 */
async function loadAllSalas() {
    const container = document.getElementById('salasContainer');
    
    // Mostrar loading
    container.innerHTML = `
        <div class="empty-state">
            <div class="spinner" style="width: 40px; height: 40px; border-width: 3px;"></div>
            <p class="mt-md">Cargando salas...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/sala/all`);
        const data = await response.json();
        
        if (response.ok && data.salas && data.salas.length > 0) {
            renderSalas(data.salas);
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <p class="empty-state-title">No hay salas disponibles</p>
                    <p class="text-muted">Crea tu primera sala haciendo clic en "Nueva Sala"</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p class="empty-state-title">Error de conexión</p>
                <p class="text-muted">No se pudieron cargar las salas</p>
                <button class="btn btn-secondary mt-md" onclick="loadAllSalas()">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Renderizar tarjetas de salas
 * @param {Array} salas
 */
function renderSalas(salas) {
    const container = document.getElementById('salasContainer');
    
    container.innerHTML = `
        <div class="salas-grid">
            ${salas.map(sala => `
                <div class="sala-card">
                    <div class="sala-header">
                        <span class="sala-name">${escapeHtml(sala.nombre)}</span>
                        <span class="sala-code">${escapeHtml(sala.codigo)}</span>
                    </div>
                    <div class="sala-info">
                        <div class="sala-info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>Capacidad: ${sala.capacidad} personas</span>
                        </div>
                        <div class="sala-info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>ID: ${sala.id}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación en dashboard
    if (document.getElementById('salasContainer')) {
        const user = getUserSession();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        
        // Cargar salas
        loadAllSalas();
        
        // Event listener para crear sala
        const salaForm = document.getElementById('salaForm');
        if (salaForm) {
            salaForm.addEventListener('submit', handleCreateSala);
        }
        
        // Event listener para búsqueda con Enter
        const searchInput = document.getElementById('searchCode');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchSalaByCode();
                }
            });
        }
        
        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('createSalaModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeCreateModal();
                }
            });
        }
        
        // Cerrar modal con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCreateModal();
            }
        });
    }
});
