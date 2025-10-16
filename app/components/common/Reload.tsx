import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReloadProps {
  error: string;
  onReload: () => void;
}

const Reload: React.FC<ReloadProps> = ({ error, onReload }) => (
  <View style={styles.errorContainer}>
    <Ionicons name="alert-circle-outline" size={48} color="#fff" />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={onReload} style={styles.retryButton}>
      <Text style={styles.retryText}>Reintentar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#CE0E2D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reload;