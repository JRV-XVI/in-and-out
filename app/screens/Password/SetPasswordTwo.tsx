import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Button from '../../components/common/Button';
import Token from '../../components/common/Token';

const SetPasswordTwo = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');

  return (
    <GeneralTemplate
      title="Cambiar contraseña"
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Hemos enviado un enlace a tu correo electrónico. 
          {'\n\n'}
          Haz clic en el enlace del correo para continuar con el cambio de contraseña.
          {'\n\n'}
          Si no recibes el correo, revisa tu carpeta de spam.
        </Text>
        <Button
          title="Volver al inicio"
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
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 32,
    marginTop: 8,
    width: '100%',
    fontFamily: 'Nunito-Regular',
    paddingLeft: 8,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: '#C8102E',
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 32,
  },
});

export default SetPasswordTwo;