import React from 'react';
import CrudScreen from '../src/CrudScreen';

const TIPOS = ['GERAL', 'PERIGOSA', 'PERECIVEL', 'FRAGIL', 'GRANEL'];

export default function Cargas() {
  return (
    <CrudScreen
      titulo="Cargas"
      icone="📦"
      endpoint="/cargas"
      vazio={{ descricao: '', pesoKg: '', volumeM3: '', tipoMercadoria: 'GERAL' }}
      chaveLabel={c => c.descricao}
      linhas={[
        { label: 'Peso', render: c => `${c.pesoKg} kg` },
        { label: 'Volume', render: c => `${c.volumeM3} m³` },
        { label: 'Tipo', render: c => c.tipoMercadoria },
      ]}
      campos={[
        { name: 'descricao', label: 'Descrição', type: 'text', required: true },
        { name: 'pesoKg', label: 'Peso (kg)', type: 'number', required: true },
        { name: 'volumeM3', label: 'Volume (m³)', type: 'number' },
        { name: 'tipoMercadoria', label: 'Tipo de Mercadoria', type: 'select', options: TIPOS },
      ]}
    />
  );
}
