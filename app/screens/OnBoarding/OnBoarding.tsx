import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import ProgressBar from '../../components/common/progressBar';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';

const OnBoarding = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/on-boarding/OnBoarding1.png')}
      style={styles.background}
    >
      {/* Botón Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('LaunchScreen' as never)}
      >
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
        <ProgressBar total={3} activeIndex={0} />
        {/* Botón Siguiente */}
        <Button
          title="Siguiente"
          onPress={() => navigation.navigate('OnBoardingTwo' as never)}
          style={styles.nextButton}
        />
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
    padding: 24, 
    alignItems: 'center',
    width: '100%',
    minHeight: 320, 
  },
  logo: {
    width: 120, 
    height: 120,
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
  nextButton: {
  },
  nextButtonText: {

  },
});

export default OnBoarding;