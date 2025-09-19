import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

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
        {/*<Button title="Iniciar Sesión" style={styles.signInButton} onPress={() => { /* lógica de signIn */ }
        <Button title="Iniciar Sesión" style={styles.signInButton} onPress={() =>navigation.navigate('HomePageDonador' as never)} />
        
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
