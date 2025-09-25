import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useUpdateUser } from '../../hooks/useUsers';
import { validateEmail, validatePhone } from '../../utils/validators';
import { normalizeEmail } from '../../utils/normalize';

const MyProfile = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(
    user?.phone !== undefined && user?.phone !== null ? String(user.phone) : ''
  );

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const { handleUpdateUser, loading } = useUpdateUser();

  // Estados para Alert personalizado
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPhone(
      user?.phone !== undefined && user?.phone !== null ? String(user.phone) : ''
    );
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    if (emailError || phoneError) {
      showAlert('Por favor corrige los errores antes de actualizar.', 'error');
      return;
    }
    const updatedUser = await handleUpdateUser(user.id, {
      name,
      email: normalizeEmail(email),
      phone: phone !== '' ? Number(phone) : undefined,
    });
    if (updatedUser) {
      setUser(updatedUser);
      showAlert('Perfil actualizado', 'success');
    } else {
      showAlert('Ocurrió un error al actualizar el perfil', 'error');
    }
  };

  return (
    <GeneralTemplate
      title="Mi perfil"
      onBackPress={() => navigation.goBack()}
    >
      <Alert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/1.jpg',
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editPhotoBtn}>
            <Ionicons name="camera" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombre completo</Text>
        <Input
          value={name}
          onChangeText={setName}
          editable
        />

        <Text style={styles.label}>Correo</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          editable
          validate={validateEmail}
          onValidationError={setEmailError}
        />

        <Text style={styles.label}>Número telefónico</Text>
        <Input
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable
          validate={validatePhone}
          onValidationError={setPhoneError}
        />

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.updateBtnText}>{loading ? "Actualizando..." : "Actualizar Perfil"}</Text>
        </TouchableOpacity>
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 16,
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative', // Necesario para posicionar el botón sobre la imagen
    width: 96,
    height: 96,
    alignSelf: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  editPhotoBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#CE0E2D',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    // Opcional: sombra para mejor visibilidad
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 15,
    color: '#5C5C60',
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#5C5C60',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 44,
  },
  updateBtn: {
    marginTop: 16,
    backgroundColor: '#CE0E2D',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default MyProfile;