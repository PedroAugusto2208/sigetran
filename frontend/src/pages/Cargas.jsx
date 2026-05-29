import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const VAZIO = { descricao: '', pesoKg: '', volumeM3: '', tipoMercadoria: 'GERAL' };
const TIPOS  = ['GERAL', 'PERIGOSA', 'PERECIVEL', 'FRAGIL', 'GRANEL'];

export default function Cargas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');

  const carregar = () => api.get('/cargas').then(r => setDados(r.data)).finally(() => setLoading(false));
  useEffect(() => { carregar(); }, []);

  function abrir(item = VAZIO) { setForm(item); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm(VAZIO); }

  async function salvar(e) {
    e.preventDefault(); setErro('');
    try {
      if (form.id) await api.put(`/cargas/${form.id}`, form);
      else         await api.post('/cargas', form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
  }

  async function remover(item) {
    if (!confirm(`Excluir carga "${item.descricao}"?`)) return;
    try { await api.delete(`/cargas/${item.id}`); carregar(); }
    catch (err) { alert(err.response?.data?.erro || 'Erro ao excluir'); }
  }

  const cols = [
    { key: 'descricao',      label: 'Descrição' },
    { key: 'pesoKg',         label: 'Peso (kg)' },
    { key: 'volumeM3',       label: 'Volume (m³)' },
    { key: 'tipoMercadoria', label: 'Tipo' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>📦 Cargas</h2>
        <button className={styles.btnNovo} onClick={() => abrir()}>+ Nova Carga</button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} onEdit={abrir} onDelete={remover} />
      </div>
      {modal && (
        <Modal titulo={form.id ? 'Editar Carga' : 'Nova Carga'} onClose={fechar}>
          <form onSubmit={salvar} className={styles.form}>
            <div className={styles.campo}>
              <label>Descrição</label>
              <input required value={form.descricao || ''}
                onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label>Peso (kg)</label>
              <input type="number" required value={form.pesoKg || ''}
                onChange={e => setForm(p => ({ ...p, pesoKg: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label>Volume (m³)</label>
              <input type="number" required value={form.volumeM3 || ''}
                onChange={e => setForm(p => ({ ...p, volumeM3: e.target.value }))} />
            </div>
            <div className={styles.campo}>
              <label>Tipo de Mercadoria</label>
              <select value={form.tipoMercadoria || 'GERAL'}
                onChange={e => setForm(p => ({ ...p, tipoMercadoria: e.target.value }))}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
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
