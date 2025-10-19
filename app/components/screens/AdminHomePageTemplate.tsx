import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainTabBar from '../../components/navigation/MainTabBar';
import Button from '../../components/common/Button'; // Ajusta la ruta si es necesario
import { useUser } from '../../context/UserContext';
import History from '../../components/screens/History'; // Importa History
import Search from '../../components/screens/Search';

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
  useScroll?: boolean; // when false, don't wrap children in a ScrollView (useful for screens that render FlatList)
}

const AdminHomePageTemplate = ({
  activeTab,
  onTabPress,
  onPrimaryAction,
  onSecondaryAction,
  children,
  headerTitle,
  primaryButtonText = "Texto cambio",
  secondaryButtonText = "Texto cambio",
  sectionTitle = "Texto cambio"
  ,
  useScroll = true
}: TemplateProps) => {
  const [selectedButton, setSelectedButton] = useState<'primary' | 'secondary' | null>(null);
  const [showHistory, setShowHistory] = useState(false); // Estado para mostrar History
  const [selectedTabBar, setSelectedTabBar] = useState<string | null>(null); // Nuevo estado para tabbar
  const { user } = useUser();

  // Si headerTitle no está definido, muestra "Hola, <usuario>"
  const displayTitle = headerTitle ?? `Hola, ${user?.name ?? 'Usuario'}`;

  // Maneja el tab de historial desde aquí
  const handleTabBarPress = (tab: string) => {
    if (tab === 'home') {
      // Cuando se presiona Home, resetea a la vista principal
      setSelectedButton(null);
      setShowHistory(false);
      setSelectedTabBar(null);
      onTabPress('home');
    } else if (tab === 'list') {
      setSelectedButton(null);
      setSelectedTabBar(tab);
      setShowHistory(prev => !prev);
    } else {
      setSelectedButton(null);
      setShowHistory(false);
      setSelectedTabBar(tab);
      onTabPress(tab);
    }
  };

  const handlePrimaryAction = () => {
    setSelectedButton('primary');
    setSelectedTabBar(null); // Deselecciona el tabbar
    setShowHistory(false);
    onPrimaryAction();
  };

  const handleSecondaryAction = () => {
    setSelectedButton('secondary');
    setSelectedTabBar(null); // Deselecciona el tabbar
    setShowHistory(false);
    onSecondaryAction();
  };

  // Determina el tab activo para MainTabBar
  const mainTabBarActive =
    selectedButton === 'primary' || selectedButton === 'secondary'
      ? 'none' // <-- Ningún tab visualmente activo
      : showHistory
      ? 'list'
      : selectedTabBar ?? activeTab;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{displayTitle}</Text>
        <Text style={styles.subtitle}>Entrar & Salir Con Propósito</Text>
      </View>
      {/* Highlight Card */}
      <View style={styles.highlightCard}>
        <View style={styles.actionsRow}>
          <Button
            title={primaryButtonText}
            onPress={handlePrimaryAction}
            style={[
              styles.primaryButton,
              selectedButton === 'primary' ? styles.buttonSelected : {},
            ]}
            textStyle={selectedButton === 'primary' ? { color: 'white' } : { color: 'white' }}
          />
          <Button
            title={secondaryButtonText}
            onPress={handleSecondaryAction}
            style={[
              styles.secondaryButton,
              selectedButton === 'secondary' ? styles.buttonSelected : {},
            ]}
            textStyle={selectedButton === 'secondary' ? { color: 'white' } : { color: 'white' }}
          />
        </View>
      </View>
      {/* Content Card (scrollable) */}
      <View style={styles.contentCard}>
        {useScroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {showHistory ? (
              <History adminView filterState={[0, 6]} />
            ) : activeTab === 'search' ? (
              <Search />
            ) : (
              <>
                <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                {children}
              </>
            )}
          </ScrollView>
        ) : (
          // When useScroll is false we render children directly so screens that use FlatList
          // (which is VirtualizedList-backed) won't be nested inside another ScrollView
          showHistory ? (
            <History adminView filterState={[0, 6]} />
          ) : activeTab === 'search' ? (
            <Search />
          ) : (
            <>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              {children}
            </>
          )
        )}
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <MainTabBar
          activeTab={mainTabBarActive}
          onTabPress={handleTabBarPress}
        />
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
    backgroundColor: '#5C5C60',
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
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center', 
  },
  bottomBar: {
    backgroundColor: '#fff',
  },
});

export default AdminHomePageTemplate;