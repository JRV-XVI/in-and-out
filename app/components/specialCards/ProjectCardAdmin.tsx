import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Token from '../common/Token';
import { Project } from '../../types/project';
import { compareAndConsumeProjectToken, updateProject, getProjectToken } from '../../services/projects';

interface ProjectCardProps {
  project: Project;
  onStart?: () => void;
  onCollected?: () => void;
  onFinalize?: () => void;
  onComplete?: () => void;
}

const statusConfig = {
  cancelado: { label: 'Cancelado', color: '#CE0E2D', icon: 'close-circle-outline' },
  confirmacionAdmin: { label: 'Confirmación - administrador', color: '#888', icon: 'time-outline' },
  confirmacion: { label: 'Confirmación - responsable', color: '#888', icon: 'time-outline' },
  en_recoleccion: { label: 'En camino', color: '#F59E0B', icon: 'car-outline' },
  recolectado: { label: 'Recolectado', color: '#10B981', icon: 'checkmark-done-circle-outline' },
  finalizado: { label: 'Finalizado', color: '#059669', icon: 'checkmark-circle' },
};

const statusOrder = ['confirmacion', 'en_recoleccion', 'recolectado', 'finalizado'];

// Helper function to format date
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Helper to extract products from foodList
const getProducts = (foodList: any): string[] => {
  if (!foodList || typeof foodList !== 'object') return [];
  return Object.values(foodList)
    .filter((item: any) => item && item.nombre)
    .map((item: any) => item.nombre);
};

// Helper to get project type
const getProjectType = (projectType: unknown): 'entrada' | 'salida' => {
  if (typeof projectType === 'string') {
    return projectType.toLowerCase() === 'entrada' ? 'entrada' : 'salida';
  }
  if (typeof projectType === 'number') {
    return projectType === 1 ? 'entrada' : 'salida';
  }
  return 'salida';
};

// Helper to get status from projectState
const getStatus = (projectState: number | null | undefined): 'cancelado' | 'confirmacionAdmin' | 'confirmacion' | 'en_recoleccion' | 'recolectado' | 'finalizado' => {
  if (projectState === 0) return 'cancelado';
  if (projectState === 1) return 'confirmacionAdmin';
  if (projectState === 2) return 'confirmacion';
  if (projectState === 3) return 'en_recoleccion';
  if (projectState === 4) return 'recolectado';
  return 'finalizado';
};

// Helper to get vehicle type label
const getVehicleTypeLabel = (loadType: number | null | undefined): string => {
  const labels: Record<number, string> = {
    1: 'Carga Normal',
    2: 'Carga Delicada',
    3: 'Carga con Congelador',
  };
  return labels[loadType || 1] || 'Sin especificar';
};

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
}

