'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Cookies', value: 'cookies' },
  { label: 'Brownies', value: 'brownies' },
  { label: 'Cakes', value: 'cakes' },
  { label: 'Cupcakes', value: 'cupcakes' },
  { label: 'Breads', value: 'breads' },
  { label: 'Pastries', value: 'pastries' },
  { label: 'Gift Boxes', value: 'gift-boxes' },
]

export default function ShopFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? 'all'

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete('category')
    else params.set('category', value)
    const query = params.toString()
    router.push(pathname + (query ? `?${query}` : ''), { scroll: false })
  }

  return (
    <div className="bg-cream sticky top-[57px] z-40 border-b border-edge">
      <div className="px-4 sm:px-8 lg:px-20 py-4 flex items-center gap-3 overflow-x-auto scrollbar-none">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilter(filter.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
              active === filter.value
                ? 'bg-chocolate text-white'
                : 'bg-beige text-ink hover:bg-edge transition-colors'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
