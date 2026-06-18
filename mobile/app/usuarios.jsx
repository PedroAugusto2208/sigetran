import React from 'react';
import CrudScreen from '../src/CrudScreen';

const TIPOS = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'GESTOR_TRANSPORTE', label: 'Gestor' },
  { value: 'MOTORISTA', label: 'Motorista' },
  { value: 'FINANCEIRO', label: 'Financeiro' },
];

export default function Usuarios() {
  return (
    <CrudScreen
      titulo="Usuários"
      icone="👤"
      endpoint="/usuarios"
      vazio={{ nome: '', login: '', senha: '', tipo: 'GESTOR_TRANSPORTE', ativo: true }}
      chaveLabel={u => u.nome}
      linhas={[
        { label: 'Login', render: u => u.login },
        { label: 'Perfil', render: u => u.tipo },
        { label: 'Status', render: u => (u.ativo ? '✅ Ativo' : '❌ Inativo') },
      ]}
      campos={[
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'login', label: 'Login', type: 'text', required: true },
        { name: 'senha', label: 'Senha (deixe em branco p/ manter)', type: 'password' },
        { name: 'tipo', label: 'Perfil', type: 'select', options: TIPOS },
      ]}
    />
  );
}
