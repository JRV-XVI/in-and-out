import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: object;
};

const Button = ({ title, onPress, style }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#CE0E2D',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Button;