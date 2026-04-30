import { useEffect, useState } from 'react';
import { AlertTriangle, X, Save, ImagePlus, Download, Edit2, Eye } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';



const EdicaoLote = ({ aberto, onFechar, produtosSelecionados, onSalvar }) => {
  const [modo, setModo] = useState('menu');
  const [editarDados, setEditarDados] = useState({ nome: '', quantidade: '', preco: '', foto: '', fotoNome: '' });
  const [loading, setLoading] = useState(false);

  const handleEditar = async () => {
    if (modo === 'editar') {
      if (!editarDados.nome?.trim() && !editarDados.quantidade && !editarDados.preco) {
        toast.error('Preencha pelo menos um campo para editar');
        return;
      }
      setLoading(true);
      try {
        for (const produto of produtosSelecionados) {
          const payload = {};
          if (editarDados.nome?.trim()) payload.nome = editarDados.nome;
          if (editarDados.quantidade) payload.quantidade = Number(editarDados.quantidade);
          if (editarDados.preco) payload.preco = Number(editarDados.preco);
          await api.put(`/products/${produto.id}`, payload);
        }
        toast.success(`${produtosSelecionados.length} produto(s) atualizado(s)!`);
        setEditarDados({ nome: '', quantidade: '', preco: '', foto: '', fotoNome: '' });
        setModo('menu');
        onSalvar();
        onFechar();
      } catch (err) {
        toast.error('Erro ao atualizar produtos');
      } finally {
        setLoading(false);
      }
    } else if (modo === 'excluir' || modo === 'excluirLotes') {
      setLoading(true);
      try {
        for (const produto of produtosSelecionados) {
          await api.delete(`/products/${produto.id}`);
        }
        toast.success(`${produtosSelecionados.length} produto(s) deletado(s)!`);
        setModo('menu');
        onSalvar();
        onFechar();
      } catch (err) {
        toast.error('Erro ao deletar produtos');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!aberto) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '28px 32px', position: 'relative' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            {modo === 'menu' ? 'Gerenciar Produtos' : modo === 'editar' ? 'Alterar Dados' : 'Excluir Produtos'}
          </h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
            <X size={22} />
          </button>
        </div>

        {modo === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px' }}>
              {produtosSelecionados.length} produto(s) selecionado(s)
            </p>
            {produtosSelecionados.length === 1 && (
              <>
                <button onClick={() => setModo('editar')} style={{ padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#7306a5', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                  ✎ Alterar Dados
                </button>
                <button onClick={() => setModo('excluir')} style={{ padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                  🗑 Excluir
                </button>
              </>
            )}
            {produtosSelecionados.length > 1 && (
              <button onClick={() => setModo('excluirLotes')} style={{ padding: '12px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                📦 Excluir em Lote
              </button>
            )}
          </div>
        )}

        {modo === 'editar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nome (deixe em branco para não alterar)</label>
              <input placeholder="Ex.: Bola de Futebol" value={editarDados.nome} onChange={(e) => setEditarDados(f => ({ ...f, nome: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Quantidade</label>
              <input type="number" placeholder="0" value={editarDados.quantidade} onChange={(e) => setEditarDados(f => ({ ...f, quantidade: e.target.value }))} style={inputStyle} min="0" />
            </div>
            <div>
              <label style={labelStyle}>Preço</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '14px' }}>R$</span>
                <input type="number" placeholder="0,00" value={editarDados.preco} onChange={(e) => setEditarDados(f => ({ ...f, preco: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} min="0" step="0.01" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Foto</label>
              <input type="file" accept=".png,.jpg,.jpeg,.gif" id="upload-imagem-lote" style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setEditarDados(f => ({ ...f, foto: url, fotoNome: file.name }));
                  }
                }}
              />
              <div onClick={() => document.getElementById('upload-imagem-lote').click()} style={{ border: '2px dashed #e9d5ff', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#faf5ff' }}>
                {editarDados.foto ? (
                  <img src={editarDados.foto} alt="preview" style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <ImagePlus size={32} color="#1e3a8a" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, fontWeight: '500' }}>Enviar uma imagem</p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0' }}>PNG, JPG, GIF até 5MB</p>
                  </>
                )}
              </div>
              {editarDados.fotoNome && <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>{editarDados.fotoNome}</p>}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => { setModo('menu'); setEditarDados({ nome: '', quantidade: '', preco: '', foto: '', fotoNome: '' }); }} style={{ flex: 1, padding: '10px 20px', borderRadius: '8px', border: '1px solid #e9d5ff', background: 'white', color: '#555', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Voltar
              </button>
              <button onClick={handleEditar} disabled={loading} style={{ flex: 1, padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#7306a5', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {loading ? 'Salvando...' : 'Alterar'}
              </button>
            </div>
          </div>
        )}

        {(modo === 'excluir' || modo === 'excluirLotes') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#555', fontSize: '14px' }}>
              {modo === 'excluir' ? 'Tem certeza que deseja excluir este produto?' : `Itens selecionados para exclusão em lote: ${produtosSelecionados.length}`}
            </p>
            {modo === 'excluirLotes' && (
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {produtosSelecionados.map(p => (
                  <div key={p.id} style={{ padding: '8px', borderBottom: '1px solid #e9d5ff', fontSize: '13px', color: '#555' }}>
                    <strong>{p.nome}</strong> - Qtd: {p.quantidade}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModo('menu')} style={{ flex: 1, padding: '10px 20px', borderRadius: '8px', border: '1px solid #e9d5ff', background: 'white', color: '#555', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                {modo === 'excluir' ? 'Cancelar' : 'Voltar'}
              </button>
              <button onClick={handleEditar} disabled={loading} style={{ flex: 1, padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {loading ? 'Deletando...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: '13px',
  color: '#555',
  fontWeight: '500',
  display: 'block',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  color: '#333',
  boxSizing: 'border-box',
  background: 'white',
};

const Detalhes = ({ aberto, onFechar, produto }) => {
  if (!aberto || !produto) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1001, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '28px 32px', position: 'relative', maxHeight: '85vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Detalhes do Produto</h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {produto.foto_url && (
            <div style={{ textAlign: 'center' }}>
              <img src={produto.foto_url} alt={produto.nome} style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>NOME</label>
            <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', marginTop: '4px' }}>{produto.nome}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>QUANTIDADE</label>
              <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', marginTop: '4px' }}>{produto.quantidade} unidades</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>PREÇO</label>
              <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500', marginTop: '4px' }}>
                R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>TOTAL EM ESTOQUE</label>
            <p style={{ fontSize: '14px', color: '#7306a5', fontWeight: '600', marginTop: '4px' }}>
              R$ {(produto.preco * produto.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>STATUS</label>
            <div style={{ marginTop: '4px' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                background: produto.quantidade === 0 ? '#fef2f2' : produto.quantidade < 10 ? '#fffbeb' : '#f0fdf4',
                color: produto.quantidade === 0 ? '#dc2626' : produto.quantidade < 10 ? '#d97706' : '#16a34a',
              }}>
                {produto.quantidade === 0 ? 'Inativo' : produto.quantidade < 10 ? 'Estoque Baixo' : 'Ativo'}
              </span>
            </div>
          </div>
          {produto.created_at && (
            <div>
              <label style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>CRIADO EM</label>
              <p style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
                {new Date(produto.created_at).toLocaleDateString('pt-BR')} às {new Date(produto.created_at).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        <button onClick={onFechar} style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e9d5ff', background: 'white', color: '#555', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '24px' }}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const EstoqueView = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionados, setSelecionados] = useState([]);
  const [EdicaoLoteAberto, setEdicaoLoteAberto] = useState(false);
  const [DetalhesAberto, setDetalhesAberto] = useState(false);
  const [produtoDetalhes, setProdutoDetalhes] = useState(null);

  const buscarProdutos = async () => {
    try {
      const response = await api.get('/products/me');
      setProdutos(response.data);
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) toast.error('Erro: Sem conexão com o servidor');
      else if (status === 401) toast.error('Erro 401: Sessão expirada, faça login novamente');
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

  const toggleSelecionado = (id) => {
    setSelecionados(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const selecionarTodos = () => {
    setSelecionados(selecionados.length === produtos.length ? [] : produtos.map(p => p.id));
  };

  const produtosSelecionadoObjs = produtos.filter(p => selecionados.includes(p.id));

  return (
    <>
      <EdicaoLote
        aberto={EdicaoLoteAberto}
        onFechar={() => setEdicaoLoteAberto(false)}
        produtosSelecionados={produtosSelecionadoObjs}
        onSalvar={() => { buscarProdutos(); setSelecionados([]); }}
      />
      <Detalhes
        aberto={DetalhesAberto}
        onFechar={() => { setDetalhesAberto(false); setProdutoDetalhes(null); }}
        produto={produtoDetalhes}
      />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#7306a5', fontWeight: '700', fontSize: '22px', margin: 0 }}>Estoque</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selecionados.length > 0 && (
              <button onClick={() => setEdicaoLoteAberto(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#7306a5', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Edit2 size={15} /> Editar ({selecionados.length})
              </button>
            )}
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e9d5ff', background: 'white', color: '#7306a5', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              <Download size={15} /> Exportar
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#888', fontSize: '14px' }}>Carregando...</p>
        ) : produtos.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '48px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#e9d5ff" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#888', fontSize: '14px' }}>Nenhum item no estoque ainda.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e9d5ff', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f0ff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', color: '#7306a5', fontWeight: '600', width: '40px' }}>
                    <input type="checkbox" checked={selecionados.length === produtos.length && produtos.length > 0} onChange={selecionarTodos} style={{ cursor: 'pointer' }} />
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', color: '#7306a5', fontWeight: '600', width: '60px' }}>Foto</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', color: '#7306a5', fontWeight: '600' }}>Produto</th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', color: '#7306a5', fontWeight: '600' }}>Quantidade</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', color: '#7306a5', fontWeight: '600' }}>Preço</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', color: '#7306a5', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', color: '#7306a5', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p, i) => {
                  const status = getStatus(p.quantidade);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #e9d5ff', background: i % 2 === 0 ? 'white' : '#faf5ff' }}>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input type="checkbox" checked={selecionados.includes(p.id)} onChange={() => toggleSelecionado(p.id)} style={{ cursor: 'pointer' }} />
                      </td>
                      <td style={{ padding: '8px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => { setProdutoDetalhes(p); setDetalhesAberto(true); }}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e9d5ff', background: p.foto_url ? 'transparent' : '#faf5ff', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {p.foto_url ? (
                            <img src={p.foto_url} alt={p.nome} style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }} />
                          ) : (
                            <Eye size={20} color="#c4b5fd" />
                          )}
                        </button>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{p.nome}</td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#555', textAlign: 'center' }}>{p.quantidade}</td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#555', textAlign: 'right' }}>
                        R$ {parseFloat(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#7306a5', fontWeight: '600', textAlign: 'right' }}>
                        R$ {(p.preco * p.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default EstoqueView;