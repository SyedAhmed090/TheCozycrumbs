export const CATEGORIES = [
  { value: 'cakes',      label: 'Cakes',      color: 'bg-rose-100 text-rose-700' },
  { value: 'cupcakes',   label: 'Cupcakes',   color: 'bg-purple-100 text-purple-700' },
  { value: 'cookies',    label: 'Cookies',    color: 'bg-amber-100 text-amber-700' },
  { value: 'brownies',   label: 'Brownies',   color: 'bg-orange-100 text-orange-700' },
  { value: 'breads',     label: 'Breads',     color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pastries',   label: 'Pastries',   color: 'bg-teal-100 text-teal-700' },
  { value: 'gift-boxes', label: 'Gift Boxes', color: 'bg-green-100 text-green-700' },
  { value: 'savory',     label: 'Savory',     color: 'bg-gray-100 text-gray-600' },
] as const

export type CategoryValue = typeof CATEGORIES[number]['value']

export function getCategoryMeta(value: string) {
  return CATEGORIES.find(c => c.value === value)
    ?? { value, label: value, color: 'bg-gray-100 text-gray-600' }
}
