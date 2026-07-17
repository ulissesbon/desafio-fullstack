import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Vamos criar este arquivo a seguir

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão redireciona para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rota de Autenticação */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota Principal do Sistema */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;