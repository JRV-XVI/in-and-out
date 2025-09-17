import React, { useRef } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface TokenProps {
  value: string;
  onChange: (value: string) => void;
}

const Token = ({ value, onChange }: TokenProps) => {
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, idx: number) => {
    let newValue = value.split('');
    newValue[idx] = text.replace(/[^0-9a-zA-Z]/g, '').slice(-1) || '';
    const joined = newValue.join('').slice(0, 4);
    onChange(joined);

    if (text && idx < 3) {
      inputs[idx + 1].current?.focus();
    }
    if (!text && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Token</Text>
      <View style={styles.tokenRow}>
        {[0, 1, 2, 3].map((idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={styles.tokenInput}
            maxLength={1}
            value={value[idx] || ''}
            onChangeText={text => handleChange(text, idx)}
            keyboardType="default"
            autoCapitalize="characters"
            textAlign="center"
            returnKeyType="next"
            blurOnSubmit={false}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 18,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#5C5C60',
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  tokenInput: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#5C5C60',
    color: '#fff',
    fontSize: 28,
    marginHorizontal: 8,
    textAlign: 'center',
  },
});

export default Token;