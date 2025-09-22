import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideBar from '../../components/screens/SideBar';
import Notifications from '../../components/screens/Notifications';
import History from '../../components/screens/History';

interface MainTabBarProps {
  onTabPress: (tab: string) => void;
  activeTab: string;
}

const tabs = [
  { key: 'search', icon: <Ionicons name="search" size={28} color="#fff" /> },
  { key: 'list', icon: <MaterialIcons name="assignment" size={28} color="#fff" /> },
  { key: 'home', icon: <Ionicons name="home" size={28} color="#fff" /> },
  { key: 'notifications', icon: <Ionicons name="notifications" size={28} color="#fff" /> },
  { key: 'profile', icon: <Ionicons name="person" size={28} color="#fff" /> },
];

const MainTabBar = ({ onTabPress, activeTab }: MainTabBarProps) => {
  const navigation = useNavigation<any>();
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [sideBarTab, setSideBarTab] = useState<string | null>(null);

  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'profile') {
      setSideBarVisible(true);
      setSideBarTab('profile');
    } else if (tabKey === 'notifications') {
      setNotificationsVisible(true);
      setSideBarTab('notifications');
    } else {
      onTabPress(tabKey);
    }
  };

  const handleCloseSidebar = () => {
    setSideBarVisible(false);
    setSideBarTab(null);
  };

  const handleCloseNotifications = () => {
    setNotificationsVisible(false);
    setSideBarTab(null);
  };

  const currentActiveTab =
    (sideBarVisible && sideBarTab === 'profile') || (notificationsVisible && sideBarTab === 'notifications')
      ? sideBarTab
      : activeTab;

  return (
    <>
      <View style={styles.container}>
        {tabs.map(tab => {
          const isActive = currentActiveTab === tab.key;
          const isHome = tab.key === 'home';
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tabButton,
                styles.shadow,
                isHome && styles.homeButton,
                isActive
                  ? { backgroundColor: '#5C5C60', borderColor: '#5C5C60' }
                  : { backgroundColor: '#CE0E2D', borderColor: '#CE0E2D' },
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              {React.cloneElement(tab.icon, {
                color: '#fff',
              })}
            </Pressable>
          );
        })}
      </View>
      {/* Sidebar Modal */}
      <Modal
        visible={sideBarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseSidebar}
      >
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0006' }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={handleCloseSidebar}
          />
          <SideBar navigation={navigation} />
        </View>
      </Modal>
      {/* Notifications Modal */}
      <Modal
        visible={notificationsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseNotifications}
      >
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0006' }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={handleCloseNotifications}
          />
          <Notifications />
        </View>
      </Modal>
      {/* History Modal */}
      <Modal
        visible={false} // Cambia a true para mostrar el modal de historial
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0006' }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {}}
          />
          <History />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0006',
  },
  tabButton: {
    backgroundColor: '#CE0E2D',
    borderRadius: 24,
    padding: 10,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#fff',
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    minWidth: 72,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default MainTabBar;