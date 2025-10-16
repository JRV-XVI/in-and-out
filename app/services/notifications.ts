import { supabase } from '../lib/supabase';
import { Notification, CreateNotificationInput } from '../types/notification';

/**
 * Crear una nueva notificación en la base de datos.
 * @param input - Datos de la notificación (título, cuerpo, user_id)
 * @returns La notificación creada o null si hay un error
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          title: input.title,
          body: input.body,
          user_id: input.user_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al crear notificación:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error inesperado al crear notificación:', err);
    return null;
  }
}

/**
 * Enviar notificación a un usuario específico.
 * @param targetUserId - ID del usuario destinatario
 * @param title - Título de la notificación
 * @param body - Cuerpo de la notificación
 * @returns La notificación creada o null si hay un error
 */
export async function sendNotificationToUser(
  targetUserId: number,
  title: string,
  body: string
): Promise<Notification | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          title,
          body,
          user_id: targetUserId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al enviar notificación a usuario:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error inesperado al enviar notificación:', err);
    return null;
  }
}

/**
 * Obtener todas las notificaciones de un usuario ordenadas por fecha de creación.
 * @param userId - ID del usuario (BIGINT)
 * @returns Array de notificaciones del usuario
 */
export async function getNotificationsByUser(
  userId: number
): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error inesperado al obtener notificaciones:', err);
    return [];
  }
}

/**
 * Marcar una notificación como leída.
 * @param notificationId - ID de la notificación
 * @returns true si se marcó exitosamente, false si hay error
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error al marcar notificación como leída:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error inesperado al marcar notificación:', err);
    return false;
  }
}

/**
 * Eliminar una notificación específica.
 * @param notificationId - ID de la notificación a eliminar
 * @returns true si se eliminó exitosamente, false si hay error
 */
export async function deleteNotification(
  notificationId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error al eliminar notificación:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error inesperado al eliminar notificación:', err);
    return false;
  }
}

/**
 * Eliminar todas las notificaciones de un usuario.
 * @param userId - ID del usuario (BIGINT)
 * @returns true si se eliminaron exitosamente, false si hay error
 */
export async function deleteAllNotifications(userId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error al eliminar todas las notificaciones:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error inesperado al eliminar notificaciones:', err);
    return false;
  }
}


