
export type TransactionType = 'income' | 'expense';
export type TransactionFrequency = 'recurring' | 'variable';
export type Category = 'Salário' | 'Moradia' | 'Alimentação' | 'Transporte' | 'Lazer' | 'Saúde' | 'Educação' | 'Investimentos' | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  frequency: TransactionFrequency;
  category: Category;
}

export interface FinancialSummary {
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  balance: number;
  savingsGoal: number;
  dailySafeToSpend: number;
  totalSafeToSpend: number;
  daysRemaining: number;
}

export interface UserSettings {
  savingsGoal: number;
  userName: string;
  age: string;
  profession: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
}

export type ViewType = 'home' | 'income' | 'expenses' | 'fixed' | 'variable' | 'goals';

export interface UserData {
  password: string;
  settings: UserSettings;
  transactions: Transaction[];
  goals: SavingsGoal[];
  hasCompletedOnboarding: boolean;
}
