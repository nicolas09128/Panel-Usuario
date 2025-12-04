// cookie-utils.js - manejo de cookies

export function setCookie(n, v, d) {
    // crear cookie con nombre, valor y dias
    const date = new Date();
    date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
    const exp = "expires=" + date.toUTCString();
    document.cookie = n + "=" + v + ";" + exp + ";path=/";
}

export function getCookie(n) {
    // obtener cookie por nombre
    const cookieN = n + "=";
    const decoded = decodeURIComponent(document.cookie);
    const cookies = decoded.split(';');
    
    for(let i = 0; i < cookies.length; i++) {
        let c = cookies[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookieN) === 0) {
            return c.substring(cookieN.length, c.length);
        }
    }
    return "";
}

export function deleteCookie(n) {
    // eliminar cookie
    document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}