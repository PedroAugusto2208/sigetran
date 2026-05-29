import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';
import Clientes from './pages/Clientes';
import Rotas from './pages/Rotas';
import Cargas from './pages/Cargas';
import Viagens from './pages/Viagens';
import Fretes from './pages/Fretes';
import Relatorios from './pages/Relatorios';
import Usuarios from './pages/Usuarios';

function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="veiculos"   element={<Veiculos />} />
        <Route path="motoristas" element={<Motoristas />} />
        <Route path="clientes"   element={<Clientes />} />
        <Route path="rotas"      element={<Rotas />} />
        <Route path="cargas"     element={<Cargas />} />
        <Route path="viagens"    element={<Viagens />} />
        <Route path="fretes"     element={<Fretes />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="usuarios"   element={<Usuarios />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
