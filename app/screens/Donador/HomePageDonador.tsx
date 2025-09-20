import React, { useState } from 'react';
import { Text, View } from 'react-native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import Card from '../../components/common/Card';

const HomePageDonador = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'estadisticas' | 'misDonaciones' | 'registrarDonaciones'>('estadisticas');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    if (tab == 'home') {
      setSelectedView('estadisticas');
    }
  }

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('misDonaciones')}
      onSecondaryAction={() => setSelectedView('registrarDonaciones')}
      headerTitle="Hola, { Donante }"
      primaryButtonText="Mis Donaciones"
      secondaryButtonText="Registrar Donaciones"
      sectionTitle={
        selectedView === 'estadisticas' ? 'Estadisticas Generales' 
        : selectedView === 'misDonaciones' ? 'Mis Donaciones'
        : 'Registrar Donaciones'
      }
    >
      {selectedView === 'estadisticas' && (
        <>
        <Card 
          title = "Donaciones completadas"
          count = {0}
          type = "completados"
        />

        <Card 
          title = "Donaciones pendientes"
          count = {0}
          type = "pendientes"
        />

        <Card 
          title = "Donaciones rechazadas"
          count = {0}
          type = "rechazado"
        />
        </>
      )}

      {selectedView === 'misDonaciones' && (
        <>
        </>
      )}

      {selectedView === 'registrarDonaciones' && (
        <>
        </>
      )}
      
    </HomePageTemplate>
  );
};

export default HomePageDonador;
