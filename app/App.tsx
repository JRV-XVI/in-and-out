import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { ActivityIndicator, View } from 'react-native';
import OnBoarding from './screens/OnBoarding/OnBoarding';
import OnBoardingTwo from './screens/OnBoarding/OnBoardingTwo';
import OnBoardingThree from './screens/OnBoarding/OnBoardingThree';
import LaunchScreen from './screens/LaunchScreen/LaunchScreen';
import LaunchScreenTwo from './screens/LaunchScreen/LaunchScreenTwo';
import SignIn from './screens/SignIn/SignIn';
import CompleteProfile from './screens/SignUp/CompleteProfile';
import HomePageResponsable from './screens/Responsable/HomePageResponsable';
import HomePageDonador from './screens/Donador/HomePageDonador';
import HomePageAdmin from './screens/Admin/HomePageAdmin';
import SetPassword from './screens/Password/SetPassword';
import SetPasswordTwo from './screens/Password/SetPasswordTwo';
import SetPasswordThree from './screens/Password/SetPasswordThree';
import { UserProvider } from './context/UserContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import MyProfile from './screens/Profile/MyProfile';
import Settings from './screens/Profile/Settings';
import MyVehicles from './screens/Responsable/MyVehicles';
import Contact from './screens/Profile/Contact';
import About from './screens/Profile/About';
import { useUser } from './context/UserContext';

const Stack = createStackNavigator();

// Componente que maneja la navegación condicionada basada en el estado de autenticación
function RootNavigator() {
  const { authUser, userProfile, loading } = useAuthContext();
  const { setUser } = useUser();
  const navigationRef = React.useRef(null);

  // Sincronizar el userProfile del AuthContext con el UserContext
  useEffect(() => {
    if (userProfile) {
      console.log('🔄 Sincronizando UserContext con AuthContext:', userProfile.email);
      setUser(userProfile);
    } else {
      console.log('🔄 Limpiando UserContext');
      setUser(null);
    }
  }, [userProfile, setUser]);

  // Mostrar pantalla de carga mientras se inicializa la autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CE0E2D' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Si hay usuario autenticado y perfil, navegar a la pantalla correspondiente
  if (authUser && userProfile) {
    console.log('✅ Usuario autenticado y perfil cargado. Redirigiendo según userType:', userProfile.userType);
    
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName={getInitialRoute(userProfile.userType)}
      >
        {/* Pantallas de autenticación (no se mostrarán si hay sesión activa) */}
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
        <Stack.Screen name="OnBoardingThree" component={OnBoardingThree} />
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="LaunchScreenTwo" component={LaunchScreenTwo} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        
        {/* Pantallas principales según tipo de usuario */}
        <Stack.Screen name="HomePageResponsable" component={HomePageResponsable} />
        <Stack.Screen name="HomePageDonador" component={HomePageDonador} />
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        
        {/* Pantallas de perfil y configuración */}
        <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="SetPasswordTwo" component={SetPasswordTwo} />
        <Stack.Screen name="SetPasswordThree" component={SetPasswordThree} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="MyVehicles" component={MyVehicles} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    );
  }

  // Si no hay usuario autenticado, mostrar flujo de onboarding/login
  console.log('❌ No hay usuario autenticado. Mostrando flujo de onboarding/login');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName="OnBoarding"
    >
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="OnBoardingTwo" component={OnBoardingTwo} />
      <Stack.Screen name="OnBoardingThree" component={OnBoardingThree} />
      <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
      <Stack.Screen name="LaunchScreenTwo" component={LaunchScreenTwo} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      
      {/* Pantallas principales (accesibles pero no mostrarse en inicio) */}
      <Stack.Screen name="HomePageResponsable" component={HomePageResponsable} />
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
  );
}

// Función auxiliar para determinar la ruta inicial según el tipo de usuario
function getInitialRoute(userType?: number): string {
  switch (userType) {
    case 0:
      // Usuario sin perfil completado
      return 'CompleteProfile';
    case 1:
      // Donante
      return 'HomePageDonador';
    case 2:
      // Responsable
      return 'HomePageResponsable';
    case 3:
      // Admin
      return 'HomePageAdmin';
    default:
      return 'LaunchScreen';
  }
}

export default function App() {
  // Configuración del deep linking
  const linking = {
    prefixes: ['exp://dzsvp48-anonymous-8081.exp.direct'],
    config: {
      screens: {
        SetPasswordThree: 'reset-password',
      },
    },
  };

  return (
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CE0E2D' }}>
              <NavigationContainer linking={linking}>
                <RootNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
}
