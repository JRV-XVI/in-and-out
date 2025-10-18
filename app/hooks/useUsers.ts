import { useEffect, useState } from "react";
import { User } from "../types/user";
import { getAllUsers, createUser, createUserProfile, getUserProfile, getUserByEmail, updateUser } from "../services/users";
import { useAuth } from "./useAuth";

/**
 * Get all users 
 */
export function useAllUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getAllUsers().then(data => {
			setUsers(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [])
	return { users, loading };
}

/**
 * Create new user with authentication
 */
export function useCreateUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { handleSignUp } = useAuth();

	const handleCreateUser = async (userData: Omit<User, "id">, password: string) => {
		setLoading(true);
		setError(null);

		try {
			// Registrar en Supabase Auth
			const authResult = await handleSignUp(userData.email, password);
			
			if (!authResult.success || !authResult.data?.user) {
				setError("Error al crear la cuenta de autenticación");
				return null;
			}

			// Crear perfil del usuario
			const userProfile = await createUserProfile(userData, authResult.data.user.id);
			
			return {
				authUser: authResult.data.user,
				profile: userProfile
			};
		} catch (err) {
			console.error("Error en registro:", err);
			setError("Ocurrió un problema al registrar el usuario");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { handleCreateUser, loading, error };
}

/**
 * Sign in user with auth and get profile
 */
export function useSignInUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { handleSignIn } = useAuth();

	const handleSignInUser = async (email: string, password: string): Promise<{ authUser: any; profile: User | null } | null> => {
		console.log('🔐 [HOOK] Iniciando proceso de login...');
		setLoading(true);
		setError(null);

		try {
			// Autenticar con Supabase Auth
			console.log('🔑 [HOOK] Autenticando con Supabase...');
			const authResult = await handleSignIn(email, password);
			
			if (!authResult.success || !authResult.data?.user) {
				console.log('❌ [HOOK] Credenciales incorrectas');
				setError("Credenciales incorrectas");
				setLoading(false); // <-- Asegurar que loading se desactiva
				return null;
			}

			// Obtener perfil del usuario
			console.log('👤 [HOOK] Obteniendo perfil del usuario...');
			const profile = await getUserProfile(authResult.data.user.id);
			console.log('✅ [HOOK] Login exitoso:', profile?.email);
			
			return {
				authUser: authResult.data.user,
				profile
			};
		} catch (err) {
			console.error("❌ [HOOK] Error al ingresar:", err);
			setError("Ocurrió un problema con el ingreso del usuario");
			return null;
		} finally {
			setLoading(false);
			console.log('✅ [HOOK] Loading state: false');
		}
	};

	return { handleSignInUser, loading, error };
}


/**
 * Update user
 */
export function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateUser = async (
        id: number,
        updates: Partial<Omit<User, "id">>
    ): Promise<User | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await updateUser(id, updates);
            return updatedUser;
        } catch (err) {
            console.error("Error actualizando usuario:", err);
            setError("Ocurrió un problema al actualizar el usuario");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdateUser, loading, error };
}