import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Apple, Pill, Sparkles, Star } from 'lucide-react';
import { ShoppingItem, CategoryType } from '../types';
import { CATEGORIES, COMMON_UNITS, POPULAR_SUGGESTIONS } from '../constants/categories';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>, editingId?: string) => void;
  editingItem?: ShoppingItem | null;
  initialName?: string;
  initialCategory?: CategoryType;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  initialName = '',
  initialCategory = 'mercado',
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<CategoryType>('mercado');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('un');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Populate fields when modal opens or item changes
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setBrand(editingItem.brand || '');
      setCategory(editingItem.category);
      setQuantity(editingItem.quantity);
      setUnit(editingItem.unit || 'un');
      setStatus(editingItem.status);
      setIsFavorite(editingItem.isFavorite ?? false);
      setNotes(editingItem.notes || '');
      setError('');
    } else {
      setName(initialName);
      setBrand('');
      setCategory(initialCategory);
      setQuantity(1);
      setUnit('un');
      setStatus('pending');
      setIsFavorite(false);
      setNotes('');
      setError('');
    }
  }, [editingItem, initialName, initialCategory, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do item é obrigatório.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        brand: brand.trim() || undefined,
        category,
        quantity: Math.max(1, quantity),
        unit: unit.trim() || 'un',
        status,
        isFavorite,
        notes: notes.trim() || undefined,
      },
      editingItem?.id
    );

    onClose();
  };

  const handleApplySuggestion = (sug: typeof POPULAR_SUGGESTIONS[0]) => {
    setName(sug.name);
    setCategory(sug.category);
    setUnit(sug.defaultUnit);
    setQuantity(sug.defaultQuantity);
    if (sug.brandSuggestion) setBrand(sug.brandSuggestion);
  };

  // Filter suggestions relevant to the chosen category
  const relevantSuggestions = POPULAR_SUGGESTIONS.filter(
    (s) => s.category === category
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingItem ? 'Editar Item' : 'Novo Item na Lista'}
            </h2>
            <p className="text-xs text-slate-500">
              {editingItem
                ? 'Atualize as informações do item selecionado'
                : 'Preencha os campos para adicionar à sua lista'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Nome do Item (Obrigatório) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome do Item <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Leite Integral, Tomate, Dipirona..."
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all ${
                error
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100'
              }`}
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Quick Suggestions */}
          {!editingItem && relevantSuggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Sugestões rápidas para {CATEGORIES[category].shortName}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {relevantSuggestions.map((sug) => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="min-h-[30px] px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    + {sug.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marca (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Marca <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Itambé, Nestlé, EMS, Omo..."
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* Categoria (Mercado, Feira, Farmácia) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['mercado', 'feira', 'farmacia'] as CategoryType[]).map((cat) => {
                const isSelected = category === cat;
                const Icon =
                  cat === 'mercado'
                    ? ShoppingBag
                    : cat === 'feira'
                    ? Apple
                    : Pill;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[52px] p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? cat === 'mercado'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                          : cat === 'feira'
                          ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                          : 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected
                          ? cat === 'mercado'
                            ? 'text-emerald-600'
                            : cat === 'feira'
                            ? 'text-amber-600'
                            : 'text-sky-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-bold leading-tight">
                      {CATEGORIES[cat].shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quantidade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantidade
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-full text-center font-bold text-slate-900 border-0 focus:outline-hidden text-base py-2"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Unidade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Unidade de Medida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 text-sm font-medium text-slate-900 bg-white focus:outline-hidden transition-all cursor-pointer"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Unit Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Atalhos:</span>
            {['un', 'kg', 'g', 'litros', 'caixa', 'pacote', 'dúzia'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`min-h-[28px] px-2 py-0.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  unit === u
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Status (Pendente / Comprado) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Inicial
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'pending'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pendente para comprar
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`flex-1 min-h-[40px] py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Já comprado
              </button>
            </div>
          </div>

          {/* Destaque / Favorito (⭐) */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isFavorite ? 'bg-amber-100 text-amber-600' : 'bg-slate-200/70 text-slate-400'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Item Favorito</span>
                <span className="text-[11px] text-slate-500 block">Destaque com estrela para acesso rápido</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isFavorite ? 'Favoritado ⭐' : 'Marcar'}
            </button>
          </div>

          {/* Observações / Notas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Observação <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pegar maduro, tamanho grande, sem açúcar..."
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {editingItem ? 'Salvar Alterações' : 'Adicionar à Lista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
