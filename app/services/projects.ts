import supabase from "../lib/supabase";
import { Project } from "../types/project";
import { getVehiclesByUser, updateVehicle } from "./vehicles"; // <-- añadir updateVehicle

/**
 * Determina si un vehículo (por placa) está asignado a un proyecto activo.
 * Consideramos activo cuando projectState es null o distinto de 6 (ajusta si tu catálogo difiere).
 */
async function isVehicleAssignedToActiveProject(plate: string): Promise<boolean> {
	const { data, error } = await supabase
		.from('project')
		.select('id, projectState')
		.eq('vehicle_id', plate)
		.or('projectState.is.null,projectState.neq.6')
		.limit(1);

	if (error) {
		console.error('[Projects] isVehicleAssignedToActiveProject error:', error);
		// si hay error, ser conservadores
		return true;
	}

	return Array.isArray(data) && data.length > 0;
}

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
 * Get projects by Responsable ID Responsables
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
 * Get projects by Donador ID Donadores
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
 * Get number of completed donations for a Donador
 */
export async function getCountsDonationsComplete(id: string): Promise<number> {
	const { count, error } = await supabase
		.from("project")
		.select("*", { count: "exact" })
		.eq("creator_id", id)
		.eq("projectState", 6)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error obteniendo proyectos por donador:", error);
		return 0;
	}

	return count || 0;
}

/**
 * Get number of pending donations for a Donador
 */
export async function getCountsDonationsPause(id: string): Promise<number> {
	const { count, error } = await supabase
		.from("project")
		.select("*", { count: "exact" })
		.eq("creator_id", id)
		.not("projectState", "in", "(0,6)")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error obteniendo proyectos por donador:", error);
		return 0;
	}

	return count || 0;
}

/**
 * Get number of completed donations for a Donador
 */
export async function getCountsDonationsCanceled(id: string): Promise<number> {
	const { count, error } = await supabase
		.from("project")
		.select("*", { count: "exact" })
		.eq("creator_id", id)
		.eq("projectState", 0)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error obteniendo proyectos por donador:", error);
		return 0;
	}

	return count || 0;
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
    // 1) Obtener vehículos del usuario
    const vehicles = await getVehiclesByUser(userId);
    console.log('[Projects] vehicles by user:', JSON.stringify(vehicles));

    // 2) Filtrar: disponibles (isAvailable === true) y NO ocupados
    const checks = await Promise.all(
        vehicles.map(async (v) => {
            const busy = await isVehicleAssignedToActiveProject(v.plate);
            return { v, busy, available: v.isAvailable === true };
        })
    );
    const freeAndAvailable = checks.filter(c => c.available && !c.busy).map(c => c.v);
    console.log('[Projects] free & available vehicles:', freeAndAvailable.map(v => v.plate));

    // 3) Derivar tipos de peso desde los vehículos libres y disponibles
    const weightTypes = new Set<number>();
    for (const v of freeAndAvailable) {
        let t = v.weightType;
        if (t == null && typeof v.loadType === 'number') t = v.loadType; // fallback histórico
        if (typeof t === 'number' && t >= 1 && t <= 3) weightTypes.add(t);
    }
    console.log('[Projects] derived weightTypes from vehicles:', Array.from(weightTypes));

    if (weightTypes.size === 0) {
        console.log('[Projects] no weightTypes found for user (no free & available vehicles)');
        return [];
    }

    // 4) Construir filtro por rangos
    const orParts: string[] = [];
    if (weightTypes.has(1)) orParts.push('and(weight.gte.3,weight.lte.5)');
    if (weightTypes.has(2)) orParts.push('and(weight.gt.5,weight.lte.10)');
    if (weightTypes.has(3)) orParts.push('weight.gt.10');

    // 5) Ejecutar query base: validados y sin responsable
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
    // RANGOS SOLICITADOS:
    // - Carga chica: menor a 5
    // - Carga mediana: mayor a 5 y menor o igual a 10
    // - Carga pesada: mayor a 10
    if (typeof weight !== 'number') return null;
    if (weight > 10) return 3;         // large
    if (weight > 5 && weight <= 10) return 2; // medium
    if (weight > 0 && weight < 5) return 1;   // small
    return null; // p.ej. weight === 5 o <= 0
}

/**
 * Aceptar un proyecto para un responsable: asigna responsible_id y el primer vehículo compatible
 * del usuario (por rangos de peso). Devuelve el proyecto actualizado o null si no hay vehículo compatible.
 */
export async function acceptProjectWithFirstCompatibleVehicle(projectId: string, userId: number): Promise<Project | null> {
    console.log('[Projects] acceptProjectWithFirstCompatibleVehicle =>', { projectId, userId });
    // 1) Obtener el proyecto
    const current = await getProjectById(projectId);
    if (!current) return null;
    console.log('[Projects] current project:', JSON.stringify(current));

    // 2) Tipo de peso requerido
    const requiredType = weightToType(current.weight ?? undefined);
    if (!requiredType) {
        console.warn('[Projects] requiredType not derivable from weight:', current.weight);
        return null;
    }

    // 3) Vehículos del usuario
    const vehicles = await getVehiclesByUser(userId);
    console.log('[Projects] user vehicles for acceptance (raw):', JSON.stringify(vehicles));

    // 4) Compatibles por tipo y disponibles (isAvailable === true)
    const compatible = vehicles.filter(v => (v.weightType ?? v.loadType) === requiredType && v.isAvailable === true);

    // 5) Elegir el primero NO ocupado
    let match: typeof vehicles[number] | undefined;
    for (const v of compatible) {
        const busy = await isVehicleAssignedToActiveProject(v.plate);
        console.log('[Projects] checking vehicle', v.plate, 'isAvailable:', v.isAvailable, 'busy:', busy);
        if (!busy) {
            match = v;
            break;
        }
    }

    console.log('[Projects] chosen vehicle match:', match?.plate, 'requiredType:', requiredType);
    if (!match) return null;

    // 6) Actualizar proyecto con responsable y vehículo asignado
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

    // 7) (Opcional pero recomendado) marcar el vehículo como no disponible
    try {
        await updateVehicle(match.plate, { isAvailable: false });
        console.log('[Projects] vehicle set to unavailable:', match.plate);
    } catch (e) {
        console.warn('[Projects] could not set vehicle unavailable:', match.plate, e);
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


