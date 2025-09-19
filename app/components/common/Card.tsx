import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CardType = 'completados' | 'pendientes' | 'rechazado';

interface CardProps {
  title: string;
  count: number;
  type: CardType;
  style?: object;
}

const size_ = 44;

const Card = ({ title, count, type, style }: CardProps) => {
  // Icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'completados':
        return <MaterialIcons name="check" size={size_} color="#28a745" />;
      case 'pendientes':
        return <MaterialIcons name="refresh" size={size_} color="#ff9800" />;
      case 'rechazado':
        return <MaterialIcons name="close" size={size_} color="#f44336" />;
      default:
        return <MaterialIcons name="help-outline" size={size_} color="#9e9e9e" />;
    }
  };

  // Color de borde según tipo
  const getBorderColor = () => {
    switch (type) {
      case 'completados':
        return '#28a745'; // verde
      case 'pendientes':
        return '#ff9800'; // naranja
      case 'rechazado':
        return '#f44336'; // rojo
      default:
        return '#9e9e9e';
    }
  };

  return (
    <View style={[styles.card, { borderColor: getBorderColor() }, style]}>
      <View style={[styles.iconCircle, { borderColor: getBorderColor() }]}>
        {getIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 5,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
  },
});

export default Card;