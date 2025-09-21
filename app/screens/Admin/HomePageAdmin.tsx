import React, { useState } from 'react';
import { Text, View } from 'react-native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import Card from '../../components/common/Card';

const HomePageAdmin = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'paginaPrincipal' | 'proyectos' | 'usuarios'>('paginaPrincipal');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    if (tab == 'home') {
      setSelectedView('paginaPrincipal');
    }
  }

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('proyectos')}
      onSecondaryAction={() => setSelectedView('usuarios')}
      headerTitle="Hola, { Administrador }"
      primaryButtonText="Proyectos"
      secondaryButtonText="Usuarios"
      sectionTitle={
        selectedView === 'paginaPrincipal' ? 'Página Principal' 
        : selectedView === 'proyectos' ? 'Proyectos'
        : 'Registrar Donaciones'
      }
    >
      {selectedView === 'paginaPrincipal' && (
        <>
        <Card 
          title = "Ingreso de alimentos"
          count = {0}
          type = "completados"
        />

        <Card 
          title = "Apoyo a comunidades"
          count = {0}
          type = "apoyo"
        />

        <Card 
          title = "Responsables registrados"
          count = {0}
          type = "responsables"
        />

        <Card 
          title = "Donadores registrados"
          count = {0}
          type = "donadores"
        />
        </>
      )}

      {selectedView === 'proyectos' && (
        <>
        </>
      )}

      {selectedView === 'usuarios' && (
        <>
        </>
      )}
      
    </HomePageTemplate>
  );
};

export default HomePageAdmin;