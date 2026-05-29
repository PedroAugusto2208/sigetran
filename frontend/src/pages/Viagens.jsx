import React, { useEffect, useState } from 'react';
import api from '../api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from './CrudPage.module.css';

const STATUS_CORES = {
  PROGRAMADA:   { bg: '#e8f0fe', color: '#1a73e8' },
  EM_ANDAMENTO: { bg: '#fff3e0', color: '#e65100' },
  CONCLUIDA:    { bg: '#e8f5e9', color: '#2e7d32' },
  CANCELADA:    { bg: '#fce8e6', color: '#c5221f' },
};

export default function Viagens() {
  const [dados, setDados]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalNova, setModalNova]     = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [selecionada, setSelecionada] = useState(null);
  const [form, setForm]         = useState({});
  const [listas, setListas]     = useState({ veiculos: [], motoristas: [], rotas: [], cargas: [], clientes: [] });
  const [erro, setErro]         = useState('');

  const carregar = () => api.get('/viagens').then(r => setDados(r.data)).finally(() => setLoading(false));

  useEffect(() => {
    carregar();
    Promise.all([
      api.get('/veiculos'),
      api.get('/motoristas'),
      api.get('/rotas'),
      api.get('/cargas'),
      api.get('/clientes'),
    ]).then(([v, m, r, c, cl]) => setListas({
      veiculos: v.data, motoristas: m.data, rotas: r.data, cargas: c.data, clientes: cl.data,
    }));
  }, []);

  async function criarViagem(e) {
    e.preventDefault(); setErro('');
    try {
      await api.post('/viagens', form);
      setModalNova(false); setForm({}); carregar();
    } catch (err) { setErro(err.response?.data?.erro || 'Erro ao programar viagem'); }
  }

  async function atualizarStatus(novoStatus) {
    try {
      await api.patch(`/viagens/${selecionada.id}/status`, { status: novoStatus });
      setModalStatus(false); setSelecionada(null); carregar();
    } catch (err) { alert(err.response?.data?.erro || 'Erro ao atualizar status'); }
  }

  const cols = [
    { key: 'id', label: '#' },
    { key: 'Veiculo',   label: 'Veículo',   render: r => r.Veiculo?.placa || '-' },
    { key: 'Motorista', label: 'Motorista', render: r => r.Motorista?.nome || '-' },
    { key: 'Rota',      label: 'Rota',      render: r => r.Rota ? `${r.Rota.origem} → ${r.Rota.destino}` : '-' },
    { key: 'status', label: 'Status', render: r => {
      const c = STATUS_CORES[r.status] || {};
      return <span style={{ ...c, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{r.status}</span>;
    }},
    { key: 'Frete', label: 'Frete (R$)', render: r => r.Frete ? Number(r.Frete.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.titulo}>🗓️ Viagens</h2>
        <button className={styles.btnNovo} onClick={() => { setForm({}); setErro(''); setModalNova(true); }}>
          + Programar Viagem
        </button>
      </div>
      <div className={styles.card}>
        <Table columns={cols} data={dados} loading={loading}
          onEdit={row => { setSelecionada(row); setModalStatus(true); }} />
      </div>

      {modalNova && (
        <Modal titulo="Programar Nova Viagem" onClose={() => setModalNova(false)}>
          <form onSubmit={criarViagem} className={styles.form}>
            {[
              { name: 'VeiculoId',   label: 'Veículo',   opts: listas.veiculos,   val: v => v.id, lbl: v => `${v.placa} - ${v.modelo}` },
              { name: 'MotoristaId', label: 'Motorista', opts: listas.motoristas, val: m => m.id, lbl: m => m.nome },
              { name: 'RotaId',      label: 'Rota',      opts: listas.rotas,      val: r => r.id, lbl: r => `${r.origem} → ${r.destino}` },
              { name: 'CargaId',     label: 'Carga',     opts: listas.cargas,     val: c => c.id, lbl: c => `${c.descricao} (${c.pesoKg}kg)` },
              { name: 'ClienteId',   label: 'Cliente',   opts: listas.clientes,   val: c => c.id, lbl: c => c.nome },
            ].map(f => (
              <div key={f.name} className={styles.campo}>
                <label>{f.label}</label>
                <select required value={form[f.name] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {f.opts.map(o => <option key={f.val(o)} value={f.val(o)}>{f.lbl(o)}</option>)}
                </select>
              </div>
            ))}
            <div className={styles.campo}>
              <label>Data de Partida</label>
              <input type="datetime-local"
                value={form.dataPartida || ''}
                onChange={e => setForm(p => ({ ...p, dataPartida: e.target.value }))} />
            </div>
            {erro && <p className={styles.erro}>{erro}</p>}
            <div className={styles.acoes}>
              <button type="button" className={styles.btnCancelar} onClick={() => setModalNova(false)}>Cancelar</button>
              <button type="submit" className={styles.btnSalvar}>Programar</button>
            </div>
          </form>
        </Modal>
      )}

      {modalStatus && selecionada && (
        <Modal titulo={`Atualizar Status — Viagem #${selecionada.id}`} onClose={() => setModalStatus(false)}>
          <p style={{ marginBottom: 16, color: '#555', fontSize: 14 }}>
            Status atual: <strong>{selecionada.status}</strong>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'].map(s => {
              const c = STATUS_CORES[s];
              return (
                <button key={s} onClick={() => atualizarStatus(s)}
                  style={{ ...c, border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  {s.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
