import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Estoque from './pages/Estoque';


function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/estoque" element={
          <PrivateRoute>
            <Estoque />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;