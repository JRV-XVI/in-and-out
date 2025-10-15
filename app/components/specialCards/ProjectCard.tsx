import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  item: {
    id: string | number;
    title: string;
    subtitle?: string;
    date?: string;
    image?: any;
    icon?: string;
    status?: 'Confirmación' | 'Recolección' | 'Recolectado' | 'Finalizado';
    state?: 'activo' | 'pendiente';
    meta?: string[];
    vehiculo?: string[];
  };
};

const statusOrder = ['Confirmación', 'Recolección', 'Recolectado', 'Finalizado'];

export default function ProjectCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);
  const indicatorIndex = Math.max(0, statusOrder.indexOf(item.status || 'confirmacion'));

  function toggle() {
    // animate layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  }

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={toggle} style={styles.container}>

      <View style={[styles.card, expanded ? styles.cardExpanded : null]}>
        {item.icon ? (
          <View style={[styles.thumbnail, styles.iconThumb]}>
            <MaterialIcons name={item.icon as any} size={34} color="#fff" />
          </View>
        ) : item.image ? (
          <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbnail, styles.iconThumb]}>
            <MaterialIcons name="local-shipping" size={34} color="#fff" />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.rowTop}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.dateBadge}><Text style={styles.dateText}>{item.date}</Text></View>
          </View>

          {/* compact view shows subtitle and a vehicle line if present */}
          <Text style={styles.subtitle} numberOfLines={expanded ? 4 : 1}>{item.subtitle}</Text>

          {/* show details only when expanded */}
          {expanded && (
            <>
                  {item.state === 'pendiente' ? (
                    // when pendiente, hide status and show a button (empty logic for now)
                    <>
                      {item.meta && (
                        <View style={styles.metaRow}>
                          {item.meta.map((m, i) => (
                            <Text key={i} style={styles.metaText}>{m}</Text>
                          ))}
                        </View>
                      )}

                      {item.vehiculo && (
                        <View style={styles.metaRow}>
                          {item.vehiculo.map((m, i) => (
                            <Text key={i} style={styles.metaText}>{m}</Text>
                          ))}
                        </View>
                      )}

                      <View style={styles.pendingRow}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => { /* empty for now */ }}>
                          <Text style={styles.actionText}>Aceptar</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.statusRow}>
                        <View style={styles.dots}>
                          {statusOrder.map((s, i) => (
                            <View key={s} style={[styles.dot, i <= indicatorIndex ? styles.dotActive : null]} />
                          ))}
                        </View>

                        <Text style={styles.statusText}>{item.status ?? 'confirmacion'}</Text>
                      </View>

                      {item.meta && (
                        <View style={styles.metaRow}>
                          {item.meta.map((m, i) => (
                            <Text key={i} style={styles.metaText}>{m}</Text>
                          ))}
                        </View>
                      )}

                      {item.vehiculo && (
                        <View style={styles.metaRow}>
                          {item.vehiculo.map((m, i) => (
                            <Text key={i} style={styles.metaText}>{m}</Text>
                          ))}
                        </View>
                      )}
                    </>
                  )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardExpanded: { backgroundColor: '#fff' },
  thumbnail: { width: 70, height: 70, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  iconThumb: { backgroundColor: '#ce0e2d', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1 },
  dateBadge: { backgroundColor: '#ce0e2d', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  dateText: { color: '#fff', fontSize: 12 },
  subtitle: { color: '#666', marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between' },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 6 },
  dotActive: { backgroundColor: '#f19800' },
  statusText: { color: '#777', fontSize: 12, marginLeft: 8 },
  metaRow: { marginTop: 8 },
  metaText: { color: '#999', fontSize: 12 },
  pendingRow: { marginTop: 20, alignItems: 'center' , marginLeft: -70},
  actionBtn: { backgroundColor: '#ce0e2d', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  actionText: { color: '#fff', fontWeight: '700' },
});
