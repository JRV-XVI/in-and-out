import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import VehicleCard from '../../components/specialCards/VehicleCard';
import Button from '../../components/common/Button';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../../components/common/Input';

import {
  getVehiclesByUser, // <-- importamos la función filtrada por usuario
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../../services/vehicles';
import { Vehicle } from '../../types/vehicle';
import { useUser } from '../../context/UserContext'; // <-- importamos el contexto

const tipos = ['Carga chica', 'Carga mediana', 'Carga grande'] as const;
type Tipo = typeof tipos[number];

const getTipoIcon = (tipo: string) => {
  if (tipo === 'Carga chica') return <MaterialCommunityIcons name="truck-outline" size={22} color="#CE0E2D" />;
  if (tipo === 'Carga mediana') return <MaterialCommunityIcons name="truck-cargo-container" size={22} color="#CE0E2D" />;
  if (tipo === 'Carga grande') return <MaterialCommunityIcons name="truck" size={22} color="#CE0E2D" />;
  return <Ionicons name="car-outline" size={22} color="#CE0E2D" />;
};

const mapTipoToLoadType = (tipo: Tipo) => {
  switch (tipo) {
    case 'Carga chica': return 1;
    case 'Carga mediana': return 2;
    case 'Carga grande': return 3;
    default: return 1;
  }
};

const MyVehicles = ({ navigation }: any) => {
  const { user } = useUser(); // <-- obtenemos el usuario logeado

  const [activeTab, setActiveTab] = useState('vehicles');
  const [query, setQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'list' | 'form'>('list');

  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [tipo, setTipo] = useState<Tipo>('Carga chica');
  const [tipoDropdown, setTipoDropdown] = useState(false);
  const [plate, setPlate] = useState('');
  const [plateError, setPlateError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(''); // campo de texto plano
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [user]); // <-- refetch cuando cambie el usuario

  const handleTabPress = (tab: string) => setActiveTab(tab);

  async function fetchVehicles() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getVehiclesByUser(user.id); // <-- filtramos por usuario

      console.log('🚗 [FETCH] Vehiculos obtenidos desde el servidor:', JSON.stringify(data, null, 2));
      console.log('👤 [FETCH] Usuario actual:', user);

      setVehiculos(data);
    } catch (err) {
      console.error('Error obteniendo vehículos:', err);
      Alert.alert('Error', 'No se pudo obtener la lista de vehículos.');
    } finally {
      setLoading(false);
    }
  }

  const validatePlate = (text: string) => {
    const regex = /^[A-Z]{3}-\d{3,4}[A-Z]?$/;
    if (!regex.test(text.trim().toUpperCase())) {
      return 'Formato de placa inválido. Ejemplo: KTJ-121A';
    }
    return null;
  };

  const handleRegistrar = async () => {
    if (!user) {
      Alert.alert('Error', 'No se encontró el usuario logeado.');
      return;
    }

    const normalizedPlate = plate.trim().toUpperCase();
    const plateValidation = validatePlate(normalizedPlate);
    setPlateError(plateValidation);
    if (!normalizedPlate || plateValidation) {
      Alert.alert('Error', 'Por favor ingresa una placa válida.');
      return;
    }

    setSaving(true);

    try {
      const mappedType = mapTipoToLoadType(tipo);
      const newVehicle: Omit<Vehicle, 'plate'> & { plate: string } = {
        plate: normalizedPlate,
        // Corregimos: el tipo seleccionado representa el tipo de peso.
        // Asignamos weightType correctamente y mantenemos loadType para no romper la UI actual.
        weightType: mappedType,
        loadType: mappedType,
        isAvailable: false,
        photo: photo || null,
      };

      console.log('📝 [CREATE] Vehículo a crear:', JSON.stringify(newVehicle));
      const created = await createVehicle(newVehicle as Vehicle, user.id); // <-- pasamos userId
      if (!created) {
        Alert.alert('Error', 'No se pudo crear el vehículo.');
        setSaving(false);
        return;
      }

      console.log('✅ [CREATE] Vehículo creado:', JSON.stringify(created));
      setVehiculos(prev => [created, ...prev]);
      setTipo('Carga chica');
      setPlate('');
      setPhoto('');
      setNotes('');
      setSelectedView('list');
      Alert.alert('Éxito', 'Vehículo registrado correctamente.');
    } catch (err) {
      console.error('Error registrando vehículo:', err);
      Alert.alert('Error', 'Ocurrió un problema al registrar el vehículo.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (item: Vehicle) => {
    const newValue = !item.isAvailable;
    setVehiculos(prev => prev.map(v => (v.plate === item.plate ? { ...v, isAvailable: newValue } : v)));

    try {
      const updated = await updateVehicle(item.plate, { isAvailable: newValue });
      if (!updated) throw new Error('No se actualizó en servidor');
      setVehiculos(prev => prev.map(v => (v.plate === item.plate ? updated : v)));
    } catch (err) {
      console.error('Error actualizando disponibilidad:', err);
      Alert.alert('Error', 'No se pudo actualizar la disponibilidad.');
      setVehiculos(prev => prev.map(v => (v.plate === item.plate ? { ...v, isAvailable: item.isAvailable } : v)));
    }
  };

  const handleDelete = async (plateVal: string) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este vehículo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const ok = await deleteVehicle(plateVal);
            if (!ok) throw new Error('No eliminado en servidor');
            setVehiculos(prev => prev.filter(v => v.plate !== plateVal));
            Alert.alert('Eliminado', 'Vehículo eliminado correctamente.');
          } catch (err) {
            console.error('Error eliminando vehículo:', err);
            Alert.alert('Error', 'No se pudo eliminar el vehículo.');
          }
        },
      },
    ]);
  };

  const filteredVehicles = vehiculos.filter(
    v =>
      (v.loadType ? tipos[v.loadType - 1] ?? '' : '').toLowerCase().includes(query.toLowerCase()) ||
      (v.plate ?? '').toLowerCase().includes(query.toLowerCase())
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
      sectionTitle={selectedView === 'list' ? 'Lista de Vehículos' : 'Nuevo Vehículo'}
    >
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
            <TouchableOpacity onPress={fetchVehicles} style={{ marginLeft: 8 }}>
              <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (

            <FlatList
              data={filteredVehicles}
              keyExtractor={(item) => item.plate}
              renderItem={({ item }) => (
                <VehicleCard
                  data={item}
                  onDelete={() => handleDelete(item.plate)}
                />
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </>
      ) : (
        <View style={styles.form}>
          <View style={styles.tipoRow}>
            <Text style={styles.cascadaLabel}>Tipo de vehículo</Text>
            <TouchableOpacity style={styles.tipoBtn} onPress={() => setTipoDropdown(v => !v)}>
              {getTipoIcon(tipo)}
              <Text style={styles.tipoBtnText}>{tipo}</Text>
              <Ionicons name={tipoDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#CE0E2D" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {tipoDropdown && (
              <View style={styles.dropdown}>
                {tipos.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionBtn, tipo === opt && styles.optionActive]}
                    onPress={() => {
                      setTipo(opt as Tipo);
                      setTipoDropdown(false);
                    }}
                  >
                    <Text style={[styles.optionText, tipo === opt && styles.optionTextActive]}>{opt}</Text>
                    {getTipoIcon(opt)}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Input
            label="Placa del vehículo"
            placeholder="Ejemplo: KTJ-121A"
            placeholderTextColor="#bbb"
            value={plate}
            onChangeText={(t) => {
              setPlate(t);
              setPlateError(validatePlate(t));
            }}
            autoCapitalize="characters"
            maxLength={8}
            keyboardType="default"
            returnKeyType="done"
            error={plateError ?? undefined}
          />

          <Input
            label="Foto (URL o descripción)"
            placeholder="Ejemplo: https://mi-foto.com/vehiculo.jpg"
            placeholderTextColor="#bbb"
            value={photo}
            onChangeText={setPhoto}
          />

          <Input
            label="Notas (opcional)"
            placeholder="Observaciones"
            placeholderTextColor="#bbb"
            value={notes}
            onChangeText={setNotes}
          />

          <Button title={saving ? 'Guardando...' : 'Registrar Vehículo'} onPress={handleRegistrar} />
        </View>
      )}
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
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
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 0, paddingHorizontal: 0, backgroundColor: 'transparent' },
  form: { flex: 1, justifyContent: 'center', padding: 16 },
  cascadaLabel: { color: '#5C5C60', fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  tipoRow: { marginBottom: 16, position: 'relative' },
  tipoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEDED', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  tipoBtnText: { color: '#5C5C60', fontSize: 16, fontWeight: 'bold', marginLeft: 8, flex: 1 },
  dropdown: { position: 'absolute', right: 0, top: 65, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, minWidth: 180, zIndex: 100 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  optionActive: { backgroundColor: '#F5F5F5' },
  optionText: { flex: 1, color: '#5C5C60', fontSize: 16 },
  optionTextActive: { color: '#CE0E2D', fontWeight: 'bold' },
});

export default MyVehicles;

