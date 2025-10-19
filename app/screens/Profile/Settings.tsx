import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { deleteUserEverywhere } from '../../services/users';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import { useAuthContext } from '../../context/AuthContext';

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
              const res = await deleteUserEverywhere(Number(userProfile.id), String(authUser.id));
              if (!res.ok) {
                if (res.reason === 'active_projects') {
                  const extra = typeof res.count === 'number' ? ` (${res.count} activos)` : '';
                  Alert.alert('No se puede eliminar', `Tienes proyectos activos como responsable${extra}. Finalízalos (estado 6) e inténtalo de nuevo.`);
                } else {
                  Alert.alert('Error', res.message || 'No se pudo eliminar la cuenta.');
                }
                // Importante: NO cerrar sesión ni navegar; mantener interfaz
                return;
              }

              // Éxito: cerrar sesión y resetear a LaunchScreen
              try { await signOut?.(); } catch {}
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