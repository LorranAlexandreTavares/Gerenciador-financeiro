
import React, { useMemo } from 'react';
import { FinancialSummary, Transaction, UserSettings } from '../types';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
  transactions: Transaction[];
  settings: UserSettings;
}

export const FinancialCoach: React.FC<Props> = ({ summary }) => {
  const coachMessage = useMemo(() => {
    const { totalIncome, balance, dailySafeToSpend, totalVariableExpenses, totalFixedExpenses } = summary;

    if (totalIncome === 0) {
      return {
        icon: Lightbulb,
        color: 'bg-blue-100 text-blue-800',
        title: 'Bem-vindo(a)!',
        message: 'Comece adicionando suas receitas e despesas para ter uma visão clara da sua saúde financeira.',
      };
    }
    
    if (dailySafeToSpend < 0) {
        return {
          icon: AlertTriangle,
          color: 'bg-red-100 text-red-800',
          title: 'Atenção ao Orçamento!',
          message: 'Você está gastando mais do que o planejado para o dia. Revise suas despesas variáveis para voltar ao controle.',
        };
    }
    
    if (balance > totalIncome * 0.2) {
        return {
          icon: TrendingUp,
          color: 'bg-emerald-100 text-emerald-800',
          title: 'Excelente Controle!',
          message: `Você está poupando mais de 20% da sua renda este mês. Continue assim! Considere investir o extra.`,
        };
    }
    
    if (totalVariableExpenses > totalFixedExpenses && totalFixedExpenses > 0) {
        return {
          icon: TrendingDown,
          color: 'bg-amber-100 text-amber-800',
          title: 'Foco nos Variáveis!',
          message: 'Seus gastos variáveis estão maiores que os fixos. Pequenos cortes no dia a dia podem fazer uma grande diferença.',
        };
    }

    return {
      icon: Lightbulb,
      color: 'bg-indigo-100 text-indigo-800',
      title: 'Dica do Dia',
      message: 'Revise suas despesas da última semana. Existe algo que você poderia ter evitado para economizar mais?',
    };
  }, [summary]);

  const Icon = coachMessage.icon;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 mb-6 shadow-sm">
      <div className={`p-3 rounded-full ${coachMessage.color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold">{coachMessage.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{coachMessage.message}</p>
      </div>
    </div>
  );
};
