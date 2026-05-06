import { LayoutDashboard, Package, Warehouse, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', aba: 'dashboard' },
  { icon: Package, label: 'Produtos', aba: 'produtos' },
  { icon: Warehouse, label: 'Estoque', aba: 'estoque' },
];

const Sidebar = ({ abaAtiva, setAbaAtiva }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #e9d5ff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 0',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}>


      <div>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #e9d5ff' }}>
          <span style={{ color: '#7306a5', fontWeight: '700', fontSize: '18px' }}>
            ProjetoEstoque
          </span>
        </div>

        <div style={{ padding: '16px 0' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#aaa', padding: '0 20px', letterSpacing: '0.08em' }}>
            MENU PRINCIPAL
          </span>

          <nav style={{ marginTop: '8px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const ativo = abaAtiva === item.aba;
              return (
                <div
                  key={item.aba}
                  onClick={() => setAbaAtiva(item.aba)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 20px',
                    margin: '2px 8px',
                    borderRadius: '8px',
                    background: ativo ? '#f3f0ff' : 'transparent',
                    color: ativo ? '#7306a5' : '#555',
                    fontWeight: ativo ? '600' : '400',
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderLeft: ativo ? '3px solid #7306a5' : '3px solid transparent',
                  }}
                >
                  <Icon size={18} color={ativo ? '#7306a5' : '#888'} />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #e9d5ff' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#333', margin: '0 0 12px' }}>
          {user?.email}
        </p>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#e53e3e',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <LogOut size={16} color="#e53e3e" />
          Sair
        </button>
      </div>

    </div>
  );
};

export default Sidebar;