import React, { useState } from 'react';
import { FlatList, TextInput, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // 👈 Necesitas instalar este paquete
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import VehicleCard from '../../components/specialCards/VehicleCard';
import Button from '../../components/common/Button'; // 👈 Usamos tu botón

const vehiculosBase = [
  { id: '1', tipo: 'Carga grande', placa: 'KTJ-121A', estado: true },
  { id: '2', tipo: 'Carga chica', placa: 'POW-280P', estado: false },
  { id: '3', tipo: 'Carga mediana', placa: 'KTM-125A', estado: true },
  { id: '4', tipo: 'Carga grande', placa: 'JAQ-42JT', estado: false },
];

const MyVehicles = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');
  const [selectedView, setSelectedView] = useState<'list' | 'form'>('list');
  const [vehiculos, setVehiculos] = useState(vehiculosBase);

  // formulario
  const [tipo, setTipo] = useState<'Carga chica' | 'Carga mediana' | 'Carga grande'>('Carga chica');
  const [placa, setPlaca] = useState('');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleRegistrar = () => {
    if (placa.trim() === '') {
      alert('Por favor ingresa una placa válida.');
      return;
    }

    const nuevoVehiculo = {
      id: (vehiculos.length + 1).toString(),
      tipo,
      placa,
      estado: true,
    };
    setVehiculos([nuevoVehiculo, ...vehiculos]);
    setTipo('Carga chica');
    setPlaca('');
    setSelectedView('list');
  };

  const filteredVehicles = vehiculos.filter(
    (vehiculo) =>
      vehiculo.tipo.toLowerCase().includes(searchText.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('list')}
      onSecondaryAction={() => setSelectedView('form')}
      headerTitle="Mis Vehículos"
      primaryButtonText="Registrados"
      secondaryButtonText="Registrar"
      sectionTitle={selectedView === 'list' ? "Lista de Vehículos" : "Nuevo Vehículo"}
    >
      {selectedView === 'list' ? (
        <>
          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por tipo o placa..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Lista de vehículos */}
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VehicleCard data={item} />}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </>
      ) : (
        <View style={styles.form}>
          {/* Picker para tipo de vehículo */}
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Carga chica" value="Carga chica" />
            <Picker.Item label="Carga mediana" value="Carga mediana" />
            <Picker.Item label="Carga grande" value="Carga grande" />
          </Picker>

          {/* Input para placa */}
          <TextInput
            style={styles.input}
            placeholder="Placa"
            value={placa}
            onChangeText={setPlaca}
          />

          {/* Botón personalizado */}
          <Button title="Registrar Vehículo" onPress={handleRegistrar} />
        </View>
      )}
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  form: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});

export default MyVehicles;
