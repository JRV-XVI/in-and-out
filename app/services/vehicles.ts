import supabase from "../lib/supabase";
import { Vehicle } from "../types/vehicle";

/**
 * Get all vehicles
 */
export async function getAllVehicles(): Promise<Vehicle[]> {
	const { data, error } = await supabase.from("vehicle").select("*");
	if (error) throw error;
	return data as Vehicle[];
}

/**
 * Get vehicle by ID
 */
export async function getVehicleByPlate(plate: string): Promise<Vehicle | null> {
	const { data, error } = await supabase
		.from("vehicle")
		.select("*")
		.eq("plate", plate)
		.single();

	if (error) {
		console.error("Error obteniendo vehículo:", error);
		return null;
	}

	return data as Vehicle;
}

/**
 * Obtener todos los vehículos del usuario actual
 */
export async function getVehiclesByUser(userId: number): Promise<Vehicle[]> {
	const { data, error } = await supabase
		.from('vehicle')
		.select('*')
		.eq('userResponsible_id', userId);

	if (error) {
		console.error('Error al obtener vehículos:', error);
		return [];
	}

	return data as Vehicle[];
}

/**
 * Create a new vehicle
 */
export async function createVehicle(vehicle: Vehicle, userId: number): Promise<Vehicle | null> {
	const vehicleData = {
		...vehicle,
		userResponsible_id: userId,
		isAvailable: false, // valor por defecto
		isInProject: false, // valor por defecto
	};

	const { data, error } = await supabase
		.from('vehicle')
		.insert(vehicleData)
		.select()
		.single();

	if (error) {
		console.error('Error creando vehículo:', error);
		return null;
	}

	return data as Vehicle;
}

/**
 * Update vehicle
 */
export async function updateVehicle(
	plate: string,
	updates: Partial<Omit<Vehicle, "plate">>
): Promise<Vehicle | null> {
	const { data, error } = await supabase
		.from("vehicle")
		.update(updates)
		.eq("plate", plate)
		.select()
		.single();

	if (error) {
		console.error("Error actualizando vehículo:", error);
		return null;
	}

	return data as Vehicle;
}


/**
 * Delete vehicle by ID
 */
export async function deleteVehicle(plate: string): Promise<boolean> {
	const { error } = await supabase.from("vehicle").delete().eq("plate", plate);

	if (error) {
		console.error("Error eliminando vehículo:", error);
		return false;
	}

	return true;
}


/**
 * Get available vehicles (utility query)
 */
export async function getAvailableVehicles(): Promise<Vehicle[]> {
	const { data, error } = await supabase
		.from("vehicle")
		.select("*")
		.eq("isInProject", false)
		.eq("isAvailable", true);

	if (error) {
		console.error("Error obteniendo vehículos disponibles:", error);
		return [];
	}

	return data as Vehicle[];
}
