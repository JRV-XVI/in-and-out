import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import VehicleCard from '../../components/specialCards/VehicleCard';
import Button from '../../components/common/Button';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../../components/common/Input'; // Asegúrate de tener este componente

const vehiculosBase = [
  { id: '1', tipo: 'Carga grande', placa: 'KTJ-121A', estado: true },
  { id: '2', tipo: 'Carga chica', placa: 'POW-280P', estado: false },
  { id: '3', tipo: 'Carga mediana', placa: 'KTM-125A', estado: true },
  { id: '4', tipo: 'Carga grande', placa: 'JAQ-42JT', estado: false },
];

const tipos = ['Carga chica', 'Carga mediana', 'Carga grande'];

const getTipoIcon = (tipo: string) => {
  if (tipo === 'Carga chica') return <MaterialCommunityIcons name="truck-outline" size={22} color="#CE0E2D" />;
  if (tipo === 'Carga mediana') return <MaterialCommunityIcons name="truck-cargo-container" size={22} color="#CE0E2D" />;
  if (tipo === 'Carga grande') return <MaterialCommunityIcons name="truck" size={22} color="#CE0E2D" />;
  return <Ionicons name="car-outline" size={22} color="#CE0E2D" />;
};

const MyVehicles = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('none'); // Cambia 'home' por 'none'
  // Cambia searchText a query para igualar el Search.tsx
  const [query, setQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'list' | 'form'>('list');
  const [vehiculos, setVehiculos] = useState(vehiculosBase);
  const [tipo, setTipo] = useState<'Carga chica' | 'Carga mediana' | 'Carga grande'>('Carga chica');
  const [tipoDropdown, setTipoDropdown] = useState(false);
  const [placa, setPlaca] = useState('');
  const [placaError, setPlacaError] = useState<string | null>(null);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab === 'home' ? 'none' : tab); // Si es 'home', pon 'none'
  };

  const handleRegistrar = () => {
    if (placa.trim() === '' || placaError) {
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

  // Actualiza el filtro para usar query
  const filteredVehicles = vehiculos.filter(
    (vehiculo) =>
      vehiculo.tipo.toLowerCase().includes(query.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(query.toLowerCase())
  );

  const onBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  // Dropdown tipo selector estilo Filter
  const TipoDropdown = () => (
    <View style={styles.tipoRow}>
      <Text style={styles.cascadaLabel}>Tipo de vehículo</Text>
      <TouchableOpacity
        style={styles.tipoBtn}
        onPress={() => setTipoDropdown(v => !v)}
      >
        {getTipoIcon(tipo)}
        <Text style={styles.tipoBtnText}>{tipo}</Text>
        <Ionicons
          name={tipoDropdown ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#CE0E2D"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>
      {tipoDropdown && (
        <View style={styles.dropdown}>
          {tipos.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionBtn,
                tipo === opt && styles.optionActive,
              ]}
              onPress={() => {
                setTipo(opt as typeof tipo);
                setTipoDropdown(false);
              }}
            >
              <Text style={[
                styles.optionText,
                tipo === opt && styles.optionTextActive,
              ]}>
                {opt}
              </Text>
              {getTipoIcon(opt)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // Validación de placa
  const validatePlaca = (text: string) => {
    // Ejemplo: formato AAA-123A (7 u 8 caracteres, letras y números)
    const regex = /^[A-Z]{3}-\d{3,4}[A-Z]?$/;
    if (!regex.test(text.trim().toUpperCase())) {
      return 'Formato de placa inválido. Ejemplo: KTJ-121A';
    }
    return null;
  };

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
      {/* Botón para regresar */}
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" style={styles.backIcon} size={28} />
      </TouchableOpacity>

      {selectedView === 'list' ? (
        <>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={22} color="#fff" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Busca en tu vehículo"
              placeholderTextColor="#ddd"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VehicleCard data={item} onDelete={() => {}} /> // <-- Añade onDelete
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </>
      ) : (
        <View style={styles.form}>
          <TipoDropdown />
          <Input
            label="Placa del vehículo"
            placeholder="Ejemplo: KTJ-121A"
            placeholderTextColor="#bbb"
            value={placa}
            onChangeText={setPlaca}
            autoCapitalize="characters"
            maxLength={8}
            keyboardType="default"
            returnKeyType="done"
            validate={validatePlaca}
            error={placaError || undefined}
            onValidationError={setPlacaError}
          />
          <Button title="Registrar Vehículo" onPress={handleRegistrar} />
        </View>
      )}
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  backIcon: {
    color: '#CE0E2D',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C5C60',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  form: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  cascadaLabel: {
    color: '#5C5C60',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  tipoRow: {
    marginBottom: 16,
    position: 'relative',
  },
  tipoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tipoBtnText: {
    color: '#5C5C60',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    right: 0, 
    top: 65,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 180,
    zIndex: 100,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    flex: 1,
    color: '#5C5C60',
    fontSize: 16,
  },
  optionTextActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
});

export default MyVehicles;