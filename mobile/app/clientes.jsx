import React from 'react';
import CrudScreen from '../src/CrudScreen';

export default function Clientes() {
  return (
    <CrudScreen
      titulo="Clientes"
      icone="🏢"
      endpoint="/clientes"
      vazio={{ nome: '', cpfCnpj: '', telefone: '', email: '', endereco: '', ativo: true }}
      chaveLabel={c => c.nome}
      linhas={[
        { label: 'CPF/CNPJ', render: c => c.cpfCnpj },
        { label: 'Telefone', render: c => c.telefone },
        { label: 'E-mail', render: c => c.email },
        { label: 'Endereço', render: c => c.endereco },
        { label: 'Status', render: c => (c.ativo ? '✅ Ativo' : '❌ Inativo') },
      ]}
      campos={[
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'cpfCnpj', label: 'CPF/CNPJ', type: 'text', required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' },
        { name: 'email', label: 'E-mail', type: 'email' },
        { name: 'endereco', label: 'Endereço', type: 'text' },
      ]}
    />
  );
}
