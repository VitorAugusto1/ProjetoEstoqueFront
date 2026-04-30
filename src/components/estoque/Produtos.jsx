import { useEffect, useState, useRef } from 'react';
import { Package, CheckCircle, XCircle, Plus, Search, ChevronLeft, ChevronRight, X, Save, ImagePlus, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { uploadFoto } from '../../services/storage';


const AdicionarProduto = ({ aberto, onFechar, onSalvar, produto }) => {
  const { user } = useAuth();
  const inputFotoRef = useRef(null);
  const [form, setForm] = useState({
    nome: '', quantidade: '', foto: '', fotoNome: '', preco: '', arquivoFoto: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome || '',
        quantidade: produto.quantidade?.toString() || '',
        foto: produto.foto_url || '',
        fotoNome: produto.fotoNome || '',
        preco: produto.preco?.toString() || '',
        arquivoFoto: null,
      });
    } else {
      setForm({ nome: '', quantidade: '', foto: '', fotoNome: '', preco: '', arquivoFoto: null });
    }
  }, [produto, aberto]);

  const criacaoProduto = Boolean(produto?.id);

  const handleChange = (campo, valor) => {
    setForm(f => ({ ...f, [campo]: valor }));
  };

  const handleSalvar = async () => {
    if (!form.nome || form.nome.trim() === '') {
      toast.error('O nome do produto é obrigatório');
      return;
    }
    if (form.quantidade === '' || isNaN(form.quantidade)) {
      toast.error('A quantidade é obrigatória');
      return;
    }
    if (form.preco === '' || isNaN(form.preco)) {
      toast.error('O preço é obrigatório');
      return;
    }

    setLoading(true);
    try {
      let foto_url = null;
      if (form.arquivoFoto) {
        toast.info('Fazendo upload da imagem...');
        foto_url = await uploadFoto(form.arquivoFoto, user.id);
      }

      const payload = {
        nome: form.nome,
        quantidade: Number(form.quantidade),
        preco: Number(form.preco),
        foto_url,
      };

      if (criacaoProduto) {
        await api.put(`/products/${produto.id}`, payload);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        toast.success('Produto adicionado com sucesso!');
      }
      setForm({ nome: '', quantidade: '', foto: '', fotoNome: '', preco: '', arquivoFoto: null });
      onSalvar();
      onFechar();
    } catch (err) {
      const message = err.response?.data?.message || (criacaoProduto ? 'Erro ao atualizar produto' : 'Erro ao adicionar produto');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!aberto) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        width: '100%', maxWidth: '1000px',
        maxHeight: '85vh', overflowY: 'auto',
        padding: '28px 32px', position: 'relative',
        margin: '0 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            {criacaoProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nome</label>
              <input
                placeholder="Ex.: Bola de Futebol"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Quantidade</label>
              <input
                type="number"
                placeholder="0"
                value={form.quantidade}
                onChange={(e) => handleChange('quantidade', e.target.value)}
                style={inputStyle}
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Foto*</label>
              <input
                ref={inputFotoRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleChange('foto', url);
                    handleChange('fotoNome', file.name);
                    handleChange('arquivoFoto', file);
                  }
                }}
              />
              <div
                onClick={() => inputFotoRef.current?.click()}
                style={{
                  border: '2px dashed #e9d5ff', borderRadius: '8px',
                  padding: '32px', textAlign: 'center', cursor: 'pointer',
                  background: '#faf5ff',
                }}
              >
                {form.foto ? (
                  <img src={form.foto} alt="preview" style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <ImagePlus size={32} color="#1e3a8a" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, fontWeight: '500' }}>Enviar uma imagem</p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0' }}>PNG, JPG, GIF até 5MB</p>
                  </>
                )}
              </div>
              {form.fotoNome && <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>{form.fotoNome}</p>}
            </div>

            <div>
              <label style={labelStyle}>Preço</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '14px' }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={form.preco}
                  onChange={(e) => handleChange('preco', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '36px' }}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button onClick={onFechar} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #e9d5ff', background: 'white', color: '#555', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            <X size={15} /> Cancelar
          </button>
          <button onClick={handleSalvar} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#7306a5', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <Save size={15} /> {loading ? 'Salvando...' : criacaoProduto ? 'Salvar alterações' : 'Salvar produto'}
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { 
  fontSize: '13px', 
  color: '#555', 
  fontWeight: '500', 
  display: 'block', 
  marginBottom: '6px' 
};
const inputStyle = { 
  width: '100%', 
  padding: '9px 12px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0', 
  fontSize: '14px', 
  outline: 'none', 
  olor: '#333', 
  boxSizing: 'border-box', 
  background: 'white' 
};

