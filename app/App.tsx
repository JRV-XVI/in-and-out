import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import OnBoarding from './screens/OnBoarding/OnBoarding';
import OnBoardingTwo from './screens/OnBoarding/OnBoardingTwo';
import OnBoardingThree from './screens/OnBoarding/OnBoardingThree';
import LaunchScreen from './screens/LaunchScreen/LaunchScreen';
import LaunchScreenTwo from './screens/LaunchScreen/LaunchScreenTwo';
import SignIn from './screens/SignIn/SignIn';
import SignUp from './screens/SignUp/SignUp';
import TokenSignUp from './screens/SignUp/TokenSignUp'; // Agrega esta línea
import HomePageResponsable from './screens/Responsable/HomePageResponsable';
import HomePageDonador from './screens/Donador/HomePageDonador'
import SetPassword from './screens/Password/SetPassword';
import SetPasswordTwo from './screens/Password/SetPasswordTwo';
import SetPasswordThree from './screens/Password/SetPasswordThree';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {/* <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
        <Stack.Screen name="OnBoardingThree" component={OnBoardingThree} />
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="LaunchScreenTwo" component={LaunchScreenTwo} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="TokenSignUp" component={TokenSignUp} />
        <Stack.Screen name="HomePageResponsable" component={HomePageResponsable} /> */}
        <Stack.Screen name="HomePageDonador" component={HomePageDonador} />
        {/* <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="SetPasswordTwo" component={SetPasswordTwo} />
        <Stack.Screen name="SetPasswordThree" component={SetPasswordThree} /> */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
