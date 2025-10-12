import { AuthError } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Enviar email para recuperar contraseña
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'exp://dzsvp48-anonymous-8081.exp.direct/reset-password', // Este es el deep link que usaremos
  });
  return { data, error };
}

/**
 * Actualizar contraseña con el código de recuperación
 */
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  return { data, error };
}