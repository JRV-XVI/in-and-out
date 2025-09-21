import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import VehicleCard from "../../components/specialCards/VehicleCard";

const vehiculos = [
  { id: "1", tipo: "Carga pesada", placa: "KTJ-121A", estado: true },
  { id: "2", tipo: "Carga chica", placa: "POW-280P", estado: false },
  { id: "3", tipo: "Carga mediana", placa: "KTM-125A", estado: true },
  { id: "4", tipo: "Carga pesada", placa: "JAQ-42JT", estado: false },
];

export default function MyVehicles() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Vehículos</Text>

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
