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

  useEffect(() => {
    console.log('🔧 AuthProvider inicializándose...');
    
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Sesión inicial:', session?.user?.email || 'No hay sesión');
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        console.log('✅ Usuario autenticado, cargando perfil...');
        loadUserProfile(session.user.id);
      } else {
        console.log('❌ No hay sesión activa');
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        setAuthUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('✅ Cargando perfil después del cambio de auth...');
          await loadUserProfile(session.user.id);
        } else {
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
    try {
      const profile = await getUserProfile(authUserId);
      console.log('✅ Perfil cargado:', profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    } finally {
      setLoading(false);
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