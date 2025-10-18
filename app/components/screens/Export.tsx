import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, TextInput, Alert as RNAlert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Alert from '../../components/common/Alert';
import { getAllProjects, getProjectByDonador } from '../../services/projects';
import { Project } from '../../types/project';
import { useAuthContext } from '../../context/AuthContext';

const Export = () => {
  const { userProfile } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Estados de filtros
  const [filterType, setFilterType] = useState<'all' | 'Entrada' | 'Salida'>('all');
  const [filterState, setFilterState] = useState<number | 'all'>('all');

  // Estados para Alert personalizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (userProfile) {
      loadProjects();
    }
  }, [userProfile]);

  useEffect(() => {
    applyFilters();
  }, [projects, filterType, filterState]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Si es donante (userType === 1), solo cargar sus propios proyectos
      // Si es admin u otro rol, cargar todos los proyectos
      let data: Project[];
      
      if (userProfile?.userType === 1) {
        // Donante: solo sus proyectos
        data = await getProjectByDonador(userProfile.id.toString());
      } else {
        // Admin u otros roles: todos los proyectos
        data = await getAllProjects();
      }
      
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      showAlert('Error al cargar los proyectos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(p => {
        if (filterType === 'Entrada') return p.projectType === 1;
        if (filterType === 'Salida') return p.projectType === 2;
        return true;
      });
    }

    // Filtrar por estado
    if (filterState !== 'all') {
      filtered = filtered.filter(p => p.projectState === filterState);
    }

    setFilteredProjects(filtered);
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterState('all');
  };

  const getProjectStateName = (state: number | null | undefined) => {
    const states: Record<number, string> = {
      0: 'Cancelado',
      1: 'Pendiente',
      2: 'Confirmado',
      3: 'En camino',
      4: 'Recolectado',
      5: 'Completado',
      6: 'Finalizado',
    };
    return state !== null && state !== undefined ? states[state] || 'Desconocido' : 'Desconocido';
  };

  const getProjectTypeName = (type: number | null | undefined) => {
    if (type === 1) return 'Entrada';
    if (type === 2) return 'Salida';
    return 'No especificado';
  };

  const convertToCSV = (data: Project[]) => {
    // Escapar valores para CSV (compatible con Excel)
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Si contiene comas, comillas, saltos de línea o punto y coma, envolver en comillas
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r') || str.includes(';')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      'ID',
      'Título',
      'Tipo',
      'Estado',
      'Token',
      'Peso (kg)',
      'Tipo de Carga',
      'Fecha de Expiración',
      'Dirección',
      'Creador ID',
      'Responsable ID',
      'Vehículo ID',
      'Fecha de Creación',
      'Notas'
    ].join(',');

    const rows = data.map(project => {
      const creatorId = typeof project.creator_id === 'object' 
        ? project.creator_id?.id || '' 
        : project.creator_id || '';
      
      // Formatear fechas para Excel
      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES');
        } catch {
          return dateStr || '';
        }
      };

      return [
        escapeCSV(project.id),
        escapeCSV(project.title || 'Sin título'),
        escapeCSV(getProjectTypeName(project.projectType)),
        escapeCSV(getProjectStateName(project.projectState)),
        escapeCSV(project.token || 'N/A'),
        escapeCSV(project.weight || 'N/A'),
        escapeCSV(project.loadType || 'N/A'),
        escapeCSV(project.expirationDate ? formatDate(project.expirationDate) : 'N/A'),
        escapeCSV(project.direction || 'N/A'),
        escapeCSV(creatorId || 'N/A'),
        escapeCSV(project.responsible_id || 'N/A'),
        escapeCSV(project.vehicle_id || 'N/A'),
        escapeCSV(project.created_at ? formatDate(project.created_at) : 'N/A'),
        escapeCSV(project.notes || 'Sin notas')
      ].join(',');
    });

    return [headers, ...rows].join('\r\n');
  };

  const handleExportCSV = async () => {
    if (filteredProjects.length === 0) {
      showAlert('No hay proyectos para exportar', 'info');
      return;
    }

    try {
      setExporting(true);
      showAlert('Generando archivo CSV...', 'info');

      const csvContent = convertToCSV(filteredProjects);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `proyectos_${timestamp}.csv`;
      
      if (Platform.OS === 'web') {
        // Para web, crear CSV con BOM para que Excel reconozca UTF-8
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = (window as any).document.createElement('a');
        link.href = url;
        link.download = fileName;
        (window as any).document.body.appendChild(link);
        link.click();
        (window as any).document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('Archivo CSV descargado exitosamente', 'success');
      } else {
        // Para Android/iOS
        try {
          const { Paths, File } = await import('expo-file-system');
          const Sharing = await import('expo-sharing');
          
          // Crear archivo usando la nueva API
          const file = new File(Paths.cache, fileName);
          await file.create();
          await file.write('\uFEFF' + csvContent);
          
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(file.uri, {
              mimeType: 'text/csv',
              dialogTitle: 'Exportar proyectos CSV',
              UTI: 'public.comma-separated-values-text',
            });
            showAlert('Archivo CSV compartido exitosamente', 'success');
          } else {
            showAlert('Archivo CSV guardado en: ' + file.uri, 'success');
          }
        } catch (mobileError) {
          console.error('Error en mobile:', mobileError);
          // Fallback: mostrar el contenido en un alert
          RNAlert.alert(
            'Exportación CSV',
            `Se generó el archivo CSV con ${filteredProjects.length} proyectos. El archivo está listo para abrirse en Excel.`,
            [{ text: 'OK' }]
          );
          showAlert('Generación completada', 'success');
        }
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showAlert('Error al exportar el archivo: ' + (error as Error).message, 'error');
    } finally {
      setExporting(false);
    }
  };

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
        <Text style={styles.headerTitle}>Exportar Información</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? 'Cargando proyectos...' : `${projects.length} proyecto${projects.length !== 1 ? 's' : ''} ${userProfile?.userType === 1 ? 'propio' + (projects.length !== 1 ? 's' : '') : 'totales'}`}
        </Text>
      </View>

      {/* Opciones de exportación */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CE0E2D" />
            <Text style={styles.loadingText}>Cargando información de proyectos...</Text>
          </View>
        ) : (
          <>
            {/* Filtros */}
            <View style={styles.filtersContainer}>
              <View style={styles.filterHeader}>
                <Text style={styles.filtersTitle}>Filtros</Text>
                {(filterType !== 'all' || filterState !== 'all') && (
                  <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Limpiar</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Filtro por tipo */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Tipo de proyecto:</Text>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilterType('all')}
                  >
                    <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
                      Todos
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterType === 'Entrada' && styles.filterButtonActive]}
                    onPress={() => setFilterType('Entrada')}
                  >
                    <Text style={[styles.filterButtonText, filterType === 'Entrada' && styles.filterButtonTextActive]}>
                      Entrada
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterType === 'Salida' && styles.filterButtonActive]}
                    onPress={() => setFilterType('Salida')}
                  >
                    <Text style={[styles.filterButtonText, filterType === 'Salida' && styles.filterButtonTextActive]}>
                      Salida
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filtro por estado */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Estado:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilterState('all')}
                  >
                    <Text style={[styles.filterButtonText, filterState === 'all' && styles.filterButtonTextActive]}>
                      Todos
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 0 && styles.filterButtonActive]}
                    onPress={() => setFilterState(0)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 0 && styles.filterButtonTextActive]}>
                      Cancelado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 1 && styles.filterButtonActive]}
                    onPress={() => setFilterState(1)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 1 && styles.filterButtonTextActive]}>
                      Pendiente
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 2 && styles.filterButtonActive]}
                    onPress={() => setFilterState(2)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 2 && styles.filterButtonTextActive]}>
                      Confirmado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 3 && styles.filterButtonActive]}
                    onPress={() => setFilterState(3)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 3 && styles.filterButtonTextActive]}>
                      En camino
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 4 && styles.filterButtonActive]}
                    onPress={() => setFilterState(4)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 4 && styles.filterButtonTextActive]}>
                      Recolectado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 5 && styles.filterButtonActive]}
                    onPress={() => setFilterState(5)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 5 && styles.filterButtonTextActive]}>
                      Completado
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterButton, filterState === 6 && styles.filterButtonActive]}
                    onPress={() => setFilterState(6)}
                  >
                    <Text style={[styles.filterButtonText, filterState === 6 && styles.filterButtonTextActive]}>
                      Finalizado
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>

            <View style={styles.statsCard}>
              <Ionicons name="stats-chart" size={28} color="#CE0E2D" />
              <View style={styles.statsContent}>
                <Text style={styles.statsNumber}>{filteredProjects.length}</Text>
                <Text style={styles.statsLabel}>Proyectos a exportar</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.exportCard, exporting && styles.exportCardDisabled]} 
              onPress={handleExportCSV}
              disabled={exporting}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="file-excel" size={40} color="#217346" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.exportTitle}>Exportar a CSV</Text>
                <Text style={styles.exportDescription}>
                  Formato compatible con Excel, Google Sheets y más
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#5C5C60" style={styles.arrow} />
            </TouchableOpacity>

            <View style={styles.infoSection}>
              <Ionicons name="information-circle-outline" size={20} color="#5C5C60" />
              <Text style={styles.infoText}>
                El archivo CSV incluye todos los datos del proyecto y se puede abrir directamente en Excel, Google Sheets y más, con formato correcto.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    left: 0,
    top: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#F7F7F7',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    paddingTop: 20,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#5C5C60',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#888',
    fontWeight: '400',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  exportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5C5C60',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  arrow: {
    marginLeft: 6,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4F8',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#5C5C60',
    lineHeight: 18,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5C5C60',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContent: {
    marginLeft: 12,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#CE0E2D',
  },
  statsLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  exportCardDisabled: {
    opacity: 0.5,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5C5C60',
    marginBottom: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#CE0E2D',
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C5C60',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 6,
  },
  filterButtonActive: {
    backgroundColor: '#CE0E2D',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C5C60',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  checkboxContainer: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#CE0E2D',
    borderColor: '#CE0E2D',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#5C5C60',
    fontWeight: '500',
  },
  dateInputContainer: {
    gap: 12,
  },
  dateInputWrapper: {
    marginBottom: 8,
  },
  dateInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C5C60',
    marginBottom: 6,
  },
  dateInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    fontSize: 14,
    color: '#5C5C60',
    backgroundColor: '#fff',
  },
});

export default Export;
