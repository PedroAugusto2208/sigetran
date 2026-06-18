import React from 'react';
import CrudScreen from '../src/CrudScreen';

export default function Veiculos() {
  return (
    <CrudScreen
      titulo="Veículos"
      icone="🚛"
      endpoint="/veiculos"
      vazio={{ placa: '', modelo: '', marca: '', anoFabricacao: '', capacidadeCarga: '', ativo: true }}
      chaveLabel={v => `${v.placa} — ${v.modelo}`}
      linhas={[
        { label: 'Marca', render: v => v.marca },
        { label: 'Ano', render: v => v.anoFabricacao },
        { label: 'Capacidade', render: v => `${v.capacidadeCarga} kg` },
        { label: 'Status', render: v => (v.ativo ? '✅ Ativo' : '❌ Inativo') },
      ]}
      campos={[
        { name: 'placa', label: 'Placa', type: 'text', required: true },
        { name: 'modelo', label: 'Modelo', type: 'text', required: true },
        { name: 'marca', label: 'Marca', type: 'text', required: true },
        { name: 'anoFabricacao', label: 'Ano de Fabricação', type: 'number', required: true },
        { name: 'capacidadeCarga', label: 'Capacidade (kg)', type: 'number', required: true },
      ]}
    />
  );
}
