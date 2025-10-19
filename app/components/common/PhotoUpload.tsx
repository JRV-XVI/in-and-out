import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  onError?: (error: string) => void;
  label?: string;
  bucketName?: string;
  resetTrigger?: number; // Prop para resetear el componente
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotoUploaded, 
  onError,
  label = 'Evidencia (foto)',
  bucketName = 'evidences',
  resetTrigger = 0
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Resetear cuando cambie resetTrigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setImageUri(null);
      setUploading(false);
    }
  }, [resetTrigger]);

  // Solicitar permisos
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || galleryPermission.status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos permisos para acceder a la cámara y galería'
      );
      return false;
    }
    return true;
  };

  // Subir imagen a Supabase
  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    try {
      setUploading(true);

      // Generar nombre único para la imagen
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${timestamp}_${randomString}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('📤 Subiendo imagen a Supabase:', filePath);

      // Leer el archivo como base64 y convertir a ArrayBuffer
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      console.log('📦 Archivo convertido a ArrayBuffer, tamaño:', arrayBuffer.byteLength);

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Error subiendo imagen:', error);
        
        // Mensaje de error más específico
        let errorMessage = 'Error al subir la imagen';
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          errorMessage = 'Error de permisos: Configura las políticas de seguridad del bucket en Supabase';
          Alert.alert(
            'Error de Configuración',
            'El bucket necesita políticas de seguridad. Ve a Storage → evidences → Policies y habilita INSERT para usuarios autenticados.',
            [{ text: 'Entendido' }]
          );
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ Imagen subida exitosamente:', data);

      // Obtener URL pública
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      console.log('🔗 URL pública generada:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('Error en uploadImageToSupabase:', error);
      if (onError) {
        onError('Error al subir la imagen');
      }
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        // Subir a Supabase
        const publicUrl = await uploadImageToSupabase(uri);
        if (publicUrl) {
          onPhotoUploaded(publicUrl);
        }
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      if (onError) {
        onError('Error al tomar la foto');
      }
    }
  };

  // Elegir foto de la galería
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        // Subir a Supabase
        const publicUrl = await uploadImageToSupabase(uri);
        if (publicUrl) {
          onPhotoUploaded(publicUrl);
        }
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      if (onError) {
        onError('Error al seleccionar la imagen');
      }
    }
  };

  // Mostrar opciones
  const showOptions = () => {
    Alert.alert(
      'Seleccionar foto',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: takePhoto,
        },
        {
          text: 'Elegir de galería',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#CE0E2D" />
              <Text style={styles.uploadingText}>Subiendo...</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changeButton}
            onPress={showOptions}
            disabled={uploading}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.changeButtonText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={showOptions}
          disabled={uploading}
        >
          <Ionicons name="camera-outline" size={32} color="#fff" />
          <Text style={styles.uploadButtonText}>
            {uploading ? 'Subiendo...' : 'Tomar o elegir foto'}
          </Text>
          {uploading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#5C5C60',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
  },
  loader: {
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CE0E2D',
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PhotoUpload;
