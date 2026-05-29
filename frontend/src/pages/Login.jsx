import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(form.login, form.senha);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🚚 SIGETRAN</div>
        <p className={styles.sub}>Sistema de Gestão de Transporte</p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Login</label>
          <input
            className={styles.input}
            value={form.login}
            onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
            placeholder="Digite seu login"
            required
          />
          <label className={styles.label}>Senha</label>
          <input
            className={styles.input}
            type="password"
            value={form.senha}
            onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
            placeholder="Digite sua senha"
            required
          />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button className={styles.btn} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
