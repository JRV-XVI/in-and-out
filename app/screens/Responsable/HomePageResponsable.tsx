import React, { useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import ProjectCard from '../../components/specialCards/ProjectCard';
import Filter from '../../components/common/Filter';
import RefreshButton from '../../components/common/RefreshButton';
import { useAuthContext } from '../../context/AuthContext';
import { acceptProjectWithFirstCompatibleVehicle } from '../../services/projects';
import { useCompatibleProjects, useProjects } from '../../hooks/useProjects';
import { Project } from '../../types/project';

// Las solicitudes en 'Abiertas' vendrán desde proyectosCompatiblesAdaptados

// Estado para proyectos compatibles desde backend
type UIProject = {
  id: string;
  fecha: string;
  destinos?: string;
  donadores: number;
  vehiculo?: string;
  carga: string;
  status: number;
  direccion: string;
  donador?: string;
  productos: string | string[];
  tokens: string[];
  tipo: 'Entrada' | 'Salida';
};

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

// Añadir: etiqueta de carga por peso con los rangos solicitados
function getCargaLabelByWeight(weight?: number | null): string {
  if (typeof weight !== 'number') return 'Sin dato';
  if (weight > 10) return 'Carga pesada';
  if (weight > 5 && weight <= 10) return 'Carga mediana';
  if (weight > 0 && weight < 5) return 'Carga chica';
  // Nota: weight === 5 no entra en ningún rango según tu regla actual
  return 'Sin dato';
}

const loadTypeLabels: Record<number, string> = {
  1: 'Carga Normal',
  2: 'Carga Delicada',
  3: 'Carga con Congelador',
};

const tipoOpciones = ['Todas', 'Entrada', 'Salida'] as const;
type TipoFiltro = typeof tipoOpciones[number];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const { userProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'home' | 'Entrada' | 'Salida' | 'Abiertas'>('home');
  const [selectedView, setSelectedView] = useState<'Entrada' | 'Salida' | 'Abiertas'>('Abiertas');
  const [filterOrder, setFilterOrder] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');
  // Hooks de datos
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

  const loading = selectedView === 'Abiertas' ? loadingCompatibles : loadingAceptados;
  const error = selectedView === 'Abiertas' ? errorCompatibles : errorAceptados;
  const refetch = () => {
    refetchCompatibles();
    refetchAceptados();
  };

  // Adaptar Project -> UIProject respetando UI existente (Abiertas)
  const proyectosCompatiblesAdaptados: UIProject[] = useMemo(() => {
    const adapted = (proyectosCompatibles || []).map(p => {
      const tipo: 'Entrada' | 'Salida' = p.projectType === 1 ? 'Entrada' : 'Salida';
      const status = typeof p.projectState === 'number' ? p.projectState : 0;
      const fecha = formatDate(p.created_at as any);
      const carga = getCargaLabelByWeight(p.weight);

      console.log('[UI] Compatibles map:', { id: p.id, weight: p.weight, carga });

      return {
        id: String(p.id),
        fecha,
        donadores: Number(p.token ?? 0),
        carga,
        status,
        direccion: p.direction || '—',
        productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
        tokens: p.token != null ? [String(p.token)] : [],
        tipo,
      } as UIProject;
    });
    return adapted;
  }, [proyectosCompatibles]);

  // Aceptados -> Entrada
  const proyectosAceptadosEntrada: UIProject[] = useMemo(() => {
    const adapted = (proyectosAceptados || [])
      .filter(p => p.projectType === 1)
      .map(p => {
        const fecha = formatDate(p.created_at as any);
        const carga = getCargaLabelByWeight(p.weight);

        console.log('[UI] Aceptados Entrada map:', { id: p.id, weight: p.weight, carga });

        return {
          id: String(p.id),
          fecha,
          donadores: Number(p.token ?? 0),
          carga,
          status: typeof p.projectState === 'number' ? p.projectState : 0,
          direccion: p.direction || '—',
          productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
          tokens: p.token != null ? [String(p.token)] : [],
          tipo: 'Entrada',
        } as UIProject;
      });
    return adapted;
  }, [proyectosAceptados]);

  // Aceptados -> Salida
  const proyectosAceptadosSalida: UIProject[] = useMemo(() => {
    const adapted = (proyectosAceptados || [])
      .filter(p => p.projectType === 2)
      .map(p => {
        const fecha = formatDate(p.created_at as any);
        const carga = getCargaLabelByWeight(p.weight);

        console.log('[UI] Aceptados Salida map:', { id: p.id, weight: p.weight, carga });

        return {
          id: String(p.id),
          fecha,
          donadores: Number(p.token ?? 0),
          carga,
          status: typeof p.projectState === 'number' ? p.projectState : 0,
          direccion: p.direction || '—',
          productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
          tokens: p.token != null ? [String(p.token)] : [],
          tipo: 'Salida',
        } as UIProject;
      });
    return adapted;
  }, [proyectosAceptados]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as any);
    if (tab === 'home') setSelectedView('Abiertas');
    else setSelectedView(tab as 'Entrada' | 'Salida');
  };

  // Filtrar y ordenar solicitudes (usando proyectos compatibles como solicitudes)
  let solicitudesFiltradas = proyectosCompatiblesAdaptados.map(p => ({
    id: p.id,
    fecha: p.fecha,
    tipo: p.tipo === 'Entrada' ? 'Entrada' : 'Salida',
    carga: p.carga.includes('pesada') ? 'Pesada' : p.carga.includes('mediana') ? 'Mediana' : 'Chica',
    voluntarios: String(p.donadores ?? 0),
    proyecto: p.tipo,
  }));
  if (selectedView === 'Abiertas') {
    if (tipoFiltro !== 'Todas') {
      solicitudesFiltradas = solicitudesFiltradas.filter(
        (item) => item.proyecto.toLowerCase() === tipoFiltro.toLowerCase()
      );
    }
    solicitudesFiltradas = [...solicitudesFiltradas].sort((a, b) => {
      const dateA = parseFecha(a.fecha);
      const dateB = parseFecha(b.fecha);
      if (filterOrder === 'Ascendente') return dateA.getTime() - dateB.getTime();
      if (filterOrder === 'Descendente') return dateB.getTime() - dateA.getTime();
      return 0;
    });
  }

  // Filtrar y ordenar proyectos (a partir de proyectosAdaptados)
  let proyectosFiltrados = proyectosCompatiblesAdaptados;
  if (selectedView !== 'Abiertas') {
    proyectosFiltrados = selectedView === 'Entrada' ? proyectosAceptadosEntrada : proyectosAceptadosSalida;
    proyectosFiltrados = [...proyectosFiltrados].sort((a, b) => {
      const dateA = parseFecha(a.fecha);
      const dateB = parseFecha(b.fecha);
      if (filterOrder === 'Ascendente') return dateA.getTime() - dateB.getTime();
      if (filterOrder === 'Descendente') return dateB.getTime() - dateA.getTime();
      return 0;
    });
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
        selectedView === 'Abiertas' ? (
          <RefreshButton onRefresh={refetch} color="#CE0E2D" size={24} />
        ) : undefined
      }
    >
      {selectedView === 'Abiertas' && (
        <View style={styles.topRow}>
          <View style={styles.filterContainer}>
            <Filter
              label="Ordenar por:"
              active={filterOrder}
              onChange={setFilterOrder}
            />
            <View style={styles.tipoFiltroRow}>
              {tipoOpciones.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.tipoFiltroBtn,
                    tipoFiltro === opt && styles.tipoFiltroBtnActive,
                  ]}
                  onPress={() => setTipoFiltro(opt)}
                >
                  <Text style={[
                    styles.tipoFiltroText,
                    tipoFiltro === opt && styles.tipoFiltroTextActive,
                  ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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

      {/* Mostrar SolicitudCard en Abiertas, ProjectCard en proyectos */}
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
                const updated = await acceptProjectWithFirstCompatibleVehicle(item.id, userProfile.id);
                if (updated) {
                  // Refrescar listas tras aceptar
                  refetch();
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
              type={item.tipo.toLowerCase() === 'entrada' ? 'entrada' : 'salida'}
              date={item.fecha}
              donors={item.donadores}
              vehicleType={item.carga}
              address={item.direccion}
              donorName={item.donador || ''}
              products={typeof item.productos === 'string' ? item.productos.split(',').map(p => p.trim()) : item.productos}
              status={
                item.status === 2 ? 'confirmacion' :
                item.status === 3 ? 'en_recoleccion' :
                item.status === 4 ? 'recolectado' :
                'finalizado'
              }
              tokens={item.tokens.map(Number)}
              onStart={() => console.log(`Iniciar proyecto ${item.id}`)}
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
  tipoFiltroRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  tipoFiltroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#EDEDED',
  },
  tipoFiltroBtnActive: {
    backgroundColor: '#CE0E2D',
  },
  tipoFiltroText: {
    color: '#5C5C60',
    fontWeight: 'bold',
  },
  tipoFiltroTextActive: {
    color: '#fff',
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