const ITENS_POR_PAGINA_TABELA = 8;

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [Aberto, setAberto] = useState(false);

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/products/me');
      setProdutos(response.data);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) toast.error('Erro: Sem conexão com o servidor');
      else if (status === 401) toast.error('Erro 401: Sessão expirada');
      else if (status === 500) toast.error('Erro 500: Erro interno no servidor');
      else toast.error(`Erro ${status}: ${err.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { buscarProdutos(); }, []);

  const getStatus = (quantidade) => {
    if (quantidade === 0) return { label: 'Inativo', bg: '#fef2f2', color: '#dc2626' };
    if (quantidade < 10) return { label: 'Estoque Baixo', bg: '#fffbeb', color: '#d97706' };
    return { label: 'Ativo', bg: '#f0fdf4', color: '#16a34a' };
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA_TABELA);
  const produtosPaginados = produtosFiltrados.slice(
    (pagina - 1) * ITENS_POR_PAGINA_TABELA,
    pagina * ITENS_POR_PAGINA_TABELA
  );

  const cards = [
    {
      titulo: 'Total de Produtos',
      valor: produtos.length.toLocaleString('pt-BR'),
      icone: Package,
      cor: '#2563eb',
      corFundo: '#eff6ff',
    },
    {
      titulo: 'Em estoque',
      valor: produtos.filter(p => p.quantidade >= 10).length.toLocaleString('pt-BR'),
      icone: CheckCircle,
      cor: '#16a34a',
      corFundo: '#f0fdf4',
    },
    {
      titulo: 'Em estoque baixo',
      valor: produtos.filter(p => p.quantidade > 0 && p.quantidade < 10).length.toLocaleString('pt-BR'),
      icone: AlertTriangle,
      cor: '#d97706',
      corFundo: '#fffbeb',
    },
    {
      titulo: 'Fora de Estoque',
      valor: produtos.filter(p => p.quantidade === 0).length.toLocaleString('pt-BR'),
      icone: XCircle,
      cor: '#dc2626',
      corFundo: '#fef2f2',
    },
  ];

  return (
    <>
      <AdicionarProduto
        aberto={Aberto}
        produto={null}
        onFechar={() => setAberto(false)}
        onSalvar={buscarProdutos}
      />

      <div>
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {cards.map((card) => {
              const Icon = card.icone;
              return (
                <div key={card.titulo} style={{
                  background: 'white', borderRadius: '12px', padding: '20px',
                  border: '1px solid #e9d5ff', boxShadow: '0 2px 8px rgba(124,58,237,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#888', margin: '0 0 8px', fontWeight: '500' }}>{card.titulo}</p>
                    <span style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>{card.valor}</span>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '50%', background: card.corFundo }}>
                    <Icon size={22} color={card.cor} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e9d5ff', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9d5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a', margin: 0 }}>Inventário de produtos</h3>
              <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0' }}>Gerencie seus itens de estoque e níveis de inventário</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type="text"
                  placeholder="Pesquisar em produtos"
                  value={busca}
                  onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
                  style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', border: '1px solid #e9d5ff', fontSize: '13px', outline: 'none', color: '#333', width: '200px' }}
                />
              </div>
              <button
                onClick={() => setAberto(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#7306a5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                <Plus size={15} /> Adicionar Produto
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: '24px', color: '#888', fontSize: '14px' }}>Carregando...</p>
          ) : produtosFiltrados.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Package size={48} color="#e9d5ff" style={{ marginBottom: '16px' }} />
              <p style={{ color: '#888', fontSize: '14px' }}>Nenhum produto encontrado.</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e9d5ff' }}>
                    {['PRODUTO', 'QUANTIDADE', 'DATA ENTRADA', 'VALOR', 'STATUS'].map(col => (
                      <th key={col} style={{ padding: '12px 16px', textAlign: col === 'PRODUTO' ? 'left' : 'center', fontSize: '12px', color: '#888', fontWeight: '600', letterSpacing: '0.05em' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {produtosPaginados.map((p) => {
                    const status = getStatus(p.quantidade);
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', borderRadius: '8px', background: '#fff3e0', flexShrink: 0 }}>
                              <Package size={18} color="#f97316" />
                            </div>
                            <span style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>{p.nome}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
                          {p.quantidade}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                          {p.created_at
                            ? `${new Date(p.created_at).toLocaleDateString('pt-BR')} ${new Date(p.created_at).toLocaleTimeString('pt-BR')}`
                            : '-'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
                          R${parseFloat(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: status.bg, color: status.color }}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPaginas > 1 && (
                <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setPagina(p => Math.max(p - 1, 1))} disabled={pagina === 1} style={{ background: 'none', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '4px 8px', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: pagina === 1 ? '#ccc' : '#7306a5' }}>
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPagina(n)} style={{ background: pagina === n ? '#7306a5' : 'none', border: `1px solid ${pagina === n ? '#7306a5' : '#e9d5ff'}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: pagina === n ? 'white' : '#555', fontSize: '13px', fontWeight: '500' }}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))} disabled={pagina === totalPaginas} style={{ background: 'none', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '4px 8px', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: pagina === totalPaginas ? '#ccc' : '#7306a5' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Produtos;