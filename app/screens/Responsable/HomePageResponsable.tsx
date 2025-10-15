import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import ProjectCard from '../../components/specialCards/ProjectCard'; // Importa tu card de proyecto
import Filter from '../../components/common/Filter';

const solicitudesPrueba = [
  { id: "1", fecha: "04/09/25", tipo: "Alimento seco", carga: "Chica", voluntarios: "1", proyecto: "Salida" },
  { id: "2", fecha: "04/09/25", tipo: "Alimento seco", carga: "Pesada", voluntarios: "2", proyecto: "Entrada" },
  { id: "3", fecha: "04/09/25", tipo: "Alimento congelado", carga: "Mediana", voluntarios: "3", proyecto: "Salida" },
  { id: "4", fecha: "04/09/25", tipo: "Fruta", carga: "Pesada", voluntarios: "1", proyecto: "Salida" },
];

// Simulación de proyectos (puedes adaptar la estructura)
const proyectosPrueba = [
  {
    id: "p1",
    fecha: "03/09/25",
    destinos: "Destinos",
    donadores: 3,
    vehiculo: "Camión",
    carga: "Carga con congelador",
    status: 0,
    direccion: "Calle 5 de Febrero, 200 - Ciudad de México, México",
    donador: "Mercado de abarrotes",
    productos: "Manzanas, Mango, Pepino, Banana, Sandía",
    tokens: ['1', '2', '3', '4'],
    tipo: "Entrada",
  },
  {
    id: "p2",
    fecha: "04/09/25",
    destinos: "Destinos",
    donadores: 2,
    vehiculo: "Camioneta",
    carga: "Carga normal",
    status: 1,
    direccion: "Av. Juárez 100, CDMX",
    donador: "Frutería Juárez",
    productos: "Manzanas, Peras",
    tokens: ['1', '2'],
    tipo: "Salida",
  },
];

function parseFecha(fecha: string) {
  const [d, m, y] = fecha.split('/');
  return new Date(Number(`20${y}`), Number(m) - 1, Number(d));
}

const tipoOpciones = ['Todas', 'Entrada', 'Salida'] as const;
type TipoFiltro = typeof tipoOpciones[number];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'home' | 'Entrada' | 'Salida' | 'Abiertas'>('home');
  const [selectedView, setSelectedView] = useState<'Entrada' | 'Salida' | 'Abiertas'>('Abiertas');
  const [filterOrder, setFilterOrder] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as any);
    if (tab === 'home') setSelectedView('Abiertas');
    else setSelectedView(tab as 'Entrada' | 'Salida');
  };

  // Filtrar y ordenar solicitudes
  let solicitudesFiltradas = solicitudesPrueba;
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

  // Filtrar y ordenar proyectos
  let proyectosFiltrados = proyectosPrueba;
  if (selectedView !== 'Abiertas') {
    proyectosFiltrados = proyectosPrueba.filter(
      (item) => item.tipo.toLowerCase() === selectedView.toLowerCase()
    );
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
              onAccept={() => console.log(`Aceptar solicitud ${item.id}`)}
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
              donorName={item.donador}
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