import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import api from '../src/api';

const CAMPOS = [
  { name: 'VeiculoId',   label: 'Veículo',   lista: 'veiculos',   lbl: v => `${v.placa} - ${v.modelo}` },
  { name: 'MotoristaId', label: 'Motorista', lista: 'motoristas', lbl: m => m.nome },
  { name: 'RotaId',      label: 'Rota',      lista: 'rotas',      lbl: r => `${r.origem} → ${r.destino}` },
  { name: 'CargaId',     label: 'Carga',     lista: 'cargas',     lbl: c => `${c.descricao} (${c.pesoKg}kg)` },
  { name: 'ClienteId',   label: 'Cliente',   lista: 'clientes',   lbl: c => c.nome },
];

export default function NovaViagem() {
  const [listas, setListas] = useState({ veiculos: [], motoristas: [], rotas: [], cargas: [], clientes: [] });
  const [form, setForm]     = useState({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]     = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/veiculos'), api.get('/motoristas'), api.get('/rotas'),
      api.get('/cargas'), api.get('/clientes'),
    ]).then(([v, m, r, c, cl]) => {
      setListas({ veiculos: v.data, motoristas: m.data, rotas: r.data, cargas: c.data, clientes: cl.data });
    }).catch(() => Alert.alert('Erro', 'Falha ao carregar dados'))
      .finally(() => setLoading(false));
  }, []);

  async function salvar() {
    for (const c of CAMPOS) {
      if (!form[c.name]) { setErro(`Selecione: ${c.label}`); return; }
    }
    setErro(''); setSalvando(true);
    try {
      await api.post('/viagens', form);
      Alert.alert('Sucesso', 'Viagem criada!', [{ text: 'OK', onPress: () => router.replace('/viagens') }]);
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao criar viagem'); }
    finally { setSalvando(false); }
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Voltar</Text></TouchableOpacity>
        <Text style={s.titulo}>➕ Nova Viagem</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {CAMPOS.map(c => (
          <View key={c.name} style={s.campo}>
            <Text style={s.label}>{c.label} *</Text>
            <View style={s.chips}>
              {listas[c.lista].length === 0 && <Text style={s.aviso}>Nenhum {c.label.toLowerCase()} cadastrado</Text>}
              {listas[c.lista].map(o => {
                const ativo = String(form[c.name]) === String(o.id);
                return (
                  <TouchableOpacity
                    key={o.id}
                    style={[s.chip, ativo && s.chipAtivo]}
                    onPress={() => setForm(p => ({ ...p, [c.name]: o.id }))}
                  >
                    <Text style={[s.chipText, ativo && s.chipTextAtivo]}>{c.lbl(o)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        {erro ? <Text style={s.erro}>{erro}</Text> : null}
        <TouchableOpacity style={[s.btnSalvar, salvando && { opacity: 0.7 }]} onPress={salvar} disabled={salvando}>
          <Text style={s.btnSalvarText}>{salvando ? 'Criando...' : 'Criar Viagem'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page:        { flex: 1, backgroundColor: '#f0f2f5' },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:      { backgroundColor: '#1a3a5c', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back:        { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  titulo:      { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll:      { padding: 16 },
  campo:       { marginBottom: 18 },
  label:       { fontSize: 14, fontWeight: '600', color: '#1a3a5c', marginBottom: 8 },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { borderWidth: 1, borderColor: '#dde3ec', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff' },
  chipAtivo:   { backgroundColor: '#1a3a5c', borderColor: '#1a3a5c' },
  chipText:    { color: '#555', fontSize: 13 },
  chipTextAtivo:{ color: '#fff', fontWeight: '600' },
  aviso:       { color: '#c5221f', fontSize: 13 },
  erro:        { color: '#c5221f', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  btnSalvar:   { backgroundColor: '#1a3a5c', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  btnSalvarText:{ color: '#fff', fontSize: 16, fontWeight: '700' },
});
