import { ShoppingItem, HistoryItem } from '../types';

const STORAGE_KEY_ITEMS = 'smartlist_items_v2';
const STORAGE_KEY_HISTORY = 'smartlist_history_v2';

const INITIAL_ITEMS: ShoppingItem[] = [
  {
    id: 'item-1',
    name: 'Leite Integral',
    brand: 'Itambé',
    category: 'mercado',
    quantity: 2,
    unit: 'litros',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 2,
    notes: 'Preferência por desnatado se não tiver',
    isFavorite: true,
  },
  {
    id: 'item-2',
    name: 'Café Torrado e Moído',
    brand: 'Pilão',
    category: 'mercado',
    quantity: 500,
    unit: 'g',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 4,
    isFavorite: true,
  },
  {
    id: 'item-3',
    name: 'Banana Prata',
    brand: '',
    category: 'feira',
    quantity: 1,
    unit: 'dúzia',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 3,
    notes: 'Madura para consumo rápido',
  },
  {
    id: 'item-4',
    name: 'Tomate Italiano',
    brand: '',
    category: 'feira',
    quantity: 1,
    unit: 'kg',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'item-5',
    name: 'Dipirona 500mg',
    brand: 'EMS',
    category: 'farmacia',
    quantity: 1,
    unit: 'caixa',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'item-6',
    name: 'Protetor Solar FPS 50',
    brand: 'La Roche-Posay',
    category: 'farmacia',
    quantity: 1,
    unit: 'un',
    status: 'completed',
    createdAt: Date.now() - 3600000 * 24,
    completedAt: Date.now() - 3600000 * 1,
  },
];

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    name: 'Arroz Branco Tipo 1',
    brand: 'Tio João',
    category: 'mercado',
    defaultQuantity: 5,
    defaultUnit: 'kg',
    timesBought: 4,
    lastBoughtAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'hist-2',
    name: 'Azeite de Oliva Extra Virgem',
    brand: 'Gallo',
    category: 'mercado',
    defaultQuantity: 500,
    defaultUnit: 'ml',
    timesBought: 3,
    lastBoughtAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'hist-3',
    name: 'Ovos Caipiras',
    brand: 'Mantiqueira',
    category: 'feira',
    defaultQuantity: 1,
    defaultUnit: 'dúzia',
    timesBought: 6,
    lastBoughtAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'hist-4',
    name: 'Batata Inglesa',
    brand: '',
    category: 'feira',
    defaultQuantity: 2,
    defaultUnit: 'kg',
    timesBought: 5,
    lastBoughtAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'hist-5',
    name: 'Creme Dental Total 12',
    brand: 'Colgate',
    category: 'farmacia',
    defaultQuantity: 2,
    defaultUnit: 'un',
    timesBought: 4,
    lastBoughtAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'hist-6',
    name: 'Detergente Líquido',
    brand: 'Ypê',
    category: 'mercado',
    defaultQuantity: 500,
    defaultUnit: 'ml',
    timesBought: 8,
    lastBoughtAt: Date.now() - 86400000 * 4,
  },
];

export function getStoredItems(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      saveStoredItems(INITIAL_ITEMS);
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Erro ao carregar itens do localStorage:', err);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: ShoppingItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Erro ao salvar itens no localStorage:', err);
  }
}

export function getStoredHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      saveStoredHistory(INITIAL_HISTORY);
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Erro ao carregar histórico do localStorage:', err);
    return INITIAL_HISTORY;
  }
}

export function saveStoredHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Erro ao salvar histórico no localStorage:', err);
  }
}

/**
 * Updates or adds an item to history whenever it gets bought or registered
 */
export function recordItemInHistory(item: Pick<ShoppingItem, 'name' | 'brand' | 'category' | 'quantity' | 'unit'>, history: HistoryItem[]): HistoryItem[] {
  const normName = item.name.trim().toLowerCase();
  const existingIndex = history.findIndex(
    h => h.name.trim().toLowerCase() === normName && h.category === item.category
  );

  if (existingIndex >= 0) {
    const updated = [...history];
    const prev = updated[existingIndex];
    updated[existingIndex] = {
      ...prev,
      brand: item.brand || prev.brand,
      defaultQuantity: item.quantity > 0 ? item.quantity : prev.defaultQuantity,
      defaultUnit: item.unit || prev.defaultUnit,
      timesBought: prev.timesBought + 1,
      lastBoughtAt: Date.now(),
    };
    return updated;
  } else {
    const newItem: HistoryItem = {
      id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: item.name.trim(),
      brand: item.brand?.trim() || '',
      category: item.category,
      defaultQuantity: item.quantity,
      defaultUnit: item.unit,
      timesBought: 1,
      lastBoughtAt: Date.now(),
    };
    return [newItem, ...history];
  }
}

/**
 * Reset application data back to demonstration dataset
 */
export function resetToDefaults(): { items: ShoppingItem[]; history: HistoryItem[] } {
  saveStoredItems(INITIAL_ITEMS);
  saveStoredHistory(INITIAL_HISTORY);
  return { items: INITIAL_ITEMS, history: INITIAL_HISTORY };
}
