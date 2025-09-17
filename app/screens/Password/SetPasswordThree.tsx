import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SetPasswordThree = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <GeneralTemplate
      title="Cambiar contraseña"
      onBackPress={() => navigation.goBack()}
    >
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
          title="Confirmar"
          onPress={() => {navigation.navigate('SignIn' as never)}}
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