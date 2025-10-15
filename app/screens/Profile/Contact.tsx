import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import GeneralTemplate from '../../components/screens/GeneralTemplate';

const phoneNumbers = [
  { label: 'General', number: '33 3810 6595', icon: <MaterialIcons name="phone" size={22} color="#D81F32" /> },
  { label: 'Donatel', number: '33 3811 3500', icon: <MaterialIcons name="phone" size={22} color="#D81F32" /> },
  { label: 'Uniendo Manos', number: '33 2256 7808', icon: <FontAwesome name="whatsapp" size={22} color="#25D366" /> },
];

const email = 'comunicacionbamx@bdalimentos.org';

const address = 'Hda. de la Calerilla 360, Santa María Tequepexpan, San Pedro Tlaquepaque, Jalisco.';
const googleMapsUrl = 'https://maps.google.com/?q=Hda.+de+la+Calerilla+360,+Santa+María+Tequepexpan,+San+Pedro+Tlaquepaque,+Jalisco';

const Contact = ({ navigation }: any) => {
  return (
    <GeneralTemplate
      title="Contáctanos"
      onBackPress={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Teléfono */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="phone" size={28} color="#D81F32" />
            <Text style={styles.sectionTitle}>Teléfono</Text>
          </View>
          {phoneNumbers.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.phoneRow}
              onPress={() => Linking.openURL(
                item.label === 'Uniendo Manos'
                  ? `https://wa.me/52${item.number.replace(/\s/g, '')}`
                  : `tel:${item.number.replace(/\s/g, '')}`
              )}
            >
              <View style={styles.phoneIcon}>{item.icon}</View>
              <Text style={styles.phoneLabel}>{item.label}:</Text>
              <Text style={styles.phoneNumber}>{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="email" size={28} color="#D81F32" />
            <Text style={styles.sectionTitle}>Email</Text>
          </View>
          <Text style={styles.emailDescription}>
            Dudas, comentarios, escríbenos y con gusto nos pondremos en contacto.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
            <Text style={styles.email}>{email}</Text>
          </TouchableOpacity>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Entypo name="location-pin" size={28} color="#D81F32" />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>
          <Text style={styles.address}>{address}</Text>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => Linking.openURL(googleMapsUrl)}
          >
            <FontAwesome name="map-marker" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GeneralTemplate>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81F32',
    marginLeft: 10,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 4,
  },
  phoneIcon: {
    marginRight: 8,
    width: 28,
    alignItems: 'center',
  },
  phoneLabel: {
    fontSize: 16,
    color: '#333',
    width: 110,
    fontWeight: '600',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#D81F32',
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  emailDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#D81F32',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  address: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D81F32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
});

export default Contact;
