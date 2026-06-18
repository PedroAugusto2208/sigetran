import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { router } from 'expo-router';
import api from '../src/api';

const fmt = v => `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export default function Relatorios() {
  const [dash, setDash]       = useState(null);
  const [fretes, setFretes]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [d, f] = await Promise.all([
        api.get('/relatorios/dashboard'),
        api.get('/relatorios/fretes'),
      ]);
      setDash(d.data);
      setFretes(f.data);
    } catch { Alert.alert('Erro', 'Não foi possível carregar relatórios'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  const total = (dash?.programadas || 0) + (dash?.emAndamento || 0) + (dash?.concluidas || 0) + (dash?.canceladas || 0);
  const linhas = [
    { label: 'Total de viagens', valor: total },
    { label: 'Programadas', valor: dash?.programadas || 0 },
    { label: 'Em andamento', valor: dash?.emAndamento || 0 },
    { label: 'Concluídas', valor: dash?.concluidas || 0 },
    { label: 'Canceladas', valor: dash?.canceladas || 0 },
  ];

  return (
    <View style={s.page}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Voltar</Text></TouchableOpacity>
        <Text style={s.titulo}>📊 Relatórios</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} />}
      >
        <View style={s.cardDestaque}>
          <Text style={s.destaqueLabel}>Receita total de fretes</Text>
          <Text style={s.destaqueValor}>{fmt(fretes?.totalGeral)}</Text>
          <Text style={s.destaqueSub}>{fretes?.total || 0} fretes registrados</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitulo}>Viagens por status</Text>
          {linhas.map(l => (
            <View key={l.label} style={s.linha}>
              <Text style={s.linhaLabel}>{l.label}</Text>
              <Text style={s.linhaValor}>{l.valor}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page:          { flex: 1, backgroundColor: '#f0f2f5' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:        { backgroundColor: '#1a3a5c', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back:          { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  titulo:        { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll:        { padding: 16, gap: 14 },
  cardDestaque:  { backgroundColor: '#1a3a5c', borderRadius: 12, padding: 20, alignItems: 'center' },
  destaqueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  destaqueValor: { color: '#fff', fontSize: 30, fontWeight: '700', marginVertical: 6 },
  destaqueSub:   { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  card:          { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  cardTitulo:    { fontSize: 16, fontWeight: '700', color: '#1a3a5c', marginBottom: 12 },
  linha:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  linhaLabel:    { fontSize: 14, color: '#555' },
  linhaValor:    { fontSize: 16, fontWeight: '700', color: '#1a3a5c' },
});
