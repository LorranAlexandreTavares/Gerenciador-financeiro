
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType, TransactionFrequency } from '../types';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  initialData: Transaction | null;
}

const categories: Category[] = ['Salário', 'Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Investimentos', 'Outros'];

export const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('expense');
  const [frequency, setFrequency] = useState<TransactionFrequency>('variable');
  const [category, setCategory] = useState<Category>('Outros');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDescription(initialData.description);
        setAmount(String(initialData.amount));
        setDate(initialData.date);
        setType(initialData.type);
        setFrequency(initialData.frequency);
        setCategory(initialData.category);
      } else {
        // Reset form for new transaction
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
        setFrequency('variable');
        setCategory('Outros');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (description && !isNaN(numericAmount) && numericAmount > 0) {
      onSave({
        description,
        amount: numericAmount,
        date,
        type,
        frequency,
        category,
      });
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar Transação' : 'Nova Transação'}</h2>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => setType('income')} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors ${type === 'income' ? 'bg-emerald-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <TrendingUp size={18}/>
                Entrada
            </button>
            <button onClick={() => setType('expense')} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors ${type === 'expense' ? 'bg-rose-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <TrendingDown size={18}/>
                Saída
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
            <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Almoço no restaurante" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
            <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="15.50" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">Data</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Frequência</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="frequency" value="variable" checked={frequency === 'variable'} onChange={() => setFrequency('variable')} className="form-radio text-indigo-600"/> Variável</label>
                <label className="flex items-center gap-2"><input type="radio" name="frequency" value="recurring" checked={frequency === 'recurring'} onChange={() => setFrequency('recurring')} className="form-radio text-indigo-600"/> Recorrente</label>
            </div>
           </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
