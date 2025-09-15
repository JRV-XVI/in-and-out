import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: object;
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => (
  <View style={[styles.container, containerStyle]}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={styles.input}
      placeholderTextColor="#fff"
      {...props}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

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
  input: {
    backgroundColor: '#5C5C60',
    color: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  error: {
    color: '#CE0E2D',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;