import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4ddbff'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-bold">{`${payload[0].name}`}</p>
          <p className="text-sm">{`R$ ${payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>
        </div>
      );
    }
    return null;
};

export const ChartsView: React.FC<Props> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      // FIX: The `reduce` accumulator was not correctly typed, leading to downstream errors.
      // By asserting the type of the initial value, we ensure `acc` is typed correctly.
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  const incomeVsExpenseData = useMemo(() => {
    const totals = transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
    return [
        { name: 'Entradas', value: totals.income },
        { name: 'Saídas', value: totals.expense },
    ];
  }, [transactions]);
  
  if (transactions.length === 0) {
      return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center text-gray-400 h-64">
            <Package size={32} className="mb-2"/>
            <p className="font-semibold">Sem dados para exibir</p>
            <p className="text-sm">Adicione transações para ver os gráficos.</p>
        </div>
      )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {expenseData.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-center mb-4">Despesas por Categoria</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(incomeVsExpenseData[0].value > 0 || incomeVsExpenseData[1].value > 0) && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-center mb-4">Entradas vs. Saídas</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={incomeVsExpenseData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={60} stroke="#333" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
                <Bar dataKey="value" barSize={35}>
                    {
                        incomeVsExpenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Entradas' ? '#22c55e' : '#ef4444'} />
                        ))
                    }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
