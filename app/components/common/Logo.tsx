import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

type LogoProps = {
  showText?: boolean;
  size?: number;
};

const Logo = ({ showText = true, size = 300 }: LogoProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/shulkerhouseWithoutBack.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
      {showText && (
        <Text style={styles.brandName}>
          <Text style={styles.redText}>SHULKER</Text>
          <Text style={styles.grayText}>HOUSE</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: -50,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: -50,
  },
  redText: {
    color: '#CE0E2D',
    fontWeight: '900',
  },
  grayText: {
    color: '#5C5C60',
    fontWeight: '900',
  },
});

export default Logo;