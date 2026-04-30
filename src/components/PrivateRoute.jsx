import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!token) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;