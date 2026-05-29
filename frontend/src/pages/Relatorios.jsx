import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import styles from './CrudPage.module.css';

export default function Relatorios() {
  const [aba, setAba]     = useState('viagens');
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo]   = useState(null);

  useEffect(() => {
    setLoading(true);
    const url = aba === 'viagens' ? '/relatorios/viagens' : '/relatorios/fretes';
    api.get(url).then(r => { setDados(aba === 'viagens' ? r.data.viagens : r.data.fretes); setResumo(r.data); })
      .finally(() => setLoading(false));
  }, [aba]);

  const colsViagens = [
    { key: 'id',        label: '#' },
    { key: 'Motorista', label: 'Motorista', render: r => r.Motorista?.nome || '-' },
    { key: 'Veiculo',   label: 'Veículo',   render: r => r.Veiculo?.placa  || '-' },
    { key: 'Rota',      label: 'Rota',      render: r => r.Rota ? `${r.Rota.origem} → ${r.Rota.destino}` : '-' },
    { key: 'status',    label: 'Status' },
    { key: 'Frete',     label: 'Frete (R$)', render: r => r.Frete ? Number(r.Frete.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-' },
  ];

  const colsFretes = [
    { key: 'id',            label: '#' },
    { key: 'ViagemId',      label: 'Viagem #' },
    { key: 'valorBase',     label: 'Valor Base',     render: r => `R$ ${Number(r.valorBase).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
    { key: 'valorPedagio',  label: 'Pedágio',        render: r => `R$ ${Number(r.valorPedagio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
    { key: 'valorTotal',    label: 'Total',          render: r => <strong>R$ {Number(r.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>📈 Relatórios</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['viagens', 'fretes'].map(a => (
          <button key={a} onClick={() => setAba(a)}
            style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              background: aba === a ? 'var(--primary)' : '#e0e4ea', color: aba === a ? '#fff' : '#333' }}>
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
      {resumo && (
        <div style={{ background: '#fff', borderRadius: 8, padding: '12px 20px', marginBottom: 16, fontSize: 14, color: '#555', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          Total de registros: <strong>{resumo.total}</strong>
          {resumo.totalGeral && <> | Receita total: <strong>R$ {Number(resumo.totalGeral).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></>}
        </div>
      )}
      <div className={styles.card}>
        <Table columns={aba === 'viagens' ? colsViagens : colsFretes} data={dados} loading={loading} />
      </div>
    </div>
  );
}
