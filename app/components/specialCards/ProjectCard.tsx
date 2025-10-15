import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Token from '../common/Token';
import Button from '../common/Button';

interface ProjectCardProps {
  type: 'entrada' | 'salida';
  date: string;
  donors: number;
  vehicleType: string;
  address: string;
  donorName: string;
  products: string[];
  status: 'confirmacion' | 'en_recoleccion' | 'recolectado' | 'finalizado';
  tokens: number[];
  onStart?: () => void;
}

const statusLabels = {
  confirmacion: 'Confirmación',
  en_recoleccion: 'En recolección',
  recolectado: 'Recolectado',
  finalizado: 'Finalizado',
};

const statusOrder = ['confirmacion', 'en_recoleccion', 'recolectado', 'finalizado'];

const ProjectCard: React.FC<ProjectCardProps> = ({
  type,
  date,
  donors,
  vehicleType,
  address,
  donorName,
  products,
  status,
  tokens,
  onStart,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tokenInput, setTokenInput] = useState(""); // Estado para el input de token
  const isEntrada = type === 'entrada';
  const currentStatusIndex = statusOrder.indexOf(status);

  const iconName = isEntrada ? 'arrow-down-circle' : 'arrow-up-circle';
  const iconColor = isEntrada ? '#CE0E2D' : '#5C5C60';
  const activeColor = isEntrada ? '#CE0E2D' : '#5C5C60';

  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardActive, expanded && { borderColor: activeColor }]}
      activeOpacity={0.95}
      onPress={() => setExpanded((v) => !v)}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            Proyecto {isEntrada ? 'Entrada' : 'Salida'}
          </Text>
          <View style={[styles.dateBadge, { backgroundColor: activeColor }]}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { borderColor: activeColor }]}>
            <Ionicons 
              name={iconName} 
              size={42} 
              color={expanded ? activeColor : '#888'} 
            />
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLine}>
              <Text style={styles.label}>Destinos</Text>
              <Text style={styles.separator}>————</Text>
              <Text style={styles.value}>{donors} donadores</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.label}>Vehiculo</Text>
              <Text style={styles.separator}>————</Text>
              <Text style={styles.value}>{vehicleType}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedBox}>
          {/* Status Progress Bar */}
          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Estatus de Viaje</Text>
            <View style={styles.statusRow}>
              {statusOrder.map((statusKey, idx) => (
                <View key={statusKey} style={styles.statusItem}>
                  <View
                    style={[
                      styles.statusDot,
                      idx <= currentStatusIndex && [
                        styles.statusDotActive,
                        { backgroundColor: activeColor },
                      ],
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      idx === currentStatusIndex && [
                        styles.statusLabelActive,
                        { color: activeColor },
                      ],
                    ]}
                  >
                    {statusLabels[statusKey as keyof typeof statusLabels]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dirección:</Text>
              <Text style={styles.detailText}>{address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donador:</Text>
              <Text style={styles.detailText}>{donorName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Productos:</Text>
              <Text style={styles.detailText}>{products.join(', ')}</Text>
            </View>
          </View>

          {/* Token Section */}
          <View style={styles.tokenSection}>
            <Text style={styles.sectionTitle}>Token</Text>
            <View style={styles.tokenRow}>
              <Token value={tokenInput} onChange={setTokenInput} />
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: activeColor }]}
            onPress={onStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 12,
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
  cardActive: {
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C5C60',
  },
  dateBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 16,
  },
  infoRow: {
    flex: 1,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    color: '#D0D0D0',
    fontSize: 10,
    marginHorizontal: 6,
  },
  value: {
    color: '#5C5C60',
    fontSize: 14,
    fontWeight: '500',
  },
  expandedBox: {
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C5C60',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D0D0D0',
    marginBottom: 4,
  },
  statusDotActive: {
    elevation: 2,
  },
  statusLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  statusLabelActive: {
    fontWeight: 'bold',
  },
  details: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C5C60',
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#5C5C60',
    flex: 1,
  },
  tokenSection: {
    marginBottom: 12,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  startBtn: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProjectCard;