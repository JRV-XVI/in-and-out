import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SolicitudCard from '../../components/specialCards/SolicitudCard';
import Alert from '../../components/common/Alert';

const proyectos = [
  {
    fecha: '04/09/25',
    tipo: 'Alimento seco',
    carga: 'Chica',
    voluntarios: '1 voluntariado',
    proyecto: 'Salida',
  },
  {
    fecha: '04/09/25',
    tipo: 'Alimento seco',
    carga: 'Pesada',
    voluntarios: '2 voluntariados',
    proyecto: 'Entrada',
  },
  {
    fecha: '04/09/25',
    tipo: 'Alimento congelado',
    carga: 'Mediana',
    voluntarios: '3 voluntariados',
    proyecto: 'Salida',
  },
  {
    fecha: '04/09/25',
    tipo: 'Fruta',
    carga: 'Pesada',
    voluntarios: '1 voluntariado',
    proyecto: 'Salida',
  },
];

const Search = () => {
  const [query, setQuery] = useState('');

  // Estados para Alert personalizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const filtered = proyectos.filter(
    p =>
      p.tipo.toLowerCase().includes(query.toLowerCase()) ||
      p.carga.toLowerCase().includes(query.toLowerCase()) ||
      p.voluntarios.toLowerCase().includes(query.toLowerCase()) ||
      p.proyecto.toLowerCase().includes(query.toLowerCase()) ||
      p.fecha.includes(query)
  );

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
        <Text style={styles.headerTitle}>Filtra Tu Búsqueda</Text>
        <View style={styles.searchBar}>
          <Ionicons name="arrow-back" size={22} color="#fff" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Busca en SHULKERHOUSE"
            placeholderTextColor="#ddd"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>
      {/* Lista de resultados */}
      <ScrollView style={styles.scroll}>
        {filtered.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No hay resultados</Text>
        ) : (
          filtered.map((p, idx) => (
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
          ))
        )}
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
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C5C60',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
});

export default Search;