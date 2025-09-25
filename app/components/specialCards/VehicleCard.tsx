import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VehicleCard({ data }) {
  return (
    <View style={styles.card}>
      <Ionicons name="alert-circle" size={30} color="#d32f2f" />

      <View style={styles.info}>
        <Text style={styles.label}>Tipo de Vehículo</Text>
        <Text style={styles.value}>{data.tipo}</Text>

        <Text style={styles.label}>Placa</Text>
        <Text style={styles.value}>{data.placa}</Text>

        <Text style={styles.label}>Estado</Text>
        <Switch value={data.estado} />
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  info: { flex: 1, marginLeft: 10 },
  label: { fontSize: 12, color: "gray" },
  value: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  btn: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
});
