import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: object;
};

const Button: React.FC<ButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#CE0E2D',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    width: '75%',
    marginBottom: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;