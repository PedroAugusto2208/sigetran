import React from 'react';
import CrudScreen from '../src/CrudScreen';

const fmt = v => `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export default function Fretes() {
  return (
    <CrudScreen
      titulo="Fretes"
      icone="💰"
      endpoint="/fretes"
      somenteLeitura
      chaveLabel={f => `Frete #${f.id} — Viagem #${f.ViagemId}`}
      linhas={[
        { label: 'Valor base', render: f => fmt(f.valorBase) },
        { label: 'Pedágio', render: f => fmt(f.valorPedagio) },
        { label: 'Adicional', render: f => fmt(f.adicionalCarga) },
        { label: 'Total', render: f => fmt(f.valorTotal) },
      ]}
    />
  );
}
