import React from 'react';
import { ShoppingBag, History, Plus, Share2, RotateCcw } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
  historyCount: number;
  onOpenNewItemModal: () => void;
  onOpenShareModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  historyCount,
  onOpenNewItemModal,
  onOpenShareModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
            SmartList
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean Segmented / Single-line tabs) */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onTabChange('list')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Lista Ativa</span>
            {pendingCount > 0 && (
              <span className="tabular-nums px-1.5 py-0.2 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Histórico & Frequentes</span>
            {historyCount > 0 && (
              <span className="tabular-nums px-1.5 py-0.2 text-[11px] font-bold rounded-md bg-slate-200 text-slate-700">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenShareModal}
            title="Compartilhar lista por WhatsApp ou texto"
            aria-label="Compartilhar lista"
            className="min-h-[40px] min-w-[40px] p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onResetData}
            title="Restaurar dados de exemplo"
            aria-label="Restaurar dados de exemplo"
            className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenNewItemModal}
            className="min-h-[42px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Novo Item</span>
            <span className="xs:hidden">Novo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
