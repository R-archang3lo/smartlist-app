import React from 'react';
import { ShoppingBag, Apple, Pill, CheckCircle2 } from 'lucide-react';
import { CategoryType, CategoryFilter } from '../types';
import { CATEGORIES } from '../constants/categories';

interface CategorySummaryProps {
  pendingCounts: Record<CategoryType, number>;
  totalPending: number;
  totalCompleted: number;
  activeFilter: CategoryFilter;
  onSelectFilter: (filter: CategoryFilter) => void;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({
  pendingCounts,
  totalPending,
  totalCompleted,
  activeFilter,
  onSelectFilter,
}) => {
  const totalItems = totalPending + totalCompleted;
  const progressPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Cards de Resumo por Categoria */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Card: Total Geral */}
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              activeFilter === 'all' ? 'text-slate-300' : 'text-slate-500'
            }`}>
              Total da Lista
            </span>
            <CheckCircle2 className={`w-4 h-4 ${
              activeFilter === 'all' ? 'text-emerald-400' : 'text-slate-400'
            }`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight">
              {totalPending}
            </span>
            <span className={`text-xs font-medium ${
              activeFilter === 'all' ? 'text-slate-300' : 'text-slate-500'
            }`}>
              pendentes
            </span>
          </div>
          <div className={`mt-2 text-[11px] font-medium ${
            activeFilter === 'all' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {totalCompleted} {totalCompleted === 1 ? 'comprado' : 'comprados'} ({progressPercent}%)
          </div>
        </button>

        {/* Card: Mercado */}
        <button
          type="button"
          onClick={() => onSelectFilter(activeFilter === 'mercado' ? 'all' : 'mercado')}
          className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'mercado'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white hover:bg-emerald-50/40 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'mercado' ? 'bg-white' : 'bg-emerald-500'}`} />
              <span className={`text-xs font-semibold ${
                activeFilter === 'mercado' ? 'text-emerald-100' : 'text-slate-700'
              }`}>
                {CATEGORIES.mercado.shortName}
              </span>
            </div>
            <ShoppingBag className={`w-4 h-4 ${
              activeFilter === 'mercado' ? 'text-emerald-200' : 'text-emerald-600'
            }`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight">
              {pendingCounts.mercado}
            </span>
            <span className={`text-xs font-medium ${
              activeFilter === 'mercado' ? 'text-emerald-100' : 'text-slate-500'
            }`}>
              pendentes
            </span>
          </div>
          <div className={`mt-2 text-[11px] truncate ${
            activeFilter === 'mercado' ? 'text-emerald-200' : 'text-slate-500'
          }`}>
            Despensa & Limpeza
          </div>
        </button>

        {/* Card: Feira */}
        <button
          type="button"
          onClick={() => onSelectFilter(activeFilter === 'feira' ? 'all' : 'feira')}
          className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'feira'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white hover:bg-amber-50/40 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'feira' ? 'bg-white' : 'bg-amber-500'}`} />
              <span className={`text-xs font-semibold ${
                activeFilter === 'feira' ? 'text-amber-100' : 'text-slate-700'
              }`}>
                {CATEGORIES.feira.shortName}
              </span>
            </div>
            <Apple className={`w-4 h-4 ${
              activeFilter === 'feira' ? 'text-amber-200' : 'text-amber-600'
            }`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight">
              {pendingCounts.feira}
            </span>
            <span className={`text-xs font-medium ${
              activeFilter === 'feira' ? 'text-amber-100' : 'text-slate-500'
            }`}>
              pendentes
            </span>
          </div>
          <div className={`mt-2 text-[11px] truncate ${
            activeFilter === 'feira' ? 'text-amber-200' : 'text-slate-500'
          }`}>
            Hortifrúti fresco
          </div>
        </button>

        {/* Card: Farmácia */}
        <button
          type="button"
          onClick={() => onSelectFilter(activeFilter === 'farmacia' ? 'all' : 'farmacia')}
          className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'farmacia'
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
              : 'bg-white hover:bg-sky-50/40 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'farmacia' ? 'bg-white' : 'bg-sky-500'}`} />
              <span className={`text-xs font-semibold ${
                activeFilter === 'farmacia' ? 'text-sky-100' : 'text-slate-700'
              }`}>
                {CATEGORIES.farmacia.shortName}
              </span>
            </div>
            <Pill className={`w-4 h-4 ${
              activeFilter === 'farmacia' ? 'text-sky-200' : 'text-sky-600'
            }`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight">
              {pendingCounts.farmacia}
            </span>
            <span className={`text-xs font-medium ${
              activeFilter === 'farmacia' ? 'text-sky-100' : 'text-slate-500'
            }`}>
              pendentes
            </span>
          </div>
          <div className={`mt-2 text-[11px] truncate ${
            activeFilter === 'farmacia' ? 'text-sky-200' : 'text-slate-500'
          }`}>
            Saúde & Higiene
          </div>
        </button>
      </div>

      {/* Barra de Progresso Global */}
      {totalItems > 0 && (
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
              <span>Progresso das compras</span>
              <span className="tabular-nums font-semibold text-slate-800">
                {totalCompleted} de {totalItems} itens ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
