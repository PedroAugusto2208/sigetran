import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const s = localStorage.getItem('sigetran_usuario');
    return s ? JSON.parse(s) : null;
  });

  async function login(login, senha) {
    const { data } = await api.post('/auth/login', { login, senha });
    localStorage.setItem('sigetran_token', data.token);
    localStorage.setItem('sigetran_usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('sigetran_token');
    localStorage.removeItem('sigetran_usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
