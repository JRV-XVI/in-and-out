import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useNavigation } from '@react-navigation/native';
import { useUpdateUser } from '../../hooks/useUsers';
import { useChangePassword } from '../../hooks/useChangePassword';
import { validatePhone } from '../../utils/validators';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../hooks/useAuth';

const userTypes = [
  { value: 1, label: "donante" },
  { value: 2, label: "responsable" },
] as const;

const CompleteProfile = () => {
  const navigation = useNavigation();
  const { user: currentUser, setUser } = useUser();
  const { handleSignOut } = useAuth();

  useEffect(() => {
    console.log("CompleteProfile montado. Usuario actual:", currentUser);
  }, [currentUser]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<number | null>(null);
  const { handleUpdateUser, loading: updateLoading } = useUpdateUser();
  const { changeUserPassword, loading: passwordLoading } = useChangePassword();

  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Estados para Alert personalizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const loading = updateLoading || passwordLoading;

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleCompleteProfile = async () => {
    if (!name || !phone || !userType) {
      showAlert("Por favor llena todos los campos obligatorios", "error");
      return;
    }
    if (phoneError) {
      showAlert("Por favor corrige los errores en el formulario", "error");
      return;
    }
    if (!currentUser?.id) {
      showAlert("Error: No se encontró el usuario actual", "error");
      console.error("Usuario no encontrado en contexto:", currentUser);
      return;
    }

    console.log("Actualizando usuario con ID:", currentUser.id);
    console.log("Datos a actualizar:", { name, phone: Number(phone), userType });

    // Actualizar perfil en public.users
    const updatedUser = await handleUpdateUser(currentUser.id, {
      name,
      phone: Number(phone),
      userType
    });

    if (!updatedUser) {
      console.error("Error: handleUpdateUser devolvió null");
      showAlert("Error al actualizar el perfil. Intenta nuevamente.", "error");
      return;
    }

    console.log("Usuario actualizado exitosamente:", updatedUser);

    // Actualizar el contexto del usuario
    setUser(updatedUser);
    
    showAlert("¡Perfil completado exitosamente!", "success");
    
    // Redirigir según el tipo de usuario elegido
    setTimeout(() => {
      console.log("Navegando a la página según userType:", updatedUser.userType);
      switch (updatedUser.userType) {
        case 1:
          navigation.navigate('HomePageDonador' as never);
          break;
        case 2:
          navigation.navigate('HomePageResponsable' as never);
          break;
        default:
          console.error("userType no válido:", updatedUser.userType);
          showAlert("Tipo de usuario no válido", "error");
          break;
      }
    }, 1500);
  };

  const handleLogout = async () => {
    await handleSignOut();
    navigation.navigate('LaunchScreen' as never);
  };

  return (
    <GeneralTemplate
      title="Bienvenido! Completa tu perfil..."
      onBackPress={handleLogout}
    >
      <Alert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
      <Text style={styles.description}>
        Para continuar, completa tu información de perfil
      </Text>
      
      <Input
        label="Nombre completo"
        value={name}
        onChangeText={setName}
        placeholder="Ingresa tu nombre"
        placeholderTextColor="#c0bbbbff"
        autoCapitalize="words"
      />
      
      <Input
        label="Número de teléfono"
        value={phone}
        onChangeText={setPhone}
        placeholder="Ingresa tu número"
        placeholderTextColor="#c0bbbbff"
        keyboardType="phone-pad"
        validate={validatePhone}
        onValidationError={setPhoneError}
      />
      
      <Text style={styles.label}>Tipo de usuario</Text>
      <View style={styles.userTypeContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.userTypeButton,
              userType === type.value && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType(type.value)}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === type.value && styles.userTypeTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Guardando..." : "Confirmar"}
          onPress={handleCompleteProfile}
          style={styles.confirmButton}
        />
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  description: {
    color: '#5C5C60',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'justify',
  },
  label: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#5C5C60',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  userTypeButtonActive: {
    backgroundColor: '#fff',
  },
  userTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  userTypeTextActive: {
    color: '#5C5C60',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  confirmButton: {
    width: '65%',
  },
});

export default CompleteProfile;
