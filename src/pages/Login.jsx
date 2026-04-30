import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { validarEmail, validarSenha, tratarErroLogin } from '../validators/authValidator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validar = () => {
    const novosErros = {};
    const erroEmail = validarEmail(email);
    if (erroEmail) novosErros.email = erroEmail;
    const erroSenha = validarSenha(password);
    if (erroSenha) novosErros.password = erroSenha;
    return novosErros;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errosEncontrados = validar();
    if (Object.keys(errosEncontrados).length > 0) {
      setErrors(errosEncontrados);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data.data;
      login(user, access_token);
      toast.success('Login realizado com sucesso!');
      navigate('/estoque');
    } catch (err) {
      tratarErroLogin(err, setErrors);
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
                Login
              </CardTitle>
              <CardDescription style={{ color: '#888', marginTop: '4px', fontSize: '13px' }}>
                Insira seu e-mail abaixo para acessar sua conta.
              </CardDescription>
            </div>
            <Link to="/registro" style={{ color: '#7306a5', fontSize: '14px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Registrar
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

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

            {/* Senha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label style={{ color: '#1a1a1a', fontSize: '14px' }}>Senha</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
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

            {/* Botão Login */}
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
              {loading ? 'Entrando...' : 'Login'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;