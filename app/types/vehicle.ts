export interface Vehicle {
	plate: string;                    // Primary key (text)
	userResponsible_id?: string | null; // FK a users.id (bigint → string por seguridad en JS)
	weightType?: number | null;       // Tipo de peso (ej. toneladas, kg, etc.)
	loadType?: number | null;         // Tipo de carga (ej. seca, refrigerada, líquida)
	isAvailable?: boolean | null;     // Estado de disponibilidad
	photo?: string | null;            // URL o ruta de la foto del vehículo
}

