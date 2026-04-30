import { useEffect, useState } from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const response = await api.get('/products/me');
        setProdutos(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    buscarProdutos();
  }, []);

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(p => p.quantidade <= 5).length;
  const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const totalItens = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  const cards = [
    {
      titulo: 'Total de Produtos',
      valor: totalProdutos.toLocaleString('pt-BR'),
      icone: Package,
      cor: '#7306a5',
      corFundo: '#f3f0ff',
    },
    {
      titulo: 'Total de Itens',
      valor: totalItens.toLocaleString('pt-BR'),
      icone: TrendingUp,
      cor: '#2563eb',
      corFundo: '#eff6ff',
    },
    {
      titulo: 'Estoque Baixo',
      valor: estoqueBaixo,
      icone: AlertTriangle,
      cor: '#dc2626',
      corFundo: '#fef2f2',
    },
    {
      titulo: 'Valor Total',
      valor: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icone: DollarSign,
      cor: '#16a34a',
      corFundo: '#f0fdf4',
    },
  ];

  return (
    <div>
      <h2 style={{ color: '#7306a5', fontWeight: '700', fontSize: '22px', marginBottom: '24px' }}>
        Dashboard
      </h2>

      {loading ? (
        <p style={{ color: '#888', fontSize: '14px' }}>Carregando...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {cards.map((card) => {
            const Icon = card.icone;
            return (
              <div key={card.titulo} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e9d5ff',
                boxShadow: '0 2px 8px rgba(124,58,237,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                    {card.titulo}
                  </span>
                  <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: card.corFundo,
                  }}>
                    <Icon size={18} color={card.cor} />
                  </div>
                </div>
                <span style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                  {card.valor}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;