import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;

// Configuración de persistencia de sesión
// Si quieres que el usuario siempre tenga que hacer login, cambia persistSession a false
// Por defecto está en true para mantener la sesión entre reinicios de la app
const PERSIST_SESSION = true; // Cambia a false para deshabilitar sesión automática

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: PERSIST_SESSION, // <-- Controla si la sesión persiste o no
    detectSessionInUrl: false,
  },
});

export default supabase;