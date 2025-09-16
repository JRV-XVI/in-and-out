import React from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useDogs } from "../hooks/useDogs";

export default function TestDogs() {
  const { dogs, loading } = useDogs();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando perritos...</Text>
      </View>
    );
  }

  if (dogs.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay perritos en la base de datos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.race}>{item.race}</Text>
            <Text style={styles.age}>Edad: {item.age}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  race: {
    fontSize: 16,
    color: "#555",
  },
  age: {
    fontSize: 14,
    color: "#777",
  },
});
