import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header rojo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Iniciar Sesión</Text>
        </View>
      </View>

      {/* Card blanca */}
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeDesc}>
          Nos alegra tenerte aquí. Tu espacio seguro para gestionar donaciones está aquí, con ShulkerHouse.
        </Text>

        <Input
          label="Correo electrónico"
          placeholder="example@example.com"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{ marginTop: 8 }}>
          <Input
            label="Contraseña"
            placeholder="************"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            autoCapitalize="none"
            containerStyle={{ marginBottom: 0 }}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setSecure(!secure)}
          >
            <Text style={styles.eyeIcon}>{secure ? '🙈' : '🐵'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        <View style={styles.loginButtonContainer}>
          <Button title="Iniciar Sesión" onPress={() => { /* lógica de login */ }} />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer rojo */}
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CE0E2D' },
  header: {
    backgroundColor: '#CE0E2D',
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 24,
    padding: 8,
    zIndex: 2,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 24,
    bottom: 0,
    right: 0,
    zIndex: 1,
    height: 56,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    flex: 1,
    marginTop: 100,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  welcomeDesc: {
    color: '#5C5C60',
    fontSize: 14,
    marginBottom: 24,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 38,
    padding: 4,
    zIndex: 2,
  },
  eyeIcon: {
    color: '#fff',
    fontSize: 20,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#CE0E2D',
    fontSize: 13,
  },
  loginButtonContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  footer: {
    height: 32,
    backgroundColor: '#CE0E2D',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});

export default Login;