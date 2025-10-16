/**
 * Representa una notificación en el sistema.
 */
export interface Notification {
  /** ID único de la notificación (UUID) */
  id: string;
  /** Fecha de creación en formato ISO */
  created_at: string;
  /** Título de la notificación */
  title: string;
  /** Contenido de la notificación */
  body: string;
  /** ID del usuario al que pertenece la notificación (BIGINT) */
  user_id: number;
  /** Indica si la notificación ha sido leída */
  read?: boolean;
}

/**
 * Datos necesarios para crear una nueva notificación.
 */
export interface CreateNotificationInput {
  /** Título de la notificación */
  title: string;
  /** Contenido de la notificación */
  body: string;
  /** ID del usuario al que se enviará la notificación (BIGINT) */
  user_id: number;
}