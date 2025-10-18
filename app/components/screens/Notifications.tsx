import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../context/NotificationContext';
import Reload from '../../components/common/Reload';

const Notifications = () => {
  const { notifications, unreadCount, loading, error, markAsRead, removeNotification, clearAll, refreshNotifications } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  // Función para manejar el pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  // Función para obtener icono según el contenido
  const getIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Iconos de estado positivo
    if (lowerText.includes('aceptado') || lowerText.includes('aprobado') || lowerText.includes('completado')) {
      return <Ionicons name="checkmark-circle" size={28} color="#fff" />;
    } 
    
    // Iconos de éxito/confirmación
    if (lowerText.includes('éxito') || lowerText.includes('exitoso') || lowerText.includes('confirmado')) {
      return <Ionicons name="checkmark-done-circle" size={28} color="#fff" />;
    }
    
    // Iconos de ubicación/transporte
    if (lowerText.includes('llegado') || lowerText.includes('llegada')) {
      return <Ionicons name="location" size={28} color="#fff" />;
    }
    
    if (lowerText.includes('transporte') || lowerText.includes('camino') || lowerText.includes('ruta')) {
      return <Ionicons name="car" size={28} color="#fff" />;
    }
    
    // Iconos de cancelación/rechazo
    if (lowerText.includes('cancelado') || lowerText.includes('cancelada')) {
      return <Ionicons name="close-circle" size={28} color="#fff" />;
    }
    
    if (lowerText.includes('rechazado') || lowerText.includes('denegado')) {
      return <Ionicons name="ban" size={28} color="#fff" />;
    }
    
    // Iconos de advertencia
    if (lowerText.includes('advertencia') || lowerText.includes('atención') || lowerText.includes('cuidado')) {
      return <Ionicons name="warning" size={28} color="#fff" />;
    }
    
    // Iconos de información
    if (lowerText.includes('información') || lowerText.includes('actualización') || lowerText.includes('cambio')) {
      return <Ionicons name="information-circle" size={28} color="#fff" />;
    }
    
    // Iconos de proyecto/donación
    if (lowerText.includes('proyecto') || lowerText.includes('solicitud')) {
      return <Ionicons name="folder-open" size={28} color="#fff" />;
    }
    
    if (lowerText.includes('donación') || lowerText.includes('donativo')) {
      return <Ionicons name="heart" size={28} color="#fff" />;
    }
    
    // Iconos de usuario
    if (lowerText.includes('usuario') || lowerText.includes('perfil') || lowerText.includes('cuenta')) {
      return <Ionicons name="person-circle" size={28} color="#fff" />;
    }
    
    // Iconos de mensaje/comunicación
    if (lowerText.includes('mensaje') || lowerText.includes('comentario') || lowerText.includes('respuesta')) {
      return <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />;
    }
    
    // Iconos de tiempo/recordatorio
    if (lowerText.includes('recordatorio') || lowerText.includes('pendiente') || lowerText.includes('plazo')) {
      return <Ionicons name="time" size={28} color="#fff" />;
    }
    
    // Icono por defecto
    return <Ionicons name="notifications" size={28} color="#fff" />;
  };

  // Manejar marcar como leída con feedback inmediato
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  // Manejar eliminar con feedback inmediato
  const handleRemove = async (id: string) => {
    await removeNotification(id);
  };

  // Manejar limpiar todas
  const handleClearAll = async () => {
    await clearAll();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <ScrollView 
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            titleColor="#fff"
            colors={['#fff']}
            progressBackgroundColor="#CE0E2D"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando notificaciones...</Text>
          </View>
        ) : error ? (
          <Reload error={error} onReload={onRefresh} />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#fff" />
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <View key={notif.id} style={styles.notificationItem}>
              <View style={styles.iconContainer}>{getIcon(notif.body)}</View>
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>{notif.title ? notif.title : 'Notificación'}</Text>
                <Text style={styles.notificationText}>{notif.body}</Text>
                <Text style={styles.dateText}>
                  {new Date(notif.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {notif.read ? '' : ' • Nuevo'}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  {!notif.read && (
                    <TouchableOpacity onPress={() => handleMarkAsRead(notif.id)}>
                      <Text style={{ color: '#fff', marginRight: 12, textDecorationLine: 'underline' }}>
                        Marcar como leída
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleRemove(notif.id)}>
                    <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 16, marginBottom: 32, textDecorationLine: 'underline' }}>
              Limpiar todas
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: '100%',
    backgroundColor: '#CE0E2D',
    paddingTop: 48,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#CE0E2D',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  dateText: {
    color: '#fffc',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#CE0E2D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Notifications;