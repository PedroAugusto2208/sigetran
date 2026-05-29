import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const VAZIO = { nome: '', login: '', senha: '', tipo: 'GESTOR_TRANSPORTE', ativo: true };
const TIPOS  = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE', 'MOTORISTA', 'FINANCEIRO'];

export default function Usuarios() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState(VAZIO);
  const [erro, setErro]   = useState('');

  const carregar = () => api.get('/usuarios').then(r => setDados(r.data)).finally(() => setLoading(false));
  useEffect(() => { carregar(); }, []);

  function abrir(item = VAZIO) { setForm({ ...item, senha: '' }); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm(VAZIO); }

  async function salvar(e) {
    e.preventDefault(); setErro('');
    try {
      const payload = { ...form };
      if (!payload.senha) delete payload.senha;
      if (form.id) await api.put(`/usuarios/${form.id}`, payload);
      else         await api.post('/usuarios', form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
  }

  async function remover(item) {
    if (!confirm(`Excluir usuário ${item.nome}?`)) return;
    try { await api.delete(`/usuarios/${item.id}`); carregar(); }
    catch (err) { alert(err.response?.data?.erro || 'Erro ao excluir'); }
  }

  const cols = [
    { key: 'nome',  label: 'Nome' },
    { key: 'login', label: 'Login' },
    { key: 'tipo',  label: 'Perfil' },
    { key: 'ativo', label: 'Status', render: r => r.ativo ? '✅ Ativo' : '❌ Inativo' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>⚙️ Usuários</h2>
        <button className={styles.btnNovo} onClick={() => abrir()}>+ Novo Usuário</button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} onEdit={abrir} onDelete={remover} />
      </div>
      {modal && (
        <Modal titulo={form.id ? 'Editar Usuário' : 'Novo Usuário'} onClose={fechar}>
          <form onSubmit={salvar} className={styles.form}>
            <div className={styles.campo}><label>Nome</label>
              <input required value={form.nome || ''} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div className={styles.campo}><label>Login</label>
              <input required value={form.login || ''} onChange={e => setForm(p => ({ ...p, login: e.target.value }))} />
            </div>
            <div className={styles.campo}><label>Senha {form.id && '(deixe em branco para manter)'}</label>
              <input type="password" required={!form.id} value={form.senha || ''} onChange={e => setForm(p => ({ ...p, senha: e.target.value }))} />
            </div>
            <div className={styles.campo}><label>Perfil</label>
              <select value={form.tipo || 'GESTOR_TRANSPORTE'} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                {TIPOS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
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
