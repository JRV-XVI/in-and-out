import { useEffect, useState } from "react";
import { User } from "../types/user";
import { getAllUsers, createUser, getUser } from "../services/users";

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
 * Create new user
 */
export function useCreateUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const handleCreateUser = async (userData: Omit<User, "id">) => {
		setLoading(true);
		setError(null);

		try {
			const newUser = await createUser(userData);
			return newUser;
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
 * Get user with email and password
 */
export function useGetUser() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetUser = async (email: string, password: string): Promise<User | null> => {
		setLoading(true);
		setError(null);

		try {
			const user = await getUser(email, password);
			return user;
		} catch (err) {
			console.error("Error al ingresar:", err);
			setError("Ocurrió un problema con el ingreso del usuario");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { handleGetUser, loading, error };
}
