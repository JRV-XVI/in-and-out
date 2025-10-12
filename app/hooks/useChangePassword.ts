import { useState } from 'react';
import { updatePassword, signIn, getCurrentUser } from '../services/auth';

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cambiar contraseña de usuario autenticado
  const changeUserPassword = async (newPassword: string, currentPassword?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si se proporciona la contraseña actual, validarla primero
      if (currentPassword) {
        const { user } = await getCurrentUser();
        if (!user?.email) {
          setError('No se pudo obtener el email del usuario');
          return false;
        }
        
        // Intentar hacer sign in con la contraseña actual para validarla
        const { error: signInError } = await signIn(user.email, currentPassword);
        if (signInError) {
          setError('La contraseña actual es incorrecta');
          return false;
        }
      }
      
      // Actualizar la contraseña
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
    changeUserPassword,
    loading,
    error,
  };
};