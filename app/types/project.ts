export interface Project {
	id: string;                    // id (bigint) — uso string para evitar problemas con enteros grandes en JS
	created_at: string;            // timestamp (ISO string)
	responsible_id?: string | null;
	vehicle_id?: string | null;
	title?: string | null;
	projectState?: number | null;
	token?: number | null;         // smallint
	projectType?: number | null;
	creator_id?: string | null;
	weight?: number | null;
	loadType?: number | null;
	foodList?: any | null;         // json column — puedes cambiar a Record<string, unknown> si lo prefieres
	expirationDate?: string | null; // date as ISO string (yyyy-mm-dd)
	direction?: string | null;
	photo?: string | null;
	notes?: string | null;
}