import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: object;
};

const Input = ({
  label,
  error,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) => {
  const [secure, setSecure] = useState(!!secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          secureTextEntry={secure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setSecure(!secure)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  label: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#5C5C60',
    color: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    paddingRight: 40, // Espacio para el icono
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  error: {
    color: '#CE0E2D',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;