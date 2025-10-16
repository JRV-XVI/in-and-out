import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import ProjectCardAdmin from '../../components/specialCards/ProjectCardAdmin';
import { Project } from '../../types/project';
import { getAllProjects } from '../../services/projects';


const ProyectPageAdmin = () => {
	const [activeTab, setActiveTab] = useState<'activos' | 'pendientes'>('activos');
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		async function load() {
			setLoading(true);
			try {
				const data = await getAllProjects();
				if (mounted) setProjects(data || []);
			} catch (err) {
				console.error('Error loading projects for admin:', err);
				if (mounted) setError(String(err));
			} finally {
				if (mounted) setLoading(false);
			}
		}
		load();
		return () => { mounted = false; };
	}, []);

	// counts for tabs (treat projectState==1 as pendiente)
	const pendingCount = projects.filter((p) => p.projectState === 1).length;
	const activeCount = projects.filter((p) => (p.projectState || 0) !== 1).length;

	// filtered data depending on selected tab
	const dataToShow = projects.filter((p) => (activeTab === 'activos' ? (p.projectState || 0) !== 1 : p.projectState === 1));

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
			renderItem={({ item }) => <ProjectCardAdmin project={item} />}
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