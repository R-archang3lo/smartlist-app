import React from 'react';
import { Check, Edit2, Trash2, Plus, Minus, ShoppingBag, Apple, Pill } from 'lucide-react';
import { ShoppingItem } from '../types';
import { CATEGORIES } from '../constants/categories';

interface ItemCardProps {
  item: ShoppingItem;
  onToggleStatus: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onToggleStatus,
  onUpdateQuantity,
  onEdit,
  onDelete,
}) => {
  const isCompleted = item.status === 'completed';
  const categoryMeta = CATEGORIES[item.category];

  const CategoryIcon =
    item.category === 'mercado'
      ? ShoppingBag
      : item.category === 'feira'
      ? Apple
      : Pill;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-150 p-3.5 sm:p-4 flex items-center justify-between gap-3 ${
        isCompleted
          ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
          : 'border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Left side: Checkbox + Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Tactile Checkbox Button (min 44px touch hitbox) */}
        <button
          type="button"
          onClick={() => onToggleStatus(item.id)}
          aria-label={isCompleted ? `Desmarcar ${item.name}` : `Marcar ${item.name} como comprado`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 cursor-pointer"
        >
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-emerald-500 bg-white'
            }`}
          >
            {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </button>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-base font-semibold truncate transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-900'
              }`}
            >
              {item.name}
            </h3>
          </div>

          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-0.5">
            {/* Category tag */}
            <span className={`inline-flex items-center gap-1 font-medium ${
              isCompleted ? 'text-slate-400' : categoryMeta.textColor
            }`}>
              <CategoryIcon className="w-3 h-3" />
              <span>{categoryMeta.shortName}</span>
            </span>

            {/* Brand (if present) */}
            {item.brand && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-600 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                  {item.brand}
                </span>
              </>
            )}

            {/* Notes preview (if present) */}
            {item.notes && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="italic text-slate-400 truncate max-w-[120px] sm:max-w-[180px]">
                  {item.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Quantity control & Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200/60">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            title="Diminuir quantidade"
            aria-label="Diminuir quantidade"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="px-2 text-center select-none">
            <span className="text-xs sm:text-sm font-bold tabular-nums text-slate-800">
              {item.quantity}
            </span>
            <span className="text-[11px] font-medium text-slate-500 ml-1">
              {item.unit}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            title="Aumentar quantidade"
            aria-label="Aumentar quantidade"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            title="Editar item"
            aria-label={`Editar ${item.name}`}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Excluir item da lista"
            aria-label={`Excluir ${item.name}`}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
