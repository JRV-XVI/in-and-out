import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Token from '../common/Token';
import { Project } from '../../types/project';
import { compareAndConsumeProjectToken } from '../../services/projects'; // <-- agregar import

interface ProjectCardProps {
  project: Project;
  onStart?: () => void;
  onCollected?: () => void;
  onFinalize?: () => void;
  onComplete?: () => void;
}

const statusConfig = {
  cancelado: { label: 'Cancelado', color: '#CE0E2D', icon: 'close-circle-outline' },
  confirmacion: { label: 'Confirmación', color: '#888', icon: 'time-outline' },
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
const getStatus = (projectState: number | null | undefined): 'cancelado' | 'confirmacion' | 'en_recoleccion' | 'recolectado' | 'finalizado' => {
  if (projectState === 0) return 'cancelado';
  if (projectState === 1 || projectState === 2) return 'confirmacion';
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onStart,
  onCollected,
  onFinalize,
  onComplete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false); // <-- estado de verificación
  
  // Extract values from project
  const type = getProjectType(project.projectType);
  const date = formatDate(project.expirationDate || project.created_at);
  const donors = 1; // Default value, can be adjusted if needed
  const vehicleType = getVehicleTypeLabel(project.loadType);
  const address = project.direction || 'Sin dirección';
  const donorName = project.title || 'Sin nombre';
  const products = getProducts(project.foodList);
  const status = getStatus(project.projectState);
  const tokens = project.token ? [String(project.token)] : [];
  
  const isEntrada = type === 'entrada';
  const currentStatus = statusConfig[status];
  const currentStatusIndex = statusOrder.indexOf(status);

  // Verifica token y, si es correcto, consume y avanza a "Recolectado"
  const handleVerifyAndCollected = async () => {
    if (!tokenInput || tokenInput.trim().length === 0) {
      Alert.alert('Token requerido', 'Ingresa el token para continuar.');
      return;
    }
    try {
      setVerifying(true);
      const ok = await compareAndConsumeProjectToken(String(project.id), tokenInput.trim());
      if (!ok) {
        Alert.alert('Token inválido', 'El token no coincide. Verifícalo e intenta de nuevo.');
        return;
      }
      Alert.alert('Éxito', 'Token verificado correctamente.');
      setTokenInput('');
      onCollected && onCollected();
    } catch (e) {
      console.error('[ProjectCard] verify token error:', e);
      Alert.alert('Error', 'No fue posible verificar el token. Intenta nuevamente.');
    } finally {
      setVerifying(false);
    }
  };

  // Función para obtener el botón según el estado
  const renderActionButton = () => {
    switch (status) {
      case 'confirmacion':
        return (
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: '#CE0E2D' }]}
            onPress={onStart}
            activeOpacity={0.8}
          >
            <Ionicons name="car-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.startBtnText}>Iniciar Viaje</Text>
          </TouchableOpacity>
        );
      case 'en_recoleccion':
        return (
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: '#10B981' }]}
            onPress={handleVerifyAndCollected} // <-- validar y consumir token antes de avanzar
            activeOpacity={0.8}
            disabled={verifying}
          >
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.startBtnText}>{verifying ? 'Verificando…' : 'Recolectado'}</Text>
          </TouchableOpacity>
        );
      case 'recolectado':
        return (
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: '#059669' }]}
            onPress={onFinalize}
            activeOpacity={0.8}
          >
            <Ionicons name="flag-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.startBtnText}>Finalizar</Text>
          </TouchableOpacity>
        );
      case 'finalizado':
        return (
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: '#5C5C60' }]}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.startBtnText}>Terminar Proyecto</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        expanded && styles.cardExpanded,
      ]}
      activeOpacity={0.95}
      onPress={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isEntrada ? 'arrow-down-circle' : 'arrow-up-circle'}
            size={36}
            color={isEntrada ? '#CE0E2D' : '#5C5C60'}
          />
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
                const stepConfig = statusConfig[key as keyof typeof statusConfig];
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
                const stepConfig = statusConfig[key as keyof typeof statusConfig];
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
              <Ionicons name="person-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Donador</Text>
                <Text style={styles.detailText}>{donorName}</Text>
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
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Donadores</Text>
                <Text style={styles.detailText}>{donors}</Text>
              </View>
            </View>
          </View>

          {/* Token Section - Solo visible en "en_recoleccion" */}
          {status === 'en_recoleccion' && (
            <View style={styles.tokenSection}>
              <View style={styles.tokenHeader}>
                <Ionicons name="key-outline" size={20} color="#CE0E2D" />
                <Text style={styles.tokenTitle}>Token de identificación</Text>
              </View>
              <View style={styles.tokenInputContainer}>
                <Token value={tokenInput} onChange={setTokenInput} />
              </View>
              {tokens && tokens.length > 0 && (
                <View style={styles.tokenList}>
                  <Text style={styles.tokenListLabel}>Tokens registrados:</Text>
                  <View style={styles.tokenItemsRow}>
                    {tokens.map((t, idx) => (
                      <View key={idx} style={styles.tokenChip}>
                        <Text style={styles.tokenText}>#{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Botón dinámico según estado */}
          {renderActionButton()}

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
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 12,
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
  tokenInputContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenList: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  tokenListLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 8,
  },
  tokenItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tokenChip: {
    backgroundColor: '#FEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CE0E2D',
  },
  tokenText: {
    fontWeight: 'bold',
    color: '#CE0E2D',
    fontSize: 14,
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

export default ProjectCard;