import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const VAZIO = { placa: '', modelo: '', marca: '', anoFabricacao: '', capacidadeCarga: '', ativo: true };

export default function Veiculos() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');

  const carregar = () => api.get('/veiculos').then(r => setDados(r.data)).finally(() => setLoading(false));
  useEffect(() => { carregar(); }, []);

  function abrir(item = VAZIO) { setForm(item); setErro(''); setModal(true); }
  function fechar() { setModal(false); setForm(VAZIO); }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (form.id) await api.put(`/veiculos/${form.id}`, form);
      else         await api.post('/veiculos', form);
      fechar(); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao salvar'); }
  }

  async function remover(item) {
    if (!confirm(`Excluir veículo ${item.placa}?`)) return;
    try { await api.delete(`/veiculos/${item.id}`); carregar(); }
    catch (err) { alert(err.response?.data?.erro || 'Erro ao excluir'); }
  }

  const cols = [
    { key: 'placa',            label: 'Placa' },
    { key: 'modelo',           label: 'Modelo' },
    { key: 'marca',            label: 'Marca' },
    { key: 'anoFabricacao',    label: 'Ano' },
    { key: 'capacidadeCarga',  label: 'Cap. Carga (kg)' },
    { key: 'ativo', label: 'Status', render: r => r.ativo ? '✅ Ativo' : '❌ Inativo' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>🚛 Veículos</h2>
        <button className={styles.btnNovo} onClick={() => abrir()}>+ Novo Veículo</button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading} onEdit={abrir} onDelete={remover} />
      </div>

      {modal && (
        <Modal titulo={form.id ? 'Editar Veículo' : 'Novo Veículo'} onClose={fechar}>
          <form onSubmit={salvar} className={styles.form}>
            {[
              { name: 'placa',           label: 'Placa',            type: 'text', required: true },
              { name: 'modelo',          label: 'Modelo',           type: 'text', required: true },
              { name: 'marca',           label: 'Marca',            type: 'text', required: true },
              { name: 'anoFabricacao',   label: 'Ano de Fabricação',type: 'number', required: true },
              { name: 'capacidadeCarga', label: 'Capacidade (kg)',  type: 'number', required: true },
            ].map(f => (
              <div key={f.name} className={styles.campo}>
                <label>{f.label}</label>
                <input
                  type={f.type} required={f.required}
                  value={form[f.name] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                />
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
