import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  // Función para enviar notificación local
  const sendLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Enviar inmediatamente
    });
  };

  useEffect(() => {
    // Solo pedir permisos básicos para notificaciones locales
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission not granted for notifications');
      }
    };

    requestPermissions();

    // Actualización automática cada segundo
    const interval = setInterval(() => {
      // Aquí va la lógica que quieres actualizar automáticamente
      // Ejemplo: consultar notificaciones nuevas, actualizar estado, etc.
      // console.log('Actualización automática de notificaciones');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { sendLocalNotification };
}