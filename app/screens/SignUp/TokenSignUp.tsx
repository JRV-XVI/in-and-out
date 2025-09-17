import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Token from '../../components/common/Token';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';

const TokenSignUp = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');

  return (
    <GeneralTemplate title="Confirmación" onBackPress={() => navigation.goBack()}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Confirma tu identidad.</Text>
        <Text style={styles.descText}>
          Identifica el token que te proporcionó.{'\n'} 
          Banco de Alimentos Guadalajara por medio de correo electrónico.
        </Text>
      </View>
      <Token value={token} onChange={setToken} />
      <View style={styles.buttonContainer}>
        <Button title="Continuar" onPress={() => navigation.navigate('SignUp' as never)} />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
          <Text style={styles.loginLink}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginBottom: 18,
    marginTop: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5C5C60',
    marginBottom: 8,
    textAlign: 'left',
  },
  descText: {
    color: '#5C5C60',
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'justify',
  },
  buttonContainer: {
    width: '65%',
    marginTop: 8,
    alignSelf: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  loginLink: {
    color: '#CE0E2D',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TokenSignUp;