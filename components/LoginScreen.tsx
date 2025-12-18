
import React, { useState } from 'react';
import { BarChart3, User, KeyRound } from 'lucide-react';

interface Props {
  onLogin: (username: string) => boolean;
  onRegister: (username: string, password: string) => boolean;
}

export const LoginScreen: React.FC<Props> = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Por favor, preencha o usuário e a senha.');
      return;
    }
    
    if (isRegistering) {
        // No registro, o sucesso é tratado pelo onRegister
        onRegister(username, password);
    } else {
        const success = onLogin(username);
        if (!success) {
            alert('Usuário não encontrado. Tente criar uma conta.');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
            <BarChart3 className="text-indigo-600" size={32}/>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">FinSimples</h1>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{isRegistering ? 'Criar Conta' : 'Login'}</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">{isRegistering ? 'Crie uma conta para começar a organizar suas finanças.' : 'Bem-vindo(a) de volta!'}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                    />
                </div>
                 <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    {isRegistering ? 'Registrar' : 'Entrar'}
                </button>
            </form>
            
            <div className="text-center mt-6">
                <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    {isRegistering ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Crie uma'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
