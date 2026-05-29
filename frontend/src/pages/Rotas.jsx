import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const VAZIO = { origem: '', destino: '', distanciaKm: '', tempoEstimadoMin: '', valorPedagio: '' };

export default function Rotas() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');

  const carregar = () => api.get('/rotas').then(r => setDados(r.data)).finally(() => setLoading(false));
  useEffect(() => { carregar(); }, []);

  function abrir(item = VAZIO) { setForm(item); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm(VAZIO); }

  async function salvar(e) {
    e.preventDefault(); setErro('');
    try {
      if (form.id) await api.put(`/rotas/${form.id}`, form);
      else         await api.post('/rotas', form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
  }

  async function remover(item) {
    if (!confirm(`Excluir rota ${item.origem} → ${item.destino}?`)) return;
    try { await api.delete(`/rotas/${item.id}`); carregar(); }
    catch (err) { alert(err.response?.data?.erro || 'Erro ao excluir'); }
  }

  const cols = [
    { key: 'origem',           label: 'Origem' },
    { key: 'destino',          label: 'Destino' },
    { key: 'distanciaKm',      label: 'Distância (km)' },
    { key: 'tempoEstimadoMin', label: 'Tempo (min)' },
    { key: 'valorPedagio',     label: 'Pedágio (R$)' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>🗺️ Rotas</h2>
        <button className={styles.btnNovo} onClick={() => abrir()}>+ Nova Rota</button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} onEdit={abrir} onDelete={remover} />
      </div>
      {modal && (
        <Modal titulo={form.id ? 'Editar Rota' : 'Nova Rota'} onClose={fechar}>
          <form onSubmit={salvar} className={styles.form}>
            {[
              { name: 'origem',           label: 'Origem',                   type: 'text',   required: true },
              { name: 'destino',          label: 'Destino',                  type: 'text',   required: true },
              { name: 'distanciaKm',      label: 'Distância (km)',           type: 'number', required: true },
              { name: 'tempoEstimadoMin', label: 'Tempo Estimado (minutos)', type: 'number' },
              { name: 'valorPedagio',     label: 'Valor Pedágio (R$)',       type: 'number' },
            ].map(f => (
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
