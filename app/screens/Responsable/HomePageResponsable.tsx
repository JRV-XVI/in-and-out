import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import ProjectCard from '../../components/specialCards/ProjectCard'; // Importa tu card de proyecto
import Filter from '../../components/common/Filter';
import { useAuthContext } from '../../context/AuthContext';
import { acceptProjectWithFirstCompatibleVehicle, getAcceptedProjectsForResponsible, getCompatibleValidatedProjectsForUser } from '../../services/projects';
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

const tipoOpciones = ['Todas', 'Entrada', 'Salida'] as const;
type TipoFiltro = typeof tipoOpciones[number];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const { userProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'home' | 'Entrada' | 'Salida' | 'Abiertas'>('home');
  const [selectedView, setSelectedView] = useState<'Entrada' | 'Salida' | 'Abiertas'>('Abiertas');
  const [filterOrder, setFilterOrder] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');
  const [loading, setLoading] = useState(false);
  const [proyectosCompatibles, setProyectosCompatibles] = useState<Project[]>([]);
  const [proyectosAceptados, setProyectosAceptados] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.id) return;
      setLoading(true);
      try {
        const [compatibles, aceptados] = await Promise.all([
          getCompatibleValidatedProjectsForUser(userProfile.id),
          getAcceptedProjectsForResponsible(userProfile.id),
        ]);
        console.log('📦 [Responsable] Compatibles (raw):', JSON.stringify(compatibles));
        console.log('📦 [Responsable] Aceptados (raw):', JSON.stringify(aceptados));
        setProyectosCompatibles(compatibles);
        setProyectosAceptados(aceptados);
      } catch (e) {
        console.error('Error cargando proyectos compatibles', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userProfile?.id]);

  // Adaptar Project -> UIProject respetando UI existente
  const proyectosCompatiblesAdaptados: UIProject[] = useMemo(() => {
    const adapted = (proyectosCompatibles || []).map(p => {
      // projectType: 1 entrada, 2 salida? Ajusta si tu enumeración es diferente
      const tipo: 'Entrada' | 'Salida' = p.projectType === 1 ? 'Entrada' : 'Salida';

      // status mapping: projectState -> UI status index
      const status = typeof p.projectState === 'number' ? p.projectState : 0;

      // fecha: usar created_at (ISO) -> dd/mm/yy simple
      const created = p.created_at ? new Date(p.created_at) : new Date();
      const dd = String(created.getDate()).padStart(2, '0');
      const mm = String(created.getMonth() + 1).padStart(2, '0');
      const yy = String(created.getFullYear()).slice(-2);
      const fecha = `${dd}/${mm}/${yy}`;

      const ui = {
        id: String(p.id),
        fecha,
        donadores: p.token ?? 0,
        carga: p.loadType === 3 ? 'Carga pesada' : p.loadType === 2 ? 'Carga mediana' : 'Carga chica',
        status,
        direccion: p.direction || '—',
        productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
        tokens: p.token != null ? [String(p.token)] : [],
        tipo,
      } as UIProject;
      return ui;
    });
    console.log('🧩 [Responsable] Compatibles (UI):', JSON.stringify(adapted));
    return adapted;
  }, [proyectosCompatibles]);

  const proyectosAceptadosEntrada: UIProject[] = useMemo(() => {
    const adapted = (proyectosAceptados || [])
      .filter(p => p.projectType === 1)
      .map(p => {
        const created = p.created_at ? new Date(p.created_at) : new Date();
        const dd = String(created.getDate()).padStart(2, '0');
        const mm = String(created.getMonth() + 1).padStart(2, '0');
        const yy = String(created.getFullYear()).slice(-2);
        const fecha = `${dd}/${mm}/${yy}`;
        const ui = {
          id: String(p.id),
          fecha,
          donadores: p.token ?? 0,
          carga: p.loadType === 3 ? 'Carga pesada' : p.loadType === 2 ? 'Carga mediana' : 'Carga chica',
          status: typeof p.projectState === 'number' ? p.projectState : 0,
          direccion: p.direction || '—',
          productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
          tokens: p.token != null ? [String(p.token)] : [],
          tipo: 'Entrada',
        } as UIProject;
        return ui;
      });
    console.log('🧩 [Responsable] Aceptados Entrada (UI):', JSON.stringify(adapted));
    return adapted;
  }, [proyectosAceptados]);

  const proyectosAceptadosSalida: UIProject[] = useMemo(() => {
    const adapted = (proyectosAceptados || [])
      .filter(p => p.projectType === 2)
      .map(p => {
        const created = p.created_at ? new Date(p.created_at) : new Date();
        const dd = String(created.getDate()).padStart(2, '0');
        const mm = String(created.getMonth() + 1).padStart(2, '0');
        const yy = String(created.getFullYear()).slice(-2);
        const fecha = `${dd}/${mm}/${yy}`;
        const ui = {
          id: String(p.id),
          fecha,
          donadores: p.token ?? 0,
          carga: p.loadType === 3 ? 'Carga pesada' : p.loadType === 2 ? 'Carga mediana' : 'Carga chica',
          status: typeof p.projectState === 'number' ? p.projectState : 0,
          direccion: p.direction || '—',
          productos: Array.isArray(p.foodList) ? p.foodList.join(', ') : (p.foodList ? JSON.stringify(p.foodList) : ''),
          tokens: p.token != null ? [String(p.token)] : [],
          tipo: 'Salida',
        } as UIProject;
        return ui;
      });
    console.log('🧩 [Responsable] Aceptados Salida (UI):', JSON.stringify(adapted));
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
      headerTitle="Hola, { Responsable }"
      primaryButtonText="Proyectos Entrada"
      secondaryButtonText="Proyectos Salida"
      sectionTitle={
        selectedView === 'Abiertas'
          ? 'Solicitudes Abiertas'
          : `Proyectos de ${selectedView}`
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
                  // Refrescar listas: quitar de compatibles y agregar a aceptados
                  setProyectosCompatibles(prev => prev.filter(p => String(p.id) !== item.id));
                  setProyectosAceptados(prev => [updated, ...prev]);
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
                item.status === 0 ? 'confirmacion' :
                item.status === 1 ? 'en_recoleccion' :
                item.status === 2 ? 'recolectado' :
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
});

export default HomePageResponsable;