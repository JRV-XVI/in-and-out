import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Logo from '../../components/common/Logo';

const LaunchScreen = () => {
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
  tagline: {
    fontSize: 18,
    color: '#5C5C60',
    fontWeight: '500',
    marginTop: 20,
  },
  buttonPlaceholder: {
    // Este espacio es para mantener la misma estructura que LaunchScreenTwo
    width: '100%',
    height: 110, // Aproximadamente el espacio que ocuparán los dos botones
  }
});

export default LaunchScreen;