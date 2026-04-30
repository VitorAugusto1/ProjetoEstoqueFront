import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = ({ titulo = 'Dashboard Overview' }) => {
  return (
    <div style={{
      width: '100%',
      height: '56px',
      background: '#7306a5',
      borderBottom: '1px solid #e9d5ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxSizing: 'border-box',
    }}>

      {/* Título */}
      <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
        {titulo}
      </span>

    </div>
  );
};

export default Navbar;