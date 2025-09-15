import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';

type OnBoardingProps = {
  onNext: () => void;
};

const OnBoarding: React.FC<OnBoardingProps> = ({ onNext }) => {
  return (
    <ImageBackground
      source={require('../../assets/on-boarding/OnBoarding1.png')}
      style={styles.background}
    >
      {/* Botón Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={onNext}>
        <Text style={styles.skipText}>Skip {'>'}</Text>
      </TouchableOpacity>

      {/* Card inferior */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/logo/shulkerhouseWithoutBack.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          <Text style={styles.redText}>Bienvenido A ShulkerHouse</Text>
        </Text>
        <Text style={styles.description}>
          Gestiona donaciones de manera ágil y sin complicaciones.{"\n"}
          Con ShulkerHouse digitalizamos cada paso:{"\n"}
          desde la recepción hasta la entrega.
        </Text>
        {/* Indicador de progreso */}
        <View style={styles.progressBar}>
          <View style={styles.progressDotActive} />
          <View style={styles.progressDot} />
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
    alignItems: 'center',
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
  logo: {
    width: 90, // Aumentado para que la imagen sea más grande
    height: 90,
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

export default OnBoarding;