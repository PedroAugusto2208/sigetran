import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

const MENU = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '📊' },
  { to: '/veiculos',   label: 'Veículos',     icon: '🚛' },
  { to: '/motoristas', label: 'Motoristas',   icon: '👤' },
  { to: '/clientes',   label: 'Clientes',     icon: '🏢' },
  { to: '/rotas',      label: 'Rotas',        icon: '🗺️' },
  { to: '/cargas',     label: 'Cargas',       icon: '📦' },
  { to: '/viagens',    label: 'Viagens',      icon: '🗓️' },
  { to: '/fretes',     label: 'Fretes',       icon: '💰' },
  { to: '/relatorios', label: 'Relatórios',   icon: '📈' },
  { to: '/usuarios',   label: 'Usuários',     icon: '⚙️', somente: ['ADMINISTRADOR'] },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(true);

  function sair() { logout(); navigate('/login'); }

  const itens = MENU.filter(m => !m.somente || m.somente.includes(usuario.tipo));

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebar ? '' : styles.collapsed}`}>
        <div className={styles.logo}>
          {sidebar ? <span>🚚 SIGETRAN</span> : <span>🚚</span>}
        </div>
        <nav className={styles.nav}>
          {itens.map(m => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              title={m.label}
            >
              <span className={styles.icon}>{m.icon}</span>
              {sidebar && <span>{m.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className={styles.sairBtn} onClick={sair}>
          <span>🚪</span>{sidebar && ' Sair'}
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.toggleBtn} onClick={() => setSidebar(s => !s)}>☰</button>
          <span className={styles.headerTitle}>Sistema de Gestão de Transporte</span>
          <span className={styles.usuario}>
            {usuario.nome} <span className={styles.badge}>{usuario.tipo.replace('_', ' ')}</span>
          </span>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
