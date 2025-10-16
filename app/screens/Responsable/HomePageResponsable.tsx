import React, { useMemo, useState } from 'react';
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
  const [filterOrder, setFilterOrder] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');
  // ELIMINAR: const [isRefreshing, setIsRefreshing] = useState(false);

  const responsableId = String(userProfile?.id || authUser?.id || '');

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

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as any);
    if (tab === 'home') setSelectedView('Abiertas');
    else setSelectedView(tab as 'Entrada' | 'Salida');
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
        2: `Solicita el token al donador para empaquetar el proyecto${projectName}.`,
        3: `Iniciaste el viaje del proyecto${projectName}.`,
        4: `El proyecto${projectName} está en camino.`,
        5: `Finalizaste el proyecto${projectName}, solicita el token al donador.`,
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

      return {
        id: String(p.id),
        fecha,
        tipo,
        carga: cargaSimple,
        voluntarios: String(p.token ?? 0),
        proyecto: tipo,
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
      await Promise.all([
        refetchCompatibles(),
        refetchAceptados(),
        refetch()
      ]);
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
        <View style={styles.topRow}>
          <View style={styles.filterContainer}>
            <Filter
              label="Ordenar por:"
              activeOrder={filterOrder}
              onOrderChange={setFilterOrder}
              tipoActive={tipoFiltro}
              onTipoChange={setTipoFiltro}
            />
          </View>
          <View style={styles.vehicleButtonContainer}>
            <TouchableOpacity
              style={styles.vehicleButton}
              onPress={() => navigation.navigate('MyVehicles' as never)}
            >
              <Ionicons name="car-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
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
              voluntarios={item.voluntarios}
              proyecto={item.proyecto}
              onAccept={async () => {
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

                  // Notificación para el responsable
                  await sendLocalNotification(
                    'Proyecto aceptado',
                    `Has aceptado el proyecto${projectName} exitosamente`
                  );

                  refetch();
                  setSelectedView(item.proyecto === 'Entrada' ? 'Entrada' : 'Salida');
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flex: 1,
    marginRight: 8,
  },
  vehicleButtonContainer: {
    alignItems: 'flex-end',
    marginTop: -10,
    marginRight: -4,
  },
  vehicleButton: {
    backgroundColor: '#CE0E2D',
    borderRadius: 24,
    padding: 10,
    borderColor: '#CE0E2D',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    marginRight: 0,
    elevation: 6,
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
