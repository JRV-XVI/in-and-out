import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OnBoardingProps = {
  onNext: () => void;
};

const OnBoardingThree: React.FC<OnBoardingProps> = ({ onNext }) => {
  return (
    <ImageBackground
      source={require('../../assets/on-boarding/OnBoarding3.jpg')} // Cambia la imagen por la del tercer onboarding
      style={styles.background}
    >
      {/* Botón Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={() => {/* navegación */}}>
        <Text style={styles.skipText}>Skip {'>'}</Text>
      </TouchableOpacity>

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
        <View style={styles.progressBar}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDotActive} />
        </View>
        {/* Botón Empezar */}
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Empezar</Text>
        </TouchableOpacity>
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
  },
  skipText: {
    color: '#CE0E2D',
    fontWeight: 'bold',
    fontSize: 16,
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
    fontWeight: 'bold',
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
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  progressDotActive: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CE0E2D',
    marginHorizontal: 2,
  },
  nextButton: {
    backgroundColor: '#CE0E2D',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnBoardingThree;