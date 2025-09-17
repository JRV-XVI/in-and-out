import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainTabBar from '../../components/navigation/MainTabBar';
import Button from '../../components/common/Button'; // Ajusta la ruta si es necesario

interface TemplateProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  children?: React.ReactNode;
}

const HomePageTemplate = ({
  activeTab,
  onTabPress,
  onPrimaryAction,
  onSecondaryAction,
  children,
}: TemplateProps) => {
  const [selectedButton, setSelectedButton] = useState<'primary' | 'secondary' | null>(null);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Texto cambio</Text>
        <Text style={styles.subtitle}>Entrar & Salir Con Propósito</Text>
      </View>
      {/* Highlight Card */}
      <View style={styles.highlightCard}>
        <View style={styles.actionsRow}>
          <Button
            title="Texto cambio"
            onPress={() => {
              setSelectedButton('primary');
              onPrimaryAction();
            }}
            style={[
              styles.primaryButton,
              selectedButton === 'primary' ? styles.buttonSelected : styles.buttonTextGray,
            ]}
          />
          <Button
            title="Texto cambio"
            onPress={() => {
              setSelectedButton('secondary');
              onSecondaryAction();
            }}
            style={[
              styles.secondaryButton,
              selectedButton === 'secondary' ? styles.buttonSelected : styles.buttonTextGray,
            ]}
          />
        </View>
      </View>
      {/* Content Card */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Texto cambio</Text>
        {children}
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <MainTabBar activeTab={activeTab} onTabPress={onTabPress} />
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
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 2,
  },
  subtitle: {
    color: '#F19800',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  highlightCard: {
    backgroundColor: '#F19800',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 18,
    marginBottom: -10,
    paddingVertical: 48,
    paddingHorizontal: 10,
    zIndex: 1,
    elevation: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginLeft: 0,
  },
  buttonTextGray: {
    color: 'red',
  },
  buttonSelected: {
    backgroundColor: '#5C5C60', // gris claro
    color: 'black',
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
  bottomBar: {
    backgroundColor: '#fff',
  },
});

export default HomePageTemplate;