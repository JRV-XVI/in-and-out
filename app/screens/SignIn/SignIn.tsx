import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import { useNavigation } from '@react-navigation/native';
import { useGetUser } from '../../hooks/useUsers';
import { useUser } from '../../context/UserContext'; 

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleGetUser, loading, error } = useGetUser();
  const { setUser } = useUser(); 
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };


  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor llena todo los campos")
      return;
    }
    const user = await handleGetUser(email, password);
    if (user) {
      setUser(user);
      showAlert("Inicio de sesión exitoso", "success");
      setTimeout(() => {
        switch (user.userType) {
          case 1:
            navigation.navigate('HomePageDonador' as never);
            break;
          case 2:
            navigation.navigate('HomePageResponsable' as never);
            break;
          case 3:
            navigation.navigate('HomePageAdmin' as never);
            break;
          default:
            showAlert("Tu tipo de usuario no está asignado correctamente", "info");
            break;
        }
      }, 2000);
    } else if (error) {
      Alert.alert("Error", error);
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  return (
    <GeneralTemplate
      title="Iniciar Sesión"
      onBackPress={() => navigation.navigate('LaunchScreenTwo' as never)}
    >
      <Text style={styles.welcomeTitle}>Bienvenido</Text>
      <Text style={styles.welcomeDesc}>
        Nos alegra tenerte aquí. Tu espacio seguro para gestionar donaciones está aquí, con ShulkerHouse.
      </Text>

      <Input
        label="Correo electrónico"
        placeholder="Ingresa tu correo"
        placeholderTextColor="#c0bbbbff"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ marginTop: 8 }}>
        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#c0bbbbff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('SetPassword' as never)}
      >
        <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <View style={styles.signInButtonContainer}>
        {/*<Button title="Iniciar Sesión" style={styles.signInButton} onPress={() => { /* lógica de signIn */}
        <Button
          title={loading ? "Cargando..." : "Iniciar Sesión"}
          onPress={handleSignIn}
          style={styles.signInButton}
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('TokenSignUp' as never)}>
          <Text style={styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeDesc: {
    color: '#5C5C60',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'justify',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#CE0E2D',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
  },
  signInButtonContainer: {
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 70,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  registerText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  registerLink: {
    color: '#CE0E2D',
    fontWeight: 'bold',
    fontSize: 14,
  },
  signInButton: {
    width: '55%',
  },
});

export default SignIn;
