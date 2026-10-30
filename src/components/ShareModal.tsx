import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { ShoppingItem } from '../types';
import { CATEGORIES } from '../constants/categories';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [copied, setCopied] = useState(false);
  const [onlyPending, setOnlyPending] = useState(true);

  if (!isOpen) return null;

  const relevantItems = onlyPending
    ? items.filter((i) => i.status === 'pending')
    : items;

  const generateText = () => {
    const lines: string[] = ['🛒 *SmartList - Lista de Compras*'];
    lines.push(`📅 ${new Date().toLocaleDateString('pt-BR')}\n`);

    const categories = ['feira', 'mercado', 'farmacia'] as const;

    for (const cat of categories) {
      const catItems = relevantItems.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        const icon = cat === 'feira' ? '🥬' : cat === 'mercado' ? '🛒' : '💊';
        lines.push(`${icon} *${CATEGORIES[cat].shortName.toUpperCase()}* (${catItems.length})`);
        catItems.forEach((item) => {
          const brandText = item.brand ? ` (${item.brand})` : '';
          const star = item.isFavorite ? ' ⭐' : '';
          const check = item.status === 'completed' ? ' [✓]' : ' [ ]';
          lines.push(`• ${item.name}${brandText}${star}: ${item.quantity} ${item.unit}${onlyPending ? '' : check}`);
        });
        lines.push('');
      }
    }

    if (relevantItems.length === 0) {
      lines.push('Nenhum item pendente no momento!');
    }

    return lines.join('\n');
  };

  const textToShare = generateText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SmartList - Lista de Compras',
          text: textToShare,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Compartilhar Lista
            </h2>
            <p className="text-xs text-slate-500">
              Copie ou envie sua lista formatada para o WhatsApp ou outros aplicativos
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Options toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-xs font-semibold text-slate-700">Incluir na cópia:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setOnlyPending(true)}
                className={`min-h-[32px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  onlyPending ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Apenas Pendentes
              </button>
              <button
                type="button"
                onClick={() => setOnlyPending(false)}
                className={`min-h-[32px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  !onlyPending ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Todos os Itens
              </button>
            </div>
          </div>

          {/* Text preview */}
          <div className="relative">
            <pre className="w-full h-56 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 overflow-y-auto whitespace-pre-wrap select-all">
              {textToShare}
            </pre>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="min-h-[44px] px-4 py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
