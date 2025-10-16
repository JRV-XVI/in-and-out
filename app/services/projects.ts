import supabase from "../lib/supabase";
import { Project } from "../types/project";

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


