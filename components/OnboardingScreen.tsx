
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { BarChart3 } from 'lucide-react';

interface Props {
  onSave: (settings: UserSettings) => void;
  defaultUsername?: string;
}

export const OnboardingScreen: React.FC<Props> = ({ onSave, defaultUsername }) => {
  const [settings, setSettings] = useState<UserSettings>({
    userName: defaultUsername || '',
    savingsGoal: 0,
    age: '',
    profession: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: name === 'savingsGoal' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.userName) {
      onSave(settings);
    } else {
      alert("O nome de usuário é obrigatório.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans animate-fade-in">
        <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-2 mb-8">
                <BarChart3 className="text-indigo-600" size={32}/>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">FinSimples</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vindo(a)!</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Vamos configurar seu perfil para começar.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-600 mb-1">Seu Nome</label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            value={settings.userName}
                            onChange={handleChange}
                            placeholder="Como podemos te chamar?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-600 mb-1">Meta de Poupança Mensal (R$)</label>
                        <input
                            id="savingsGoal"
                            name="savingsGoal"
                            type="number"
                            step="0.01"
                            value={settings.savingsGoal}
                            onChange={handleChange}
                            placeholder="Ex: 500.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">Idade (Opcional)</label>
                        <input
                            id="age"
                            name="age"
                            type="text"
                            value={settings.age}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="profession" className="block text-sm font-medium text-gray-600 mb-1">Profissão (Opcional)</label>
                        <input
                            id="profession"
                            name="profession"
                            type="text"
                            value={settings.profession}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800">
                            Salvar e Começar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};
