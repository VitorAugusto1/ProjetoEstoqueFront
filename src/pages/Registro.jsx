import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import { validarEmail, validarSenha, validarConfirmacaoSenha, tratarErroRegistro } from '../validators/authValidator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const novosErros = {};

    const erroEmail = validarEmail(email);
    if (erroEmail) novosErros.email = erroEmail;

    const erroSenha = validarSenha(password);
    if (erroSenha) novosErros.password = erroSenha;

    const erroConfirmacao = validarConfirmacaoSenha(password, confirmPassword);
    if (erroConfirmacao) novosErros.confirmPassword = erroConfirmacao;

    if (!nomeLoja || nomeLoja.trim() === '')
      novosErros.nomeLoja = 'O nome da loja é obrigatório';
    else if (nomeLoja.trim().length < 2)
      novosErros.nomeLoja = 'O nome da loja deve ter pelo menos 2 caracteres';
    else if (nomeLoja.trim().length > 50)
      novosErros.nomeLoja = 'O nome da loja deve ter no máximo 50 caracteres';

    return novosErros;
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    const errosEncontrados = validar();
    if (Object.keys(errosEncontrados).length > 0) {
      setErrors(errosEncontrados);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post('/register', { email, password, nome_loja: nomeLoja });
      toast.success('Conta criada com sucesso!');
      navigate('/login');
    } catch (err) {
      tratarErroRegistro(err, setErrors, setEmail, setPassword, setConfirmPassword, setNomeLoja);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f0ff',
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        border: '1px solid #e9d5ff',
        borderRadius: '12px',
        margin: '0 16px',
        boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
      }}>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <CardTitle style={{ color: '#1a1a1a', fontSize: '20px' }}>
                Criar conta
              </CardTitle>
              <CardDescription style={{ color: '#888', marginTop: '4px', fontSize: '13px' }}>
                Preencha os dados abaixo para criar sua conta
              </CardDescription>
            </div>
            <Link to="/login" style={{ color: '#7306a5', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Login
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegistro} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>


            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label style={{ color: '#1a1a1a', fontSize: '14px' }}>Email</Label>
              <Input
                type="text"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                style={{
                  background: 'white',
                  border: `1px solid ${errors.email ? '#e53e3e' : '#e9d5ff'}`,
                  color: '#1a1a1a',
                  borderRadius: '8px',
                }}
              />
              {errors.email && (
                <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.email}</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label style={{ color: '#1a1a1a', fontSize: '14px' }}>Empresa</Label>
              <Input
                type="text"
                placeholder="Ex: Minha Loja"
                value={nomeLoja}
                onChange={(e) => { setNomeLoja(e.target.value); setErrors(p => ({ ...p, nomeLoja: '' })); }}
                style={{
                  background: 'white',
                  border: `1px solid ${errors.nomeLoja ? '#e53e3e' : '#e9d5ff'}`,
                  color: '#1a1a1a',
                  borderRadius: '8px',
                }}
              />
              {errors.nomeLoja && (
                <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.nomeLoja}</span>
              )}
            </div>

            {/* Senha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label style={{ color: '#1a1a1a', fontSize: '14px' }}>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                autoComplete="new-password"
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                style={{
                  background: 'white',
                  border: `1px solid ${errors.password ? '#e53e3e' : '#e9d5ff'}`,
                  color: '#1a1a1a',
                  borderRadius: '8px',
                }}
              />
              {errors.password && (
                <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.password}</span>
              )}
            </div>

            {/* Confirmar Senha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label style={{ color: '#1a1a1a', fontSize: '14px' }}>Confirm Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                style={{
                  background: 'white',
                  border: `1px solid ${errors.confirmPassword ? '#e53e3e' : '#e9d5ff'}`,
                  color: '#1a1a1a',
                  borderRadius: '8px',
                }}
              />
              {errors.confirmPassword && (
                <span style={{ fontSize: '12px', color: '#e53e3e' }}>{errors.confirmPassword}</span>
              )}
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#7306a5',
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                marginTop: '4px',
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;