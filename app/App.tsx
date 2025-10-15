import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import OnBoarding from './screens/OnBoarding/OnBoarding';
import OnBoardingTwo from './screens/OnBoarding/OnBoardingTwo';
import OnBoardingThree from './screens/OnBoarding/OnBoardingThree';
import LaunchScreen from './screens/LaunchScreen/LaunchScreen';
import LaunchScreenTwo from './screens/LaunchScreen/LaunchScreenTwo';
import SignIn from './screens/SignIn/SignIn';
import SignUp from './screens/SignUp/SignUp';
import TokenSignUp from './screens/SignUp/TokenSignUp';
import HomePageResponsable from './screens/Responsable/HomePageResponsable';
import HomePageDonador from './screens/Donador/HomePageDonador'
import HomePageAdmin from './screens/Admin/HomePageAdmin';
import SetPassword from './screens/Password/SetPassword';
import SetPasswordTwo from './screens/Password/SetPasswordTwo';
import SetPasswordThree from './screens/Password/SetPasswordThree';
import { UserProvider } from './context/UserContext';
import MyProfile from './screens/Profile/MyProfile';
import Settings from './screens/Profile/Settings';
import MyVehicles from './screens/Responsable/MyVehicles';
import Contact from './screens/Profile/Contact';
import About from './screens/Profile/About';

const Stack = createStackNavigator();

export default function App() {
  // Configuración del deep linking
  const linking = {
    prefixes: ['exp://dzsvp48-anonymous-8081.exp.direct'], // Este es nuestro esquema de URL personalizado
    config: {
      screens: {
        SetPasswordThree: 'reset-password', // Cuando llegue exp://reset-password, navegar a SetPasswordThree
      },
    },
  };

  return (
    <UserProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#CE0E2D' }}>
          <NavigationContainer linking={linking}>
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
              <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
              <Stack.Screen name="SetPassword" component={SetPassword} />
              <Stack.Screen name="SetPasswordTwo" component={SetPasswordTwo} />
              <Stack.Screen name="SetPasswordThree" component={SetPasswordThree} />
              <Stack.Screen name="MyProfile" component={MyProfile} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="MyVehicles" component={MyVehicles} />
              <Stack.Screen name="Contact" component={Contact} />
              <Stack.Screen name="About" component={About} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </UserProvider>
  );
}
