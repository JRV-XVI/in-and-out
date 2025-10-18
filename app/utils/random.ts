// Conjuntos de caracteres
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
// Símbolos "seguros" para UI/queries (evita comillas y barras)
const SYMBOLS_DEFAULT = '!@#$%^&*()-_=+[]{};:,.?~';

// Obtiene crypto si existe (RN/Expo suele tener getRandomValues polyfilleado)
function getCrypto(): Crypto | undefined {
  try {
    // @ts-ignore
    return typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function'
      ? (globalThis.crypto as Crypto)
      : undefined;
  } catch {
    return undefined;
  }
}

// Entero aleatorio [0, max) con rechazo para evitar sesgo
function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new Error('max must be a positive integer');
  const cryptoObj = getCrypto();
  if (cryptoObj) {
    const range = 0x100000000; // 2^32
    const limit = Math.floor(range / max) * max;
    const buf = new Uint32Array(1);
    let x: number;
    do {
      cryptoObj.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % max;
  }
  // Fallback no-crypto (menos seguro)
  return Math.floor(Math.random() * max);
}

export type TokenOptions = {
  length?: number;               // largo del token (por defecto 4)
  useUpper?: boolean;            // incluir mayúsculas
  useLower?: boolean;            // incluir minúsculas
  useDigits?: boolean;           // incluir números
  useSymbols?: boolean;          // incluir símbolos
  symbolsSet?: string;           // set de símbolos personalizado
  excludeSimilar?: boolean;      // excluir caracteres ambiguos: 0,O,o,1,l,I
};

// Genera un token aleatorio con el charset y largo indicados
export function generateToken(opts: TokenOptions = {}): string {
  const {
    length = 4,
    useUpper = true,
    useLower = true,
    useDigits = true,
    useSymbols = true,
    symbolsSet = SYMBOLS_DEFAULT,
    excludeSimilar = false,
  } = opts;

  let charset = '';
  if (useUpper) charset += UPPER;
  if (useLower) charset += LOWER;
  if (useDigits) charset += DIGITS;
  if (useSymbols) charset += symbolsSet;

  // Excluir caracteres ambiguos si se solicita
  if (excludeSimilar) {
    const ambiguous = new Set(['0', 'O', 'o', '1', 'l', 'I']);
    charset = Array.from(charset).filter(ch => !ambiguous.has(ch)).join('');
  }

  if (!charset) throw new Error('Empty charset: enable at least one character set');
  if (!Number.isInteger(length) || length <= 0) throw new Error('length must be a positive integer');

  let out = '';
  for (let i = 0; i < length; i++) {
    const idx = secureRandomInt(charset.length);
    out += charset[idx];
  }
  return out;
}

// Atajo específico para projects.token (4 chars, incluye símbolos/letras/números)
export function generateProjectToken(length: number = 4): string {
  return generateToken({
    length: length,
    useUpper: true,
    useLower: true,
    useDigits: true,
    useSymbols: true,
    // Evita caracteres ambiguos para facilitar lectura si se decide
    excludeSimilar: true,
  });
}

// (Opcional) Valida que un token cumpla el charset por defecto
export function isValidProjectToken(token: string): boolean {
  if (typeof token !== 'string' || token.length !== 4) return false;
  const allowed = new Set((UPPER + LOWER + DIGITS + SYMBOLS_DEFAULT).split(''));
  return Array.from(token).every(ch => allowed.has(ch));
}