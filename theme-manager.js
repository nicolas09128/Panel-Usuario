// theme-manager.js - cambiar tema
import { setCookie, getCookie } from './cookie-utils.js';

export function setTheme() {
    // aplicar tema guardado en cookie
    const t = getCookie('theme') || 'light';
    if (t === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

export function toggleTheme() {
    // cambiar de tema
    const actual = getCookie('theme') || 'light';
    const nuevo = actual === 'light' ? 'dark' : 'light';
    
    setCookie('theme', nuevo, 365);
    setTheme();
    console.log('tema cambiado a: ' + nuevo);
}