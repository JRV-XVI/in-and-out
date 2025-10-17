import supabase from "../lib/supabase";
import { User } from "../types/user";

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
	const { data, error } = await supabase.from('users').select("*");
	if (error) throw error;
	return data as User[];
}

/**
 * Get user profile by auth user ID
 */
export async function getUserProfile(authUserId: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("auth_user_id", authUserId)
		.single();

	if (error) {
		console.error("Error obteniendo perfil de usuario:", error);
		return null;
	}

	return data as User;
}

/**
 * Get user by email (for profile lookup)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("email", email)
		.single();

	if (error) {
		console.error("Error obteniendo usuario por email:", error);
		return null;
	}

	return data as User;
}

/**
 * Create user profile (after auth registration)
 */
export async function createUserProfile(user: Omit<User, "id">, authUserId: string): Promise<User | null> {
	const userData = {
		...user,
		auth_user_id: authUserId
	};

	const { data, error } = await supabase
		.from("users")
		.insert(userData)
		.select()
		.single();

	if (error) {
		console.error("Error creando perfil de usuario:", error);
		return null;
	}

	return data as User;
}

/**
 * New user (legacy - mantener para compatibilidad)
 */
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
	const { data, error } = await supabase
		.from("users")
		.insert(user)
		.select()
		.single();

	if (error) {
		console.error("Error creando usuario:", error);
		return null;
	}

	return data as User;
}

/**
 * Update user
 */
export async function updateUser(
	id: number,
	updates: Partial<Omit<User, "id">>
): Promise<User | null> {
	const { data, error } = await supabase
		.from("users")
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error actualizando usuario:", error);
		return null;
	}

	return data as User;
}

/**
 * Delete user by ID
 */
export async function deleteUser(id: number): Promise<boolean> {
	const { error } = await supabase.from("users").delete().eq("id", id);

	if (error) {
		console.error("Error eliminando usuario:", error);
		return false;
	}

	return true;
}

/**
 * Elimina usuario en public.users y en auth.users (vía Edge Function con Service Role).
 * - publicId: id bigint de la tabla public.users
 * - authUserId: uuid de auth.users (supabase auth)
 */
export async function deleteUserEverywhere(publicId: number, authUserId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { publicUserId: publicId, authUserId },
    });
    if (error) {
      console.error('[Users] deleteUserEverywhere error:', error);
      return false;
    }
    return !!data?.ok;
  } catch (e) {
    console.error('[Users] deleteUserEverywhere exception:', e);
    return false;
  }
}

