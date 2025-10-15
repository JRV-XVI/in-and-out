import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';

const solicitudesPrueba = [
  { id: "1", fecha: "04/09/25", tipo: "Alimento seco", carga: "Chica", voluntarios: "1", proyecto: "Salida" },
  { id: "2", fecha: "04/09/25", tipo: "Alimento seco", carga: "Pesada", voluntarios: "2", proyecto: "Entrada" },
  { id: "3", fecha: "04/09/25", tipo: "Alimento congelado", carga: "Mediana", voluntarios: "3", proyecto: "Salida" },
  { id: "4", fecha: "04/09/25", tipo: "Fruta", carga: "Pesada", voluntarios: "1", proyecto: "Salida" },
];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'Entrada' | 'Salida'>('Entrada');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setSelectedView('Entrada');
  };

  // Filtrar solicitudes según "Entrada" o "Salida"
  const solicitudesFiltradas = solicitudesPrueba.filter(
    (item) => item.proyecto.toLowerCase() === selectedView.toLowerCase()
  );

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('Entrada')}
      onSecondaryAction={() => setSelectedView('Salida')}
      headerTitle="Hola, { Responsable }"
      primaryButtonText="Entrada"
      secondaryButtonText="Salida"
      sectionTitle={`Solicitudes de ${selectedView}`}
    >
      {/* Botón de vehículo alineado a la derecha debajo del título */}
      <View style={styles.vehicleButtonContainer}>
        <TouchableOpacity
          style={styles.vehicleButton}
          onPress={() => navigation.navigate('MyVehicles' as never)}
        >
          <Ionicons name="car-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

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
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  vehicleButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
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
    marginRight: 20,
    elevation: 6,
  },
});

export default HomePageResponsable;