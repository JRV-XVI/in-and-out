import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { updateVehicle } from '../../services/vehicles';

export default function VehicleCard({ data, onDelete }) {
  const [isAvailable, setIsAvailable] = useState(!!data.isAvailable);

  // Funcion para manejar el cambio del Switch
  const handleToggleAvailability = async () => {
    const newValue = !isAvailable;
    setIsAvailable(newValue); // Actualiza visualmente primero

    try {
      const updated = await updateVehicle(data.plate, { isAvailable: newValue });
      if (!updated) {
        throw new Error('No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('Error al actualizar disponibilidad:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del vehículo.');
      setIsAvailable(!newValue); // Revertir cambio si fallo
    }
  };

  return (
    <View style={styles.card}>
      {/* Encabezado */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="directions-car" size={22} color="#C8102E" style={{ marginRight: 6 }} />
          <Text style={styles.placa}>{data.plate}</Text>
        </View>
      </View>

      {/* Cuerpo */}
      <View style={styles.cardBody}>
        <View style={styles.info}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Tipo de carga: </Text>
            {data.loadType}
          </Text>

          <View style={styles.estadoRow}>
            <Text style={styles.bold}>Disponible:</Text>
            <Switch
              value={isAvailable}
              onValueChange={handleToggleAvailability}
              style={styles.estadoSwitch}
              trackColor={{ false: '#ccc', true: '#C8102E' }}
              thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
            />
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
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placa: {
    color: '#C8102E',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
