
import React, { useState, useEffect } from 'react';
import { SavingsGoal } from '../types';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export const AddGoalModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setTargetAmount('');
      setDeadline('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && parseFloat(targetAmount) > 0) {
      onAdd({
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        deadline,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-6">Nova Meta de Poupança</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-600 mb-1">Nome da Meta</label>
            <input
              id="goalName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem para o Japão"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-600 mb-1">Valor Alvo (R$)</label>
            <input
              id="targetAmount"
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="5000.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-600 mb-1">Prazo Final (Opcional)</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
              Adicionar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
