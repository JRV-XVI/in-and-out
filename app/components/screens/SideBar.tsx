import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';
import { useUser } from '../../context/UserContext'; 

type SideBarProps = {
  navigation: NavigationProp<any>;
};

const SideBar = ({ navigation }: SideBarProps) => {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {/* Perfil */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.name ?? 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      {/* Opciones */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation?.navigate('MyProfile')}>
          <Ionicons name="person-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Mi perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation?.navigate('Contact')}>
          <Feather name="phone" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Contáctanos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation?.navigate('Help')}>
          <MaterialIcons name="help-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Ayuda & FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation?.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#fff" style={styles.menuIcon} />
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>
      </View>

      {/* Línea separadora */}
      <View style={styles.separator} />

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutSection}
        onPress={() => navigation.navigate('LaunchScreen')}
      >
        <MaterialIcons name="logout" size={24} color="#fff" style={styles.menuIcon} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 2,
  },
  email: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
    marginVertical: 24,
  },
  logoutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default SideBar;