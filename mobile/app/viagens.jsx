import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import api from '../src/api';

const STATUS_COR = {
  PROGRAMADA:   { bg: '#e8f0fe', text: '#1a73e8' },
  EM_ANDAMENTO: { bg: '#fff3e0', text: '#e65100' },
  CONCLUIDA:    { bg: '#e8f5e9', text: '#2e7d32' },
  CANCELADA:    { bg: '#fce8e6', text: '#c5221f' },
};

const PROXIMOS_STATUS = {
  PROGRAMADA:   ['EM_ANDAMENTO', 'CANCELADA'],
  EM_ANDAMENTO: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA:    [],
  CANCELADA:    [],
};

export default function Viagens() {
  const [viagens, setViagens]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get('/viagens');
      setViagens(data);
    } catch { Alert.alert('Erro', 'Não foi possível carregar viagens'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function atualizarStatus(viagemId, novoStatus) {
    Alert.alert(
      'Confirmar',
      `Atualizar status para "${novoStatus.replace('_', ' ')}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.patch(`/viagens/${viagemId}/status`, { status: novoStatus });
              carregar();
            } catch (err) { Alert.alert('Erro', err.response?.data?.erro || 'Erro ao atualizar'); }
          },
        },
      ]
    );
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Voltar</Text></TouchableOpacity>
        <Text style={s.titulo}>Minhas Viagens</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} />}
      >
        {viagens.length === 0 && <Text style={s.vazio}>Nenhuma viagem encontrada.</Text>}
        {viagens.map(v => {
          const cor = STATUS_COR[v.status] || {};
          const proximos = PROXIMOS_STATUS[v.status] || [];
          return (
            <View key={v.id} style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardId}>Viagem #{v.id}</Text>
                <View style={[s.badge, { backgroundColor: cor.bg }]}>
                  <Text style={[s.badgeText, { color: cor.text }]}>{v.status}</Text>
                </View>
              </View>
              <Text style={s.info}>🚛 {v.Veiculo?.placa} — {v.Veiculo?.modelo}</Text>
              {v.Rota && <Text style={s.info}>📍 {v.Rota.origem} → {v.Rota.destino} ({v.Rota.distanciaKm} km)</Text>}
              {v.Carga && <Text style={s.info}>📦 {v.Carga.descricao} ({v.Carga.pesoKg} kg)</Text>}
              {v.Frete && <Text style={s.info}>💰 Frete: R$ {Number(v.Frete.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>}
              {proximos.length > 0 && (
                <View style={s.acoes}>
                  {proximos.map(ns => (
                    <TouchableOpacity key={ns} style={s.btnStatus} onPress={() => atualizarStatus(v.id, ns)}>
                      <Text style={s.btnStatusText}>{ns.replace('_', ' ')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page:         { flex: 1, backgroundColor: '#f0f2f5' },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:       { backgroundColor: '#1a3a5c', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back:         { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  titulo:       { color: '#fff', fontSize: 18, fontWeight: '700' },
  scroll:       { padding: 16, gap: 12 },
  vazio:        { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  card:         { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardId:       { fontSize: 15, fontWeight: '700', color: '#1a3a5c' },
  badge:        { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:    { fontSize: 12, fontWeight: '700' },
  info:         { fontSize: 13, color: '#555', marginBottom: 5 },
  acoes:        { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnStatus:    { flex: 1, backgroundColor: '#1a3a5c', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnStatusText:{ color: '#fff', fontSize: 13, fontWeight: '600' },
});
