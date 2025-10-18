import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import supabase from '../lib/supabase';
import { User } from '../types/user';
import { getUserProfile } from '../services/users';

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    console.log('🔧 AuthProvider inicializándose...');
    
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Sesión inicial:', session?.user?.email || 'No hay sesión');
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        console.log('✅ Usuario autenticado (sesión persistente), cargando perfil...');
        loadUserProfile(session.user.id);
      } else {
        console.log('❌ No hay sesión activa');
        setLoading(false);
      }
      setIsInitialLoad(false);
    });

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
        
        if (session?.user && event === 'SIGNED_IN') {
          console.log('✅ SIGNED_IN: Cargando perfil...');
          await loadUserProfile(session.user.id);
        } else if (!session?.user && event === 'SIGNED_OUT') {
          console.log('❌ Sesión cerrada');
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUserId: string) => {
    console.log('📥 Cargando perfil para authUserId:', authUserId);
    setLoading(true);
    try {
      const profile = await getUserProfile(authUserId);
      console.log('✅ Perfil cargado exitosamente:', {
        nombre: profile?.name,
        email: profile?.email,
        userType: profile?.userType
      });
      setUserProfile(profile);
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    } finally {
      setLoading(false);
      console.log('✅ Loading state set to false');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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