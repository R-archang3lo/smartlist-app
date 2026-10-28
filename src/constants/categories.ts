import { CategoryType, CategoryMeta } from '../types';

export const CATEGORIES: Record<CategoryType, CategoryMeta> = {
  mercado: {
    id: 'mercado',
    name: 'Mercado & Despensa',
    shortName: 'Mercado',
    description: 'Alimentos não perecíveis, bebidas, limpeza e produtos para casa',
    bgLight: 'bg-emerald-50/80',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  feira: {
    id: 'feira',
    name: 'Feira & Hortifrúti',
    shortName: 'Feira',
    description: 'Frutas, legumes, verduras, ervas frescas e temperos',
    bgLight: 'bg-amber-50/80',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  farmacia: {
    id: 'farmacia',
    name: 'Farmácia & Cuidados',
    shortName: 'Farmácia',
    description: 'Medicamentos, higiene pessoal, dermocosméticos e primeiros socorros',
    bgLight: 'bg-sky-50/80',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
  },
};

export const COMMON_UNITS = [
  'un',
  'kg',
  'g',
  'litros',
  'ml',
  'caixa',
  'pacote',
  'dúzia',
  'bandeja',
  'lata',
  'garrafa',
  'frasco',
];

export interface ItemSuggestion {
  name: string;
  category: CategoryType;
  defaultUnit: string;
  defaultQuantity: number;
  brandSuggestion?: string;
}

export const POPULAR_SUGGESTIONS: ItemSuggestion[] = [
  // Mercado
  { name: 'Arroz Branco', category: 'mercado', defaultUnit: 'kg', defaultQuantity: 5, brandSuggestion: 'Tio João' },
  { name: 'Feijão Carioca', category: 'mercado', defaultUnit: 'kg', defaultQuantity: 1, brandSuggestion: 'Camil' },
  { name: 'Café Torrado e Moído', category: 'mercado', defaultUnit: 'g', defaultQuantity: 500, brandSuggestion: 'Pilão' },
  { name: 'Azeite de Oliva Extra Virgem', category: 'mercado', defaultUnit: 'ml', defaultQuantity: 500, brandSuggestion: 'Gallo' },
  { name: 'Açúcar Refinado', category: 'mercado', defaultUnit: 'kg', defaultQuantity: 1, brandSuggestion: 'União' },
  { name: 'Leite Integral', category: 'mercado', defaultUnit: 'litros', defaultQuantity: 2, brandSuggestion: 'Itambé' },
  { name: 'Manteiga com Sal', category: 'mercado', defaultUnit: 'g', defaultQuantity: 200, brandSuggestion: 'Aviação' },
  { name: 'Detergente Líquido', category: 'mercado', defaultUnit: 'ml', defaultQuantity: 500, brandSuggestion: 'Ypê' },
  { name: 'Sabão em Pó', category: 'mercado', defaultUnit: 'kg', defaultQuantity: 1, brandSuggestion: 'Omo' },
  { name: 'Papel Higiênico', category: 'mercado', defaultUnit: 'pacote', defaultQuantity: 1, brandSuggestion: 'Neve' },
  { name: 'Água Sanitária', category: 'mercado', defaultUnit: 'litros', defaultQuantity: 1, brandSuggestion: 'Dragão' },
  { name: 'Macarrão Espaguete', category: 'mercado', defaultUnit: 'g', defaultQuantity: 500, brandSuggestion: 'Barilla' },

  // Feira
  { name: 'Banana Prata', category: 'feira', defaultUnit: 'dúzia', defaultQuantity: 1 },
  { name: 'Maçã Gala', category: 'feira', defaultUnit: 'kg', defaultQuantity: 1 },
  { name: 'Tomate Italiano', category: 'feira', defaultUnit: 'kg', defaultQuantity: 1 },
  { name: 'Cebola Roxa', category: 'feira', defaultUnit: 'kg', defaultQuantity: 1 },
  { name: 'Alho Roxo', category: 'feira', defaultUnit: 'g', defaultQuantity: 200 },
  { name: 'Batata Inglesa', category: 'feira', defaultUnit: 'kg', defaultQuantity: 2 },
  { name: 'Cenoura', category: 'feira', defaultUnit: 'kg', defaultQuantity: 1 },
  { name: 'Alface Crespa', category: 'feira', defaultUnit: 'un', defaultQuantity: 1 },
  { name: 'Limão Taiti', category: 'feira', defaultUnit: 'kg', defaultQuantity: 1 },
  { name: 'Ovos Caipiras', category: 'feira', defaultUnit: 'dúzia', defaultQuantity: 1 },
  { name: 'Laranja Pera', category: 'feira', defaultUnit: 'kg', defaultQuantity: 2 },
  { name: 'Cheiro Verde', category: 'feira', defaultUnit: 'un', defaultQuantity: 1 },

  // Farmácia
  { name: 'Dipirona 500mg', category: 'farmacia', defaultUnit: 'caixa', defaultQuantity: 1, brandSuggestion: 'EMS' },
  { name: 'Paracetamol 750mg', category: 'farmacia', defaultUnit: 'caixa', defaultQuantity: 1, brandSuggestion: 'Medley' },
  { name: 'Protetor Solar FPS 50', category: 'farmacia', defaultUnit: 'un', defaultQuantity: 1, brandSuggestion: 'La Roche-Posay' },
  { name: 'Creme Dental', category: 'farmacia', defaultUnit: 'un', defaultQuantity: 2, brandSuggestion: 'Colgate' },
  { name: 'Fio Dental', category: 'farmacia', defaultUnit: 'un', defaultQuantity: 1, brandSuggestion: 'Oral-B' },
  { name: 'Curativo Adesivo', category: 'farmacia', defaultUnit: 'caixa', defaultQuantity: 1, brandSuggestion: 'Band-Aid' },
  { name: 'Sabonete Líquido Hidratante', category: 'farmacia', defaultUnit: 'frasco', defaultQuantity: 1, brandSuggestion: 'Dove' },
  { name: 'Álcool em Gel 70%', category: 'farmacia', defaultUnit: 'ml', defaultQuantity: 500 },
  { name: 'Vitamina C Efervescente', category: 'farmacia', defaultUnit: 'caixa', defaultQuantity: 1, brandSuggestion: 'Redoxon' },
  { name: 'Desodorante Aerosol', category: 'farmacia', defaultUnit: 'un', defaultQuantity: 1, brandSuggestion: 'Rexona' },
];

/**
 * Predicts category based on item name keywords in Portuguese
 */
export function predictCategory(name: string): CategoryType {
  const lower = name.toLowerCase().trim();

  // Farmácia keywords
  const pharmaKeywords = [
    'dipirona', 'paracetamol', 'remedio', 'remédio', 'aspirina', 'dorflex',
    'ibuprofeno', 'antigripal', 'pomada', 'curativo', 'band-aid', 'gaze',
    'algodão', 'álcool', 'alcool', 'protetor solar', 'creme dental', 'pasta de dente',
    'escova de dente', 'fio dental', 'shampoo', 'condicionador', 'desodorante',
    'sabonete', 'vitamina', 'soro', 'antialérgico', 'antialergico', 'colírio', 'colirio',
    'termômetro', 'termometro', 'repelente', 'lenço umedecido', 'fralda'
  ];
  if (pharmaKeywords.some(kw => lower.includes(kw))) {
    return 'farmacia';
  }

  // Feira keywords
  const feiraKeywords = [
    'banana', 'maçã', 'maca', 'tomate', 'cebola', 'alho', 'batata', 'cenoura',
    'alface', 'limão', 'limao', 'laranja', 'ovo', 'ovos', 'morango', 'melancia',
    'abacaxi', 'manga', 'mamão', 'mamao', 'uva', 'abacate', 'chuchu', 'abobrinha',
    'brócolis', 'brocolis', 'couve', 'espinafre', 'rúcula', 'rucula', 'cheiro verde',
    'coentro', 'salsa', 'cebolinha', 'manjericão', 'manjericao', 'gengibre', 'pimentão',
    'pimentao', 'quiabo', 'mandioca', 'aipim', 'macaxeira', 'beterraba', 'repolho'
  ];
  if (feiraKeywords.some(kw => lower.includes(kw))) {
    return 'feira';
  }

  // Default to mercado
  return 'mercado';
}
