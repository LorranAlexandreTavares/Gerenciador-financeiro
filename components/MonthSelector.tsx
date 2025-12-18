
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthSelector: React.FC<Props> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl mb-6 border border-gray-100 shadow-sm">
      <button 
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="text-center">
        <span className="text-lg font-bold text-gray-800 capitalize">{monthName}</span>
        <span className="text-lg font-medium text-gray-400 ml-2">{year}</span>
      </div>
      <button 
        onClick={onNextMonth}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
