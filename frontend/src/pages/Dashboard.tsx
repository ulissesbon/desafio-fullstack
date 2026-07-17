import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, LogOut, Upload, X, Loader2, Leaf } from 'lucide-react';
import axios from 'axios';

type Tab = 'painel' | 'historico';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('painel');
  const navigate = useNavigate();

  // Estados para o Upload (Painel)
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para o Histórico
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // NOVO: Estado para controlar o Modal de detalhes da imagem
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'historico') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:3000/plants/identify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setResult(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao analisar a imagem. Verifique se o servidor Python e o NestJS estão rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:3000/plants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setHistory(response.data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#F5F5F5] border-r border-gray-200 flex flex-col justify-between">
        <div className="pt-8">
          <button onClick={() => setActiveTab('painel')} className={`w-full flex items-center px-6 py-4 transition-colors ${activeTab === 'painel' ? 'bg-[#9DB2F5] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}>
            <LayoutDashboard className="mr-3" size={20} />
            <span>Painel</span>
          </button>
          <button onClick={() => setActiveTab('historico')} className={`w-full flex items-center px-6 py-4 transition-colors ${activeTab === 'historico' ? 'bg-[#9DB2F5] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}>
            <BarChart2 className="mr-3" size={20} />
            <span>Histórico</span>
          </button>
        </div>
        
        <div className="pb-8">
          <button onClick={handleLogout} className="w-full flex items-center px-6 py-4 text-[#D32F2F] hover:bg-red-50 transition-colors font-medium">
            <LogOut className="mr-3" size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col">
        <header className="w-full bg-white flex justify-center items-center py-4 border-b-2 border-gray-100 h-24">
          <img src="/header-lapisco.png" alt="Logos Lapisco e IFCE" className="h-16 md:h-20 object-contain" />
        </header>

        <div className="flex-1 p-10 bg-white overflow-y-auto">
          
          {/* ================= ABA PAINEL ================= */}
          {activeTab === 'painel' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Processamento de Imagens</h2>
              <p className="text-gray-500 mb-8">Faça o upload da imagem da planta para análise da nossa IA.</p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center bg-gray-50 text-gray-400 hover:bg-[#EEF2FF] hover:border-[#9DB2F5] transition-all cursor-pointer"
                >
                  <Upload size={48} className="mb-4 text-[#9DB2F5]" />
                  <p className="text-lg font-medium text-gray-600">Clique para selecionar uma imagem da planta</p>
                  <p className="text-sm mt-2">Suporta JPG, PNG</p>
                </div>
              ) : (
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative w-full md:w-1/2 rounded-lg overflow-hidden border border-gray-200">
                      <img src={preview} alt="Prévia" className="w-full h-auto object-cover" />
                      {!isLoading && !result && (
                        <button onClick={clearSelection} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
                      {!result && !isLoading && (
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-semibold mb-2">Imagem pronta para envio!</h3>
                          <p className="text-gray-500 mb-6 text-sm">Clique no botão abaixo para iniciar o reconhecimento da espécie através da nossa rede neural.</p>
                          <button onClick={handleUpload} className="bg-[#5EAC92] text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 w-full flex justify-center items-center">
                            <Upload size={20} className="mr-2" /> Analisar Planta
                          </button>
                        </div>
                      )}

                      {isLoading && (
                        <div className="flex flex-col items-center justify-center py-10 text-[#5EAC92]">
                          <Loader2 size={48} className="animate-spin mb-4" />
                          <p className="font-medium animate-pulse">A Inteligência Artificial está analisando...</p>
                        </div>
                      )}

                      {result && (
                        <div className="bg-[#EEF2FF] border border-[#9DB2F5] rounded-lg p-6 w-full">
                          <div className="flex items-center text-[#3B8E47] mb-4">
                            <Leaf size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Identificação Concluída</h3>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Espécie Detectada</p>
                            <p className="text-2xl font-bold text-gray-800 capitalize">{result.specie}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Nível de Confiança</p>
                            <div className="flex items-center mt-1">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div className="bg-[#5EAC92] h-2.5 rounded-full" style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}></div>
                              </div>
                              <span className="font-bold text-gray-700">{(result.confidence * 100).toFixed(2)}%</span>
                            </div>
                          </div>
                          <button onClick={clearSelection} className="mt-6 text-sm text-[#9DB2F5] hover:text-blue-800 font-medium underline">
                            Analisar outra imagem
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= ABA HISTÓRICO ================= */}
          {activeTab === 'historico' && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Histórico de Análises</h2>
              
              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 size={40} className="animate-spin text-[#5EAC92]" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Nenhuma análise encontrada. Vá para o Painel e envie uma imagem!</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Imagem</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Espécie Detectada</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Confiança</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data da Análise</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((item) => (
                        <tr 
                          key={item.id} 
                          // AQUI ADICIONAMOS O CLIQUE NA LINHA DA TABELA
                          onClick={() => setSelectedHistoryItem(item)}
                          className="hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                          title="Clique para ver detalhes"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={item.imageUrl} alt={item.specie} className="h-16 w-16 object-cover rounded-md border border-gray-200" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900 capitalize">{item.specie}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-700 font-bold mr-3 w-12">
                                {(item.confidence * 100).toFixed(2)}%
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-[#5EAC92] h-2 rounded-full" style={{ width: `${(item.confidence * 100)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.creationDate).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL DO HISTÓRICO ================= */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col">
            
            {/* Botão Fechar Modal */}
            <button 
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-red-500 hover:text-white text-gray-800 p-2 rounded-full transition-all z-10 backdrop-blur-sm"
              title="Fechar"
            >
              <X size={20} />
            </button>

            {/* Imagem em tamanho grande */}
            <div className="w-full bg-gray-100 flex justify-center border-b border-gray-200 p-4">
              <img 
                src={selectedHistoryItem.imageUrl} 
                alt={selectedHistoryItem.specie} 
                className="w-full max-h-[400px] object-contain rounded-lg shadow-sm" 
              />
            </div>

            {/* Informações detalhadas embaixo */}
            <div className="p-8 bg-white">
              <div className="flex items-center text-[#3B8E47] mb-6">
                <Leaf size={28} className="mr-2" />
                <h3 className="text-2xl font-bold">Detalhes da Identificação</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Espécie Detectada</p>
                  <p className="text-xl font-bold text-gray-800 capitalize">{selectedHistoryItem.specie}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Data e Hora</p>
                  <p className="text-lg font-medium text-gray-800">
                    {new Date(selectedHistoryItem.creationDate).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Nível de Confiança da Inteligência Artificial</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3 mr-4">
                    <div 
                      className="bg-[#5EAC92] h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${(selectedHistoryItem.confidence * 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-[#3B8E47] text-xl">
                    {(selectedHistoryItem.confidence * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}