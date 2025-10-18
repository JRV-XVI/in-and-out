import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../lib/supabase';
import { User } from '../types/user';
import { getUserProfile } from '../services/users';

const USER_PROFILE_KEY = '@in-and-out:user-profile';

interface AuthContextType {
  authUser: AuthUser | null;
  userProfile: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('🔧 AuthProvider inicializándose...');
    
    let isMounted = true;

    const loadPersistedProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (storedProfile) {
          const parsedProfile: User = JSON.parse(storedProfile);
          setUserProfile(parsedProfile);
        }
      } catch (error) {
        console.warn('⚠️ No se pudo recuperar el perfil persistido:', error);
      }
    };

    const initializeSession = async () => {
      setLoading(true);

      try {
        await loadPersistedProfile();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        console.log('📱 Sesión inicial:', session?.user?.email || 'No hay sesión');
        setAuthUser(session?.user ?? null);

        if (session?.user) {
          console.log('✅ Usuario autenticado (sesión persistente), cargando perfil...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('❌ No hay sesión activa');
          setUserProfile(null);
          await AsyncStorage.removeItem(USER_PROFILE_KEY);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error obteniendo sesión inicial:', error);
        setLoading(false);
      }
    };

    initializeSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        
        // Ignorar TOKEN_REFRESHED para evitar doble carga
        // Solo procesar SIGNED_IN, SIGNED_OUT, etc.
        if (event === 'TOKEN_REFRESHED') {
          console.log('⏭️ Ignorando TOKEN_REFRESHED (evitar doble carga)');
          return;
        }
        
        setAuthUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          console.log(`✅ ${event}: Cargando perfil...`);
          setLoading(true);
          await loadUserProfile(session.user.id);
        } else if (!session?.user && event === 'SIGNED_OUT') {
          console.log('❌ Sesión cerrada');
          setUserProfile(null);
          await AsyncStorage.removeItem(USER_PROFILE_KEY);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUserId: string) => {
    console.log('📥 Cargando perfil para authUserId:', authUserId);
    try {
      const profile = await getUserProfile(authUserId);
      console.log('✅ Perfil cargado exitosamente:', {
        nombre: profile?.name,
        email: profile?.email,
        userType: profile?.userType
      });
      setUserProfile(profile);
      if (profile) {
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      } else {
        await AsyncStorage.removeItem(USER_PROFILE_KEY);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    } finally {
      setLoading(false);
      console.log('✅ Loading state set to false');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  };

  const value = {
    authUser,
    userProfile,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};