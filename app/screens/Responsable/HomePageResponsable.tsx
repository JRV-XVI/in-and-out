import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import SolicitudCard from '../../components/specialCards/SolicitudCard';

const solicitudesPrueba = [
  { id: "1", fecha: "04/09/25", tipo: "Alimento seco", carga: "Chica", voluntarios: "1 voluntariado", proyecto: "Salida" },
  { id: "2", fecha: "04/09/25", tipo: "Alimento seco", carga: "Pesada", voluntarios: "2 voluntariados", proyecto: "Entrada" },
  { id: "3", fecha: "04/09/25", tipo: "Alimento congelado", carga: "Mediana", voluntarios: "3 voluntariados", proyecto: "Salida" },
  { id: "4", fecha: "04/09/25", tipo: "Fruta", carga: "Pesada", voluntarios: "1 voluntariado", proyecto: "Salida" },
];

const HomePageResponsable = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'entrada' | 'salida'>('entrada');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setSelectedView('entrada');
  };

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('entrada')}
      onSecondaryAction={() => setSelectedView('salida')}
      primaryButtonText="Entrada"
      secondaryButtonText="Salida"
      sectionTitle="Solicitudes Abiertas"
    >
      <FlatList
        data={solicitudesPrueba}
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

      {/* Botón flotante 
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MyVehicles' as never)}
      >
        <Ionicons name="car-outline" size={28} color="white" />
      </TouchableOpacity>
      */}

    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80, // justo encima de la tab bar
    alignSelf: 'center',
    backgroundColor: '#CE0E2D',
    borderRadius: 40,
    padding: 18,
    elevation: 5,
  },
});

export default HomePageResponsable;
