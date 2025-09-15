import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';

type LaunchScreenTwoProps = {
  onNext: () => void;
};

const LaunchScreenTwo: React.FC<LaunchScreenTwoProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo size={400} showText={true} />
        <Text style={styles.tagline}>
          ENTRAR & SALIR con propósito
        </Text>
        <View style={styles.buttonContainer}>
          <Button 
            title="Iniciar Sesión" 
            onPress={onNext} 
          />
          <Button 
            title="Registrarse" 
            onPress={() => console.log('Register pressed')} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 112,
  },
  tagline: {
    fontSize: 18,
    color: '#5C5C60',
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LaunchScreenTwo;