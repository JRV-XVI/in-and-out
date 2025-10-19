import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../types/project';
import { getProjectToken } from '../../services/projects';

interface DonationCardProps {
  project: Project;
  onPress?: () => void;
}

const statusConfig = {
  0: { label: 'Cancelado', color: '#CE0E2D', icon: 'close-circle-outline' },
  1: { label: 'Pendiente', color: '#888', icon: 'time-outline' },
  2: { label: 'Confirmado', color: '#3B82F6', icon: 'checkmark-circle-outline' },
  3: { label: 'En camino', color: '#F59E0B', icon: 'car-outline' },
  4: { label: 'Recolectado', color: '#10B981', icon: 'checkmark-done-circle-outline' },
  5: { label: 'Completado', color: '#059669', icon: 'checkmark-circle' },
  6: { label: 'Finalizado', color: '#059669', icon: 'checkmark-circle' },
};

const loadTypeLabels: Record<number, string> = {
  1: 'Carga Normal',
  2: 'Carga Delicada',
  3: 'Carga con Congelador',
};

const DonationCard: React.FC<DonationCardProps> = ({ project, onPress }) => {
  const [expanded, setExpanded] = useState(false);
  const [projectToken, setProjectToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
    onPress?.();
  };

  // Cargar token cuando el proyecto está en estado 3 y se expande la card
  useEffect(() => {
    const fetchToken = async () => {
      if (project.projectState === 3 && expanded && !projectToken) {
        setLoadingToken(true);
        try {
          const token = await getProjectToken(project.id);
          setProjectToken(token);
        } catch (error) {
          console.error('Error cargando token:', error);
        } finally {
          setLoadingToken(false);
        }
      }
    };

    fetchToken();
  }, [project.projectState, project.id, expanded]);

  // Obtener configuración del estatus
  const currentStatus = statusConfig[project.projectState as keyof typeof statusConfig] || statusConfig[1];

  // Extraer productos del foodList JSON
  const products: string[] = [];
  if (project.foodList && typeof project.foodList === 'object') {
    Object.values(project.foodList).forEach((item: any) => {
      if (item && item.nombre) {
        products.push(item.nombre);
      }
    });
  }

  // Obtener tipo de carga
  const loadTypeLabel = loadTypeLabels[project.loadType || 1] || 'Sin especificar';

  // Calcular progreso del estatus
  const statusProgress = project.projectState || 1;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        expanded && styles.cardExpanded,
      ]}
      activeOpacity={0.95}
      onPress={handlePress}
    >
      {/* Header - Siempre visible */}
      <View style={styles.headerContainer}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {project.photo ? (
            <Image
              source={{ uri: project.photo }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: currentStatus.color + '20' }]}>
              <Ionicons name="image-outline" size={40} color={currentStatus.color} />
            </View>
          )}
        </View>

        {/* Info Principal */}
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {project.title || 'Sin título'}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.loadTypeBadge}>
              <Ionicons name="cube-outline" size={14} color="#5C5C60" />
              <Text style={styles.loadTypeText}>{loadTypeLabel}</Text>
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

        {/* Indicador de expansión */}
        <View style={styles.expandIcon}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#CE0E2D"
          />
        </View>
      </View>

      {/* Contenido Expandido */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Barra de Progreso del Estatus */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progreso de Donación</Text>
            
            {/* Labels superiores (pares) */}
            <View style={styles.progressLabelsTop}>
              {[1, 2, 3, 4, 5].map((step, idx) => {
                const stepConfig = statusConfig[step as keyof typeof statusConfig];
                const isCurrent = step === statusProgress;
                const isEven = idx % 2 !== 0; // índice 1, 3 (segundo, cuarto)
                
                return (
                  <View key={`top-${step}`} style={styles.progressLabelContainer}>
                    {isEven ? (
                      <Text
                        style={[
                          styles.progressLabel,
                          isCurrent && { color: stepConfig.color, fontWeight: 'bold' },
                        ]}
                        numberOfLines={2}
                      >
                        {stepConfig.label}
                      </Text>
                    ) : (
                      <Text style={styles.progressLabelSpacer}> </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Barra de progreso */}
            <View style={styles.progressBar}>
              {[1, 2, 3, 4, 5].map((step, idx) => {
                const stepConfig = statusConfig[step as keyof typeof statusConfig];
                const isActive = step <= statusProgress;
                const isCurrent = step === statusProgress;

                return (
                  <View key={step} style={styles.progressStep}>
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
                    {idx < 4 && (
                      <View
                        style={[
                          styles.progressLine,
                          isActive && step < statusProgress && { backgroundColor: stepConfig.color },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Labels inferiores (impares) */}
            <View style={styles.progressLabelsBottom}>
              {[1, 2, 3, 4, 5].map((step, idx) => {
                const stepConfig = statusConfig[step as keyof typeof statusConfig];
                const isCurrent = step === statusProgress;
                const isOdd = idx % 2 === 0; // índice 0, 2, 4 (primero, tercero, quinto)
                
                return (
                  <View key={`bottom-${step}`} style={styles.progressLabelContainer}>
                    {isOdd ? (
                      <Text
                        style={[
                          styles.progressLabel,
                          isCurrent && { color: stepConfig.color, fontWeight: 'bold' },
                        ]}
                        numberOfLines={2}
                      >
                        {stepConfig.label}
                      </Text>
                    ) : (
                      <Text style={styles.progressLabelSpacer}> </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Detalles */}
          <View style={styles.detailsSection}>
            {/* Dirección */}
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dirección de recolección</Text>
                <Text style={styles.detailText}>
                  {project.direction || 'No especificada'}
                </Text>
              </View>
            </View>

            {/* Productos */}
            <View style={styles.detailRow}>
              <Ionicons name="basket-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Productos donados</Text>
                <Text style={styles.detailText}>
                  {products.length > 0 ? products.join(', ') : 'No especificados'}
                </Text>
              </View>
            </View>

            {/* Peso Total */}
            {project.weight && (
              <View style={styles.detailRow}>
                <Ionicons name="scale-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Peso total</Text>
                  <Text style={styles.detailText}>{project.weight} t</Text>
                </View>
              </View>
            )}

            {/* Vehículo Asignado */}
            <View style={styles.detailRow}>
              <Ionicons name="car-sport-outline" size={20} color="#CE0E2D" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Vehículo asignado</Text>
                <Text style={styles.detailText}>{project.vehicle_id || 'No especificado'}</Text>
              </View>
            </View>

            {/* Fecha de Expiración */}
            {project.expirationDate && (
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fecha de expiración</Text>
                  <Text style={styles.detailText}>
                    {new Date(project.expirationDate).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}

            {/* Notas */}
            {project.notes && (
              <View style={styles.detailRow}>
                <Ionicons name="document-text-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Notas adicionales</Text>
                  <Text style={styles.detailText}>{project.notes}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Token Section - Solo visible en estado 3 (En camino) */}
          {project.projectState === 3 && (
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
                  <Text style={styles.tokenLabel}>Tu Token</Text>
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

          {/* Fecha de creación */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Creada el {new Date(project.created_at).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
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
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressLabelsTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 110,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressDotActive: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: '#D0D0D0',
  },
  progressLabelsBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  progressLabelContainer: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    lineHeight: 11,
  },
  progressLabelSpacer: {
    fontSize: 10,
    color: 'transparent',
    height: 12,
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

export default DonationCard;