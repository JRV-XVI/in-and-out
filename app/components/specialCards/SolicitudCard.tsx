import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Vehicle } from '../../types/vehicle';
import Alert from '../common/Alert';

export interface SolicitudCardProps {
  fecha: string;
  tipo: string;
  carga: string;
  voluntarios: string;
  proyecto: string;
  direccion?: string;
  productos?: string[];
  weightType?: number; // Tipo de peso requerido (1, 2, 3) basado en el peso del proyecto
  availableVehicles?: Vehicle[]; // Vehículos disponibles del responsable
  onAccept: (selectedVehicle?: Vehicle) => void;
  icon?: React.ReactNode;
  isAccepting?: boolean;
}

// Helper to get vehicle type label by weightType
const getVehicleTypeLabel = (weightType: number | null | undefined): string => {
  const labels: Record<number, string> = {
    1: 'Carga Ligera (3-5 kg)',
    2: 'Carga Mediana (5-10 kg)',
    3: 'Carga Pesada (>10 kg)',
  };
  return labels[weightType || 1] || 'Sin especificar';
};

// Helper to get vehicle icon by weightType
const getVehicleIcon = (weightType: number | null | undefined): string => {
  const icons: Record<number, string> = {
    1: 'car-outline',
    2: 'car-sport-outline',
    3: 'cube-outline',
  };
  return icons[weightType || 1] || 'car-outline';
};

const SolicitudCard: React.FC<SolicitudCardProps> = ({
  fecha,
  tipo,
  carga,
  voluntarios,
  proyecto,
  direccion,
  productos = [],
  weightType,
  availableVehicles = [],
  onAccept,
  icon,
  isAccepting,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  // Filtrar vehículos que coincidan con el tipo de carga/peso requerido
  // Usa weightType O loadType del vehículo (lo que esté disponible)
  const matchingVehicles = availableVehicles.filter((v) => {
    if (!v.isAvailable) return false;
    const vehicleType = v.weightType ?? v.loadType;
    return vehicleType === weightType;
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleAccept = () => {
    if (matchingVehicles.length > 1) {
      setShowVehicleModal(true);
    } else if (matchingVehicles.length === 1) {
      setSelectedVehicle(matchingVehicles[0]);
      onAccept(matchingVehicles[0]);
      showAlert(
        `Has aceptado la solicitud usando el vehículo ${matchingVehicles[0].plate}.`,
        'success'
      );
    } else {
      showAlert(
        `No tienes vehículos disponibles que cumplan con el requisito de ${getVehicleTypeLabel(weightType)}.`,
        'error'
      );
    }
  };

  const handleVehicleSelection = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(false);
    onAccept(vehicle);
    showAlert(
      `Has aceptado la solicitud usando el vehículo ${vehicle.plate}.`,
      'success'
    );
  };

  const isEntrada = tipo.toLowerCase().includes('entrada');
  const vehicleTypeLabel = getVehicleTypeLabel(weightType);
  const vehicleIconName = getVehicleIcon(weightType);

  return (
    <>
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
            {icon ? (
              icon
            ) : (
              <Ionicons
                name={isEntrada ? 'arrow-down-circle' : 'arrow-up-circle'}
                size={36}
                color={isEntrada ? '#CE0E2D' : '#5C5C60'}
              />
            )}
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {proyecto}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.loadTypeBadge}>
                <Ionicons name={vehicleIconName as any} size={14} color="#5C5C60" />
                <Text style={styles.loadTypeText}>{vehicleTypeLabel}</Text>
              </View>
            </View>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#CE0E2D" />
              <Text style={styles.dateText}>{fecha}</Text>
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
            {/* Details Section */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="clipboard-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Tipo de Proyecto</Text>
                  <Text style={styles.detailText}>{tipo}</Text>
                </View>
              </View>

              {direccion && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={20} color="#CE0E2D" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Dirección</Text>
                    <Text style={styles.detailText}>{direccion}</Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Voluntarios Necesarios</Text>
                  <Text style={styles.detailText}>{voluntarios}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name={vehicleIconName as any} size={20} color="#CE0E2D" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Tipo de Vehículo Requerido</Text>
                  <Text style={styles.detailText}>{carga}</Text>
                </View>
              </View>

              {productos.length > 0 && (
                <View style={styles.detailRow}>
                  <Ionicons name="basket-outline" size={20} color="#CE0E2D" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Productos</Text>
                    <Text style={styles.detailText}>
                      {productos.join(', ')}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Vehicle Availability Info */}
            <View style={styles.vehicleSection}>
              <View style={styles.vehicleHeader}>
                <Ionicons name="car-sport-outline" size={20} color="#CE0E2D" />
                <Text style={styles.vehicleTitle}>Vehículos Disponibles</Text>
              </View>
              {matchingVehicles.length > 0 ? (
                <View style={styles.vehicleInfo}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.vehicleAvailable}>
                    {matchingVehicles.length} vehículo{matchingVehicles.length > 1 ? 's' : ''} compatible{matchingVehicles.length > 1 ? 's' : ''}
                  </Text>
                </View>
              ) : (
                <View style={styles.vehicleInfo}>
                  <Ionicons name="alert-circle" size={18} color="#F59E0B" />
                  <Text style={styles.vehicleUnavailable}>
                    No tienes vehículos disponibles para esta solicitud
                  </Text>
                </View>
              )}
            </View>

            {/* Accept Button */}
            <TouchableOpacity
              style={[
                styles.acceptBtn,
                (isAccepting || matchingVehicles.length === 0) && styles.acceptBtnDisabled,
              ]}
              onPress={handleAccept}
              disabled={isAccepting || matchingVehicles.length === 0}
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.acceptText}>
                {isAccepting ? 'Aceptando...' : 'Aceptar Solicitud'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Solicitud recibida el {fecha}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un Vehículo</Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
                <Ionicons name="close-circle" size={28} color="#CE0E2D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {matchingVehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.plate}
                  style={styles.vehicleOption}
                  onPress={() => handleVehicleSelection(vehicle)}
                  activeOpacity={0.7}
                >
                  <View style={styles.vehicleOptionIcon}>
                    <Ionicons name="car" size={28} color="#CE0E2D" />
                  </View>
                  <View style={styles.vehicleOptionInfo}>
                    <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                    <Text style={styles.vehicleType}>
                      {getVehicleTypeLabel(vehicle.weightType ?? vehicle.loadType)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#888" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <Alert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
    </>
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
    marginBottom: 6,
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
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FEE',
  },
  dateText: {
    fontSize: 11,
    color: '#CE0E2D',
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
  detailsSection: {
    padding: 16,
    backgroundColor: '#fff',
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
  vehicleSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  vehicleAvailable: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
  vehicleUnavailable: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 8,
  },
  acceptBtn: {
    backgroundColor: '#CE0E2D',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  acceptBtnDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
  btnIcon: {
    marginRight: 8,
  },
  acceptText: {
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScroll: {
    padding: 16,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  vehicleOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleOptionInfo: {
    flex: 1,
  },
  vehiclePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 13,
    color: '#888',
  },
});

export default SolicitudCard;
