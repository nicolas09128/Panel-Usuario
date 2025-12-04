// ui-manager.js - funciones para la interfaz

export function showScreen(screenId) {
    // ocultar todas las pantallas y mostrar una
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenId).classList.add('active');
}

export function showMessage(elementId, msg, tipo) {
    // mostrar mensaje de error o exito
    const elem = document.getElementById(elementId);
    elem.textContent = msg;
    elem.className = 'message';
    
    if (tipo === 'success') {
        elem.classList.add('success');
    } else if (tipo === 'error') {
        elem.classList.add('error-message');
    }
    
    elem.style.display = 'block';
    
    // desaparecer en 5 segundos
    setTimeout(() => {
        elem.style.display = 'none';
    }, 5000);
}