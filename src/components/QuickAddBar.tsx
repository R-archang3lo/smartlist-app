import React, { useState } from 'react';
import { Plus, SlidersHorizontal, CornerDownLeft } from 'lucide-react';
import { CategoryType } from '../types';
import { CATEGORIES, predictCategory } from '../constants/categories';

interface QuickAddBarProps {
  onQuickAdd: (name: string, category: CategoryType, quantity: number, unit: string) => void;
  onOpenFullModal: (prefillName?: string, prefillCategory?: CategoryType) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  onQuickAdd,
  onOpenFullModal,
}) => {
  const [name, setName] = useState('');
  const [manualCategory, setManualCategory] = useState<CategoryType | null>(null);

  const detectedCategory = name.trim() ? predictCategory(name) : 'mercado';
  const currentCategory = manualCategory ?? detectedCategory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onQuickAdd(name.trim(), currentCategory, 1, 'un');
    setName('');
    setManualCategory(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <div className="flex-1 flex items-center gap-2 px-2">
        <Plus className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Reset manual override if user cleared input
            if (!e.target.value) setManualCategory(null);
          }}
          placeholder="Adicionar item rápido (ex: 1kg Tomate, Dipirona, Leite)..."
          className="w-full bg-transparent border-0 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-1.5"
        />
      </div>

      <div className="flex items-center gap-1.5 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        {/* Category Picker Indicator / Toggle */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
          {(['mercado', 'feira', 'farmacia'] as CategoryType[]).map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setManualCategory(cat)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? cat === 'mercado'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : cat === 'feira'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {CATEGORIES[cat].shortName}
              </button>
            );
          })}
        </div>

        {/* Detailed Modal Trigger */}
        <button
          type="button"
          onClick={() => onOpenFullModal(name, currentCategory)}
          title="Abrir com detalhes (marca, quantidade, notas)"
          className="min-h-[40px] min-w-[40px] p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Add Button */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="min-h-[40px] px-3.5 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Adicionar</span>
          <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </div>
    </form>
  );
};
