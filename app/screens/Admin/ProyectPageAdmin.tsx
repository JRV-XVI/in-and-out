import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import ProjectCardAdmin from '../../components/specialCards/ProjectCardAdmin';
import RefreshButton from '../../components/common/RefreshButton';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import * as DocumentPicker from 'expo-document-picker';
import { Project } from '../../types/project';
import { getAllProjects, createProject } from '../../services/projects';
import { useAuthContext } from '../../context/AuthContext';


const ProyectPageAdmin = () => {
	const [activeTab, setActiveTab] = useState<'activos' | 'pendientes'>('activos');
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState<number>(0);

	// auth
	const { authUser, userProfile } = useAuthContext();

	// view selector (Lista / Crear)
	const [selectedView, setSelectedView] = useState<'lista' | 'crear'>('lista');
	const [titulo, setTitulo] = useState('');
	const [pesoTotal, setPesoTotal] = useState('');
	const [pesoTotalKg, setPesoTotalKg] = useState('0');
	// use a stable unique id generator to avoid duplicates after deletions
	const nextArtIdRef = useRef<number>(Date.now());
	const [articulos, setArticulos] = useState<Array<{ id: string; nombre: string; peso: string }>>([{ id: String(nextArtIdRef.current), nombre: '', peso: '' }]);
	const [tipoCarga, setTipoCarga] = useState('');
	const [fechaExpiracion, setFechaExpiracion] = useState('');
	const [notas, setNotas] = useState('');
	const [direccion, setDireccion] = useState('');
	const [volunteers, setVolunteers] = useState<number>(0);
	const [evidencia, setEvidencia] = useState<any>(null);
	const [isLoadingCreate, setIsLoadingCreate] = useState(false);
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

	const loadProjects = async () => {
		setLoading(true);
		try {
			const data = await getAllProjects();
			setProjects(data || []);
		} catch (err) {
			console.error('Error loading projects for admin:', err);
			setError(String(err));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProjects();
	}, [refreshKey]);

	const handleRefresh = () => {
		setRefreshKey(prev => prev + 1);
	};

	// form helpers
	useEffect(() => {
		const totalKg = articulos.reduce((sum, articulo) => {
			const pesoKg = parseFloat(articulo.peso) || 0;
			return sum + pesoKg;
		}, 0);
		const totalTon = totalKg / 1000;
		setPesoTotal(totalTon ? totalTon.toFixed(3) : '');
		setPesoTotalKg(totalKg ? String(Math.round(totalKg)) : '0');
	}, [articulos]);

	const agregarArticulo = () => {
		nextArtIdRef.current += 1;
		setArticulos(prev => [...prev, { id: String(nextArtIdRef.current), nombre: '', peso: '' }]);
	};
	const eliminarArticulo = (id: string) => setArticulos(prev => prev.filter(a => a.id !== id));
	const actualizarArticulo = (id: string, campo: 'nombre' | 'peso', valor: string) => setArticulos(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));

	const seleccionarEvidencia = async () => {
		try {
			const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
			if (!res.canceled && res.assets && res.assets.length > 0) setEvidencia(res.assets[0]);
		} catch (e) {
			setAlertMessage('Error al cargar archivo');
			setAlertType('error');
			setAlertVisible(true);
		}
	};

	const validarFormulario = () => {
		if (!titulo.trim()) { setAlertMessage('El título es obligatorio'); setAlertType('error'); setAlertVisible(true); return false; }
		if (!pesoTotal || parseFloat(pesoTotal) <= 0) { setAlertMessage('Peso inválido'); setAlertType('error'); setAlertVisible(true); return false; }
		const validArt = articulos.every(a => a.nombre.trim() && a.peso && parseFloat(a.peso) > 0);
		if (!validArt) { setAlertMessage('Artículos inválidos'); setAlertType('error'); setAlertVisible(true); return false; }
		if (!direccion.trim()) { setAlertMessage('Dirección obligatoria'); setAlertType('error'); setAlertVisible(true); return false; }
		return true;
	};

	const limpiarFormulario = () => {
		setTitulo('');
		setPesoTotal('');
		setVolunteers(0);
		// ensure a fresh unique id for the only starter articulo
		nextArtIdRef.current += 1;
		setArticulos([{ id: String(nextArtIdRef.current), nombre: '', peso: '' }]);
		setTipoCarga('');
		setFechaExpiracion('');
		setNotas('');
		setDireccion('');
		setEvidencia(null);
	};

	const handleEnviar = async () => {
		if (!validarFormulario()) return;
		setIsLoadingCreate(true);
		try {
			const articulosJSON = articulos.reduce<Record<string, { nombre: string; peso: string }>>((acc, articulo, idx) => { acc[`articulo_${idx + 1}`] = { nombre: articulo.nombre, peso: articulo.peso }; return acc; }, {});
			const loadTypeMap: Record<string, number> = { 'Normal': 1, 'Delicado': 2, 'Frío': 3 };
			const projectData = {
				title: titulo,
				weight: parseFloat(pesoTotal),
				foodList: articulosJSON,
				loadType: loadTypeMap[tipoCarga] || 1,
				expirationDate: fechaExpiracion || null,
				notes: notas || null,
				direction: direccion,
				photo: evidencia?.uri || null,
				projectType: 2,
				volunteers: volunteers,
				projectState: 2,
				creator_id: userProfile?.id?.toString() || null,
			} as any;

			const result = await createProject(projectData);
			if (result) {
				setAlertMessage('Proyecto creado correctamente'); setAlertType('success'); setAlertVisible(true);
				limpiarFormulario(); setSelectedView('lista'); handleRefresh();
			} else {
				setAlertMessage('Error creando proyecto'); setAlertType('error'); setAlertVisible(true);
			}
		} catch (e) {
			console.error(e);
			setAlertMessage('Error creando proyecto'); setAlertType('error'); setAlertVisible(true);
		} finally { setIsLoadingCreate(false); }
	};

	// counts for tabs
	// Pending projects are defined as projectState === 1
	// Active projects are any projectState > 1
	const pendingCount = projects.filter((p) => (p.projectState ?? 0) === 1).length;
	const activeCount = projects.filter((p) => (p.projectState ?? 0) > 1 && (p.projectState ?? 0) < 4).length;

	// filtered data depending on selected tab
	// keep the same semantics as activeCount: activos are states 2 and 3 ( >1 && <4 )
	const dataToShow = projects.filter((p) =>
		activeTab === 'activos' ? ((p.projectState ?? 0) > 1 && (p.projectState ?? 0) < 5) : (p.projectState ?? 0) === 1
	);

	return (
		<SafeAreaView style={styles.safe}>
			<Alert visible={alertVisible} message={alertMessage} type={alertType} onClose={() => setAlertVisible(false)} />

			{/* Top switch: Lista / Crear (same style as UsersPageAdmin) */}
			<View style={styles.tabSwitchRow}>
				<TouchableOpacity
					style={[styles.tabSwitchBtn, selectedView === 'lista' ? styles.tabSwitchActive : null]}
					onPress={() => setSelectedView('lista')}
				>
					<Text style={[styles.tabSwitchText, selectedView === 'lista' ? styles.tabSwitchTextActive : null]}>Lista de proyectos</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tabSwitchBtn, selectedView === 'crear' ? styles.tabSwitchActive : null]}
					onPress={() => setSelectedView('crear')}
				>
					<Text style={[styles.tabSwitchText, selectedView === 'crear' ? styles.tabSwitchTextActive : null]}>Crear proyecto</Text>
				</TouchableOpacity>
			</View>

			{selectedView === 'lista' && (
				<View style={styles.subTabsWrap}>
					<TouchableOpacity style={[styles.subTab, activeTab === 'activos' ? styles.subTabActive : null]} onPress={() => setActiveTab('activos')}>
						<Text style={[styles.subTabText, activeTab === 'activos' ? styles.subTabTextActive : null]}>Activos ({activeCount})</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.subTab, activeTab === 'pendientes' ? styles.subTabActive : null]} onPress={() => setActiveTab('pendientes')}>
						<Text style={[styles.subTabText, activeTab === 'pendientes' ? styles.subTabTextActive : null]}>Pendientes ({pendingCount})</Text>
					</TouchableOpacity>

					<View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
						<RefreshButton onRefresh={handleRefresh} />
					</View>
				</View>
			)}

			{selectedView === 'crear' ? (
				<ScrollView style={{ paddingHorizontal: 18, marginBottom: 8, marginTop: 20 }}>
					<Input placeholder="Título de proyecto" value={titulo} onChangeText={setTitulo} />
					<Text style={{ marginTop: 0, marginBottom: 4, color: '#666', fontWeight: '700' }}>Artículos</Text>
					{articulos.map((a, idx) => {
						const isOnlyOne = articulos.length === 1 && idx === 0;
						return (
							<View key={a.id} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
								<View style={{ flex: 2, marginRight: 8 }}>
									<Input placeholder="Nombre" value={a.nombre} onChangeText={v => actualizarArticulo(a.id, 'nombre', v)} containerStyle={{ marginBottom: 0 }} />
								</View>
								<View style={{ width: 100, marginRight: 8 }}>
									<Input placeholder="Kg" value={a.peso} onChangeText={v => actualizarArticulo(a.id, 'peso', v)} containerStyle={{ marginBottom: 0 }} keyboardType="numeric" />
								</View>
								<TouchableOpacity
									onPress={() => { if (!isOnlyOne) eliminarArticulo(a.id); }}
									disabled={isOnlyOne}
									style={{ justifyContent: 'center', paddingHorizontal: 8, opacity: isOnlyOne ? 0.5 : 1 }}
								>
									<Text style={{ color: isOnlyOne ? '#999' : '#ce0e2d', fontWeight: '700' }}>{isOnlyOne ? 'Eliminar' : 'Eliminar'}</Text>
								</TouchableOpacity>
							</View>
						);
					})}
					<TouchableOpacity onPress={agregarArticulo} style={{ marginBottom: 20 }}>
						<Text style={{ color: '#5C5C60', fontWeight: '700' }}>+ Agregar artículo</Text>
					</TouchableOpacity>

					{/* Total weight display (in kg) */}
					<View style={styles.weightRow}>
						<Text style={styles.weightLabel}>Peso total</Text>
						<Text style={styles.weightValue}>{pesoTotalKg ? `${pesoTotalKg} kg` : '0 kg'}</Text>
					</View>

					<Input placeholder="Dirección" value={direccion} onChangeText={setDireccion} />

					{/* Volunteers counter for admin-created projects */}
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 15 }}>
						<Text style={{ fontWeight: '700', marginRight: 12 }}>Voluntarios</Text>
						<TouchableOpacity onPress={() => setVolunteers(v => Math.max(0, v - 1))} style={{ padding: 8, backgroundColor: '#f2f2f2', borderRadius: 8, marginRight: 8 }}>
							<Text style={{ fontWeight: '700', paddingRight: 7, paddingLeft: 7 }}>-</Text>
						</TouchableOpacity>
						<View style={{ minWidth: 40, alignItems: 'center' }}>
							<Text style={{ fontWeight: '700', fontSize: 20 }}>{volunteers}</Text>
						</View>
						<TouchableOpacity onPress={() => setVolunteers(v => v + 1)} style={{ padding: 8, backgroundColor: '#f2f2f2', borderRadius: 8, marginLeft: 8 }}>
							<Text style={{ fontWeight: '700', paddingRight: 6, paddingLeft: 6 }}>+</Text>
						</TouchableOpacity>
					</View>

					<Input placeholder="Notas (opcional)" value={notas} onChangeText={setNotas} />
					<TouchableOpacity onPress={seleccionarEvidencia} style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
						<Text style={{ color: '#ce0e2d' }}>{evidencia ? 'Evidencia cargada' : 'Subir evidencia'}</Text>
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 18 }}>
						<Button title={isLoadingCreate ? 'Creando...' : 'Crear proyecto'} onPress={() => { if (!isLoadingCreate) handleEnviar(); }} style={{ flex: 1 }} />
					</View>
					
				</ScrollView>
			) : (
				<FlatList
					data={dataToShow}
					keyExtractor={(i) => String(i.id)}
					renderItem={({ item }) => <ProjectCardAdmin project={item} onPress={handleRefresh} />}
					contentContainerStyle={{ paddingVertical: 16, paddingBottom: 120 }}
					showsVerticalScrollIndicator={false}
				/>
			)}
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
	subTabsWrap: { flexDirection: 'row', marginTop: 12, marginHorizontal: 18, alignItems: 'center', marginBottom: 20},
	subTab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#f2f2f2', marginRight: 8 },
	subTabActive: { backgroundColor: '#fff', elevation: 2 },
	subTabNeutral: { backgroundColor: '#e5e5e5' },
	subTabText: { color: '#666', fontWeight: '700' },
	subTabTextActive: { color: '#ce0e2d' },
	subTabTextMuted: { color: '#999' },
	createBtn: { marginLeft: 12, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
	// tab switch styles (same as UsersPageAdmin)
	tabSwitchRow: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 8,
		justifyContent: 'center',
	},
	tabSwitchBtn: {
		paddingVertical: 8,
		paddingHorizontal: 18,
		borderRadius: 20,
		backgroundColor: '#f2f2f2',
		marginHorizontal: 6,
	},
	tabSwitchActive: {
		backgroundColor: '#CE0E2D',
	},
	tabSwitchText: {
		color: '#333',
		fontWeight: '700',
	},
	tabSwitchTextActive: {
		color: '#fff',
	},
	weightRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 0,
		marginBottom: 20,
		padding: 10,
		backgroundColor: '#f2f2f2',
		borderRadius: 5,
	},
	weightLabel: {
		fontWeight: '700',
		color: '#333',
	},
	weightValue: {
		fontWeight: '700',
		color: '#5C5C60',
	},
});
 
export default ProyectPageAdmin;