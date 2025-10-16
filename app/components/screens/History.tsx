import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProjectCard from '../specialCards/ProjectCard';
import Filter from '../common/Filter';
import Alert from '../common/Alert';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../context/AuthContext';

interface Project {
  id: string;
  projectType: number | string;
  created_at: string;
  expirationDate?: string;
  loadType?: number;
  direction?: string;
  title?: string;
  foodList?: any;
  token?: string;
  projectState: number;
}

const loadTypeLabels: Record<number, string> = {
  1: 'Carga Normal',
  2: 'Carga Delicada',
  3: 'Carga con Congelador',
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

const History = () => {
  const { authUser, userProfile } = useAuthContext();
  const [filter, setFilter] = useState<'Completados' | 'Ascendente' | 'Descendente'>('Completados');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const responsableId = String(userProfile?.id || authUser?.id || '');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Cargar proyectos completados
  useEffect(() => {
    loadCompletedProjects();
  }, [responsableId]);

  const loadCompletedProjects = async () => {
    if (!responsableId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project')
        .select('*')
        .eq('responsible_id', responsableId)
        .eq('projectState', 6)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error al cargar proyectos completados:', err);
      showAlert('Error al cargar el historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Extraer productos del foodList JSON
  const getProducts = (foodList: any): string[] => {
    if (!foodList || typeof foodList !== 'object') return [];
    return Object.values(foodList)
      .filter((item: any) => item && item.nombre)
      .map((item: any) => item.nombre);
  };

  const getProjectType = (projectType: unknown): 'entrada' | 'salida' => {
    if (typeof projectType === 'string') {
      return projectType.toLowerCase() === 'entrada' ? 'entrada' : 'salida';
    }
    if (typeof projectType === 'number') {
      return projectType === 1 ? 'entrada' : 'salida';
    }
    return 'salida';
  };

  // Filtrar y ordenar proyectos
  let proyectosFiltrados = [...projects];
  if (filter === 'Ascendente') {
    proyectosFiltrados.sort((a, b) => {
      const dateA = new Date(a.expirationDate || a.created_at);
      const dateB = new Date(b.expirationDate || b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  } else if (filter === 'Descendente') {
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
        <Filter label="Ordenar por:" active={filter} onChange={setFilter} />
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
          <Text style={styles.emptyText}>No hay proyectos completados</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
          {proyectosFiltrados.map((item) => (
            <ProjectCard
              key={item.id}
              type={getProjectType(item.projectType)}
              date={formatDate(item.expirationDate || item.created_at)}
              donors={1}
              vehicleType={loadTypeLabels[item.loadType || 1] || 'Sin especificar'}
              address={item.direction || 'Sin dirección'}
              donorName={item.title || 'Sin nombre'}
              products={getProducts(item.foodList)}
              status="finalizado"
              tokens={item.token ? [Number(item.token)] : []}
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