import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ShoppingItem, CategoryFilter } from '../types';
import { ItemCard } from './ItemCard';

interface ItemListProps {
  items: ShoppingItem[];
  currentFilter: CategoryFilter;
  searchQuery: string;
  onToggleStatus: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onOpenNewModal: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  currentFilter,
  searchQuery,
  onToggleStatus,
  onUpdateQuantity,
  onEdit,
  onDelete,
  onOpenNewModal,
}) => {
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  const pendingItems = items.filter((i) => i.status === 'pending');
  const completedItems = items.filter((i) => i.status === 'completed');

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="max-w-sm mx-auto">
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery
              ? 'Nenhum item encontrado com essa busca'
              : currentFilter !== 'all'
              ? 'Nenhum item nesta categoria'
              : 'Sua lista está vazia!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? 'Tente procurar por outro termo ou limpe a busca.'
              : 'Adicione novos itens usando o campo acima ou reabra itens frequentes do histórico.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewModal}
          className="min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Cadastrar Primeiro Item</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Items Section */}
      {pendingItems.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Itens a comprar ({pendingItems.length})
            </h3>
          </div>

          <div className="space-y-2">
            {pendingItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggleStatus={onToggleStatus}
                onUpdateQuantity={onUpdateQuantity}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* When all items are completed */}
      {pendingItems.length === 0 && completedItems.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Tudo comprado! Todos os itens desta lista foram marcados.</span>
          </div>
          <p className="text-xs text-emerald-700/80 mt-1">
            Precisa de algo mais? Adicione um novo item ou consulte o histórico.
          </p>
        </div>
      )}

      {/* Completed Items Section */}
      {completedItems.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => setCompletedCollapsed(!completedCollapsed)}
            className="w-full flex items-center justify-between px-1 py-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              {completedCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Itens Comprados ({completedItems.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {completedCollapsed ? 'Clique para ver' : 'Clique para ocultar'}
            </span>
          </button>

          {!completedCollapsed && (
            <div className="space-y-2">
              {completedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggleStatus={onToggleStatus}
                  onUpdateQuantity={onUpdateQuantity}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
