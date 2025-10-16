import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainTabBar from '../../components/navigation/MainTabBar';
import Button from '../../components/common/Button';
import { useUser } from '../../context/UserContext';
import History from '../../components/screens/History';
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
  sectionTitleAction?: React.ReactNode;
}

const HomePageTemplate = ({
  activeTab,
  onTabPress,
  onPrimaryAction,
  onSecondaryAction,
  children,
  headerTitle,
  primaryButtonText = "Texto cambio",
  secondaryButtonText = "Texto cambio",
  sectionTitle = "Texto cambio",
  sectionTitleAction,
}: TemplateProps) => {
  const [selectedButton, setSelectedButton] = useState<'primary' | 'secondary' | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTabBar, setSelectedTabBar] = useState<string | null>(null);
  const { user } = useUser();

  const displayTitle = headerTitle ?? `Hola, ${user?.name ?? 'Usuario'}`;

  const handleTabBarPress = (tab: string) => {
    setSelectedButton(null);
    setSelectedTabBar(tab);
    if (tab === 'list') {
      setShowHistory(prev => !prev);
    } else {
      setShowHistory(false);
      onTabPress(tab);
    }
  };

  const handlePrimaryAction = () => {
    setSelectedButton('primary');
    setSelectedTabBar(null);
    onPrimaryAction();
  };

  const handleSecondaryAction = () => {
    setSelectedButton('secondary');
    setSelectedTabBar(null);
    onSecondaryAction();
  };

  const mainTabBarActive =
    selectedButton === 'primary' || selectedButton === 'secondary'
      ? 'none'
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
      {/* Content Card */}
      <View style={styles.contentCard}>
        {showHistory ? (
          <History />
        ) : activeTab === 'search' ? (
          <Search />
        ) : (
          <>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              {sectionTitleAction}
            </View>
            {children}
          </>
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
  buttonSelected: {
    backgroundColor: '#5C5C60',
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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: '#5C5C60',
    fontWeight: '900',
    fontSize: 24,
    flex: 1,
  },
  bottomBar: {
    backgroundColor: '#fff',
  },
});

export default HomePageTemplate;