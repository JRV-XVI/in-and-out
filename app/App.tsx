import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import OnBoarding from './screens/OnBoarding/OnBoarding';
import OnBoardingTwo from './screens/OnBoarding/OnBoardingTwo';
import OnBoardingThree from './screens/OnBoarding/OnBoardingThree'; // Importa el tercer onboarding
import LaunchScreen from './screens/LaunchScreen/LaunchScreen';
import LaunchScreenTwo from './screens/LaunchScreen/LaunchScreenTwo';
import Login from './screens/Login/Login';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');

  useEffect(() => {
    if (currentScreen === 'launch') {
      const timer = setTimeout(() => setCurrentScreen('launchTwo'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen === 'onboarding') setCurrentScreen('onboardingTwo');
    else if (currentScreen === 'onboardingTwo') setCurrentScreen('onboardingThree');
    else if (currentScreen === 'onboardingThree') setCurrentScreen('launch');
    else if (currentScreen === 'launchTwo') setCurrentScreen('login');
  };

  return (
    <>
      {currentScreen === 'onboarding' && <OnBoarding onNext={handleNext} />}
      {currentScreen === 'onboardingTwo' && <OnBoardingTwo onNext={handleNext} />}
      {currentScreen === 'onboardingThree' && <OnBoardingThree onNext={handleNext} />}
      {currentScreen === 'launch' && <LaunchScreen />}
      {currentScreen === 'launchTwo' && <LaunchScreenTwo onNext={handleNext} />}
      {currentScreen === 'login' && <Login />}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});