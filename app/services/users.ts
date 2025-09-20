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
 * Get user by email and password
 */
export async function getUser(email: string, password: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("email", email)
		.eq("password", password)
		.single();

	if (error) {
		console.error("Error obteniendo usuario:", error);
		return null;
	}

	return data as User;
}

/**
 * New user
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

