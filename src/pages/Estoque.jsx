import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/estoque/Dashboard';
import Produtos from '../components/estoque/Produtos';
import EstoqueView from '../components/estoque/EstoqueView';

const Estoque = () => {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');

  const renderConteudo = () => {
    if (abaAtiva === 'dashboard') return <Dashboard />;
    if (abaAtiva === 'produtos') return <Produtos />;
    if (abaAtiva === 'estoque') return <EstoqueView />;
  };

  const titulos = {
    dashboard: 'Dashboard',
    produtos: 'Produtos',
    estoque: 'Estoque',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f0ff' }}>
      <Sidebar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar titulo={titulos[abaAtiva]} />
        <div style={{ flex: 1, padding: '24px' }}>
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
};

export default Estoque;