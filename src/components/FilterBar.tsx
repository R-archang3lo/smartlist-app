import React from 'react';
import { Search, X, ArrowUpDown, CheckCheck, Trash2 } from 'lucide-react';
import { CategoryFilter, SortOption } from '../types';
import { CATEGORIES } from '../constants/categories';

interface FilterBarProps {
  currentFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasCompletedItems: boolean;
  onClearCompleted: () => void;
  onToggleAllCompleted: () => void;
  allCompleted: boolean;
  itemCounts: {
    all: number;
    mercado: number;
    feira: number;
    farmacia: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  hasCompletedItems,
  onClearCompleted,
  onToggleAllCompleted,
  allCompleted,
  itemCounts,
}) => {
  return (
    <div className="space-y-3">
      {/* Category Filter Tabs & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs (Segmented Controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`min-h-[36px] px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Todos</span>
            <span className="tabular-nums text-[11px] opacity-75">
              ({itemCounts.all})
            </span>
          </button>

          {(['mercado', 'feira', 'farmacia'] as const).map((cat) => {
            const count = itemCounts[cat];
            const isSelected = currentFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange(cat)}
                className={`min-h-[36px] px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{CATEGORIES[cat].shortName}</span>
                <span className="tabular-nums text-[11px] opacity-75">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onToggleAllCompleted}
            className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{allCompleted ? 'Desmarcar todos' : 'Concluir todos'}</span>
          </button>

          {hasCompletedItems && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar comprados</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou marca..."
            className="w-full min-h-[42px] pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="min-h-[32px] min-w-[32px] absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 rounded-md flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 min-h-[42px] bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 text-xs hidden xs:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent border-0 font-medium text-slate-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="status">Pendentes primeiro</option>
              <option value="category">Por Categoria</option>
              <option value="name">Nome (A - Z)</option>
              <option value="newest">Mais recentes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
