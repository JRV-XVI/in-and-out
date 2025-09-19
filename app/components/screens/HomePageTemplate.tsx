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
  headerTitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  sectionTitle?: string;
}

const HomePageTemplate = ({
  activeTab,
  onTabPress,
  onPrimaryAction,
  onSecondaryAction,
  children,
  headerTitle = "Texto cambio",
  primaryButtonText = "Texto cambio",
  secondaryButtonText = "Texto cambio",
  sectionTitle = "Texto cambio"
}: TemplateProps) => {
  const [selectedButton, setSelectedButton] = useState<'primary' | 'secondary' | null>(null);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{headerTitle}</Text>
        <Text style={styles.subtitle}>Entrar & Salir Con Propósito</Text>
      </View>
      {/* Highlight Card */}
      <View style={styles.highlightCard}>
        <View style={styles.actionsRow}>
          <Button
            title={primaryButtonText}
            onPress={() => {
              setSelectedButton('primary');
              onPrimaryAction();
            }}
            style={[
              styles.primaryButton,
              selectedButton === 'primary' ? styles.buttonSelected : {},
            ]}
            textStyle={selectedButton === 'primary' ? {color: 'white'} : {color: 'black'}}
          />
          <Button
            title={secondaryButtonText}
            onPress={() => {
              setSelectedButton('secondary');
              onSecondaryAction();
            }}
            style={[
              styles.secondaryButton,
              selectedButton === 'secondary' ? styles.buttonSelected : {},
            ]}
            textStyle={selectedButton === 'secondary' ? {color: 'white'} : {color: 'black'}}
          />
        </View>
      </View>
      {/* Content Card */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
    maxWidth: '48%',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
    maxWidth: '48%',
  },
  buttonTextGray: {
    color: 'red',
  },
  buttonSelected: {
    backgroundColor: '#CE0E2D',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: -50,
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