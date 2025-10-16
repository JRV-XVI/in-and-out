import { useState, useEffect } from "react";
import { Vehicle } from "../types/vehicle";
import { useUser } from "../context/UserContext";
import {
  getVehiclesByUser,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicles";

/**
 * Hook para obtener todos los vehículos del usuario logeado
 */
export function useUserVehicles() {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return; // ✅ validamos que exista user.id

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await getVehiclesByUser(user.id); // ✅ solo 1 argumento
        setVehicles(data);
      } catch (err) {
        console.error("Error obteniendo vehículos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  const refresh = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getVehiclesByUser(user.id); // ✅ solo 1 argumento
      setVehicles(data);
    } catch (err) {
      console.error("Error refrescando vehículos:", err);
    } finally {
      setLoading(false);
    }
  };

  return { vehicles, setVehicles, loading, refresh };
};

/**
 * Hook para crear un nuevo vehículo
 */
export function useCreateVehicle() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreateVehicle = async (vehicleData: Omit<Vehicle, "userResponsible_id">) => {
    if (!user?.id) {
      setError("No hay usuario logeado");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await createVehicle(vehicleData, user.id); // ✅ pasar user.id como segundo argumento
      return created;
    } catch (err) {
      console.error("Error creando vehículo:", err);
      setError("Ocurrió un error al registrar el vehículo");
      return null;
    } finally {
      setLoading(false);
    }
  };


  return { handleCreateVehicle, loading, error };
}

/**
 * Hook para actualizar un vehículo
 */
export function useUpdateVehicle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateVehicle = async (plate: string, updates: Partial<Vehicle>) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await updateVehicle(plate, updates);
      return updated;
    } catch (err) {
      console.error("Error actualizando vehículo:", err);
      setError("Ocurrió un error al actualizar el vehículo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateVehicle, loading, error };
}

/**
 * Hook para eliminar un vehículo
 */
export function useDeleteVehicle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteVehicle = async (plate: string) => {
    setLoading(true);
    setError(null);

    try {
      const ok = await deleteVehicle(plate);
      return ok;
    } catch (err) {
      console.error("Error eliminando vehículo:", err);
      setError("Ocurrió un error al eliminar el vehículo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteVehicle, loading, error };
}

