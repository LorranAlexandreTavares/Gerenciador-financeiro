
import React from 'react';
import { FinancialSummary } from '../types';
import { Wallet } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
}

export const SmallDailyBudgetCard: React.FC<Props> = ({ summary }) => {
  const isPositive = summary.dailySafeToSpend >= 0;
  const formattedAmount = Math.abs(summary.dailySafeToSpend).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const amountColor = isPositive ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 shadow-sm mt-6">
      <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gray-100">
              <Wallet size={20} className="text-gray-600"/>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Orçamento Diário Livre</p>
          </div>
      </div>
      <p className={`text-xl font-bold ${amountColor}`}>
        {isPositive ? `R$ ${formattedAmount}` : `- R$ ${formattedAmount}`}
      </p>
    </div>
  );
};
