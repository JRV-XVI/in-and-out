import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import ProjectCard from '../../components/specialCards/ProjectCard';
import Filter from '../../components/common/Filter';
import { useAuthContext } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { supabase } from '../../lib/supabase';
import { acceptProjectWithFirstCompatibleVehicle } from '../../services/projects';
import { useCompatibleProjects, useProjects } from '../../hooks/useProjects';
import { sendNotificationToUser } from '../../services/notifications';
import RefreshButton from '../../components/common/RefreshButton';
import { getVehiclesByUser } from '../../services/vehicles';
import { Vehicle } from '../../types/vehicle';

function parseFecha(fecha: string) {
  const [d, m, y] = fecha.split('/');
  return new Date(Number(`20${y}`), Number(m) - 1, Number(d));
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function getCargaLabelByWeight(weight?: number | null): string {
  if (typeof weight !== 'number') return 'Sin dato';
  if (weight > 10) return 'Carga pesada';
  if (weight > 5 && weight <= 10) return 'Carga mediana';
  if (weight > 0 && weight < 5) return 'Carga chica';
  return 'Sin dato';
}

const tipoOpciones = ['Todas', 'Entrada', 'Salida'] as const;
type TipoFiltro = typeof tipoOpciones[number];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const { authUser, userProfile } = useAuthContext();
  const { sendLocalNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'home' | 'Entrada' | 'Salida' | 'Abiertas'>('home');
  const [selectedView, setSelectedView] = useState<'Entrada' | 'Salida' | 'Abiertas'>('Abiertas');
  const [filterOrder, setFilterOrder] = useState<'Ascendente' | 'Descendente'>('Ascendente');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  // ELIMINAR: const [isRefreshing, setIsRefreshing] = useState(false);

  const responsableId = String(userProfile?.id || authUser?.id || '');
  
  // Ref para rastrear proyectos compatibles previos
  const previousCompatibleProjectsRef = useRef<Set<string>>(new Set());

  const {
    projects: proyectosAceptados,
    loading: loadingAceptados,
    error: errorAceptados,
    refetch: refetchAceptados,
  } = useProjects(userProfile?.id ?? '');

  const {
    projects: proyectosCompatibles,
    loading: loadingCompatibles,
    error: errorCompatibles,
    refetch: refetchCompatibles,
  } = useCompatibleProjects(userProfile?.id);

  const tipoProyecto = selectedView !== 'Abiertas' ? selectedView : undefined;
  const { projects, loading, error, refetch } = useProjects(responsableId, tipoProyecto);

  // Efecto para cargar vehículos del usuario
  useEffect(() => {
    const loadVehicles = async () => {
      if (!userProfile?.id) return;
      try {
        const vehicles = await getVehiclesByUser(Number(userProfile.id));
        setUserVehicles(vehicles);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
      }
    };

    loadVehicles();
  }, [userProfile?.id]);

  // Efecto para detectar nuevos proyectos compatibles y enviar notificaciones
  useEffect(() => {
    const checkNewCompatibleProjects = async () => {
      if (!proyectosCompatibles || proyectosCompatibles.length === 0 || !userProfile?.id) return;

      const currentProjectIds = new Set(proyectosCompatibles.map(p => String(p.id)));
      const previousIds = previousCompatibleProjectsRef.current;

      // Detectar nuevos proyectos (que no estaban antes)
      const newProjectIds = Array.from(currentProjectIds).filter(id => !previousIds.has(id));

      if (newProjectIds.length > 0) {
        try {
          // Obtener vehículos del usuario
          const vehicles = await getVehiclesByUser(Number(userProfile.id));
          
          // Filtrar vehículos disponibles
          const availableVehicles = vehicles.filter(v => v.isAvailable === true);

          for (const projectId of newProjectIds) {
            const project = proyectosCompatibles.find(p => String(p.id) === projectId);
            if (!project) continue;

            // Determinar vehículo compatible basado en el peso del proyecto
            let compatibleVehicle = null;
            if (availableVehicles.length > 0) {
              const projectWeight = project.weight || 0;
              
              // Determinar el tipo de carga requerido
              let requiredWeightType: number | null = null;
              if (projectWeight >= 0 && projectWeight <= 5) requiredWeightType = 1;
              else if (projectWeight > 5 && projectWeight <= 10) requiredWeightType = 2;
              else if (projectWeight > 10) requiredWeightType = 3;

              // Buscar vehículo compatible con el tipo de carga
              if (requiredWeightType) {
                compatibleVehicle = availableVehicles.find(v => {
                  const weightType = v.weightType ?? v.loadType;
                  return weightType === requiredWeightType;
                });
              }
            }

            const projectTitle = project.title || 'Sin título';
            const vehicleInfo = compatibleVehicle 
              ? ` es compatible con tu vehículo (${compatibleVehicle.plate})` 
              : ' está disponible';

            // Enviar notificación local
            await sendLocalNotification(
              'Nuevo proyecto compatible',
              `El proyecto "${projectTitle}"${vehicleInfo}`
            );
          }
        } catch (error) {
          console.error('Error al verificar proyectos compatibles:', error);
        }
      }

      // Actualizar referencia con los IDs actuales
      previousCompatibleProjectsRef.current = currentProjectIds;
    };

    checkNewCompatibleProjects();
  }, [proyectosCompatibles, userProfile?.id, sendLocalNotification]);

  const handleTabPress = (tab: string) => {
    if (tab === 'home') {
      // Cuando se presiona home, resetea a la vista de "Abiertas"
      setActiveTab('home' as any);
      setSelectedView('Abiertas');
    } else {
      // Para otros tabs (Entrada, Salida), actualiza el view
      setActiveTab(tab as any);
      setSelectedView(tab as 'Entrada' | 'Salida');
    }
  };

  const handleProjectStateChange = async (projectId: string, newState: number) => {
    try {
      // Obtener también el nombre del proyecto
      const { data: projectData, error: fetchError } = await supabase
        .from('project')
        .select('creator_id, title') // Asegúrate que el campo sea 'name', si no, usa el correcto
        .eq('id', projectId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Actualizar el estado del proyecto
      const { error: updateError } = await supabase
        .from('project')
        .update({ projectState: newState })
        .eq('id', projectId);

      if (updateError) {
        throw updateError;
      }

      const projectName = projectData?.title ? ` (${projectData.title})` : '';

      const stateMessages: Record<number, string> = {
        2: `El proyecto${projectName} está en proceso de empaquetado`,
        3: `El transporte ha llegado para el proyecto${projectName}`,
        4: `El proyecto${projectName} está en camino`,
        5: `El proyecto${projectName} ha sido entregado`,
        6: `El proyecto${projectName} ha sido completado`
      };

      const localMessages: Record<number, string> = {

        3: `Iniciaste el viaje del proyecto${projectName}. Solicita el token al donador.`,
        4: `El proyecto${projectName} está en camino.`,
        5: `Finalizaste el proyecto${projectName}.`,
        6: `Terminaste el proyecto${projectName} exitosamente.`
      };

      // Notificación al donador (creator_id)
      if (stateMessages[newState] && projectData?.creator_id) {
        const creatorId = Number(projectData.creator_id);
        await sendNotificationToUser(
          creatorId,
          'Estado del proyecto actualizado',
          stateMessages[newState]
        );
      }

      // Notificación local al responsable
      if (localMessages[newState]) {
        await sendLocalNotification(
          'Actualización de proyecto',
          localMessages[newState]
        );
      }

      Alert.alert('Éxito', 'Estado del proyecto actualizado');
      refetch();
    } catch (err: any) {
      console.error('Error al actualizar estado:', err);
      Alert.alert('Error', 'No se pudo actualizar el estado del proyecto');
    }
  };

  // Adaptar proyectos compatibles para SolicitudCard
  const solicitudesFiltradas = useMemo(() => {
    let adapted = (proyectosCompatibles || []).map(p => {
      const tipo: 'Entrada' | 'Salida' = p.projectType === 1 ? 'Entrada' : 'Salida';
      const fecha = formatDate(p.created_at as any);
      const carga = getCargaLabelByWeight(p.weight);
      const cargaSimple = carga.includes('pesada') ? 'Pesada' : carga.includes('mediana') ? 'Mediana' : 'Chica';

      // Calcular weightType basado en el peso del proyecto
      const projectWeight = p.weight || 0;
      let weightType: number | undefined = undefined;
      if (projectWeight >= 0 && projectWeight <= 5) weightType = 1; // Ligera
      else if (projectWeight > 5 && projectWeight <= 10) weightType = 2; // Mediana
      else if (projectWeight > 10) weightType = 3; // Pesada

      return {
        id: String(p.id),
        fecha,
        tipo,
        carga: cargaSimple,
        voluntarios: String(p.token ?? 0),
        proyecto: tipo,
        titulo: p.title || 'Sin título',
        weightType,
        direccion: p.direction || undefined,
        productos: p.foodList ? Object.values(p.foodList)
          .filter((item: any) => item && item.nombre)
          .map((item: any) => item.nombre) : [],
      };
    });

    if (selectedView === 'Abiertas') {
      if (tipoFiltro !== 'Todas') {
        adapted = adapted.filter(
          (item) => item.proyecto.toLowerCase() === tipoFiltro.toLowerCase()
        );
      }
      adapted = [...adapted].sort((a, b) => {
        const dateA = parseFecha(a.fecha);
        const dateB = parseFecha(b.fecha);
        if (filterOrder === 'Ascendente') return dateA.getTime() - dateB.getTime();
        if (filterOrder === 'Descendente') return dateB.getTime() - dateA.getTime();
        return 0;
      });
    }

    return adapted;
  }, [proyectosCompatibles, selectedView, tipoFiltro, filterOrder]);

  // Filtrar proyectos aceptados para ProjectCard
  const proyectosFiltrados = useMemo(() => {
    if (selectedView === 'Abiertas') return [];
    
    return [...projects]
      .filter(p => p.projectState !== 6)
      .sort((a, b) => {
        const dateA = new Date(a.expirationDate || a.created_at);
        const dateB = new Date(b.expirationDate || b.created_at);
        if (filterOrder === 'Ascendente') return dateA.getTime() - dateB.getTime();
        if (filterOrder === 'Descendente') return dateB.getTime() - dateA.getTime();
        return 0;
      });
  }, [projects, selectedView, filterOrder]);

  // Consolidar función de refresco
  const handleRefresh = async () => {
    // ELIMINAR: setIsRefreshing(true);
    try {
      const refreshPromises = [
        refetchCompatibles(),
        refetchAceptados(),
        refetch()
      ];
      
      // También recargar vehículos
      if (userProfile?.id) {
        refreshPromises.push(
          getVehiclesByUser(Number(userProfile.id)).then(vehicles => setUserVehicles(vehicles))
        );
      }
      
      await Promise.all(refreshPromises);
    } catch (error) {
      console.error('Error al refrescar:', error);
    }
    // ELIMINAR: finally { setIsRefreshing(false); }
  };

  if (!responsableId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró usuario autenticado</Text>
      </View>
    );
  }

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('Entrada')}
      onSecondaryAction={() => setSelectedView('Salida')}
      headerTitle={`Hola, ${userProfile?.name || 'Responsable'}`}
      primaryButtonText="Entrada"
      secondaryButtonText="Salida"
      sectionTitle={
        selectedView === 'Abiertas'
          ? 'Solicitudes Abiertas'
          : `Proyectos de ${selectedView}`
      }
      sectionTitleAction={
        <RefreshButton
          onRefresh={handleRefresh}
          color="#CE0E2D"
          size={24}
        />
      }
    >
      {selectedView === 'Abiertas' && (
        <View style={styles.filterContainer}>
          <Filter
            label="Ordenar por:"
            activeOrder={filterOrder}
            onOrderChange={setFilterOrder}
            tipoActive={tipoFiltro}
            onTipoChange={setTipoFiltro}
          />
        </View>
      )}

      {selectedView === 'Abiertas' ? (
        <FlatList
          data={solicitudesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SolicitudCard
              fecha={item.fecha}
              tipo={item.tipo}
              carga={item.carga}
              title={item.titulo}
              voluntarios={item.voluntarios}
              proyecto={item.proyecto}
              direccion={item.direccion}
              productos={item.productos}
              weightType={item.weightType}
              availableVehicles={userVehicles}
              onAccept={async (selectedVehicle?: Vehicle) => {
                if (!userProfile?.id) return;

                // Obtener el creator_id y nombre del proyecto antes de aceptarlo
                const { data: projectData } = await supabase
                  .from('project')
                  .select('creator_id, title')
                  .eq('id', item.id)
                  .single();

                const projectName = projectData?.title ? ` (${projectData.title})` : '';

                const updated = await acceptProjectWithFirstCompatibleVehicle(item.id, userProfile.id);
                if (updated) {
                  // Notificación al donador
                  if (projectData?.creator_id) {
                    const creatorId = Number(projectData.creator_id);
                    await sendNotificationToUser(
                      creatorId,
                      'Proyecto aceptado',
                      `Un responsable ha aceptado tu proyecto${projectName} y comenzará el proceso`
                    );
                  }

                  // Notificación para el responsable con info del vehículo
                  const vehicleInfo = selectedVehicle ? ` usando el vehículo ${selectedVehicle.plate}` : '';
                  await sendLocalNotification(
                    'Proyecto aceptado',
                    `Has aceptado el proyecto${projectName}${vehicleInfo} exitosamente`
                  );

                  // Refrescar la lista de proyectos sin cambiar de vista
                  await refetchCompatibles();
                  await refetch();
                }
              }}
              icon={
                item.proyecto.toLowerCase() === 'entrada'
                  ? <Ionicons name="arrow-down-circle-outline" size={28} color="#CE0E2D" />
                  : <Ionicons name="arrow-up-circle-outline" size={28} color="#CE0E2D" />
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CE0E2D" />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : proyectosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hay proyectos de {selectedView}</Text>
        </View>
      ) : (
        <FlatList
          data={proyectosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onStart={() => handleProjectStateChange(item.id, 3)}
              onCollected={() => handleProjectStateChange(item.id, 4)}
              onFinalize={() => handleProjectStateChange(item.id, 5)}
              onComplete={() => {
                Alert.alert(
                  'Confirmar',
                  '¿Deseas terminar este proyecto?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Confirmar',
                      onPress: () => handleProjectStateChange(item.id, 6)
                    }
                  ]
                );
              }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#CE0E2D',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#CE0E2D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
});

export default HomePageResponsable;
