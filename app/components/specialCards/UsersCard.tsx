import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { User } from '../../types/user';

export default function UserRow({ user, onPress }: { user: User; onPress?: () => void }) {
  const typeLabel = user.userType === 1 ? 'Donador' : user.userType === 2 ? 'Responsable' : 'Usuario';
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View style={{ flex: 1 }}>
        {user.icon ? (
          <View style={[styles.thumbnail, styles.iconThumb]}>
            <MaterialIcons name={user.icon as any} size={34} color="#fff" />
          </View>
        ) : user.image ? (
          // user.image is expected to be a URI string; Image needs an object { uri }
          <Image source={{ uri: user.image }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbnail, styles.iconThumb]}>
            <MaterialIcons name="person" size={34} color="#fff" />
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{typeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10, elevation: 1 },
  name: { fontWeight: '700' },
  email: { color: '#666', marginTop: 2 },
  badge: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  badgeText: { fontSize: 12, color: '#CE0E2D', fontWeight: '700' },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  iconThumb: {
    backgroundColor: '#CE0E2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});