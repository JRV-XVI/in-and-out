import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SetPasswordTwo from './SetPasswordTwo';

const SetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  return (
    <GeneralTemplate
      title="Cambiar contraseña"
      onBackPress={() => navigation.goBack()}
    >
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
          title="Aceptar"
          onPress={() => {navigation.navigate('SetPasswordTwo' as never)}}
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