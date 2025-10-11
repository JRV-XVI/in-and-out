import { useState } from 'react';
import { signUp, signIn, signOut, getCurrentUser, getCurrentSession } from '../services/auth';

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Ocurrió un problema al registrar el usuario');
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, data: null };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Error en login:', err);
      setError('Ocurrió un problema al iniciar sesión');
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signOut();
      
      if (error) {
        setError(error.message);
        return { success: false };
      }

      return { success: true };
    } catch (err) {
      console.error('Error en logout:', err);
      setError('Ocurrió un problema al cerrar sesión');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const { user, error } = await getCurrentUser();
      if (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
      }
      return user;
    } catch (err) {
      console.error('Error obteniendo usuario:', err);
      return null;
    }
  };

  const getSession = async () => {
    try {
      const { session, error } = await getCurrentSession();
      if (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
      }
      return session;
    } catch (err) {
      console.error('Error obteniendo sesión:', err);
      return null;
    }
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut,
    getUser,
    getSession,
    loading,
    error,
  };
}