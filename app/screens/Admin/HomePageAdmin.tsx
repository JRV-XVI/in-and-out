import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import HomePageTemplate from '../../components/screens/AdminHomePageTemplate';
import Card from '../../components/common/Card';
import ProyectPageAdmin from './ProyectPageAdmin';
import UsersPageAdmin from './UsersPageAdmin';
import { useAllUsers } from '../../hooks/useUsers';
import { getAllProjects } from '../../services/projects';
import { Project } from '../../types/project';

const HomePageAdmin = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'paginaPrincipal' | 'proyectos' | 'usuarios'>('paginaPrincipal');

  const handleTabPress = (tab: string) => {
    if (tab === 'home') {
      // Cuando se presiona home, resetea a la vista principal
      setActiveTab('home');
      setSelectedView('paginaPrincipal');
    } else {
      // Para otros tabs
      setActiveTab(tab);
    }
  }

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingProjects(true);
      try {
        const data = await getAllProjects();
        if (mounted) setAllProjects(data || []);
      } catch (err) {
        console.error('Error loading projects for dashboard:', err);
      } finally {
        if (mounted) setLoadingProjects(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const finalizedProjects = allProjects ? allProjects.filter(p => p.projectState != null && p.projectState > 4).length : 0;

  // Load all users
  const { users: allUsers } = useAllUsers();
  // Donadores (userType === 1)
  const donadoresCount = allUsers ? allUsers.filter(u => u.userType === 1).length : 0;
  // Responsables (userType === 2)
  const responsablesCount = allUsers ? allUsers.filter(u => u.userType === 2).length : 0;

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('proyectos')}
      onSecondaryAction={() => setSelectedView('usuarios')}
    // Disable the outer ScrollView when showing views that render a FlatList
    // (projects or users) to avoid nesting a VirtualizedList inside a ScrollView.
    useScroll={selectedView === 'paginaPrincipal'}
      primaryButtonText="Proyectos"
      secondaryButtonText="Usuarios"
      sectionTitle={
        selectedView === 'paginaPrincipal' ? 'Página Principal' 
        : selectedView === 'proyectos' ? 'Proyectos'
        : 'Usuarios registrados'
      }
    >
      {selectedView === 'paginaPrincipal' && (
        <>
        <Card 
          title = "Ingreso de alimentos"
          count = {finalizedProjects}
          type = "completados"
        />

        <Card 
          title = "Apoyo a comunidades"
          count = {allProjects ? allProjects.filter(p => (p.projectType ?? 0) === 2 && (p.projectState ?? 0) === 5).length : 0}
          type = "apoyo"
        />

        <Card 
          title = "Responsables registrados"
          count = {responsablesCount}
          type = "responsables"
        />

        <Card 
          title = "Donadores registrados"
          count = {donadoresCount}
          type = "donadores"
        />
        </>
      )}

      {selectedView === 'proyectos' && (
        <>
        <ProyectPageAdmin />
        </>
      )}

      {selectedView === 'usuarios' && (
        <>
        <UsersPageAdmin />
        </>
      )}
      
    </HomePageTemplate>
  );
};

export default HomePageAdmin;