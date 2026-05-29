import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const VAZIO = { nome: '', cpf: '', cnh: '', telefone: '', email: '', ativo: true };

export default function Motoristas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');

  const carregar = () => api.get('/motoristas').then(r => setDados(r.data)).finally(() => setLoading(false));
  useEffect(() => { carregar(); }, []);

  function abrir(item = VAZIO) { setForm(item); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm(VAZIO); }

  async function salvar(e) {
    e.preventDefault(); setErro('');
    try {
      if (form.id) await api.put(`/motoristas/${form.id}`, form);
      else         await api.post('/motoristas', form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
  }

  async function remover(item) {
    if (!confirm(`Excluir motorista ${item.nome}?`)) return;
    try { await api.delete(`/motoristas/${item.id}`); carregar(); }
    catch (err) { alert(err.response?.data?.erro || 'Erro ao excluir'); }
  }

  const cols = [
    { key: 'nome',     label: 'Nome' },
    { key: 'cpf',      label: 'CPF' },
    { key: 'cnh',      label: 'CNH' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email',    label: 'E-mail' },
    { key: 'ativo', label: 'Status', render: r => r.ativo ? '✅ Ativo' : '❌ Inativo' },
  ];

  const campos = [
    { name: 'nome',     label: 'Nome Completo', type: 'text',  required: true },
    { name: 'cpf',      label: 'CPF',           type: 'text',  required: true },
    { name: 'cnh',      label: 'CNH',           type: 'text',  required: true },
    { name: 'telefone', label: 'Telefone',       type: 'text' },
    { name: 'email',    label: 'E-mail',         type: 'email' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>👤 Motoristas</h2>
        <button className={styles.btnNovo} onClick={() => abrir()}>+ Novo Motorista</button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} onEdit={abrir} onDelete={remover} />
      </div>
      {modal && (
        <Modal titulo={form.id ? 'Editar Motorista' : 'Novo Motorista'} onClose={fechar}>
          <form onSubmit={salvar} className={styles.form}>
            {campos.map(f => (
              <div key={f.name} className={styles.campo}>
                <label>{f.label}</label>
                <input type={f.type} required={f.required}
                  value={form[f.name] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
              </div>
            ))}
            {erro && <p className={styles.erro}>{erro}</p>}
            <div className={styles.acoes}>
              <button type="button" className={styles.btnCancelar} onClick={fechar}>Cancelar</button>
              <button type="submit" className={styles.btnSalvar}>Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
