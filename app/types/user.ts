export interface User {
	id: number;
	name: string;
	email: string;
	password?: string; // Opcional ya que ahora usamos Supabase Auth
	phone: number;
	userType: number;
	auth_user_id?: string; // ID del usuario en Supabase Auth
}
