export type CategoryType = 'mercado' | 'feira' | 'farmacia';

export interface ShoppingItem {
  id: string;
  name: string;
  brand?: string;
  category: CategoryType;
  quantity: number;
  unit: string;
  status: 'pending' | 'completed';
  createdAt: number;
  completedAt?: number;
  notes?: string;
  isFavorite?: boolean;
}

export interface HistoryItem {
  id: string;
  name: string;
  brand?: string;
  category: CategoryType;
  defaultQuantity: number;
  defaultUnit: string;
  timesBought: number;
  lastBoughtAt: number;
}

export type ActiveTab = 'list' | 'history';

export type CategoryFilter = 'all' | CategoryType;

export type SortOption = 'status' | 'category' | 'name' | 'newest' | 'favorites';

export interface CategoryMeta {
  id: CategoryType;
  name: string;
  shortName: string;
  description: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}
