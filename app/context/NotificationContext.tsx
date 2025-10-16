import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../services/notifications';
import { Notification } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  sendLocalNotification: (title: string, body: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, userProfile } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = Number(userProfile?.id || authUser?.id || 0);

  // Cargar notificaciones desde la base de datos
  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getNotificationsByUser(userId);
      setNotifications(data);
    } catch (err) {
      const errorMessage = 'Error al cargar notificaciones';
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId, loadNotifications]);

  // Crear notificación en la base de datos
  const sendLocalNotification = useCallback(async (title: string, body: string) => {
    if (!userId) {
      console.warn('No hay usuario autenticado');
      setError('No hay usuario autenticado');
      return;
    }
    try {
      setError(null);
      const newNotification = await createNotification({
        title,
        body,
        user_id: userId,
      });

      if (newNotification) {
        // Actualizar estado inmediatamente
        setNotifications((prev) => [newNotification, ...prev]);
        console.log('📢 Notificación creada:', title);
      } else {
        setError('No se pudo crear la notificación');
      }
    } catch (err) {
      const errorMessage = 'Error al crear notificación';
      console.error(errorMessage, err);
      setError(errorMessage);
    }
  }, [userId]);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (id: string) => {
    // Actualizar UI inmediatamente (optimistic update)
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    // Enviar al backend
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error('Error al marcar como leída:', err);
      // Revertir cambio si falla
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: false } : notif
        )
      );
    }
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback(async (id: string) => {
    // Guardar copia para revertir si falla
    const notifToRemove = notifications.find((n) => n.id === id);
    
    // Actualizar UI inmediatamente (optimistic update)
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));

    // Enviar al backend
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      // Revertir cambio si falla
      if (notifToRemove) {
        setNotifications((prev) => [notifToRemove, ...prev]);
      }
    }
  }, [notifications]);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(async () => {
    if (!userId) return;
    
    // Guardar copia para revertir si falla
    const previousNotifications = [...notifications];
    
    // Actualizar UI inmediatamente (optimistic update)
    setNotifications([]);

    // Enviar al backend
    try {
      await deleteAllNotifications(userId);
    } catch (err) {
      console.error('Error al limpiar notificaciones:', err);
      // Revertir cambio si falla
      setNotifications(previousNotifications);
    }
  }, [userId, notifications]);

  // Refrescar notificaciones manualmente
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        sendLocalNotification,
        markAsRead,
        removeNotification,
        clearAll,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};