/**
 * Módulo de Autenticación
 * Sistema de Gestión de Salas
 */

const API_BASE = '';

/**
 * Mostrar una alerta en el contenedor de alertas
 * @param {string} type - 'success' o 'error'
 * @param {string} message - Mensaje a mostrar
 */
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    alertContainer.innerHTML = `
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
}

/**
 * Ocultar alerta
 */
function hideAlert() {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

/**
 * Establecer estado de carga en un botón
 * @param {HTMLButtonElement} button
 * @param {boolean} loading
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner"></span> Cargando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

/**
 * Guardar datos del usuario en sessionStorage
 * @param {Object} userData
 */
function saveUserSession(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
}

/**
 * Obtener datos del usuario de sessionStorage
 * @returns {Object|null}
 */
function getUserSession() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * Limpiar sesión del usuario
 */
function clearUserSession() {
    sessionStorage.removeItem('user');
}

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
    return getUserSession() !== null;
}

/**
 * Redirigir según estado de autenticación
 * @param {boolean} requireAuth - True si la página requiere autenticación
 */
function checkAuth(requireAuth = false) {
    const authenticated = isAuthenticated();
    
    if (requireAuth && !authenticated) {
        window.location.href = '/login';
    } else if (!requireAuth && authenticated) {
        window.location.href = '/dashboard';
    }
}

/**
 * Manejar inicio de sesión
 * @param {Event} event
 */
async function handleLogin(event) {
    event.preventDefault();
    hideAlert();
    
    // Validar formulario
    if (!validateLoginForm()) {
        return;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            saveUserSession({
                userid: data.userid,
                username: data.username,
                email: data.email
            });
            showAlert('success', '¡Bienvenido! Redirigiendo...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            showAlert('error', data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Error de conexión. Por favor, intenta de nuevo.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Manejar registro de usuario
 * @param {Event} event
 */
async function handleRegister(event) {
    event.preventDefault();
    hideAlert();
    
    // Validar formulario
    if (!validateRegisterForm()) {
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    setButtonLoading(submitBtn, true);
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('success', '¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => {
                window.location.href = '/login?registered=true';
            }, 1500);
        } else {
            showAlert('error', data.error || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Error de conexión. Por favor, intenta de nuevo.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

/**
 * Manejar cierre de sesión
 */
async function handleLogout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        clearUserSession();
        window.location.href = '/login';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners a formularios
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Verificar si viene de registro exitoso
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registered') === 'true') {
            showAlert('success', '¡Registro exitoso! Ahora puedes iniciar sesión.');
        }
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Mostrar nombre de usuario en navbar
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const user = getUserSession();
        if (user) {
            userNameElement.textContent = user.username;
            
            // Actualizar avatar con inicial
            const avatarElement = document.getElementById('userAvatar');
            if (avatarElement) {
                avatarElement.textContent = user.username.charAt(0).toUpperCase();
            }
        }
    }
});
