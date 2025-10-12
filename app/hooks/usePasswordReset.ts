import { useState } from 'react';
import { resetPassword, updatePassword } from '../services/auth';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para enviar el email de recuperación
  const sendResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError('Error al enviar el correo: ' + error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Error inesperado al enviar el correo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la contraseña
  const changePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        setError('Error al cambiar la contraseña: ' + error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Error inesperado al cambiar la contraseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendResetEmail,
    changePassword,
    loading,
    error,
  };
};