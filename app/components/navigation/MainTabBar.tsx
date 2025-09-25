import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideBar from '../../components/screens/SideBar';
import Notifications from '../../components/screens/Notifications';
import Modal from 'react-native-modal';

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
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [sideBarTab, setSideBarTab] = React.useState<string | null>(null);

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
        isVisible={sideBarVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={handleCloseSidebar}
        style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
        backdropOpacity={0.4}
      >
        <View style={styles.panelContainer}>
          <SideBar navigation={navigation} />
        </View>
      </Modal>
      {/* Notifications Modal */}
      <Modal
        isVisible={notificationsVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={handleCloseNotifications}
        style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
        backdropOpacity={0.4}
      >
        <View style={styles.panelContainer}>
          <Notifications />
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
  panelContainer: {
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});

export default MainTabBar;