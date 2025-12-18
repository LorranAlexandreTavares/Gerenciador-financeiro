
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: name === 'savingsGoal' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-6">Configurações</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-600 mb-1">Seu Nome</label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={currentSettings.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-600 mb-1">Meta de Poupança Mensal (R$)</label>
            <input
              id="savingsGoal"
              name="savingsGoal"
              type="number"
              step="0.01"
              value={currentSettings.savingsGoal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
             <p className="text-xs text-gray-400 mt-1">Este valor será descontado do seu orçamento livre.</p>
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">Idade</label>
            <input
              id="age"
              name="age"
              type="text"
              value={currentSettings.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
           <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-600 mb-1">Profissão</label>
            <input
              id="profession"
              name="profession"
              type="text"
              value={currentSettings.profession}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
