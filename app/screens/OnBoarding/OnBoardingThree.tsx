import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../../components/common/progressBar';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';

const OnBoardingThree: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/on-boarding/OnBoarding3.jpg')}
      style={styles.background}
    >
      {/* Botón Skip */}
      <Button
        title="Skip >"
        onPress={() => navigation.navigate('LaunchScreen' as never)}
        style={styles.skipButton}
      />

      {/* Card inferior */}
      <View style={styles.card}>
        <Ionicons name="location" size={60} color="#CE0E2D" style={styles.icon} />
        <Text style={styles.title}>
          <Text style={styles.redText}>Recupera Y Entrega</Text>
        </Text>
        <Text style={styles.description}>
          Optimiza la recolección de donaciones y{'\n'}
          facilita la entrega de despensas.{'\n'}
          Con ShulkerHouse, cada movimiento transforma vidas.
        </Text>
        {/* Indicador de progreso */}
        <ProgressBar total={3} activeIndex={2} />
        {/* Botón Empezar */}
        <Button title="Empezar" onPress={() => navigation.navigate('LaunchScreen' as never)} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 2,
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    minHeight: 350,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  redText: {
    color: '#CE0E2D',
  },
  description: {
    color: '#5C5C60',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default OnBoardingThree;