import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, CheckCircle } from 'lucide-react';
import axios from 'axios';

type AuthView = 'initial' | 'login' | 'register';

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('initial');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Credenciais inválidas. Verifique seu usuário e senha.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3000/auth/register', {
        username,
        password
      });
      setSuccess('Cadastro realizado com sucesso! Agora você pode fazer login.');
      setView('login');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError('Este usuário já existe. Tente outro nome.');
      } else {
        setError('Erro ao tentar cadastrar. Verifique se o backend está rodando.');
      }
    }
  };

  const changeView = (newView: AuthView) => {
    setView(newView);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      { }
      <header className="w-full bg-white flex justify-center items-center py-4 border-b-2 border-gray-100 shadow-sm">
        <img 
          src="/header-lapisco.png" 
          alt="Logos Lapisco e IFCE" 
          className="h-16 md:h-20 object-contain"
        />
      </header>

      {/* Área Central */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex w-full max-w-4xl bg-gray-100 shadow-2xl rounded-lg overflow-hidden min-h-[500px] border border-gray-200">
          
          {/* Lado Esquerdo Painel */}
          <div className="w-1/2 bg-[#3B8E47] text-white flex flex-col justify-center items-center p-10 text-center">
            <h2 className="text-4xl font-serif font-bold mb-2">Bem Vindo!</h2>
            <p className="mb-8 text-sm px-4 font-serif">
              Faça login ou cadastre-se para iniciar.
            </p>
            
            <button 
              onClick={() => changeView('login')}
              className={`w-40 border-2 border-white rounded-full py-2 font-semibold mb-4 transition-colors ${view === 'login' ? 'bg-white text-[#3B8E47]' : 'hover:bg-white hover:text-[#3B8E47]'}`}
            >
              LOGIN
            </button>
            
            <button 
              onClick={() => changeView('register')}
              className={`w-40 border-2 border-white rounded-full py-2 font-semibold transition-colors ${view === 'register' ? 'bg-white text-[#3B8E47]' : 'hover:bg-white hover:text-[#3B8E47]'}`}
            >
              CADASTRAR
            </button>
          </div>

          {/* Lado Direito Painel */}
          <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-[#F0F2F5]">
            
            {view === 'initial' && (
              <div className="text-center text-gray-800">
                <h2 className="text-4xl font-serif font-bold mb-2">Bem Vindo!</h2>
                <p className="text-sm font-serif">
                  Faça login ou cadastre-se para iniciar.
                </p>
              </div>
            )}

            {(view === 'login' || view === 'register') && (
              <div className="w-full flex flex-col items-center">
                <h2 className="text-4xl font-bold text-[#3B8E47] mb-8">
                  {view === 'login' ? 'Sign In' : 'Sign Up'}
                </h2>
                
                {error && (
                  <div className="w-full max-w-sm mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="w-full max-w-sm mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center flex items-center justify-center">
                    <CheckCircle size={16} className="mr-2" />
                    {success}
                  </div>
                )}

                <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="w-full max-w-sm flex flex-col space-y-4">
                  <div className="flex items-center bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <User className="text-gray-400 mr-3" size={20} />
                    <input 
                      type="text" 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-transparent outline-none w-full text-gray-700"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <Lock className="text-gray-400 mr-3" size={20} />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent outline-none w-full text-gray-700"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-[#5EAC92] text-white font-bold rounded-full py-3 mt-6 hover:bg-opacity-90 transition-all uppercase tracking-wider shadow-md"
                  >
                    {view === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}