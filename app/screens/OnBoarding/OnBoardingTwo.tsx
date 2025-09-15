import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OnBoardingProps = {
  onNext: () => void;
};
const OnBoardingTwo: React.FC<OnBoardingProps> = ({ onNext }) => {
  return (
    <ImageBackground
      source={require('../../assets/on-boarding/OnBoarding2.jpg')} // cambiar
      style={styles.background}
    >
      {/* Botón Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={() => {/* navegación */}}>
        <Text style={styles.skipText}>Skip {'>'}</Text>
      </TouchableOpacity>

      {/* Card inferior */}
      <View style={styles.card}>
        <Ionicons name="document-text-sharp" size={60} color="#CE0E2D" style={styles.icon} />
        <Text style={styles.title}>
          <Text style={styles.redText}>Entradas Y Salidas Rápida</Text>
        </Text>
        <Text style={styles.description}>
          Registra en tiempo real los productos que{'\n'}
          entran y salen del inventario.{'\n'}
          Asegura trazabilidad y elimina la captura manual.
        </Text>
        {/* Indicador de progreso */}
        <View style={styles.progressBar}>
          <View style={styles.progressDot} />
          <View style={styles.progressDotActive} />
          <View style={styles.progressDot} />
        </View>
        {/* Botón Siguiente */}
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
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

export default OnBoardingTwo;