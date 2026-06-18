import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  StyleSheet, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import api from './api';

/**
 * Tela CRUD genérica reutilizável.
 *
 * props:
 *  - titulo:    string do cabeçalho
 *  - endpoint:  rota da API (ex: '/veiculos')
 *  - icone:     emoji do título
 *  - vazio:     objeto inicial do formulário
 *  - chaveLabel: função(item) => texto principal do card
 *  - linhas:    [{ label, render(item) }] linhas exibidas no card
 *  - campos:    [{ name, label, type:'text'|'number'|'email'|'password'|'select', required, options:[] }]
 *  - somenteLeitura: se true, esconde botões de criar/editar/excluir
 */
export default function CrudScreen({
  titulo, endpoint, icone = '📋', vazio = {}, chaveLabel,
  linhas = [], campos = [], somenteLeitura = false,
}) {
  const [dados, setDados]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(vazio);
  const [erro, setErro]           = useState('');
  const [salvando, setSalvando]   = useState(false);

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get(endpoint);
      setDados(data);
    } catch { Alert.alert('Erro', `Não foi possível carregar ${titulo.toLowerCase()}`); }
    finally { setLoading(false); setRefreshing(false); }
  }, [endpoint, titulo]);

  useEffect(() => { carregar(); }, [carregar]);

  function abrir(item) { setForm(item ? { ...item } : { ...vazio }); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm({ ...vazio }); setErro(''); }

  async function salvar() {
    setErro(''); setSalvando(true);
    try {
      if (form.id) await api.put(`${endpoint}/${form.id}`, form);
      else         await api.post(endpoint, form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
    finally { setSalvando(false); }
  }

  function remover(item) {
    Alert.alert('Confirmar exclusão', `Excluir "${chaveLabel(item)}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await api.delete(`${endpoint}/${item.id}`); carregar(); }
          catch (err) { Alert.alert('Erro', err.response?.data?.erro || 'Erro ao excluir'); }
        },
      },
    ]);
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Voltar</Text></TouchableOpacity>
        <Text style={s.titulo}>{icone} {titulo}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} />}
      >
        {dados.length === 0 && <Text style={s.vazio}>Nenhum registro encontrado.</Text>}
        {dados.map(item => (
          <View key={item.id} style={s.card}>
            <Text style={s.cardTitulo}>{chaveLabel(item)}</Text>
            {linhas.map(l => {
              const valor = l.render(item);
              if (valor == null || valor === '') return null;
              return <Text key={l.label} style={s.info}>{l.label}: {valor}</Text>;
            })}
            {!somenteLeitura && (
              <View style={s.acoes}>
                <TouchableOpacity style={s.btnEditar} onPress={() => abrir(item)}>
                  <Text style={s.btnEditarText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnExcluir} onPress={() => remover(item)}>
                  <Text style={s.btnExcluirText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {!somenteLeitura && (
        <TouchableOpacity style={s.fab} onPress={() => abrir(null)}>
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modal} animationType="slide" transparent onRequestClose={fechar}>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitulo}>{form.id ? 'Editar' : 'Novo'} — {titulo}</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {campos.map(f => (
                <View key={f.name} style={s.campo}>
                  <Text style={s.label}>{f.label}{f.required ? ' *' : ''}</Text>
                  {f.type === 'select' ? (
                    <View style={s.chips}>
                      {f.options.map(o => {
                        const val = typeof o === 'object' ? o.value : o;
                        const lbl = typeof o === 'object' ? o.label : o;
                        const ativo = String(form[f.name]) === String(val);
                        return (
                          <TouchableOpacity
                            key={val}
                            style={[s.chip, ativo && s.chipAtivo]}
                            onPress={() => setForm(p => ({ ...p, [f.name]: val }))}
                          >
                            <Text style={[s.chipText, ativo && s.chipTextAtivo]}>{lbl}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <TextInput
                      style={s.input}
                      value={form[f.name] != null ? String(form[f.name]) : ''}
                      placeholder={f.label}
                      autoCapitalize={f.type === 'email' || f.type === 'password' ? 'none' : 'sentences'}
                      keyboardType={f.type === 'number' ? 'numeric' : f.type === 'email' ? 'email-address' : 'default'}
                      secureTextEntry={f.type === 'password'}
                      onChangeText={v => setForm(p => ({ ...p, [f.name]: v }))}
                    />
                  )}
                </View>
              ))}
              {erro ? <Text style={s.erro}>{erro}</Text> : null}
            </ScrollView>
            <View style={s.modalAcoes}>
              <TouchableOpacity style={s.btnCancelar} onPress={fechar}>
                <Text style={s.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnSalvar, salvando && { opacity: 0.7 }]} onPress={salvar} disabled={salvando}>
                <Text style={s.btnSalvarText}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  page:        { flex: 1, backgroundColor: '#f0f2f5' },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:      { backgroundColor: '#1a3a5c', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back:        { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  titulo:      { color: '#fff', fontSize: 17, fontWeight: '700' },
  scroll:      { padding: 16, gap: 12, paddingBottom: 100 },
  vazio:       { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  card:        { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardTitulo:  { fontSize: 16, fontWeight: '700', color: '#1a3a5c', marginBottom: 8 },
  info:        { fontSize: 13, color: '#555', marginBottom: 4 },
  acoes:       { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnEditar:   { flex: 1, backgroundColor: '#eef2f7', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnEditarText:{ color: '#1a3a5c', fontSize: 13, fontWeight: '600' },
  btnExcluir:  { flex: 1, backgroundColor: '#fce8e6', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnExcluirText:{ color: '#c5221f', fontSize: 13, fontWeight: '600' },
  fab:         { position: 'absolute', right: 20, bottom: 24, backgroundColor: '#1a3a5c', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  fabText:     { color: '#fff', fontSize: 30, fontWeight: '300', marginTop: -2 },
  modalOverlay:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox:    { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 32 },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#1a3a5c', marginBottom: 16 },
  campo:       { marginBottom: 14 },
  label:       { fontSize: 13, fontWeight: '600', color: '#1a3a5c', marginBottom: 6 },
  input:       { borderWidth: 1, borderColor: '#dde3ec', borderRadius: 8, padding: 12, fontSize: 15 },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { borderWidth: 1, borderColor: '#dde3ec', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipAtivo:   { backgroundColor: '#1a3a5c', borderColor: '#1a3a5c' },
  chipText:    { color: '#555', fontSize: 13 },
  chipTextAtivo:{ color: '#fff', fontWeight: '600' },
  erro:        { color: '#c5221f', fontSize: 13, marginTop: 4, marginBottom: 8 },
  modalAcoes:  { flexDirection: 'row', gap: 12, marginTop: 16 },
  btnCancelar: { flex: 1, backgroundColor: '#eef2f7', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnCancelarText:{ color: '#555', fontSize: 15, fontWeight: '600' },
  btnSalvar:   { flex: 1, backgroundColor: '#1a3a5c', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnSalvarText:{ color: '#fff', fontSize: 15, fontWeight: '700' },
});
