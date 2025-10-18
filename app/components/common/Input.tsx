import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: object;
  validate?: (value: string) => string | null; 
  onValidationError?: (error: string | null) => void; 
};

const Input = ({
  label,
  error,
  containerStyle,
  secureTextEntry,
  validate,
  onValidationError,
  onChangeText,
  value,
  ...props
}: InputProps) => {
  const [secure, setSecure] = useState(!!secureTextEntry);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleChangeText = (text: string) => {
    if (validate) {
      const validationError = validate(text);
      setInternalError(validationError);
      if (onValidationError) onValidationError(validationError);
    }
    if (onChangeText) onChangeText(text);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#fff"
          secureTextEntry={secure}
          value={value}
          onChangeText={handleChangeText}
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
      {(error || internalError) && <Text style={styles.error}>{error || internalError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
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
    color: '#FFFFFF', // Texto en blanco
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