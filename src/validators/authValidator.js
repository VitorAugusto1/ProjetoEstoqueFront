import { toast } from 'sonner';

export const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

export const validarEmail = (email) => {
  if (!email || email.trim() === '')
    return 'O email é obrigatório';
  if (email.includes(' '))
    return 'O email não pode conter espaços';
  if (email.startsWith('.'))
    return 'O email não pode começar com ponto';
  if (email.includes('@') && email.split('@')[0].endsWith('.'))
    return 'O email não pode ter ponto antes do @';
  if (email.includes('..'))
    return 'O email não pode ter dois pontos seguidos';
  if (/[àáâãäåèéêëìíîïòóôõöùúûüýÿçñ]/i.test(email))
    return 'O email não pode conter acentos';
  if (/[^a-zA-Z0-9@._\-+]/.test(email))
    return 'O email contém caracteres inválidos';
  if (!emailRegex.test(email))
    return 'O email informado é inválido';

  return null;
};

export const validarSenha = (password) => {
  if (!password || password.trim() === '')
    return 'A senha é obrigatória';
  if (password.length < 6)
    return 'A senha deve ter pelo menos 6 caracteres';

  return null;
};

export const validarConfirmacaoSenha = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '')
    return 'Confirme sua senha';
  if (password !== confirmPassword)
    return 'As senhas não coincidem';

  return null;
};

export const tratarErroRegistro = (err, setErrors, setEmail, setPassword, setConfirmPassword, setNomeLoja) => {
  const status = err.response?.status;
  const message = err.response?.data?.message || '';

  setEmail('');
  setPassword('');
  setConfirmPassword('');
  if (setNomeLoja) setNomeLoja('');
  setErrors({});

  if (!err.response) {
    toast.error('Erro: Sem conexão com o servidor');
    return;
  }

  if (message.includes('Email ja registrado'))
    setErrors({ email: 'Este email já está cadastrado' });
  else if (message.includes('email') || message.includes('Email'))
    setErrors({ email: message });
  else if (message.includes('senha') || message.includes('Senha'))
    setErrors({ password: message });
  else if (status === 400)
    toast.error(`Erro 400: ${message}`);
  else if (status === 404)
    toast.error('Erro 404: Rota não encontrada');
  else if (status === 500)
    toast.error('Erro 500: Erro interno no servidor');
  else
    toast.error(`Erro ${status}: ${message}`);
};

export const tratarErroLogin = (err, setErrors) => {
  const status = err.response?.status;
  const message = err.response?.data?.message || '';

  if (!err.response) {
    toast.error('Erro: Sem conexão com o servidor');
    return;
  }

  if (message.includes('email') || message.includes('Email'))
    setErrors({ email: message });
  else if (message.includes('senha') || message.includes('incorretos'))
    setErrors({ password: message });
  else if (status === 400)
    toast.error(`Erro 400: ${message}`);
  else if (status === 404)
    toast.error('Erro 404: Rota não encontrada');
  else if (status === 500)
    toast.error('Erro 500: Erro interno no servidor');
  else
    toast.error(`Erro ${status}: ${message}`);
};