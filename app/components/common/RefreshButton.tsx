import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void; // Función que se ejecuta al presionar el botón
  size?: number; // Tamaño del ícono
  color?: string; // Color del ícono
  style?: ViewStyle; // Estilos personalizados para el contenedor
  disabled?: boolean; // Deshabilitar el botón
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  size = 24,
  color = '#CE0E2D',
  style,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || disabled) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        (isRefreshing || disabled) && styles.buttonDisabled,
      ]}
      onPress={handleRefresh}
      disabled={isRefreshing || disabled}
      activeOpacity={0.7}
    >
      {isRefreshing ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name="refresh" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default RefreshButton;
