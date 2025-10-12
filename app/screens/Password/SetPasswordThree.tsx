import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { usePasswordReset } from '../../hooks/usePasswordReset';

const SetPasswordThree = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { changePassword, loading, error } = usePasswordReset();
  
  // Estados para el Alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleConfirmPassword = async () => {
    // Validaciones básicas
    if (!password || !confirmPassword) {
      showAlert('Por favor llena todos los campos', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    // Intentar cambiar la contraseña
    const success = await changePassword(password);
    
    if (success) {
      showAlert('¡Contraseña cambiada exitosamente!', 'success');
      // Esperar un poco para mostrar el mensaje y luego navegar
      setTimeout(() => {
        navigation.navigate('SignIn' as never);
      }, 2000);
    } else if (error) {
      showAlert(error, 'error');
    }
  };

  return (
    <GeneralTemplate
      title="Cambiar contraseña"
      onBackPress={() => navigation.goBack()}
    >
      <Alert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Ingresa la nueva contraseña que se{'\n'}
          enlazará a tu cuenta
        </Text>
        <Input
          label="Nueva Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu nueva contraseña"
          placeholderTextColor="#c0bbbbff"
          secureTextEntry
          containerStyle={styles.input}
        />
        <Input
          label="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirma tu nueva contraseña"
          placeholderTextColor="#c0bbbbff"
          secureTextEntry
          containerStyle={styles.input}
        />
        <Button
          title={loading ? "Cambiando..." : "Confirmar"}
          onPress={handleConfirmPassword}
          style={styles.button}
        />
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  description: {
    color: '#333',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 32,
    marginTop: 8,
    width: '100%',
    fontFamily: 'Nunito-Regular',
  },
  input: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: '#C8102E',
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 24,
  },
});

export default SetPasswordThree;