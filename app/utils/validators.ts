export const validateEmail = (value: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Correo electrónico inválido";

export const validatePassword = (value: string): string | null =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
    ? null
    : "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un caracter especial";

export const validatePhone = (value: string): string | null =>
  /^\d{10}$/.test(value)
    ? null
    : "El número de teléfono debe tener exactamente 10 dígitos";