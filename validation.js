// validacion.js - funciones para validar datos

export function validateUsername(u) {
    // minimo 3 caracteres
    return u.length >= 3;
}

export function validatePassword(p) {
    // debe tener mayuscula, minuscula y 8 caracteres minimo
    const reg = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return reg.test(p);
}

export function validatePhone(phone) {
    // 9 digitos
    const reg = /^\d{9}$/;
    return reg.test(phone);
}

export function validatePostalCode(pc) {
    // 5 digitos
    const reg = /^\d{5}$/;
    return reg.test(pc);
}

export function validateAge(a) {
    // entre 18 y 99
    if (!a) return false;
    const num = parseInt(a);
    return num >= 18 && num <= 99;
}