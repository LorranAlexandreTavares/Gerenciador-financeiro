
import React from 'react';
import { FinancialSummary } from '../types';

interface Props {
  summary: FinancialSummary;
}

export const DailyBudgetCard: React.FC<Props> = ({ summary }) => {
  const isPositive = summary.totalSafeToSpend >= 0;
  const formattedAmount = Math.abs(summary.totalSafeToSpend).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className={`p-6 rounded-3xl mb-6 shadow-xl text-white ${isPositive ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-rose-500 to-red-600'}`}>
      <p className="font-medium opacity-90">Orçamento Livre no Mês</p>
      <h2 className="text-4xl lg:text-5xl font-bold mt-2 truncate">
        {isPositive ? `R$ ${formattedAmount}` : `- R$ ${formattedAmount}`}
      </h2>
      <p className="text-sm mt-3 opacity-80">
        {isPositive
          ? 'Este é o valor disponível para gastos até o final do mês, após despesas fixas e metas.'
          : 'Atenção! Você ultrapassou seu orçamento para o mês.'}
      </p>
    </div>
  );
};