const ProjectCardAdmin: React.FC<ProjectCardProps> = ({
  project,
  onStart,
  onCollected,
  onFinalize,
  onComplete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [localProjectState, setLocalProjectState] = useState<number | null | undefined>(project.projectState);
  const [volunteersCount, setVolunteersCount] = useState<number>(Number(project.volunteers ?? 0) || 0);
  const [updatingVolunteers, setUpdatingVolunteers] = useState(false);
  const [projectToken, setProjectToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const ignoreToggleRef = useRef(false);
  
  // Extract values from project
  const type = getProjectType(project.projectType);
  const date = formatDate(project.expirationDate || project.created_at);
  const donors = 1; // Default value, can be adjusted if needed
  const vehicleType = getVehicleTypeLabel(project.loadType);
  const address = project.direction || 'Sin dirección';
  const donorName = project.title || 'Sin nombre';
  const products = getProducts(project.foodList);
  const status = getStatus(localProjectState);
  
  const isEntrada = type === 'entrada';
  const currentStatus = statusConfig[status];
  // when status is the admin confirmation variant, treat it as the first step in the progress
  const currentStatusIndex = status === 'confirmacionAdmin' ? 0 : statusOrder.indexOf(status);

  // Función para obtener el botón según el estado
    const renderActionButton = () => {
      switch (status) {
        case 'confirmacionAdmin':
          return (
            <View style={styles.startBtnRow}>
              <TouchableOpacity
                style={[styles.startBtn, { flex: 1, marginLeft: 8, backgroundColor: '#CE0E2D' }]}
                onPress={handleCancelProject}
                activeOpacity={0.8}
                disabled={cancelling}
              >
                <Ionicons name="close-circle" size={20} color="#fff" style={styles.btnIcon} />
                <Text style={styles.startBtnText}>{cancelling ? 'Cancelando…' : 'Cancelar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.startBtn, { backgroundColor: '#059669', flex: 1, marginRight: 8 }]}
                onPress={handleConfirmProject}
                activeOpacity={0.8}
                disabled={confirming}
              >
                <Ionicons name="car-outline" size={20} color="#fff" style={styles.btnIcon} />
                <Text style={styles.startBtnText}>{confirming ? 'Confirmando…' : 'Confirmar'}</Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    };

      // Handler: cambia estado 1 -> 2 usando el servicio updateProject
      const handleConfirmProject = async () => {
        try {
          // prevent outer toggle when pressing this button
          ignoreToggleRef.current = true;
          setTimeout(() => { ignoreToggleRef.current = false; }, 400);
          setConfirming(true);
          // call service to update projectState to 2 and persist volunteersCount
          const updated = await updateProject(String(project.id), { projectState: 2, volunteers: volunteersCount });
          if (!updated) {
            Alert.alert('Error', 'No se pudo confirmar el proyecto. Intenta de nuevo.');
            return;
          }
          // Update local visual state
          setLocalProjectState(updated.projectState);
          // call optional callback if provided
          if (typeof onStart === 'function') onStart();
        } catch (e) {
          console.error('[ProjectCardAdmin] confirm project error:', e);
          Alert.alert('Error', 'Ocurrió un error al confirmar el proyecto.');
        } finally {
          setConfirming(false);
        }
      };

    // Handler: cancela el proyecto (projectState -> 0)
    const handleCancelProject = async () => {
      try {
        // prevent outer toggle when pressing this button
        ignoreToggleRef.current = true;
        setTimeout(() => { ignoreToggleRef.current = false; }, 400);
        setCancelling(true);
        const updated = await updateProject(String(project.id), { projectState: 0 });
        if (!updated) {
          Alert.alert('Error', 'No se pudo cancelar el proyecto. Intenta de nuevo.');
          return;
        }
        setLocalProjectState(updated.projectState);
      } catch (e) {
        console.error('[ProjectCardAdmin] cancel project error:', e);
        Alert.alert('Error', 'Ocurrió un error al cancelar el proyecto.');
      } finally {
        setCancelling(false);
      }
    };

    // Volunteers increment/decrement handlers (persist immediately)
    const updateVolunteers = async (newCount: number) => {
      // clamp to >= 0
      if (newCount < 0) newCount = 0;
      const previous = volunteersCount;
      try {
        // prevent outer toggle when pressing this control
        ignoreToggleRef.current = true;
        setTimeout(() => { ignoreToggleRef.current = false; }, 300);
        setUpdatingVolunteers(true);
        setVolunteersCount(newCount); // optimistic
        const updated = await updateProject(String(project.id), { volunteers: newCount });
        if (!updated) {
          setVolunteersCount(previous);
          Alert.alert('Error', 'No se pudo actualizar el número de voluntarios.');
          return;
        }
        // ensure sync with server value if returned
        setVolunteersCount(Number(updated.volunteers ?? newCount));
      } catch (e) {
        console.error('[ProjectCardAdmin] update volunteers error:', e);
        setVolunteersCount(previous);
        Alert.alert('Error', 'Ocurrió un error al actualizar voluntarios.');
      } finally {
        setUpdatingVolunteers(false);
      }
    };

    const handleIncVolunteers = () => updateVolunteers(volunteersCount + 1);
    const handleDecVolunteers = () => updateVolunteers(Math.max(0, volunteersCount - 1));

    // Fetch project token when project is en_recoleccion (state 3) and card is expanded
    React.useEffect(() => {
      let mounted = true;
      const shouldFetch = (localProjectState ?? project.projectState) === 3 && expanded && !projectToken;
      if (!shouldFetch) return;
      const fetchToken = async () => {
        try {
          setLoadingToken(true);
          const token = await getProjectToken(project.id as any);
          if (!mounted) return;
          setProjectToken(token);
        } catch (e) {
          console.error('[ProjectCardAdmin] fetch token error:', e);
        } finally {
          if (mounted) setLoadingToken(false);
        }
      };
      fetchToken();
      return () => { mounted = false; };
    }, [localProjectState, project.projectState, project.id, expanded, projectToken]);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        expanded && styles.cardExpanded,
      ]}
      activeOpacity={0.95}
      onPress={() => { if (!ignoreToggleRef.current) setExpanded(!expanded); }}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Imagen del Proyecto */}
        <View style={styles.imageContainer}>
          {project.photo ? (
            <Image
              source={{ uri: project.photo }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: currentStatus.color + '20' }]}>
              <Ionicons
                name={isEntrada ? 'arrow-down-circle' : 'arrow-up-circle'}
                size={40}
                color={isEntrada ? '#CE0E2D' : '#5C5C60'}
              />
            </View>
          )}
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {donorName}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.loadTypeBadge}>
              <Ionicons name="cube-outline" size={14} color="#5C5C60" />
              <Text style={styles.loadTypeText}>{vehicleType}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: currentStatus.color }]}>
            <Ionicons
              name={currentStatus.icon as any}
              size={14}
              color="#fff"
            />
            <Text style={styles.statusText}>{currentStatus.label}</Text>
          </View>
        </View>
        <View style={styles.expandIcon}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#CE0E2D"
          />
        </View>
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progreso de Viaje</Text>
            <View style={styles.progressBar}>
              {statusOrder.map((key, idx) => {
                // if the project is awaiting admin confirmation, show the first step using the admin label/color
                const stepConfig = (key === 'confirmacion' && status === 'confirmacionAdmin')
                  ? statusConfig['confirmacionAdmin']
                  : statusConfig[key as keyof typeof statusConfig];
                const isActive = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <View key={key} style={styles.progressStep}>
                    <View
                      style={[
                        styles.progressDot,
                        isActive && { backgroundColor: stepConfig.color },
                        isCurrent && styles.progressDotActive,
                      ]}
                    >
                      {isActive && (
                        <Ionicons
                          name={stepConfig.icon as any}
                          size={12}
                          color="#fff"
                        />
                      )}
                    </View>
                    {idx < statusOrder.length - 1 && (
                      <View
                        style={[
                          styles.progressLine,
                          isActive && idx < currentStatusIndex && { backgroundColor: stepConfig.color },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
            <View style={styles.progressLabels}>
              {statusOrder.map((key, idx) => {
                const stepConfig = (key === 'confirmacion' && status === 'confirmacionAdmin')
                  ? statusConfig['confirmacionAdmin']
                  : statusConfig[key as keyof typeof statusConfig];
                const isCurrent = idx === currentStatusIndex;
                return (
                  <View key={key} style={styles.progressLabelContainer}>
                    <Text
                      style={[
                        styles.progressLabel,
                        isCurrent && { color: stepConfig.color, fontWeight: 'bold' },
                      ]}
                    >
                      {stepConfig.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dirección</Text>
                <Text style={styles.detailText}>{address}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="basket-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Productos</Text>
                <Text style={styles.detailText}>
                  {products.length > 0 ? products.join(', ') : 'No especificados'}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="car-sport-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Vehículo</Text>
                <Text style={styles.detailText}>{vehicleType}</Text>
              </View>
            </View>
            {/* Volunteers counter: visible to admin while project is in confirmacionAdmin */}
            {status === 'confirmacionAdmin' && (
              <View style={[styles.detailRow, { alignItems: 'center' }]}>
                <Ionicons name="people-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Voluntarios asignados</Text>
                  <View style={styles.volunteersRow}>
                    <TouchableOpacity style={styles.volButton} onPress={handleDecVolunteers} disabled={updatingVolunteers}>
                      <Text style={styles.volButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.volCountBox}>
                      <Text style={styles.volCountText}>{volunteersCount}</Text>
                    </View>
                    <TouchableOpacity style={styles.volButton} onPress={handleIncVolunteers} disabled={updatingVolunteers}>
                      <Text style={styles.volButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* When project has progressed beyond admin confirmation show volunteers as text */}
            {(localProjectState ?? -1) > 1 && (
              <View style={styles.detailRow}>
                <Ionicons name="people-circle" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Voluntarios</Text>
                  <Text style={styles.detailText}>{volunteersCount}</Text>
                </View>
              </View>
            )}
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Donadores</Text>
                <Text style={styles.detailText}>{donors}</Text>
              </View>
            </View>
          </View>

          {/* Botón dinámico según estado */}
          {renderActionButton()}

          {/* Token Section - Solo visible en estado 3 (En camino) */}
            {(localProjectState ?? -1) === 3 && (
              <View style={styles.tokenSection}>
                <View style={styles.tokenHeader}>
                  <Ionicons name="key-outline" size={20} color="#CE0E2D" />
                  <Text style={styles.tokenTitle}>Da el siguiente token al conductor</Text>
                </View>
                {loadingToken ? (
                  <View style={styles.tokenDisplayContainer}>
                    <Text style={styles.tokenLabel}>Cargando token...</Text>
                  </View>
                ) : projectToken ? (
                  <View style={styles.tokenDisplayContainer}>
                    <Text style={styles.tokenLabel}>Token</Text>
                    <View style={styles.tokenDisplay}>
                      {String(projectToken).padStart(4, '0').split('').map((digit, idx) => (
                        <View key={idx} style={styles.tokenDigit}>
                          <Text style={styles.tokenDigitText}>{digit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.tokenDisplayContainer}>
                    <Text style={styles.tokenLabel}>Token no disponible</Text>
                  </View>
                )}
              </View>
            )}

          {/* Fecha al final como DonationCard */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Creado el {date}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardExpanded: {
    borderColor: '#CE0E2D',
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loadTypeText: {
    fontSize: 12,
    color: '#5C5C60',
    marginLeft: 4,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  expandIcon: {
    marginLeft: 8,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  progressSection: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  progressDotActive: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  progressLine: {
    height: 3,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
    minWidth: 24,
    alignSelf: 'center',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  progressLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    lineHeight: 14,
  },
  detailsSection: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tokenSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tokenDisplayContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  tokenLabel: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#5C5C60',
    marginBottom: 12,
    textAlign: 'center',
  },
  tokenDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  tokenDigit: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#5C5C60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenDigitText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  startBtn: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  startBtnRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volunteersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  volButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 8,
  },
  volButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
  },
  volCountBox: {
    minWidth: 48,
    marginHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volCountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  btnIcon: {
    marginRight: 8,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProjectCardAdmin;