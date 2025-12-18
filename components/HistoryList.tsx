import React from 'react';
import { Transaction, Category } from '../types';
import { Trash2, Edit2, TrendingUp, TrendingDown, Repeat, Shuffle, Building, Utensils, Bus, Film, HeartPulse, GraduationCap, BarChart, Package } from 'lucide-react';

interface Props {
  title: string;
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const categoryIcons: { [key in Category]: React.ReactNode } = {
    'Salário': <TrendingUp className="text-emerald-500" size={20} />,
    'Moradia': <Building className="text-blue-500" size={20} />,
    'Alimentação': <Utensils className="text-orange-500" size={20} />,
    'Transporte': <Bus className="text-purple-500" size={20} />,
    'Lazer': <Film className="text-pink-500" size={20} />,
    'Saúde': <HeartPulse className="text-red-500" size={20} />,
    'Educação': <GraduationCap className="text-indigo-500" size={20} />,
    'Investimentos': <BarChart className="text-green-700" size={20} />,
    'Outros': <Package className="text-gray-500" size={20} />,
};

export const HistoryList: React.FC<Props> = ({ title, transactions, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
        <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                <p>Nenhuma transação encontrada.</p>
            </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-2">
        {transactions.map(t => (
          <div key={t.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 group">
            <div className="p-3 bg-gray-100 rounded-full mr-4">
                {categoryIcons[t.category] || categoryIcons['Outros']}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{t.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>
                <span className="text-gray-300">•</span>
                {/* FIX: The 'title' prop is not supported by lucide-react icons. Wrapped the icon in a span with a title attribute to provide a tooltip, preserving the intended UI behavior. */}
                <span title={t.frequency === 'recurring' ? 'Recorrente' : 'Variável'}>
                  {t.frequency === 'recurring' ? <Repeat size={12}/> : <Shuffle size={12}/>}
                </span>
                <span>{t.frequency === 'recurring' ? 'Recorrente' : 'Variável'}</span>
              </div>
            </div>
            <div className="text-right mr-4">
              <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(t)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(t.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-100 rounded-full">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};