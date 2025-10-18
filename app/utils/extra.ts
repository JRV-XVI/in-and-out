import { generateProjectToken } from './random';
import {
  getProjectToken,
  compareAndConsumeProjectToken,
  updateProject,
} from '../services/projects';

// Utilidad simple de logging
function expectLog(label: string, ok: boolean) {
  console.log(ok ? `✅ ${label}` : `❌ ${label}`);
}

/**
 * Solo lectura: imprime el token actual (si existe) sin modificarlo.
 */
export async function runTokenReadTest(projectId: number | string): Promise<void> {
  console.log('[Test] runTokenReadTest projectId=', projectId);
  const token = await getProjectToken(projectId);
  console.log('[Test] current token:', token ?? 'null');
}

/**
 * Prueba completa con semilla segura:
 * - Si el proyecto NO tiene token, siembra un token temporal.
 * - Verifica que un token incorrecto NO se consuma.
 * - Verifica que el token correcto SÍ se consuma (se borra del proyecto).
 * - No altera tokens reales existentes (si ya había token, solo reporta y no consume).
 */
export async function runTokenConsumeTestWithSeed(projectId: number | string): Promise<void> {
  console.log('[Test] runTokenConsumeTestWithSeed projectId=', projectId);

  const original = await getProjectToken(projectId);
  console.log('[Test] original token:', original ?? 'null');

  // Por seguridad: no consumimos tokens reales; solo probamos si no hay token.
  if (original) {
    console.log('[Test] El proyecto ya tiene un token real. No se hará consumo para no afectar el flujo.');
    console.log('       Usa runTokenReadTest o ejecuta esta prueba en un proyecto sin token.');
    return;
  }

  // 1) Sembrar token temporal de prueba
  const seed = generateProjectToken();
  await updateProject(String(projectId), { token: seed });
  console.log('[Test] token sembrado:', seed);

  try {
    // 2) Intento con token incorrecto (ligeramente modificado para evitar colisión)
    const wrong = seed.slice(0, 3) + (seed[3] === 'A' ? 'B' : 'A');
    const wrongRes = await compareAndConsumeProjectToken(projectId, wrong);
    expectLog('verify wrong token returns false (no consumo)', wrongRes === false);

    // Confirmar que el token sigue allí
    const still = await getProjectToken(projectId);
    expectLog('token sigue presente tras intento fallido', still === seed);

    // 3) Consumo con token correcto
    const okRes = await compareAndConsumeProjectToken(projectId, seed);
    expectLog('verify correct token returns true (consumido)', okRes === true);

    // 4) Confirmar eliminación
    const after = await getProjectToken(projectId);
    expectLog('token eliminado (null) tras consumo', after === null);
  } finally {
    // Limpieza defensiva por si algo falló: dejar token en null
    await updateProject(String(projectId), { token: null });
    console.log('[Test] cleanup: token puesto en null');
  }
}