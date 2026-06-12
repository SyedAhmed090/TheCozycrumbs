'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Cookies', value: 'cookies' },
  { label: 'Brownies', value: 'brownies' },
  { label: 'Cakes', value: 'cakes' },
  { label: 'Cupcakes', value: 'cupcakes' },
  { label: 'Breads', value: 'breads' },
  { label: 'Savory', value: 'savory' },
  { label: 'Pastries', value: 'pastries' },
  { label: 'Gift Boxes', value: 'gift-boxes' },
]

export default function ShopFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? 'all'
  const currentQ = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(currentQ)

  // Keep input in sync when URL changes (e.g. browser back, or clear via category click)
  useEffect(() => {
    setSearchInput(currentQ)
  }, [currentQ])

  function buildUrl(overrides: { category?: string | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString())
    if ('category' in overrides) {
      if (!overrides.category || overrides.category === 'all') params.delete('category')
      else params.set('category', overrides.category)
    }
    if ('q' in overrides) {
      if (!overrides.q) params.delete('q')
      else params.set('q', overrides.q)
    }
    const qs = params.toString()
    return pathname + (qs ? `?${qs}` : '')
  }

  function handleFilter(value: string) {
    router.push(buildUrl({ category: value }), { scroll: false })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(buildUrl({ q: searchInput.trim() || null }), { scroll: false })
  }

  function clearSearch() {
    setSearchInput('')
    router.push(buildUrl({ q: null }), { scroll: false })
  }

  return (
    <div className="bg-cream sticky top-[60px] lg:top-[72px] z-40 border-b border-edge">
      {/* Search bar */}
      <div className="px-4 sm:px-8 lg:px-20 pt-3 pb-1">
        <form onSubmit={handleSearch} className="relative inline-flex w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white border border-edge rounded-full pl-8 pr-8 py-1.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-caramel transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </form>
      </div>

      {/* Category filter pills */}
      <div className="px-4 sm:px-8 lg:px-20 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilter(filter.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
              active === filter.value
                ? 'bg-chocolate text-white'
                : 'bg-beige text-ink hover:bg-edge'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
