import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GeneralTemplate from '../../components/screens/GeneralTemplate';

const Settings = ({ navigation }: any) => {
  return (
    <GeneralTemplate title="Configuración" onBackPress={() => navigation.goBack()}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NotificationConfig')}>
          <Ionicons name="notifications-outline" size={32} color="#C8102E" style={styles.icon} />
          <Text style={styles.optionText}>Configuración de notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('PasswordConfig')}>
          <MaterialIcons name="vpn-key" size={32} color="#C8102E" style={styles.icon} />
          <Text style={styles.optionText}>Configuración de contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('DeleteAccount')}>
          <Ionicons name="person-outline" size={32} color="#C8102E" style={styles.icon} />
          <Text style={styles.optionText}>Borrar cuenta</Text>
        </TouchableOpacity>
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Settings;