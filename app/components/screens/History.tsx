import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import Filter from '../../components/common/Filter';
import Alert from '../../components/common/Alert';

const proyectos = [
  {
    fecha: '04/09/25',
    tipo: 'Alimento seco',
    carga: 'Chica',
    voluntarios: '1',
    proyecto: 'Salida',
  },
  {
    fecha: '04/09/25',
    tipo: 'Alimento seco',
    carga: 'Pesada',
    voluntarios: '2s',
    proyecto: 'Entrada',
  },
  {
    fecha: '04/09/25',
    tipo: 'Alimento congelado',
    carga: 'Mediana',
    voluntarios: '3s',
    proyecto: 'Salida',
  },
  {
    fecha: '04/09/25',
    tipo: 'Fruta',
    carga: 'Pesada',
    voluntarios: '1',
    proyecto: 'Salida',
  },
];

const History = () => {
  const [filter, setFilter] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');

  // Estados para Alert personalizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Opcional: filtrar o ordenar proyectos según el filtro
  let proyectosFiltrados = [...proyectos];
  if (filter === 'Ascendente') {
    proyectosFiltrados.sort((a, b) => a.carga.localeCompare(b.carga));
  } else if (filter === 'Descendente') {
    proyectosFiltrados.sort((a, b) => b.carga.localeCompare(a.carga));
  }

  return (
    <View style={styles.root}>
      <Alert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial De Proyectos</Text>
        <Filter active={filter} onChange={setFilter} />
      </View>
      {/* Lista de proyectos */}
      <ScrollView style={styles.scroll}>
        {proyectosFiltrados.map((p, idx) => (
          <SolicitudCard
            key={idx}
            fecha={p.fecha}
            tipo={p.tipo}
            carga={p.carga}
            voluntarios={p.voluntarios}
            proyecto={p.proyecto}
            onAccept={() => {
              showAlert(`Aceptaste el proyecto del ${p.fecha}`, 'success');
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    right: 0,
    top: 0,
    width: 370,
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5C5C60',
    marginBottom: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  filterActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
});

export default History;