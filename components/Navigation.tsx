
import React from 'react';
import { Home, TrendingUp, TrendingDown, Repeat, Shuffle, Target, BarChart3, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ size?: number, className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'income', label: 'Entradas', icon: TrendingUp },
  { id: 'expenses', label: 'Saídas', icon: TrendingDown },
  { id: 'fixed', label: 'Fixos', icon: Repeat },
  { id: 'variable', label: 'Variáveis', icon: Shuffle },
  { id: 'goals', label: 'Metas', icon: Target },
];

interface Props {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const NavButton: React.FC<{ item: NavItem, isActive: boolean, onClick: () => void, isMobile?: boolean }> = ({ item, isActive, onClick, isMobile = false }) => {
  const Icon = item.icon;
  const activeClasses = 'bg-indigo-600 text-white';
  const inactiveClasses = 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600';
  
  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-xs gap-1 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}
      >
        <Icon size={22} />
        <span className={`${isActive ? 'font-bold' : ''}`}>{item.label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon size={20} className="mr-3" />
      <span>{item.label}</span>
    </button>
  );
};


export const Navigation: React.FC<Props> = ({ activeView, onChangeView }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed p-4">
        <div className="flex items-center gap-2 mb-8">
            <BarChart3 className="text-indigo-600" size={28}/>
            <h1 className="text-xl font-bold tracking-tight">FinSimples</h1>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(item => (
            <NavButton key={item.id} item={item} isActive={activeView === item.id} onClick={() => onChangeView(item.id)} />
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around shadow-lg z-50">
        {navItems.map(item => (
          <NavButton key={item.id} item={item} isActive={activeView === item.id} onClick={() => onChangeView(item.id)} isMobile />
        ))}
      </nav>
    </>
  );
};
