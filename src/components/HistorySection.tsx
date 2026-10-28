import React, { useState } from 'react';
import { Search, Plus, Check, Trash2, Edit3, ShoppingBag, Apple, Pill, RotateCw } from 'lucide-react';
import { HistoryItem, CategoryFilter, CategoryType } from '../types';
import { CATEGORIES } from '../constants/categories';

interface HistorySectionProps {
  history: HistoryItem[];
  activeItemNames: Set<string>;
  onReAddToList: (historyItem: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  onOpenEditModal: (prefill: {
    name: string;
    brand?: string;
    category: CategoryType;
    quantity: number;
    unit: string;
  }) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  activeItemNames,
  onReAddToList,
  onDeleteHistoryItem,
  onClearAllHistory,
  onOpenEditModal,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [readdedIds, setReaddedIds] = useState<Record<string, boolean>>({});

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleReAdd = (item: HistoryItem) => {
    onReAddToList(item);
    // Show visual feedback checkmark for 1.5 seconds
    setReaddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setReaddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const formatDate = (timestamp: number) => {
    const diffDays = Math.round((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'hoje';
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Explanation Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Histórico & Itens Recorrentes
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Itens comprados anteriormente ficam salvos aqui. Clique em{' '}
            <strong className="text-emerald-700 font-semibold">+ Readicionar</strong> para recolocá-los na lista sem redigitar!
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearAllHistory}
            className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar histórico</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({history.length})
          </button>

          {(['mercado', 'feira', 'farmacia'] as const).map((cat) => {
            const count = history.filter((h) => h.category === cat).length;
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {CATEGORIES[cat].shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar no histórico por nome ou marca..."
            className="w-full min-h-[40px] pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400"
          />
        </div>
      </div>

      {/* History Items Grid / List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <RotateCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {search ? 'Nenhum item encontrado no histórico' : 'Seu histórico está vazio'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Conforme você conclui ou adiciona itens no dia a dia, eles serão catalogados aqui para recompra rápida com 1 toque.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredHistory.map((item) => {
            const isAlreadyActive = activeItemNames.has(item.name.toLowerCase());
            const wasJustReadded = readdedIds[item.id];
            const catMeta = CATEGORIES[item.category];

            const CategoryIcon =
              item.category === 'mercado'
                ? ShoppingBag
                : item.category === 'feira'
                ? Apple
                : Pill;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className={`inline-flex items-center gap-1 font-medium ${catMeta.textColor}`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span>{catMeta.shortName}</span>
                    </span>

                    {item.brand && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-600 font-medium truncate max-w-[120px]">
                          {item.brand}
                        </span>
                      </>
                    )}

                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-700">
                      {item.defaultQuantity} {item.defaultUnit}
                    </span>

                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400">
                      {item.timesBought}x {formatDate(item.lastBoughtAt)}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Re-add button & actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleReAdd(item)}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      wasJustReadded
                        ? 'bg-emerald-600 text-white'
                        : isAlreadyActive
                        ? 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {wasJustReadded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isAlreadyActive ? '+ Mais 1' : 'Readicionar'}</span>
                      </>
                    )}
                  </button>

                  {/* Edit attributes before readding */}
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEditModal({
                        name: item.name,
                        brand: item.brand,
                        category: item.category,
                        quantity: item.defaultQuantity,
                        unit: item.defaultUnit,
                      })
                    }
                    title="Editar quantidade ou detalhes"
                    className="min-h-[38px] min-w-[38px] p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete from history */}
                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    title="Excluir do histórico"
                    className="min-h-[38px] min-w-[38px] p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
