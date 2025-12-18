
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goalName: string;
  onConfirm: (amount: number) => void;
}

export const DepositGoalModal: React.FC<Props> = ({ isOpen, onClose, goalName, onConfirm }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onConfirm(numericAmount);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-2">Depositar em Meta</h2>
        <p className="text-gray-600 mb-6">"{goalName}"</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-600 mb-1">Valor do Depósito (R$)</label>
            <input
              id="depositAmount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoFocus
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
              Confirmar Depósito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
