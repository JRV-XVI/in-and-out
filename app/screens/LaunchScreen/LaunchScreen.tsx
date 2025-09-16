import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../../components/common/Logo';
import { useNavigation } from '@react-navigation/native';

const LaunchScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LaunchScreenTwo' as never);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Logo size={400} showText={true} />
      </View>
      <View style={styles.buttonPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 40,
  },
  topContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonPlaceholder: {
    width: '100%',
    height: 110,
  }
});

export default LaunchScreen;