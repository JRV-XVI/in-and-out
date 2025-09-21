import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface SolicitudCardProps {
  fecha: string;
  tipo: string;
  carga: string;
  voluntarios: string;
  proyecto: string;
  onAccept?: () => void;
}

const SolicitudCard: React.FC<SolicitudCardProps> = ({
  fecha,
  tipo,
  carga,
  voluntarios,
  proyecto,
  onAccept,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{fecha}</Text>
        <MaterialIcons name="info-outline" size={16} color="#777" />
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Ionicons
          name="alert-circle-outline"
          size={36}
          color="red"
          style={{ marginRight: 10 }}
        />

        <View style={{ flex: 1 }}>
          <Text><Text style={styles.bold}>Tipo: </Text>{tipo}</Text>
          <Text><Text style={styles.bold}>Carga: </Text>{carga}</Text>
          <Text><Text style={styles.bold}>Voluntarios: </Text>{voluntarios}</Text>
          <Text><Text style={styles.bold}>Proyecto: </Text>{proyecto}</Text>
        </View>

        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
          <Text style={styles.acceptText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: { color: '#C8102E', fontWeight: 'bold' },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  bold: { fontWeight: 'bold' },
  acceptBtn: {
    backgroundColor: '#C8102E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  acceptText: { color: '#fff', fontWeight: 'bold' },
});

export default SolicitudCard;
