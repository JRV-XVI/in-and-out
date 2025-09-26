import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const Notifications = () => {
  const { user } = useUser();

  // Ejemplo de notificaciones (puedes reemplazar por datos reales)
  const notifications = [
    {
      icon: <MaterialIcons name="check-circle-outline" size={28} color="#fff" />,
      text: `Tu proyecto ${user?.name ?? 'NOMBRE'} ha sido aceptado!`,
    },
    {
      icon: <Ionicons name="location-outline" size={28} color="#fff" />,
      text: `El transporte para tu proyecto ${user?.name ?? 'NOMBRE'} ha llegado!`,
    },
    {
      icon: <MaterialIcons name="cancel" size={28} color="#fff" />,
      text: `Tu proyecto ${user?.name ?? 'NOMBRE'} ha sido cancelado...`,
    },
    {
      icon: <Ionicons name="home-outline" size={28} color="#fff" />,
      text: `¡Muchas gracias! Tu producto del proyecto ${user?.name ?? 'NOMBRE'} ha llegado`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <ScrollView style={styles.notificationsList}>
        {notifications.map((notif, idx) => (
          <View key={idx} style={styles.notificationItem}>
            <View style={styles.iconContainer}>{notif.icon}</View>
            <Text style={styles.notificationText}>{notif.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: '100%', // Ocupa todo el alto de la pantalla
    backgroundColor: '#CE0E2D',
    paddingTop: 48,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    alignSelf: 'flex-end', // Para alinear a la derecha
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
    alignItems: 'center',
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
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default Notifications;