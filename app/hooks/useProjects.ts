import { useState, useEffect } from 'react';
import { getCompatibleValidatedProjectsForUser, getProjectByResponsable } from '../services/projects';
import { Project } from '../types/project';
import supabase from '../lib/supabase';

/**
 * Hook para obtener proyectos aceptados por responsable (optional filter por tipo Entrada/Salida)
 * - responsableId: puede ser number|string; se normaliza a string para la consulta.
 * - tipo: 'Entrada' | 'Salida' para filtrar por projectType (1=Entrada, 2=Salida)
 */
export function useProjects(responsableId: number | string, tipo?: 'Entrada' | 'Salida') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const idStr = String(responsableId);
      const allProjects = await getProjectByResponsable(idStr);

      // Filtrar por tipo si se especifica
      let filteredProjects = allProjects;
      if (tipo) {
        filteredProjects = allProjects.filter((p) => {
          if (typeof p.projectType === 'string') {
            return (p.projectType as string).toLowerCase() === tipo.toLowerCase();
            }
          if (typeof p.projectType === 'number') {
            if (tipo === 'Entrada') return p.projectType === 1;
            if (tipo === 'Salida') return p.projectType === 2;
          }
          return false;
        });
      }

      setProjects(filteredProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responsableId == null) return;
    fetchProjects();

    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project',
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [responsableId, tipo]);

  return { projects, loading, error, refetch: fetchProjects };
}

/**
 * Hook para obtener proyectos validados y compatibles con los vehículos del usuario
 * - userId: número o string (bigint) del usuario en tabla users
 */
export function useCompatibleProjects(userId: number | string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompatible = async () => {
    try {
      if (userId == null) return;
      setLoading(true);
      const numericId = typeof userId === 'string' ? Number(userId) : userId;
      const compatibles = await getCompatibleValidatedProjectsForUser(numericId);
      setProjects(compatibles);
      setError(null);
    } catch (err) {
      console.error('Error fetching compatible projects:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId == null) return;
    fetchCompatible();

    // Suscripción a cambios en tiempo real (proyectos)
    const channel = supabase
      .channel('projects-compatible-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project',
        },
        () => {
          fetchCompatible();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { projects, loading, error, refetch: fetchCompatible };
}