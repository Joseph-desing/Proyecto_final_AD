/**
 * Validación de Formularios
 * Sistema de Gestión de Salas
 */

// Patrones de validación
const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{6,}$/,
    username: /^.{3,}$/,
    codigo: /^[A-Za-z0-9_-]{3,20}$/,
    capacidad: /^[1-9][0-9]*$/
};

// Mensajes de error
const MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, ingresa un email válido',
    password: 'La contraseña debe tener al menos 6 caracteres',
    passwordMatch: 'Las contraseñas no coinciden',
    username: 'El nombre de usuario debe tener al menos 3 caracteres',
    codigo: 'El código debe tener entre 3-20 caracteres alfanuméricos',
    capacidad: 'La capacidad debe ser un número mayor a 0',
    nombre: 'El nombre de la sala es obligatorio'
};

/**
 * Validar un campo individual
 * @param {HTMLInputElement} input - El elemento input a validar
 * @param {string} type - Tipo de validación
 * @returns {boolean} - True si es válido
 */
function validateField(input, type) {
    const value = input.value.trim();
    const errorElement = input.parentElement.querySelector('.form-error');
    
    let isValid = true;
    let errorMessage = '';

    // Validar campo requerido
    if (!value) {
        isValid = false;
        errorMessage = MESSAGES.required;
    } 
    // Validar según tipo
    else if (PATTERNS[type] && !PATTERNS[type].test(value)) {
        isValid = false;
        errorMessage = MESSAGES[type];
    }

    // Mostrar/ocultar error
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('visible');
            input.classList.add('error');
            input.classList.remove('success');
        } else {
            errorElement.classList.remove('visible');
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    return isValid;
}

/**
 * Validar que dos contraseñas coincidan
 * @param {HTMLInputElement} password - Campo de contraseña
 * @param {HTMLInputElement} confirmPassword - Campo de confirmación
 * @returns {boolean}
 */
function validatePasswordMatch(password, confirmPassword) {
    const errorElement = confirmPassword.parentElement.querySelector('.form-error');
    
    if (password.value !== confirmPassword.value) {
        if (errorElement) {
            errorElement.textContent = MESSAGES.passwordMatch;
            errorElement.classList.add('visible');
        }
        confirmPassword.classList.add('error');
        confirmPassword.classList.remove('success');
        return false;
    }
    
    if (errorElement) {
        errorElement.classList.remove('visible');
    }
    confirmPassword.classList.remove('error');
    confirmPassword.classList.add('success');
    return true;
}

/**
 * Validar formulario de login
 * @returns {boolean}
 */
function validateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    const isEmailValid = validateField(email, 'email');
    const isPasswordValid = validateField(password, 'password');
    
    return isEmailValid && isPasswordValid;
}

/**
 * Validar formulario de registro
 * @returns {boolean}
 */
function validateRegisterForm() {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    const isUsernameValid = validateField(username, 'username');
    const isEmailValid = validateField(email, 'email');
    const isPasswordValid = validateField(password, 'password');
    const isPasswordMatch = validatePasswordMatch(password, confirmPassword);
    
    return isUsernameValid && isEmailValid && isPasswordValid && isPasswordMatch;
}

/**
 * Validar formulario de crear sala
 * @returns {boolean}
 */
function validateSalaForm() {
    const nombre = document.getElementById('salaName');
    const codigo = document.getElementById('salaCodigo');
    const capacidad = document.getElementById('salaCapacidad');
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre.value.trim()) {
        showFieldError(nombre, MESSAGES.nombre);
        isValid = false;
    } else {
        clearFieldError(nombre);
    }
    
    // Validar código
    if (!validateField(codigo, 'codigo')) {
        isValid = false;
    }
    
    // Validar capacidad
    if (!validateField(capacidad, 'capacidad')) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Mostrar error en un campo
 * @param {HTMLInputElement} input
 * @param {string} message
 */
function showFieldError(input, message) {
    const errorElement = input.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    input.classList.add('error');
    input.classList.remove('success');
}

/**
 * Limpiar error de un campo
 * @param {HTMLInputElement} input
 */
function clearFieldError(input) {
    const errorElement = input.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.classList.remove('visible');
    }
    input.classList.remove('error');
    input.classList.add('success');
}

/**
 * Inicializar validación en tiempo real para un formulario
 * @param {string} formId - ID del formulario
 */
function initRealTimeValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Validar al perder foco
        input.addEventListener('blur', function() {
            const type = this.dataset.validate || this.type;
            if (type === 'confirmPassword') {
                const password = document.getElementById('password');
                validatePasswordMatch(password, this);
            } else if (PATTERNS[type]) {
                validateField(this, type);
            } else if (this.required) {
                if (!this.value.trim()) {
                    showFieldError(this, MESSAGES.required);
                } else {
                    clearFieldError(this);
                }
            }
        });
        
        // Limpiar error al escribir
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

// Inicializar validación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Detectar formularios y agregar validación
    if (document.getElementById('loginForm')) {
        initRealTimeValidation('loginForm');
    }
    if (document.getElementById('registerForm')) {
        initRealTimeValidation('registerForm');
    }
    if (document.getElementById('salaForm')) {
        initRealTimeValidation('salaForm');
    }
});
