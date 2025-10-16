import { useState, useEffect } from 'react';
import { getProjectByResponsable } from '../services/projects';
import { Project } from '../types/project';
import supabase from '../lib/supabase';

export function useProjects(responsableId: string, tipo?: 'Entrada' | 'Salida') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await getProjectByResponsable(responsableId);

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