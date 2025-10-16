import supabase from "../lib/supabase";
import { Project } from "../types/project";
import { getVehiclesByUser } from "./vehicles";

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<Project[]> {
	const { data, error } = await supabase.from("project").select("*");

	if (error) {
		console.error("Error obteniendo proyectos:", error);
		throw error;
	}

	return data as Project[];
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
	const { data, error } = await supabase
		.from("project")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error obteniendo proyecto por ID:", error);
		return null;
	}

	return data as Project;
}

/**
 * Get projects by Responsable ID
 */
export async function getProjectByResponsable(id: string): Promise<Project[]> {
    const { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("responsible_id", id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error obteniendo proyectos por responsable:", error);
        return [];
    }

    return data as Project[];
}

/**
 * Get projects by Donador ID
 */
export async function getProjectByDonador(id: string): Promise<Project[]> {
	const { data, error } = await supabase
		.from("project")
		.select("*")
		.eq("creator_id", id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error obteniendo proyectos por donador:", error);
		return [];
	}

	return data as Project[];
}

/**
 * Create new project
 */
export async function createProject(project: Omit<Project, "id" | "created_at">): Promise<Project | null> {
	const { data, error } = await supabase
		.from("project")
		.insert(project)
		.select()
		.single();

	if (error) {
		console.error("Error creando proyecto:", error);
		return null;
	}

	return data as Project;
}

/**
 * Update project
 */
export async function updateProject(
	id: string,
	updates: Partial<Omit<Project, "id" | "created_at">>
): Promise<Project | null> {
	const { data, error } = await supabase
		.from("project")
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error actualizando proyecto:", error);
		return null;
	}

	return data as Project;
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<boolean> {
	const { error } = await supabase.from("project").delete().eq("id", id);

	if (error) {
		console.error("Error eliminando proyecto:", error);
		return false;
	}

	return true;
}

/**
 * Obtener proyectos validados (projectState = 2) que sean compatibles con el usuario según
 * el/los tipos de peso de sus vehículos.
 *
 * Reglas de compatibilidad por peso (toneladas):
 * - small (1): 3 <= weight <= 5
 * - medium (2): 5 < weight <= 10
 * - large (3): weight > 10
 *
 * Devuelve los proyectos que cumplen alguno de los rangos anteriores dependiendo de los
 * tipos de peso (weightType) de los vehículos del usuario.
 */
export async function getCompatibleValidatedProjectsForUser(userId: number): Promise<Project[]> {
	console.log('[Projects] getCompatibleValidatedProjectsForUser => userId:', userId);
	// 1) Obtener vehículos del usuario para conocer sus weightType
	const vehicles = await getVehiclesByUser(userId);
	console.log('[Projects] vehicles by user:', JSON.stringify(vehicles));

	// Conjunto de tipos de peso disponibles para el usuario
	const weightTypes = new Set<number>();
	for (const v of vehicles) {
		let t = v.weightType;
		if (t == null && typeof v.loadType === 'number') {
			// Fallback si fue mal guardado: loadType usado como weightType
			t = v.loadType;
		}
		if (typeof t === 'number' && t >= 1 && t <= 3) {
			weightTypes.add(t);
		}
	}
	console.log('[Projects] derived weightTypes from vehicles:', Array.from(weightTypes));

	if (weightTypes.size === 0) {
		// Si el usuario no tiene vehículos con weightType definido, no hay proyectos compatibles
		console.log('[Projects] no weightTypes found for user');
		return [];
	}

	// 2) Construir filtro OR por rangos de weight
	// Supabase .or() recibe una expresión separada por comas de grupos and(...)
	const orParts: string[] = [];
	// small (1): 3 <= weight <= 5
	if (weightTypes.has(1)) orParts.push('and(weight.gte.3,weight.lte.5)');
	// medium (2): 5 < weight <= 10
	if (weightTypes.has(2)) orParts.push('and(weight.gt.5,weight.lte.10)');
	// large (3): weight > 10
	if (weightTypes.has(3)) orParts.push('weight.gt.10');

	// 3) Ejecutar query: projectState = 2 AND (OR de rangos)
	let query = supabase
		.from('project')
		.select('*')
		.eq('projectState', 2)
		.is('responsible_id', null);

	if (orParts.length > 0) {
		query = query.or(orParts.join(','));
	}

	const { data, error } = await query.order('created_at', { ascending: false });

	if (error) {
		console.error('Error obteniendo proyectos compatibles:', error);
		return [];
	}

	console.log('[Projects] compatible projects result:', JSON.stringify(data));
	return (data || []) as Project[];
}

function weightToType(weight?: number | null): 1 | 2 | 3 | null {
	if (typeof weight !== 'number') return null;
	if (weight <= 5 && weight > 0) return 1; // small
	if (weight > 5 && weight <= 10) return 2; // medium
	if (weight > 10) return 3; // large
	return null;
}

/**
 * Aceptar un proyecto para un responsable: asigna responsible_id y el primer vehículo compatible
 * del usuario (por rangos de peso). Devuelve el proyecto actualizado o null si no hay vehículo compatible.
 */
export async function acceptProjectWithFirstCompatibleVehicle(projectId: string, userId: number): Promise<Project | null> {
	console.log('[Projects] acceptProjectWithFirstCompatibleVehicle =>', { projectId, userId });
	// Obtener el proyecto actual
	const current = await getProjectById(projectId);
	if (!current) return null;
	console.log('[Projects] current project:', JSON.stringify(current));

	// Calcular el tipo de peso requerido por el proyecto
	const requiredType = weightToType(current.weight ?? undefined);
	if (!requiredType) return null;

	// Buscar vehículos del usuario y elegir el primero compatible
	const vehicles = await getVehiclesByUser(userId);
	console.log('[Projects] user vehicles for acceptance:', JSON.stringify(vehicles));
	const match = vehicles.find(v => v.weightType === requiredType);
	console.log('[Projects] vehicle match:', match?.plate, 'requiredType:', requiredType);
	if (!match) return null;

	// Actualizar el proyecto con responsable y vehículo asignados
	const { data, error } = await supabase
		.from('project')
		.update({ responsible_id: userId, vehicle_id: match.plate })
		.eq('id', projectId)
		.select('*')
		.single();

	if (error) {
		console.error('Error aceptando proyecto (asignando vehículo):', error);
		return null;
	}

	console.log('[Projects] project accepted and updated:', JSON.stringify(data));
	return data as Project;
}

/**
 * Obtener proyectos aceptados por el responsable (responsible_id = userId).
 * No filtra por estado; si necesitas limitar por estados específicos, ajusta aquí.
 */
export async function getAcceptedProjectsForResponsible(userId: number): Promise<Project[]> {
	const { data, error } = await supabase
		.from('project')
		.select('*')
		.eq('responsible_id', userId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error obteniendo proyectos aceptados para responsable:', error);
		return [];
	}

	return (data || []) as Project[];
}


