import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProjectCard from '../specialCards/ProjectCard';
import Filter from '../common/Filter';
import Alert from '../common/Alert';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../context/AuthContext';
import { Project } from '../../types/project';

const tipoOptions = ['Todas', 'Entrada', 'Salida'] as const;
type TipoFiltro = typeof tipoOptions[number];

const History = () => {
  const { authUser, userProfile } = useAuthContext();
  const [filterOrder, setFilterOrder] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Todas');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const userId = String(userProfile?.id || authUser?.id || '');
  const userType = userProfile?.userType;

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  useEffect(() => {
    loadCompletedProjects();
  }, [userId, userType]);

  const loadCompletedProjects = async () => {
    if (!userId) {
      return;
    }
    try {
      setLoading(true);
      let query = supabase
        .from('project')
        .select('*')
        .in('projectState', [0, 6]); // Incluir estado 0 (cancelados) y 6 (completados)

      if (userType === 1) {
        query = query.eq('creator_id', userId);
      } else {
        query = query.eq('responsible_id', userId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      showAlert('Error al cargar el historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  let proyectosFiltrados = [...projects];
  if (tipoFiltro !== 'Todas') {
    proyectosFiltrados = proyectosFiltrados.filter((p) => {
      if (typeof p.projectType === 'number') {
        return (
          (tipoFiltro === 'Entrada' && p.projectType === 1) ||
          (tipoFiltro === 'Salida' && p.projectType === 2)
        );
      }
      return false;
    });
  }


  // Ordenar
  if (filterOrder === 'Ascendente') {
    proyectosFiltrados.sort((a, b) => {
      const dateA = new Date(a.expirationDate || a.created_at);
      const dateB = new Date(b.expirationDate || b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  } else if (filterOrder === 'Descendente') {
    proyectosFiltrados.sort((a, b) => {
      const dateA = new Date(a.expirationDate || a.created_at);
      const dateB = new Date(b.expirationDate || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
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
        <Filter
          label="Ordenar por:"
          activeOrder={filterOrder}
          onOrderChange={setFilterOrder}
          tipoActive={tipoFiltro}
          onTipoChange={setTipoFiltro}
        />
      </View>

      {/* Lista de proyectos */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CE0E2D" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : proyectosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hay proyectos en el historial</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
          {proyectosFiltrados.map((item) => (
            <ProjectCard
              key={item.id}
              project={{
                ...item,
                token: item.token ? String(item.token) : null,
                projectType: typeof item.projectType === 'string' ? Number(item.projectType) : item.projectType,
              }}
            />
          ))}
        </ScrollView>
      )}
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
  scroll: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 10,
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
    textAlign: 'center',
  },
});

export default History;