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


