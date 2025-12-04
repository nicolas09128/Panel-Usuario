// crypto-utils.js - funciones de contraseña

export async function hashPassword(p) {
    // convertir password a hash
    const enc = new TextEncoder();
    const data = enc.encode(p);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function verifyPassword(p, h) {
    // verificar si el password es igual al hash
    const hashed = await hashPassword(p);
    return hashed === h;
}