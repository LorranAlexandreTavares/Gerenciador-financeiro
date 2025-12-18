
import React from 'react';
import { FinancialSummary } from '../types';
import { TrendingUp, TrendingDown, Scale, PiggyBank } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
}

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: string }> = ({ title, amount, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">
        R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  </div>
);

export const SummaryCards: React.FC<Props> = ({ summary }) => {
  const balanceColor = summary.balance >= 0 ? 'text-emerald-600' : 'text-rose-600';
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <SummaryCard title="Total Entradas" amount={summary.totalIncome} icon={<TrendingUp size={24} className="text-emerald-600"/>} color="bg-emerald-100" />
      <SummaryCard title="Total Saídas" amount={summary.totalFixedExpenses + summary.totalVariableExpenses} icon={<TrendingDown size={24} className="text-rose-600"/>} color="bg-rose-100" />
      <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="p-3 rounded-full bg-blue-100">
            <Scale size={24} className="text-blue-600" />
        </div>
        <div>
            <p className="text-sm text-gray-500">Saldo do Mês</p>
            <p className={`text-xl font-bold ${balanceColor}`}>
                R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
        </div>
      </div>
      <SummaryCard title="Meta de Poupança" amount={summary.savingsGoal} icon={<PiggyBank size={24} className="text-indigo-600"/>} color="bg-indigo-100" />
    </div>
  );
};
