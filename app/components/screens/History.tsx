import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const historyData = [
  {
    date: '04/09/25',
    type: 'Alimento seco',
    size: 'Chica',
    volunteers: 1,
    project: 'Salida',
  },
  {
    date: '04/09/25',
    type: 'Alimento seco',
    size: 'Pesado',
    volunteers: 2,
    project: 'Entrada',
  },
  {
    date: '04/09/25',
    type: 'Alimento congelado',
    size: 'Mediana',
    volunteers: 3,
    project: 'Salida',
  },
  {
    date: '04/09/25',
    type: 'Fruta',
    size: 'Pesado',
    volunteers: 1,
    project: 'Salida',
  },
];

const History = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'Entrada' | 'Salida'>('Entrada');

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hola {user?.name ?? 'Usuario'}</Text>
        <Text style={styles.headerSubtitle}>Entrar & Salir Con Propósito</Text>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Entrada' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('Entrada')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'Entrada' && styles.tabButtonTextActive,
          ]}>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Salida' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('Salida')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'Salida' && styles.tabButtonTextActive,
          ]}>Salida</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Historial De Proyectos</Text>
        <View style={styles.orderRow}>
          <Text style={styles.orderText}>Ordenar Por: <Text style={styles.orderCompleted}>Completados</Text></Text>
          <MaterialIcons name="sort" size={20} color="#CE0E2D" />
        </View>
        <ScrollView>
          {historyData.map((item, idx) => (
            <View key={idx} style={styles.historyItem}>
              <View style={styles.historyRow}>
                <Text style={styles.date}>{item.date}</Text>
                <MaterialIcons name="error-outline" size={32} color="#CE0E2D" style={{ marginLeft: 8 }} />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo</Text>
                <Text style={styles.infoValue}>{item.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Carga</Text>
                <Text style={styles.infoValue}>{item.size}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Voluntarios</Text>
                <Text style={styles.infoValue}>{item.volunteers} voluntariado{item.volunteers > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Proyecto</Text>
                <Text style={styles.infoValue}>{item.project}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#CE0E2D',
  },
  header: {
    backgroundColor: '#CE0E2D',
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#F19800',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F19800',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 18,
    marginBottom: -10,
    paddingVertical: 18,
    zIndex: 1,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#F19800',
    borderRadius: 16,
    marginHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  tabButtonTextActive: {
    color: '#CE0E2D',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: -20,
    zIndex: 2,
  },
  sectionTitle: {
    color: '#5C5C60',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  orderCompleted: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CE0E2D',
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    color: '#CE0E2D',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  infoLabel: {
    color: '#CE0E2D',
    fontWeight: 'bold',
    fontSize: 13,
    width: 90,
  },
  infoValue: {
    color: '#5C5C60',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
});

export default History;