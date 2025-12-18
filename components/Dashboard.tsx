
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Settings, Trash2, Clock, Zap, LogOut } from 'lucide-react';
import { Transaction, FinancialSummary, UserSettings, SavingsGoal, ViewType, UserData } from '../types';
import { DailyBudgetCard } from './DailyBudgetCard';
import { SummaryCards } from './SummaryCards';
import { AddTransactionModal } from './AddTransactionModal';
import { HistoryList } from './HistoryList';
import { FinancialCoach } from './FinancialCoach';
import { SettingsModal } from './SettingsModal';
import { ChartsView } from './ChartsView';
import { Navigation } from './Navigation';
import { MonthSelector } from './MonthSelector';
import { AddGoalModal } from './AddGoalModal';
import { DepositGoalModal } from './DepositGoalModal';
import { SmallDailyBudgetCard } from './SmallDailyBudgetCard';


interface DashboardProps {
    userData: UserData;
    onDataChange: (data: { settings: UserSettings, transactions: Transaction[], goals: SavingsGoal[] }) => void;
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userData, onDataChange, onLogout }) => {
  const { settings, transactions, goals } = userData;

  const handleTransactionsChange = (newTransactions: Transaction[]) => {
      onDataChange({ settings, goals, transactions: newTransactions });
  }
  const handleGoalsChange = (newGoals: SavingsGoal[]) => {
      onDataChange({ settings, transactions, goals: newGoals });
  }
  const handleSettingsChange = (newSettings: UserSettings) => {
      onDataChange({ goals, transactions, settings: newSettings });
  }

  const [activeView, setActiveView] = useState<ViewType>('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Depósito em Meta State
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);

  // Edit State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // --- Date Handlers ---
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // --- Calculations & Filtering ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentDate]);

  const summary = useMemo((): FinancialSummary => {
    const now = new Date();
    const isCurrentMonth = now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear();
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysRemaining = isCurrentMonth ? daysInMonth - now.getDate() : 0;

    let totalIncome = 0;
    let totalFixedExpenses = 0;
    let totalVariableExpenses = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        if (t.frequency === 'recurring') {
          totalFixedExpenses += t.amount;
        } else {
          totalVariableExpenses += t.amount;
        }
      }
    });

    const balance = totalIncome - totalFixedExpenses - totalVariableExpenses;
    const discretionaryBudget = totalIncome - totalFixedExpenses - settings.savingsGoal;
    const remainingBudget = discretionaryBudget - totalVariableExpenses;
    
    const dailySafeToSpend = remainingBudget / (daysRemaining > 0 ? daysRemaining : 1);

    return {
      totalIncome,
      totalFixedExpenses,
      totalVariableExpenses,
      balance,
      savingsGoal: settings.savingsGoal,
      dailySafeToSpend,
      totalSafeToSpend: remainingBudget,
      daysRemaining
    };
  }, [filteredTransactions, settings, currentDate]);

  // --- Helpers ---
  const calculateTimeRemaining = (deadline: string) => {
    if (!deadline) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const [year, month, day] = deadline.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    if (target < now) return "Prazo vencido";
    if (target.getTime() === now.getTime()) return "É hoje!";
    const diffTime = Math.abs(target.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    const parts = [];
    if (years > 0) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
    if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
    if (parts.length === 0) return "É hoje!";
    return `Faltam ${parts.join(', ')}`;
  };
  
  const calculateProjection = (goal: SavingsGoal): string | null => {
    if (!goal.startDate || goal.currentAmount <= 0) return null;
    const start = new Date(goal.startDate + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (start > now) return "Data de início no futuro";
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    if (remainingAmount <= 0) return 'Meta Atingida!';
    const diffTime = now.getTime() - start.getTime();
    const daysPassed = Math.max(1, diffTime / (1000 * 60 * 60 * 24)); 
    const avgDailySavings = goal.currentAmount / daysPassed;
    if (avgDailySavings <= 0) return null;
    const daysNeeded = Math.ceil(remainingAmount / avgDailySavings);
    const projectedDate = new Date();
    projectedDate.setDate(now.getDate() + daysNeeded);
    return projectedDate.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // --- Handlers ---
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
        handleTransactionsChange(transactions.map(t => t.id === editingTransaction.id ? { ...txData, id: t.id } : t));
        setEditingTransaction(null);
    } else {
        const transaction: Transaction = { ...txData, id: crypto.randomUUID() };
        handleTransactionsChange([transaction, ...transactions]);
    }
    setIsAddModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
      setEditingTransaction(transaction);
      setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    handleTransactionsChange(transactions.filter(t => t.id !== id));
  };

  const handleCloseAddModal = () => {
      setIsAddModalOpen(false);
      setEditingTransaction(null);
  };

  const addGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = { ...newGoal, id: crypto.randomUUID() };
    handleGoalsChange([...goals, goal]);
  };

  const deleteGoal = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir esta meta?')) {
        handleGoalsChange(goals.filter(g => g.id !== id));
    }
  };

  const handleDepositSubmit = (amount: number) => {
    if (depositGoal) {
      handleGoalsChange(goals.map(g => g.id === depositGoal.id ? { ...g, currentAmount: g.currentAmount + amount } : g));
      setDepositGoal(null);
    }
  };

  // --- Render Helpers ---
  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-6 animate-fade-in">
            <DailyBudgetCard summary={summary} />
            <FinancialCoach summary={summary} transactions={filteredTransactions} settings={settings} />
            <SummaryCards summary={summary} />
            <div className="mt-8">
               <h3 className="font-bold text-lg mb-4">Visão Geral do Mês</h3>
               <ChartsView transactions={filteredTransactions} />
            </div>
            <HistoryList title="Histórico Recente" transactions={filteredTransactions.slice(0, 10)} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            <SmallDailyBudgetCard summary={summary} />
          </div>
        );
      
      case 'income':
        const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-500 p-6 rounded-3xl text-white shadow-lg">
              <p className="opacity-90 font-medium">Total de Entradas</p>
              <h2 className="text-4xl font-bold mt-1">R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="mt-6">
                <HistoryList title="Todas as Entradas" transactions={incomeTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            </div>
          </div>
        );

      case 'expenses':
        const allExpenses = filteredTransactions.filter(t => t.type === 'expense');
        const totalExpenses = allExpenses.reduce((acc, t) => acc + t.amount, 0);
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-rose-600 p-6 rounded-3xl text-white shadow-lg">
              <p className="opacity-90 font-medium">Total de Saídas</p>
              <h2 className="text-4xl font-bold mt-1">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
            <ChartsView transactions={filteredTransactions} />
            <HistoryList title="Todas as Saídas" transactions={allExpenses} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
          </div>
        );

      case 'fixed':
        const recurringTransactions = filteredTransactions.filter(t => t.frequency === 'recurring');
        const fixedIncome = recurringTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const fixedExpenses = recurringTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-lg">
                    <p className="opacity-90 text-sm font-medium">Entradas Fixas</p>
                    <h2 className="text-2xl font-bold mt-1">R$ {fixedIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
                 <div className="bg-amber-600 p-5 rounded-3xl text-white shadow-lg">
                    <p className="opacity-90 text-sm font-medium">Saídas Fixas</p>
                    <h2 className="text-2xl font-bold mt-1">R$ {fixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Saldo Recorrente</span>
                <span className={`font-bold ${(fixedIncome - fixedExpenses) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {(fixedIncome - fixedExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
            <ChartsView transactions={recurringTransactions} />
            <HistoryList title="Transações Recorrentes" transactions={recurringTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
          </div>
        );

      case 'variable':
        const variableTransactions = filteredTransactions.filter(t => t.frequency === 'variable');
        const variableIncome = variableTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const variableExpenses = variableTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-lg">
                    <p className="opacity-90 text-sm font-medium">Entradas Variáveis</p>
                    <h2 className="text-2xl font-bold mt-1">R$ {variableIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
                 <div className="bg-rose-500 p-5 rounded-3xl text-white shadow-lg">
                    <p className="opacity-90 text-sm font-medium">Saídas Variáveis</p>
                    <h2 className="text-2xl font-bold mt-1">R$ {variableExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Saldo Variável</span>
                <span className={`font-bold ${(variableIncome - variableExpenses) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {(variableIncome - variableExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            </div>
            <ChartsView transactions={variableTransactions} />
            <HistoryList title="Transações Variáveis" transactions={variableTransactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg mb-6">
              <p className="opacity-90 font-medium">Compromisso Mensal de Poupança</p>
              <h2 className="text-4xl font-bold mt-1">R$ {settings.savingsGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              <div className="mt-4 bg-indigo-800/50 rounded-lg p-3 text-sm">
                <p>Este é o valor que você definiu como meta para poupar todo mês.</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Minhas Metas</h3>
                <button onClick={() => setIsAddGoalModalOpen(true)} className="text-sm bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    + Nova Meta
                </button>
            </div>
            <div className="grid gap-4">
                {goals.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
                        <p>Nenhuma meta criada ainda.</p>
                        <p className="text-sm mt-1">Adicione "Viagem", "Carro" ou "Reserva de Emergência".</p>
                    </div>
                ) : (
                    goals.map(goal => {
                        const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                        const timeRemaining = goal.deadline ? calculateTimeRemaining(goal.deadline) : null;
                        const projection = calculateProjection(goal);
                        let deadlineDateDisplay = null;
                        if (goal.deadline) {
                            const [year, month, day] = goal.deadline.split('-').map(Number);
                            deadlineDateDisplay = new Date(year, month - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        }
                        return (
                            <div key={goal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-lg">{goal.name}</h4>
                                        <div className="mt-1 space-y-1">
                                            {goal.deadline && (
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                      <Clock className="w-3 h-3" />
                                                      <span>Prazo: {deadlineDateDisplay}</span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-indigo-600 mt-1">{timeRemaining}</p>
                                                </div>
                                            )}
                                            {projection && (
                                                 <div className="flex items-center gap-1.5 text-xs">
                                                    <Zap className="w-3 h-3 text-amber-500" />
                                                    <span className="text-gray-500 font-medium">Projeção: <span className="text-amber-600 font-bold">{projection}</span></span>
                                                 </div>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteGoal(goal.id)} className="text-gray-300 hover:text-rose-500 p-1 ml-2">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Acumulado</p>
                                        <span className="text-2xl font-bold text-indigo-600">R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-900">{percent.toFixed(0)}%</span>
                                        <p className="text-xs text-gray-500">de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-4">
                                    <div className="bg-indigo-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setDepositGoal(goal)} className="flex-1 bg-indigo-50 text-indigo-700 py-3 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Depositar
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 selection:bg-indigo-100">
      <Navigation activeView={activeView} onChangeView={setActiveView} />
      <div className="flex-1 md:ml-64 pb-24 md:pb-10">
        <header className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md px-6 py-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">FinSimples</h1>
          <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </header>
        <div className="hidden md:flex justify-end px-8 py-6">
           <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Olá, {settings.userName}</span>
              <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all" title="Configurações">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={onLogout} className="p-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all" title="Sair">
                <LogOut className="w-5 h-5 text-rose-600" />
              </button>
           </div>
        </div>
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-2 md:py-0">
          <MonthSelector currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
          {renderContent()}
        </main>
      </div>
      <div className="fixed bottom-20 md:bottom-10 right-6 md:right-10 z-40">
        <button onClick={() => { setEditingTransaction(null); setIsAddModalOpen(true); }} className="bg-black text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center" title="Nova Transação">
          <Plus className="w-6 h-6" />
        </button>
      </div>
      <AddTransactionModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleSaveTransaction} initialData={editingTransaction} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} settings={settings} onSave={handleSettingsChange} />
      <AddGoalModal isOpen={isAddGoalModalOpen} onClose={() => setIsAddGoalModalOpen(false)} onAdd={addGoal} />
      <DepositGoalModal isOpen={!!depositGoal} onClose={() => setDepositGoal(null)} goalName={depositGoal?.name || ''} onConfirm={handleDepositSubmit} />
    </div>
  );
};