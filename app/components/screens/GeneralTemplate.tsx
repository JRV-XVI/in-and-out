import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GeneralTemplateProps {
  title: string;
  children: ReactNode;
  onBackPress?: () => void; // Opcional, para manejar el evento de regresar
}

const GeneralTemplate = ({ title, children, onBackPress }: GeneralTemplateProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header rojo con título y botón de regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {/* Carta blanca */}
      <View style={styles.card}>
        {children}
      </View>
      {/* Fondo rojo inferior */}
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D81F32', // Rojo principal
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#D81F32',
    paddingTop: 100,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 40,
    zIndex: 2,
    padding: 8,
  },
  backIcon: {
    color: '#fff',
    paddingTop: 55,
    paddingLeft: 5,
    fontSize: 28,
    fontWeight: '900',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginHorizontal: 0,
    marginTop: 50, // Baja la carta blanca
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  footer: {
    height: 70,
    backgroundColor: '#D81F32',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 16,
  },
});

export default GeneralTemplate;