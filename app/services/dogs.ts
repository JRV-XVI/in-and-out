import supabase from "../lib/supabase";
import { Dog } from "../types/dog";

export async function getDogs(): Promise<Dog[]> {
	const { data, error } = await supabase.from('dogs').select("*");
	if (error) throw error;
	return data as Dog[];
}
