import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import ProjectCardAdmin from '../../components/specialCards/ProjectCardAdmin';

const sample = [
	{
		id: 1,
		title: 'Alimento Seco',
		subtitle: 'Carga mediana',
		date: '03/09/25',
		// normalized status for ProjectCard
		status: 'Confirmación' as const,
		// state used for tab filtering
		state: 'activo' as const,
		meta: ['Direccion: Calle 5 de Febrero, 200', 'Productos: Manzanas, Mango, Pepino'],
		vehiculo: ['Vehículo: {matricula}, {marca}, {modelo}, {color}'],
	},
	{
		id: 2,
		title: 'Alimento Seco',
		subtitle: 'Carga mediana',
		date: '03/07/25',
		status: 'Recolección' as const,
		state: 'pendiente' as const,
		meta: ['Direccion: ...', 'Productos: ...'],
		vehiculo: ['Vehículo: {matricula}, {marca}, {modelo}, {color}'],
	},
	{
		id: 3,
		title: 'Alimento Congelado',
		subtitle: 'Carga con congelador',
		date: '03/05/25',
		status: 'Recolectado' as const,
		state: 'activo' as const,
		meta: ['Direccion: ...', 'Productos: ...'],
		vehiculo: ['Vehículo: {matricula}, {marca}, {modelo}, {color}'],
	},
];

const ProyectPageAdmin = () => {
	const [activeTab, setActiveTab] = useState<'activos' | 'pendientes'>('activos');

	// counts for tabs
	const pendingCount = sample.filter((p) => p.state === 'pendiente').length;
	const activeCount = sample.filter((p) => p.state === 'activo').length;

	// filtered data depending on selected tab
	const dataToShow = sample.filter((p) => (activeTab === 'activos' ? p.state === 'activo' : p.state === 'pendiente'));

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.subTabsWrap}>
				<TouchableOpacity style={[styles.subTab, activeTab === 'activos' ? styles.subTabActive : null]} onPress={() => setActiveTab('activos')}>
					<Text style={[styles.subTabText, activeTab === 'activos' ? styles.subTabTextActive : null]}>Activos ({activeCount})</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.subTab, activeTab === 'pendientes' ? styles.subTabActive : null]} onPress={() => setActiveTab('pendientes')}>
					<Text style={[styles.subTabText, activeTab === 'pendientes' ? styles.subTabTextActive : null]}>Pendientes ({pendingCount})</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={dataToShow}
				keyExtractor={(i) => String(i.id)}
				renderItem={({ item }) => <ProjectCardAdmin item={item} />}
				contentContainerStyle={{ paddingVertical: 16, paddingBottom: 120 }}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: '#fff' },
	header: { backgroundColor: '#ce0e2d', paddingVertical: 22, paddingHorizontal: 18, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
	headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
	headerSubtitle: { color: '#ffdede', marginTop: 4 },
	sectionTabs: { flexDirection: 'row', marginTop: -12, marginHorizontal: 18, backgroundColor: '#f59f00', padding: 8, borderRadius: 18, justifyContent: 'flex-start' },
	tabBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 16, backgroundColor: 'transparent', marginRight: 8 },
	tabActive: { backgroundColor: '#fff' },
	tabMuted: { opacity: 0.6 },
	tabText: { color: '#fff', fontWeight: '700' },
	tabTextActive: { color: '#ce0e2d' },
	tabTextMuted: { color: '#8b8b8b' },
	subTabsWrap: { flexDirection: 'row', marginTop: 12, marginHorizontal: 18, alignItems: 'center' },
	subTab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#f2f2f2', marginRight: 8 },
	subTabActive: { backgroundColor: '#fff', elevation: 2 },
	subTabNeutral: { backgroundColor: '#e5e5e5' },
	subTabText: { color: '#666', fontWeight: '700' },
	subTabTextActive: { color: '#ce0e2d' },
	subTabTextMuted: { color: '#999' },
});
 
export default ProyectPageAdmin;