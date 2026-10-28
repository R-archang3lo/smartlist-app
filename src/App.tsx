import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, History, Plus } from 'lucide-react';
import { ShoppingItem, HistoryItem, ActiveTab, CategoryFilter, SortOption, CategoryType } from './types';
import {
  getStoredItems,
  saveStoredItems,
  getStoredHistory,
  saveStoredHistory,
  recordItemInHistory,
  resetToDefaults,
} from './utils/storage';
import { Header } from './components/Header';
import { CategorySummary } from './components/CategorySummary';
import { QuickAddBar } from './components/QuickAddBar';
import { FilterBar } from './components/FilterBar';
import { ItemList } from './components/ItemList';
import { HistorySection } from './components/HistorySection';
import { ItemModal } from './components/ItemModal';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>(() => getStoredItems());
  const [history, setHistory] = useState<HistoryItem[]>(() => getStoredHistory());
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [currentFilter, setCurrentFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('status');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [modalPrefills, setModalPrefills] = useState<{
    name: string;
    category?: CategoryType;
  }>({ name: '' });

  // Sync with localStorage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    saveStoredHistory(history);
  }, [history]);

  // Set of names currently in active list
  const activeItemNames = useMemo(() => {
    return new Set(items.map((i) => i.name.trim().toLowerCase()));
  }, [items]);

  // Category counts for pending items
  const pendingCounts: Record<CategoryType, number> = useMemo(() => {
    const counts: Record<CategoryType, number> = { mercado: 0, feira: 0, farmacia: 0 };
    items.forEach((item) => {
      if (item.status === 'pending') {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  const totalPending = useMemo(() => {
    return items.filter((i) => i.status === 'pending').length;
  }, [items]);

  const totalCompleted = useMemo(() => {
    return items.filter((i) => i.status === 'completed').length;
  }, [items]);

  // Total counts by category for current filter badge
  const categoryItemCounts = useMemo(() => {
    return {
      all: items.length,
      mercado: items.filter((i) => i.category === 'mercado').length,
      feira: items.filter((i) => i.category === 'feira').length,
      farmacia: items.filter((i) => i.category === 'farmacia').length,
    };
  }, [items]);

  // Filtering and Sorting items
  const displayedItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        const matchesSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'status') {
          if (a.status !== b.status) {
            return a.status === 'pending' ? -1 : 1;
          }
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'category') {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          if (a.status !== b.status) {
            return a.status === 'pending' ? -1 : 1;
          }
          return a.name.localeCompare(b.name, 'pt-BR');
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'pt-BR');
        }
        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }
        return 0;
      });
  }, [items, currentFilter, searchQuery, sortBy]);

  // Handler: Add or Update Item
  const handleSaveItem = (
    itemData: Omit<ShoppingItem, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...itemData } : i))
      );
    } else {
      const newItem: ShoppingItem = {
        ...itemData,
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: Date.now(),
      };
      setItems((prev) => [newItem, ...prev]);

      // Record in history catalog
      setHistory((prevHist) => recordItemInHistory(newItem, prevHist));
    }
    setEditingItem(null);
  };

  // Handler: Quick Add directly from top input
  const handleQuickAdd = (
    name: string,
    category: CategoryType,
    quantity: number,
    unit: string
  ) => {
    const newItem: ShoppingItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name,
      category,
      quantity,
      unit,
      status: 'pending',
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setHistory((prev) => recordItemInHistory(newItem, prev));
  };

  // Handler: Toggle Bought / Pending
  const handleToggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newStatus = item.status === 'pending' ? 'completed' : 'pending';
        const updatedItem = {
          ...item,
          status: newStatus as 'pending' | 'completed',
          completedAt: newStatus === 'completed' ? Date.now() : undefined,
        };

        // When marking as completed, register into purchase history
        if (newStatus === 'completed') {
          setHistory((prevHist) => recordItemInHistory(updatedItem, prevHist));
        }

        return updatedItem;
      })
    );
  };

  // Handler: Stepper Quantity (+ / -)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      })
    );
  };

  // Handler: Delete Item from active list
  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (itemToDelete) {
      // Ensure item remains preserved in history as required by prompt
      setHistory((prevHist) => recordItemInHistory(itemToDelete, prevHist));
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Handler: Re-add item from History into active list with 1-click!
  const handleReAddFromHistory = (historyItem: HistoryItem) => {
    setItems((prev) => {
      // Check if item with same name and category is already in active list
      const existingIndex = prev.findIndex(
        (i) =>
          i.name.trim().toLowerCase() === historyItem.name.trim().toLowerCase() &&
          i.category === historyItem.category
      );

      if (existingIndex >= 0) {
        // If it exists, make sure it is pending and increment its count
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          status: 'pending',
          quantity: existing.status === 'completed' ? existing.quantity : existing.quantity + 1,
        };
        return updated;
      } else {
        // Create new active item
        const newItem: ShoppingItem = {
          id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          name: historyItem.name,
          brand: historyItem.brand,
          category: historyItem.category,
          quantity: historyItem.defaultQuantity || 1,
          unit: historyItem.defaultUnit || 'un',
          status: 'pending',
          createdAt: Date.now(),
        };
        return [newItem, ...prev];
      }
    });

    // Update history timesBought
    setHistory((prev) =>
      prev.map((h) =>
        h.id === historyItem.id
          ? { ...h, timesBought: h.timesBought + 1, lastBoughtAt: Date.now() }
          : h
      )
    );
  };

  // Handler: Delete from History permanently
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  // Handler: Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Deseja realmente limpar todo o histórico de compras?')) {
      setHistory([]);
    }
  };

  // Bulk: Clear Completed from list
  const handleClearCompleted = () => {
    // Preserve items in history before clearing
    const completedItems = items.filter((i) => i.status === 'completed');
    let updatedHistory = history;
    completedItems.forEach((ci) => {
      updatedHistory = recordItemInHistory(ci, updatedHistory);
    });
    setHistory(updatedHistory);
    setItems((prev) => prev.filter((i) => i.status !== 'completed'));
  };

  // Bulk: Toggle All
  const handleToggleAllCompleted = () => {
    const allAreCompleted = items.length > 0 && items.every((i) => i.status === 'completed');
    const targetStatus = allAreCompleted ? 'pending' : 'completed';

    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        status: targetStatus,
        completedAt: targetStatus === 'completed' ? Date.now() : undefined,
      }))
    );

    if (targetStatus === 'completed') {
      let updatedHistory = history;
      items.forEach((i) => {
        updatedHistory = recordItemInHistory(i, updatedHistory);
      });
      setHistory(updatedHistory);
    }
  };

  // Reset to initial demo dataset
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar a lista inicial com dados de exemplo?')) {
      const defs = resetToDefaults();
      setItems(defs.items);
      setHistory(defs.history);
      setCurrentFilter('all');
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 pb-24 md:pb-12 text-slate-900 flex flex-col">
      {/* Top Bar Contract (Wordmark - Navigation Links - Primary CTA) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={totalPending}
        historyCount={history.length}
        onOpenNewItemModal={() => {
          setEditingItem(null);
          setModalPrefills({ name: '' });
          setIsModalOpen(true);
        }}
        onOpenShareModal={() => setIsShareOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Dynamic Category Summary Metric Cards */}
        <CategorySummary
          pendingCounts={pendingCounts}
          totalPending={totalPending}
          totalCompleted={totalCompleted}
          activeFilter={currentFilter}
          onSelectFilter={(f) => {
            setCurrentFilter(f);
            if (activeTab !== 'list') setActiveTab('list');
          }}
        />

        {/* View Switcher: Active List vs History */}
        {activeTab === 'list' ? (
          <div className="space-y-5">
            {/* Quick Add Bar with Auto-Category Detection */}
            <QuickAddBar
              onQuickAdd={handleQuickAdd}
              onOpenFullModal={(prefillName, prefillCategory) => {
                setEditingItem(null);
                setModalPrefills({
                  name: prefillName || '',
                  category: prefillCategory,
                });
                setIsModalOpen(true);
              }}
            />

            {/* Filter Bar (Categories, Search, Sort & Bulk actions) */}
            <FilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              hasCompletedItems={totalCompleted > 0}
              onClearCompleted={handleClearCompleted}
              onToggleAllCompleted={handleToggleAllCompleted}
              allCompleted={items.length > 0 && items.every((i) => i.status === 'completed')}
              itemCounts={categoryItemCounts}
            />

            {/* Active Items Feed */}
            <ItemList
              items={displayedItems}
              currentFilter={currentFilter}
              searchQuery={searchQuery}
              onToggleStatus={handleToggleStatus}
              onUpdateQuantity={handleUpdateQuantity}
              onEdit={(item) => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteItem}
              onOpenNewModal={() => {
                setEditingItem(null);
                setModalPrefills({ name: '' });
                setIsModalOpen(true);
              }}
            />
          </div>
        ) : (
          /* Frequent Items & Purchase History View */
          <HistorySection
            history={history}
            activeItemNames={activeItemNames}
            onReAddToList={handleReAddFromHistory}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            onOpenEditModal={(prefill) => {
              setEditingItem(null);
              setModalPrefills({
                name: prefill.name,
                category: prefill.category,
              });
              setIsModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile Thumb Ergonomics */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'list' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalPending > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalPending}
              </span>
            )}
          </div>
          <span className="text-[11px]">Lista</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalPrefills({ name: '' });
            setIsModalOpen(true);
          }}
          className="w-12 h-12 -mt-5 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'history' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <History className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-slate-300 text-slate-800 text-[10px] font-bold px-1 rounded-full flex items-center justify-center">
                {history.length}
              </span>
            )}
          </div>
          <span className="text-[11px]">Histórico</span>
        </button>
      </div>

      {/* Item Creation & Edit Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
        initialName={modalPrefills.name}
        initialCategory={modalPrefills.category}
      />

      {/* Share / WhatsApp Format Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        items={items}
      />
    </div>
  );
}
