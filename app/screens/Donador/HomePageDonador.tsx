import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert as RNAlert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import HomePageTemplate from '../../components/screens/HomePageTemplate';
import DonationCard from '../../components/specialCards/DonationCard';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { createProject, getProjectByDonador } from '../../services/projects';
import { useAuthContext } from '../../context/AuthContext';
import { Project } from '../../types/project';

interface Articulo {
  id: string;
  nombre: string;
  peso: string;
}

const HomePageDonador = () => {
  const { authUser, userProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedView, setSelectedView] = useState<'estadisticas' | 'misDonaciones' | 'registrarDonaciones'>('estadisticas');

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [pesoTotal, setPesoTotal] = useState('');
  const [articulos, setArticulos] = useState<Articulo[]>([{ id: '1', nombre: '', peso: '' }]);
  const [tipoCarga, setTipoCarga] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [notas, setNotas] = useState('');
  const [direccion, setDireccion] = useState('');
  const [evidencia, setEvidencia] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para mis donaciones
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Debug: Verificar userProfile
  useEffect(() => {
    console.log('=== DEBUG USER PROFILE ===');
    console.log('userProfile:', userProfile);
    console.log('userProfile?.id (ID numérico):', userProfile?.id);
    console.log('authUser?.id (UUID):', authUser?.id);
  }, [userProfile, authUser]);

  // Cargar proyectos del donador cuando cambie la vista a "misDonaciones"
  useEffect(() => {
    if (selectedView === 'misDonaciones' && userProfile?.id) {
      console.log('Cargando proyectos para userProfile.id:', userProfile.id);
      loadMyProjects();
    }
  }, [selectedView, userProfile?.id]);

  const loadMyProjects = async () => {
    if (!userProfile?.id) {
      console.log('No hay userProfile.id disponible');
      return;
    }

    console.log('Buscando proyectos con creator_id:', userProfile.id);
    setLoadingProjects(true);
    try {
      // Convertir el ID numérico a string para la búsqueda
      const projects = await getProjectByDonador(userProfile.id.toString());
      console.log('Proyectos encontrados:', projects);
      setMyProjects(projects);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      setAlertMessage('Error al cargar tus donaciones');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);

    if (tab == 'home') {
      setSelectedView('estadisticas');
    }
  };

  const agregarArticulo = () => {
    const newId = (articulos.length + 1).toString();
    setArticulos([...articulos, { id: newId, nombre: '', peso: '' }]);
  };

  const eliminarArticulo = (id: string) => {
    if (articulos.length > 1) {
      setArticulos(articulos.filter(articulo => articulo.id !== id));
    }
  };

  const actualizarArticulo = (id: string, campo: 'nombre' | 'peso', valor: string) => {
    setArticulos(articulos.map(articulo => 
      articulo.id === id ? { ...articulo, [campo]: valor } : articulo
    ));
  };

  const seleccionarEvidencia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEvidencia(result.assets[0]);
        setAlertMessage('Archivo cargado correctamente');
        setAlertType('success');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Error al cargar el archivo');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const validarFormulario = () => {
    if (!titulo.trim()) {
      setAlertMessage('El título es obligatorio');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    if (!pesoTotal || parseFloat(pesoTotal) <= 0) {
      setAlertMessage('El peso total debe ser mayor a 0');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    const articulosValidos = articulos.every(art => art.nombre.trim() && art.peso && parseFloat(art.peso) > 0);
    if (!articulosValidos) {
      setAlertMessage('Todos los artículos deben tener nombre y peso válido');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    if (!tipoCarga) {
      setAlertMessage('Debe seleccionar un tipo de carga');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    if (fechaExpiracion) {
      const fechaSeleccionada = new Date(fechaExpiracion);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        setAlertMessage('La fecha de expiración debe ser posterior a hoy');
        setAlertType('error');
        setShowAlert(true);
        return false;
      }
    }

    if (!direccion.trim()) {
      setAlertMessage('La dirección es obligatoria');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    if (!evidencia) {
      setAlertMessage('Debe subir al menos un archivo de evidencia');
      setAlertType('error');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleEnviar = () => {
    // Debug: Ver los IDs disponibles
    console.log('=== DEBUG EN ENVIAR ===');
    console.log('userProfile?.id (ID numérico):', userProfile?.id);
    console.log('authUser?.id (UUID):', authUser?.id);
    
    if (!validarFormulario()) return;

    // Convertir la lista de artículos en un JSON
    const articulosJSON = articulos.reduce<Record<string, { nombre: string; peso: string }>>((acc, articulo, index) => {
      acc[`articulo_${index + 1}`] = {
        nombre: articulo.nombre,
        peso: articulo.peso,
      };
      return acc;
    }, {});

    RNAlert.alert(
      'Confirmar envío',
      '¿Deseas enviar la donación?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Enviar',
          onPress: async () => {
            setIsLoading(true);
            
            try {
              // Mapear tipo de carga a número
              const loadTypeMap: Record<string, number> = {
                'Normal': 1,
                'Delicado': 2,
                'Frío': 3
              };

              // Crear el objeto del proyecto para Supabase
              const projectData = {
                title: titulo,
                weight: parseFloat(pesoTotal),
                foodList: articulosJSON, // JSON con la lista de artículos
                loadType: loadTypeMap[tipoCarga] || 1,
                expirationDate: fechaExpiracion || null,
                notes: notas || null,
                direction: direccion,
                photo: evidencia?.uri || null,
                projectType: 1, // 1 para donación
                projectState: 1, // No confirmado
                creator_id: userProfile?.id?.toString() || null, // ID numérico de la tabla users
              };

              console.log('Datos a enviar:', projectData);

              // Guardar en Supabase
              const result = await createProject(projectData);

              if (result) {
                console.log('Donación creada exitosamente:', result);
                setAlertMessage('Donación registrada exitosamente');
                setAlertType('success');
                setShowAlert(true);

                // Limpiar formulario
                limpiarFormulario();

                // Recargar los proyectos
                if (userProfile?.id) {
                  loadMyProjects();
                }
              } else {
                setAlertMessage('Error al registrar la donación');
                setAlertType('error');
                setShowAlert(true);
              }
            } catch (error) {
              console.error('Error al enviar donación:', error);
              setAlertMessage('Error al registrar la donación');
              setAlertType('error');
              setShowAlert(true);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setPesoTotal('');
    setArticulos([{ id: '1', nombre: '', peso: '' }]);
    setTipoCarga('');
    setFechaExpiracion('');
    setNotas('');
    setDireccion('');
    setEvidencia(null);
  };

  return (
    <HomePageTemplate
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onPrimaryAction={() => setSelectedView('misDonaciones')}
      onSecondaryAction={() => setSelectedView('registrarDonaciones')}
      primaryButtonText="Mis Donaciones"
      secondaryButtonText="Registrar Donaciones"
      sectionTitle={
        selectedView === 'estadisticas' ? 'Estadisticas Generales' 
        : selectedView === 'misDonaciones' ? 'Mis Donaciones'
        : 'Registrar Donaciones'
      }
    >
      {selectedView === 'estadisticas' && (
        <>
        <Card 
          title = "Donaciones completadas"
          count = {0}
          type = "completados"
        />

        <Card 
          title = "Donaciones pendientes"
          count = {0}
          type = "pendientes"
        />

        <Card 
          title = "Donaciones rechazadas"
          count = {0}
          type = "rechazado"
        />
        </>
      )}

      {selectedView === 'misDonaciones' && (
        <ScrollView style={styles.donationsContainer} showsVerticalScrollIndicator={true}>
          {loadingProjects ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#CE0E2D" />
              <Text style={styles.loadingText}>Cargando tus donaciones...</Text>
            </View>
          ) : myProjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={80} color="#D0D0D0" />
              <Text style={styles.emptyTitle}>No tienes donaciones</Text>
              <Text style={styles.emptySubtitle}>
                Tus donaciones aparecerán aquí una vez que las registres
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setSelectedView('registrarDonaciones')}
              >
                <Text style={styles.emptyButtonText}>Registrar Donación</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myProjects.map((project) => (
              <DonationCard
                key={project.id}
                project={project}
                onPress={() => {
                  console.log('Donación seleccionada:', project.id);
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {selectedView === 'registrarDonaciones' && (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={true}>
          <View style={styles.formContent}>
            {/* Título de donación */}
            <Input
              label="Título de donación"
              placeholder="Ej. Donación de arroz y frijol"
              value={titulo}
              onChangeText={setTitulo}
            />

            {/* Peso total */}
            <Input
              label="Peso total (kg)"
              placeholder="0.0"
              keyboardType="decimal-pad"
              value={pesoTotal}
              onChangeText={setPesoTotal}
            />

            {/* Lista de artículos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lista de artículos</Text>
              {articulos.map((articulo, index) => (
                <View key={articulo.id} style={styles.articuloContainer}>
                  <View style={styles.articuloHeader}>
                    <Text style={styles.articuloLabel}>Artículo {index + 1}</Text>
                    {articulos.length > 1 && (
                      <TouchableOpacity 
                        onPress={() => eliminarArticulo(articulo.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#CE0E2D" />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <Input
                    placeholder="Nombre del artículo"
                    value={articulo.nombre}
                    onChangeText={(valor) => actualizarArticulo(articulo.id, 'nombre', valor)}
                    containerStyle={styles.articuloInput}
                  />
                  
                  <Input
                    placeholder="Peso (kg)"
                    keyboardType="decimal-pad"
                    value={articulo.peso}
                    onChangeText={(valor) => actualizarArticulo(articulo.id, 'peso', valor)}
                    containerStyle={styles.articuloInput}
                  />
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={agregarArticulo}
              >
                <Ionicons name="add-circle-outline" size={24} color="#CE0E2D" />
                <Text style={styles.addButtonText}>Agregar otro artículo</Text>
              </TouchableOpacity>
            </View>

            {/* Tipo de carga */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de carga</Text>
              <View style={styles.optionsContainer}>
                {['Normal', 'Delicado', 'Frío'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.optionButton,
                      tipoCarga === tipo && styles.optionButtonSelected
                    ]}
                    onPress={() => setTipoCarga(tipo)}
                  >
                    <Text style={[
                      styles.optionText,
                      tipoCarga === tipo && styles.optionTextSelected
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fecha de expiración */}
            <Input
              label="Fecha de expiración (opcional)"
              placeholder="AAAA-MM-DD"
              value={fechaExpiracion}
              onChangeText={setFechaExpiracion}
            />

            {/* Notas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notas (opcional)</Text>
              <View style={styles.textAreaContainer}>
                <Input
                  placeholder="Información adicional sobre la donación..."
                  value={notas}
                  onChangeText={setNotas}
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>

            {/* Dirección */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección</Text>
              <View style={styles.textAreaContainer}>
                <Input
                  placeholder="Calle, número, colonia, ciudad..."
                  value={direccion}
                  onChangeText={setDireccion}
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>

            {/* Evidencia */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evidencia (imagen o PDF)</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={seleccionarEvidencia}
              >
                <Ionicons name="cloud-upload-outline" size={32} color="#fff" />
                <Text style={styles.uploadButtonText}>
                  {evidencia ? evidencia.name : 'Seleccionar archivo'}
                </Text>
                {evidencia && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            </View>

            {/* Botón enviar */}
            <Button
              title={isLoading ? "Enviando..." : "Enviar"}
              onPress={handleEnviar}
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            />
          </View>
        </ScrollView>
      )}
      
      {/* Alert Component */}
      <Alert
        visible={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={() => setShowAlert(false)}
      />
    </HomePageTemplate>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%',
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  articuloContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  articuloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articuloLabel: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
  articuloInput: {
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CE0E2D',
    borderStyle: 'dashed',
    padding: 16,
    marginTop: 8,
  },
  addButtonText: {
    color: '#CE0E2D',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#5C5C60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#CE0E2D',
    borderColor: '#CE0E2D',
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
  textAreaContainer: {
    backgroundColor: '#5C5C60',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#5C5C60',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#CE0E2D',
    marginTop: 24,
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  // Estilos para "Mis Donaciones"
  donationsContainer: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5C5C60',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C5C60',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#CE0E2D',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    elevation: 2,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePageDonador;
