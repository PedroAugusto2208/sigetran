import React from 'react';
import CrudScreen from '../src/CrudScreen';

export default function Motoristas() {
  return (
    <CrudScreen
      titulo="Motoristas"
      icone="🧑‍✈️"
      endpoint="/motoristas"
      vazio={{ nome: '', cpf: '', cnh: '', telefone: '', email: '', ativo: true }}
      chaveLabel={m => m.nome}
      linhas={[
        { label: 'CPF', render: m => m.cpf },
        { label: 'CNH', render: m => m.cnh },
        { label: 'Telefone', render: m => m.telefone },
        { label: 'E-mail', render: m => m.email },
        { label: 'Status', render: m => (m.ativo ? '✅ Ativo' : '❌ Inativo') },
      ]}
      campos={[
        { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
        { name: 'cpf', label: 'CPF', type: 'text', required: true },
        { name: 'cnh', label: 'CNH', type: 'text', required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' },
        { name: 'email', label: 'E-mail', type: 'email' },
      ]}
    />
  );
}
