import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import supabase from '../../lib/supabase';
import { useNotifications } from '../../hooks/useNotification';

interface NotificationItem {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
}

const Notifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { sendLocalNotification } = useNotifications();

  // Función para obtener icono según el contenido
  const getIcon = (text: string) => {
    if (text.includes('aceptado')) {
      return <MaterialIcons name="check-circle-outline" size={28} color="#fff" />;
    } else if (text.includes('llegado') || text.includes('transporte')) {
      return <Ionicons name="location-outline" size={28} color="#fff" />;
    } else if (text.includes('cancelado')) {
      return <MaterialIcons name="cancel" size={28} color="#fff" />;
    } else {
      return <Ionicons name="notifications-outline" size={28} color="#fff" />;
    }
  };

  // Cargar notificaciones desde Supabase
  const fetchNotifications = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Notificaciones cargadas:', data?.length || 0);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.auth_user_id}`,
        },
        (payload: any) => {
          console.log('Nueva notificación recibida:', payload.new);
          const newNotification = payload.new as NotificationItem;
          
          // Agregar a la lista
          setNotifications((prev) => [newNotification, ...prev]);
          
          // Mostrar notificación local
          sendLocalNotification('Nueva notificación', newNotification.body);
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.auth_user_id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <ScrollView 
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        ) : (
          notifications.map((notif) => (
            <View key={notif.id} style={styles.notificationItem}>
              <View style={styles.iconContainer}>{getIcon(notif.body)}</View>
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>{notif.body}</Text>
                <Text style={styles.dateText}>
                  {new Date(notif.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))
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
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    alignSelf: 'flex-end',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 26,
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
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Notifications;