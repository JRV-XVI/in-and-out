import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import { normalizeEmail } from '../../utils/normalize';

const SetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const { sendResetEmail, loading, error } = usePasswordReset();
  
  // Estados para el Alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleResetPassword = async () => {
    if (!email) {
      showAlert('Por favor ingresa tu correo electrónico', 'error');
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    const success = await sendResetEmail(normalizedEmail);
    
    if (success) {
      showAlert('¡Correo enviado! Revisa tu bandeja de entrada.', 'success');
      // Navegar a la siguiente pantalla después de un breve delay
      setTimeout(() => {
        navigation.navigate('SetPasswordTwo' as never);
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
          Ingresa el correo que está enlazado a tu{'\n'}
          cuenta de <Text style={styles.bold}>SHUKER HOUSE</Text>
        </Text>
        <Input
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#c0bbbbff"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          title={loading ? "Enviando..." : "Enviar correo"}
          onPress={handleResetPassword}
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
  bold: {
    fontWeight: 'bold',
  },
  label: {
    color: '#333',
    fontSize: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontFamily: 'Nunito-Regular',
  },
  input: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#555',
    color: '#fff',
    borderRadius: 16,
    fontFamily: 'Nunito-Regular',
  },
  button: {
    width: '50%',
    marginTop: 16,
  },
});

export default SetPassword;