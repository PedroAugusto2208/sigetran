import React from 'react';
import CrudScreen from '../src/CrudScreen';

export default function Rotas() {
  return (
    <CrudScreen
      titulo="Rotas"
      icone="🗺️"
      endpoint="/rotas"
      vazio={{ origem: '', destino: '', distanciaKm: '', tempoEstimadoMin: '', valorPedagio: '' }}
      chaveLabel={r => `${r.origem} → ${r.destino}`}
      linhas={[
        { label: 'Distância', render: r => `${r.distanciaKm} km` },
        { label: 'Tempo', render: r => `${r.tempoEstimadoMin} min` },
        { label: 'Pedágio', render: r => `R$ ${r.valorPedagio}` },
      ]}
      campos={[
        { name: 'origem', label: 'Origem', type: 'text', required: true },
        { name: 'destino', label: 'Destino', type: 'text', required: true },
        { name: 'distanciaKm', label: 'Distância (km)', type: 'number', required: true },
        { name: 'tempoEstimadoMin', label: 'Tempo Estimado (min)', type: 'number' },
        { name: 'valorPedagio', label: 'Valor Pedágio (R$)', type: 'number' },
      ]}
    />
  );
}
