import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function VehicleCard({ data, onDelete }) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.placa}>{data.placa}</Text>
        <MaterialIcons name="directions-car" size={18} color="#777" />
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Ionicons
          name="car-outline"
          size={36}
          color="#C8102E"
          style={{ marginRight: 10 }}
        />

        <View style={styles.info}>
          <Text><Text style={styles.bold}>Tipo: </Text>{data.tipo}</Text>
          <View style={styles.estadoRow}>
            <Text style={styles.bold}>Estado: </Text>
            <Switch value={data.estado} disabled style={styles.estadoSwitch} />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    alignItems: 'center',
  },
  placa: { color: '#C8102E', fontWeight: 'bold', fontSize: 16 },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  bold: { fontWeight: 'bold' },
  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  estadoSwitch: {
    marginLeft: 8,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  deleteBtn: {
    backgroundColor: '#C8102E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});