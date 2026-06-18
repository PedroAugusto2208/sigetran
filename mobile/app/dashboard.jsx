import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from '../src/api';

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('sigetran_usuario').then(s => s && setUsuario(JSON.parse(s)));
    api.get('/relatorios/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function sair() {
    await SecureStore.deleteItemAsync('sigetran_token');
    await SecureStore.deleteItemAsync('sigetran_usuario');
    router.replace('/login');
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  const cards = [
    { label: 'Programadas',  value: stats?.programadas  || 0, cor: '#1a73e8', icon: '🗓️' },
    { label: 'Em Andamento', value: stats?.emAndamento  || 0, cor: '#f39c12', icon: '🚛' },
    { label: 'Concluídas',   value: stats?.concluidas   || 0, cor: '#27ae60', icon: '✅' },
  ];

  const menu = [
    { label: 'Viagens',    icon: '📋', rota: '/viagens' },
    { label: 'Veículos',   icon: '🚛', rota: '/veiculos' },
    { label: 'Motoristas', icon: '🧑‍✈️', rota: '/motoristas' },
    { label: 'Clientes',   icon: '🏢', rota: '/clientes' },
    { label: 'Rotas',      icon: '🗺️', rota: '/rotas' },
    { label: 'Cargas',     icon: '📦', rota: '/cargas' },
    { label: 'Fretes',     icon: '💰', rota: '/fretes' },
    { label: 'Usuários',   icon: '👤', rota: '/usuarios' },
    { label: 'Relatórios', icon: '📊', rota: '/relatorios' },
  ];

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Text style={s.titulo}>🚚 SIGETRAN</Text>
        <TouchableOpacity onPress={sair}><Text style={s.sairBtn}>Sair</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {usuario && <Text style={s.boas}>Olá, {usuario.nome}!</Text>}

        <View style={s.grid}>
          {cards.map(c => (
            <View key={c.label} style={[s.card, { borderTopColor: c.cor, borderTopWidth: 4 }]}>
              <Text style={s.cardIcon}>{c.icon}</Text>
              <Text style={s.cardVal}>{c.value}</Text>
              <Text style={s.cardLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secaoTitulo}>Módulos</Text>
        <View style={s.menuGrid}>
          {menu.map(m => (
            <TouchableOpacity key={m.label} style={s.menuItem} onPress={() => router.push(m.rota)}>
              <Text style={s.menuIcon}>{m.icon}</Text>
              <Text style={s.menuLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page:         { flex: 1, backgroundColor: '#f0f2f5' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:       { backgroundColor: '#1a3a5c', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo:       { color: '#fff', fontSize: 20, fontWeight: '700' },
  sairBtn:      { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  scroll:       { padding: 20 },
  boas:         { fontSize: 18, fontWeight: '600', color: '#1a3a5c', marginBottom: 20 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  card:         { backgroundColor: '#fff', borderRadius: 10, padding: 16, width: '47%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardIcon:     { fontSize: 24, marginBottom: 8 },
  cardVal:      { fontSize: 26, fontWeight: '700', color: '#1a3a5c' },
  cardLabel:    { fontSize: 12, color: '#888', marginTop: 4 },
  secaoTitulo:  { fontSize: 15, fontWeight: '700', color: '#1a3a5c', marginBottom: 12 },
  menuGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuItem:     { backgroundColor: '#fff', borderRadius: 10, padding: 16, width: '47%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  menuIcon:     { fontSize: 28, marginBottom: 8 },
  menuLabel:    { fontSize: 14, fontWeight: '600', color: '#1a3a5c' },
});
