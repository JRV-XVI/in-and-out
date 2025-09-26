import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import GeneralTemplate from '../../components/screens/GeneralTemplate';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useCreateUser } from '../../hooks/useUsers';

const userTypes = [
  { value: 1, label: "donante" },
  { value: 2, label: "responsable" },
] as const;


const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<number | null>(null);
  const { handleCreateUser, loading, error } = useCreateUser();

  const handleSignUp = async () => {
    if (!name || !email || !password || !phone || !userType) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    const newUser = await handleCreateUser({
      name,
      email,
      password,
      phone: Number(phone),
      userType
    });

    if (newUser) {
      Alert.alert("Éxito", "Usuario creado correctamente");
      console.log("New user");
      navigation.navigate('LaunchScreen' as never); // Change this to a real screen *IMPORTANT*
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <GeneralTemplate
      title="Crear Cuenta"
      onBackPress={() => navigation.goBack()}
    >
      <Input
        label="Nombre"
        value={name}
        onChangeText={setName}
        placeholder="Ingresa tu nombre"
        placeholderTextColor="#c0bbbbff"
        autoCapitalize="words"
      />
      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="Ingresa tu correo"
        placeholderTextColor="#c0bbbbff"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Ingresa tu contraseña"
        placeholderTextColor="#c0bbbbff"
        secureTextEntry
        autoCapitalize="none"
      />
      <Input
        label="Número de teléfono"
        value={phone}
        onChangeText={setPhone}
        placeholder="Ingresa tu número"
        placeholderTextColor="#c0bbbbff"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Tipo de usuario</Text>
      <View style={styles.userTypeContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.userTypeButton,
              userType === type.value && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType(type.value)}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === type.value && styles.userTypeTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Registrando..." : "Confirmar"}
          onPress={handleSignUp}
          style={styles.confirmButton}
        />
      </View>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#5C5C60',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  userTypeButtonActive: {
    backgroundColor: '#fff',
  },
  userTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  userTypeTextActive: {
    color: '#5C5C60',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  confirmButton: {
    width: '65%',
  },
});

export default SignUp;
