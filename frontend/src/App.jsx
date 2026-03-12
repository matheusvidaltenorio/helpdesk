/**
 * App - Rotas e proteção de páginas
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Chamados from './pages/Chamados';
import NovoChamado from './pages/NovoChamado';
import ChamadoDetalhe from './pages/ChamadoDetalhe';

function RotaProtegida({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Carregando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Chamados />
            </RotaProtegida>
          }
        />
        <Route
          path="/chamados"
          element={
            <RotaProtegida>
              <Chamados />
            </RotaProtegida>
          }
        />
        <Route
          path="/chamados/novo"
          element={
            <RotaProtegida>
              <NovoChamado />
            </RotaProtegida>
          }
        />
        <Route
          path="/chamados/:id"
          element={
            <RotaProtegida>
              <ChamadoDetalhe />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
