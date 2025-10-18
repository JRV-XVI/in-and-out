import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import UsersCard from '../../components/specialCards/UsersCard';
import { User } from '../../types/user';
import { useAllUsers } from '../../hooks/useUsers';
import Input from '../../components/common/Input';
import supabase from '../../lib/supabase';

const UsersPageAdmin = () => {
    const [selectedView, setSelectedView] = useState<'lista' | 'token'>('lista');
    const [filter, setFilter] = useState<'all' | 'donadores' | 'responsables'>('all');
    const { users: allUsers = [], loading: loadingUsers } = useAllUsers();
    const [error, setError] = useState<string | null>(null);

    // counts
    // Exclude userType === 3 from the visible list
    const visibleUsers = (allUsers || []).filter(u => (u.userType ?? 0) !== 3);

    const donadoresCount = visibleUsers.filter((u) => (u.userType ?? 0) === 1).length;
    const responsablesCount = visibleUsers.filter((u) => (u.userType ?? 0) === 2).length;
    const allCount = visibleUsers.length;

    // explicit filter selection: 'all' | 'donadores' | 'responsables'
    const filteredUsers = visibleUsers.filter(u =>
        filter === 'all' ? true : filter === 'donadores' ? (u.userType ?? 0) === 1 : (u.userType ?? 0) === 2
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* Top tab switch */}
            <View style={styles.tabSwitchRow}>
                <TouchableOpacity
                    style={[styles.tabSwitchBtn, selectedView === 'lista' ? styles.tabSwitchActive : null]}
                    onPress={() => setSelectedView('lista')}
                >
                    <Text style={[styles.tabSwitchText, selectedView === 'lista' ? styles.tabSwitchTextActive : null]}>Lista de usuarios</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabSwitchBtn, selectedView === 'token' ? styles.tabSwitchActive : null]}
                    onPress={() => setSelectedView('token')}
                >
                    <Text style={[styles.tabSwitchText, selectedView === 'token' ? styles.tabSwitchTextActive : null]}>Creación de usuario</Text>
                </TouchableOpacity>
            </View>

            {selectedView === 'lista' ? (
                <>
                    <View style={{ padding: 16 }}>
                        <View style={styles.tipoFiltroRow}>
                            <TouchableOpacity style={[styles.tipoFiltroBtn, filter === 'all' && styles.tipoFiltroBtnActive]} onPress={() => setFilter('all')}>
                                <Text style={[styles.tipoFiltroText, filter === 'all' && styles.tipoFiltroTextActive]}>Todos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tipoFiltroBtn, filter === 'donadores' && styles.tipoFiltroBtnActive]} onPress={() => setFilter('donadores')}>
                                <Text style={[styles.tipoFiltroText, filter === 'donadores' && styles.tipoFiltroTextActive]}>Donadores</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tipoFiltroBtn, filter === 'responsables' && styles.tipoFiltroBtnActive]} onPress={() => setFilter('responsables')}>
                                <Text style={[styles.tipoFiltroText, filter === 'responsables' && styles.tipoFiltroTextActive]}>Responsables</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loadingUsers ? (
                        <View style={{ padding: 16 }}>
                            <ActivityIndicator size="large" color="#CE0E2D" />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => <UsersCard user={item} onPress={() => { /* navigate to user */ }} />}
                            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                            ListEmptyComponent={<View style={{ padding: 16 }}><Text>No users found</Text></View>}
                        />
                    )}
                </>
            ) : (
                // Envío de correo con enlace (Supabase) hacia Vercel
                <EmailInviteSection />
            )}
        </SafeAreaView>
    );
};

const EmailInviteSection = () => {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const redirectUrl = 'https://supabase-reset-auth-in-out.vercel.app/';

    const sendEmail = async () => {
        setMessage(null);
        setIsError(false);

        const trimmed = email.trim();
        if (!trimmed) {
            setMessage('Escribe un correo electrónico válido.');
            setIsError(true);
            return;
        }
        setSending(true);
        try {
            // Enviar link de acceso (passwordless). El usuario llegará a la página de Vercel.
            const { error } = await supabase.auth.signInWithOtp({
                email: trimmed,
                options: { emailRedirectTo: redirectUrl },
            });
            if (error) {
                setMessage(`Error al enviar el correo: ${error.message}`);
                setIsError(true);
            } else {
                setMessage('Correo enviado.');
                setIsError(false);
            }
        } catch (e: any) {
            setMessage('Ocurrió un error inesperado al enviar el correo.');
            setIsError(true);
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={{ padding: 20, width: '100%' }}>
            <Text style={{ fontWeight: '800', fontSize: 18, color: '#5C5C60', marginBottom: 6 }}>Enviar invitación por correo</Text>
            <Text style={{ color: '#666', marginBottom: 16, textAlign: 'justify' }}>
               Le enviaremos un enlace seguro para que continúe el proceso en la página de verificación y establezca su nueva contraseña.
            </Text>

            <Input
                label="Correo electrónico"
                placeholder="correo@dominio.com"
                placeholderTextColor="#c0bbbbff"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                style={[styles.primaryButton, { alignSelf: 'center', marginTop: 8, opacity: sending ? 0.6 : 1 }]}
                onPress={sendEmail}
                disabled={sending}
            >
                {sending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Enviar correo</Text>
                )}
            </TouchableOpacity>

            {!!message && (
                <Text style={{ marginTop: 12, textAlign: 'center', color: isError ? '#CE0E2D' : '#059669' }}>
                    {message}
                </Text>
            )}
        </View>
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
    filterButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#f2f2f2',
        marginBottom: 12,
    },
    filterButtonText: {
        color: '#333',
        fontWeight: '700',
    },
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
    primaryButton: {
        backgroundColor: '#CE0E2D',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    tipoFiltroRow: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    tipoFiltroBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#EDEDED',
    },
    tipoFiltroBtnActive: {
        backgroundColor: '#CE0E2D',
    },
    tipoFiltroText: {
        color: '#5C5C60',
        fontWeight: 'bold',
    },
    tipoFiltroTextActive: {
        color: '#fff',
    },
});
 
export default UsersPageAdmin;