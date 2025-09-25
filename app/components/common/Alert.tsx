import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Button from './Button'; // Ajusta la ruta si es necesario

type AlertProps = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ visible, message, type = 'info', onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, styles[type]]}>
          <Text style={styles.message}>{message}</Text>
          <Button
            title="Cerrar"
            onPress={onClose}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    minWidth: 240,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#5C5C60',
  },
  error: {
    backgroundColor: '#5C5C60',
  },
  info: {
    backgroundColor: '#5C5C60',
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#CE0E2D',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Alert;