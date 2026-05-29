import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import styles from './CrudPage.module.css';

export default function Fretes() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fretes').then(r => setDados(r.data)).finally(() => setLoading(false));
  }, []);

  const fmt = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const cols = [
    { key: 'id',            label: '#' },
    { key: 'ViagemId',      label: 'Viagem #' },
    { key: 'valorBase',     label: 'Valor Base (R$)',  render: r => fmt(r.valorBase) },
    { key: 'valorPedagio',  label: 'Pedágio (R$)',     render: r => fmt(r.valorPedagio) },
    { key: 'adicionalCarga',label: 'Adicional (R$)',   render: r => fmt(r.adicionalCarga) },
    { key: 'valorTotal',    label: 'Total (R$)',       render: r => <strong>{fmt(r.valorTotal)}</strong> },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>💰 Fretes</h2>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} />
      </div>
    </div>
  );
}
