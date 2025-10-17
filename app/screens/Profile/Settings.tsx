import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import { useAuthContext } from '../../context/AuthContext';
import { deleteUserEverywhere } from '../../services/users';

const Settings = ({ navigation }: any) => {
  const { authUser, userProfile, signOut } = useAuthContext?.() || {};

  const handleConfirmDelete = () => {
    Alert.alert(
      'Confirmación',
      '¿Desea eliminar tu cuenta? Se borrará toda tu información.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Acepto',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!authUser?.id || !userProfile?.id) {
                Alert.alert('Error', 'No se encontró el usuario autenticado.');
                return;
              }
              const ok = await deleteUserEverywhere(Number(userProfile.id), String(authUser.id));
              if (!ok) {
                Alert.alert('Error', 'No se pudo eliminar la cuenta. Intenta nuevamente.');
                return;
              }
              try { await signOut?.(); } catch {}
              // Resetear navegación a LaunchScreen (existe en tu Stack)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'LaunchScreen' }],
                })
              );
            } catch (e) {
              console.error('[Settings] delete account error:', e);
              Alert.alert('Error', 'Ocurrió un problema eliminando tu cuenta.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <GeneralTemplate title="Configuración" onBackPress={() => navigation.goBack()}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NotificationConfig')}>
          <Ionicons name="notifications-outline" size={32} color="#C8102E" style={styles.icon} />
          <Text style={styles.optionText}>Configuración de notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SetPasswordThree', { fromSettings: true })}>
          <MaterialIcons name="vpn-key" size={32} color="#C8102E" style={styles.icon} />
          <Text style={styles.optionText}>Configuración de contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleConfirmDelete}>
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