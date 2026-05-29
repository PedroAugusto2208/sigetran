import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from '../src/api';

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' });
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!form.login || !form.senha) { Alert.alert('Atenção', 'Preencha login e senha'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      await SecureStore.setItemAsync('sigetran_token', data.token);
      await SecureStore.setItemAsync('sigetran_usuario', JSON.stringify(data.usuario));
      router.replace('/dashboard');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || 'Não foi possível conectar ao servidor');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.card}>
        <Text style={s.logo}>🚚 SIGETRAN</Text>
        <Text style={s.sub}>Sistema de Gestão de Transporte</Text>

        <Text style={s.label}>Login</Text>
        <TextInput
          style={s.input} placeholder="Digite seu login"
          autoCapitalize="none"
          value={form.login}
          onChangeText={v => setForm(p => ({ ...p, login: v }))}
        />

        <Text style={s.label}>Senha</Text>
        <TextInput
          style={s.input} placeholder="Digite sua senha"
          secureTextEntry
          value={form.senha}
          onChangeText={v => setForm(p => ({ ...p, senha: v }))}
        />

        <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={entrar} disabled={loading}>
          <Text style={s.btnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page:       { flex: 1, backgroundColor: '#1a3a5c', justifyContent: 'center', padding: 24 },
  card:       { backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  logo:       { fontSize: 28, fontWeight: '700', color: '#1a3a5c', textAlign: 'center', marginBottom: 4 },
  sub:        { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 28 },
  label:      { fontSize: 13, fontWeight: '600', color: '#1a3a5c', marginBottom: 6, marginTop: 10 },
  input:      { borderWidth: 1, borderColor: '#dde3ec', borderRadius: 8, padding: 12, fontSize: 15 },
  btn:        { backgroundColor: '#1a3a5c', borderRadius: 8, padding: 14, marginTop: 20, alignItems: 'center' },
  btnDisabled:{ opacity: 0.7 },
  btnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
});
