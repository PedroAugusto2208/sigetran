import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/relatorios/dashboard')
      .then(r => setDados(r.data))
      .catch(() => setDados({ programadas: 0, emAndamento: 0, concluidas: 0, canceladas: 0, receitaTotal: '0.00' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;

  const cards = [
    { label: 'Viagens Programadas', value: dados.programadas,  icon: '🗓️', color: '#1a73e8' },
    { label: 'Em Andamento',        value: dados.emAndamento,  icon: '🚛', color: '#f39c12' },
    { label: 'Concluídas',          value: dados.concluidas,   icon: '✅', color: '#27ae60' },
    { label: 'Canceladas',          value: dados.canceladas,   icon: '❌', color: '#e74c3c' },
    { label: 'Receita Total (R$)',  value: Number(dados.receitaTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), icon: '💰', color: '#8e44ad' },
  ];

  return (
    <div>
      <h2 className={styles.titulo}>Bem-vindo, {usuario.nome}!</h2>
      <p className={styles.sub}>Painel de controle — SIGETRAN</p>
      <div className={styles.grid}>
        {cards.map(c => (
          <div key={c.label} className={styles.card} style={{ borderTop: `4px solid ${c.color}` }}>
            <div className={styles.cardIcon}>{c.icon}</div>
            <div className={styles.cardVal}>{c.value}</div>
            <div className={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
