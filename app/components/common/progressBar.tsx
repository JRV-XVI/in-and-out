import React from 'react';
import { View, StyleSheet } from 'react-native';

type ProgressBarProps = {
  total: number;         // Total de pasos
  activeIndex: number;   // Índice del paso activo (comienza en 0)
};

const ProgressBar = ({ total, activeIndex }: ProgressBarProps) => {
  return (
    <View style={styles.progressBar}>
      {Array.from({ length: total }).map((_, idx) => (
        <View
          key={idx}
          style={idx === activeIndex ? styles.progressDotActive : styles.progressDot}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5C5C60',
    marginHorizontal: 2,
  },
  progressDotActive: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CE0E2D',
    marginHorizontal: 2,
  },
});

export default ProgressBar;