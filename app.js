// imports para las funciones
import { validateUsername, validatePassword, validatePhone, validatePostalCode, validateAge } from './validation.js';
import { hashPassword, verifyPassword } from './crypto-utils.js';
import { setCookie, getCookie, deleteCookie } from './cookie-utils.js';
import { setTheme, toggleTheme } from './theme-manager.js';
import { showScreen, showMessage } from './ui-manager.js';

// elementos html
const pantRegister = document.getElementById('register-screen');
const pantLogin = document.getElementById('login-screen');
const pantPanel = document.getElementById('user-panel');
const cookies = document.getElementById('cookie-banner');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // cookies
    if (!getCookie('cookiesAccepted')) {
        cookies.style.display = 'block';
    }

    // tema
    setTheme();

    // revisar si hay usuario logueado
    const user = getCookie('currentUser');
    if (user) {
        showScreen('user-panel');
        document.getElementById('welcome-message').textContent = `Bienvenido/a, ${user}`;
        console.log('usuario logueado: ' + user);
    } else {
        showScreen('register-screen');
    }

    // listeners
    setupEventListeners();
});

function setupEventListeners() {
    // botones para cambiar de pantalla
    document.getElementById('go-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login-screen');
    });

    document.getElementById('go-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('register-screen');
    });

    // eventos del formulario registro
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('username').addEventListener('blur', validateUsernameField);
    document.getElementById('password').addEventListener('blur', validatePasswordField);
    document.getElementById('phone').addEventListener('blur', validatePhoneField);
    document.getElementById('postal-code').addEventListener('blur', validatePostalCodeField);
    document.getElementById('age').addEventListener('blur', validateAgeField);
    document.getElementById('adult').addEventListener('change', toggleAgeField);

    // login
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // panel botones
    document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // ver contraseña
    document.getElementById('toggle-password').addEventListener('click', togglePasswordVisibility);
    document.getElementById('toggle-login-password').addEventListener('click', toggleLoginPasswordVisibility);

    // cookies
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);
    document.getElementById('reject-cookies').addEventListener('click', rejectCookies);
}

// validaciones
function validateUsernameField() {
    const u = document.getElementById('username').value;
    const err = document.getElementById('username-error');
    
    if (!validateUsername(u)) {
        err.style.display = 'block';
        return false;
    } else {
        err.style.display = 'none';
        return true;
    }
}

function validatePasswordField() {
    const p = document.getElementById('password').value;
    const err = document.getElementById('password-error');
    
    if (!validatePassword(p)) {
        err.style.display = 'block';
        return false;
    } else {
        err.style.display = 'none';
        return true;
    }
}

function validatePhoneField() {
    const phone = document.getElementById('phone').value;
    const err = document.getElementById('phone-error');
    
    if (!validatePhone(phone)) {
        err.style.display = 'block';
        return false;
    } else {
        err.style.display = 'none';
        return true;
    }
}

function validatePostalCodeField() {
    const pc = document.getElementById('postal-code').value;
    const err = document.getElementById('postal-code-error');
    
    if (!validatePostalCode(pc)) {
        err.style.display = 'block';
        return false;
    } else {
        err.style.display = 'none';
        return true;
    }
}

function validateAgeField() {
    const age = document.getElementById('age').value;
    const err = document.getElementById('age-error');
    
    if (!validateAge(age)) {
        err.style.display = 'block';
        return false;
    } else {
        err.style.display = 'none';
        return true;
    }
}

function toggleAgeField() {
    const campo = document.getElementById('age-field');
    const check = document.getElementById('adult');
    
    if (check.checked) {
        campo.style.display = 'block';
    } else {
        campo.style.display = 'none';
        document.getElementById('age').value = '';
        document.getElementById('age-error').style.display = 'none';
    }
}

// registro
async function handleRegister(e) {
    e.preventDefault();
    console.log('registrando...');
    
    // validar campos
    const u_val = validateUsernameField();
    const p_val = validatePasswordField();
    const ph_val = validatePhoneField();
    const pc_val = validatePostalCodeField();
    
    const es_adulto = document.getElementById('adult');
    let age_val = true;
    
    if (es_adulto.checked) {
        age_val = validateAgeField();
    }
    
    // si todo ok
    if (u_val && p_val && ph_val && pc_val && age_val) {
        const username = document.getElementById('username').value;
        
        // ver si existe
        if (localStorage.getItem(username)) {
            showMessage('register-message', 'El usuario ya existe', 'error');
            return;
        }
        
        // crear objeto usuario
        const usuario = {
            username: username,
            password: await hashPassword(document.getElementById('password').value),
            phone: document.getElementById('phone').value,
            postalCode: document.getElementById('postal-code').value,
            isAdult: document.getElementById('adult').checked,
            age: document.getElementById('adult').checked ? document.getElementById('age').value : null
        };
        
        // guardar
        localStorage.setItem(username, JSON.stringify(usuario));
        console.log('usuario guardado: ' + username);
        
        // mensaje
        showMessage('register-message', '¡Registro ok!', 'success');
        
        // limpiar
        document.getElementById('register-form').reset();
        document.getElementById('age-field').style.display = 'none';
        
        // ir a login
        setTimeout(() => {
            showScreen('login-screen');
        }, 2000);
    }
}

// login
async function handleLogin(e) {
    e.preventDefault();
    
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    
    // buscar usuario
    const datos = localStorage.getItem(u);
    
    if (!datos) {
        showMessage('login-message', 'usuario o contraseña incorrectos', 'error');
        return;
    }
    
    const usuario = JSON.parse(datos);
    
    // verificar contraseña
    const ok = await verifyPassword(p, usuario.password);
    
    if (ok) {
        // guardar cookie
        setCookie('currentUser', u, 1);
        console.log('sesion iniciada para: ' + u);
        
        // mostrar panel
        showScreen('user-panel');
        document.getElementById('welcome-message').textContent = `Bienvenido/a, ${u}`;
    } else {
        showMessage('login-message', 'usuario o contraseña incorrectos', 'error');
    }
}

// logout
function handleLogout() {
    deleteCookie('currentUser');
    showScreen('login-screen');
    document.getElementById('login-form').reset();
    console.log('sesion cerrada');
}

// ver/ocultar contraseña
function togglePasswordVisibility() {
    const inp = document.getElementById('password');
    const btn = document.getElementById('toggle-password');
    
    if (inp.type === 'password') {
        inp.type = 'text';
        btn.textContent = '🔓';
    } else {
        inp.type = 'password';
        btn.textContent = '🔒';
    }
}

function toggleLoginPasswordVisibility() {
    const inp = document.getElementById('login-password');
    const btn = document.getElementById('toggle-login-password');
    
    if (inp.type === 'password') {
        inp.type = 'text';
        btn.textContent = '🔓';
    } else {
        inp.type = 'password';
        btn.textContent = '🔒';
    }
}

// cookies
function acceptCookies() {
    setCookie('cookiesAccepted', 'true', 365);
    cookies.style.display = 'none';
    console.log('cookies aceptadas');
}

function rejectCookies() {
    cookies.style.display = 'none';
    console.log('cookies rechazadas');
}