'use client'

import { useState, useMemo, useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { toggleProductAvailability } from '@/app/admin/products/actions'
import { CATEGORIES, getCategoryMeta } from '@/lib/constants/products'

export type AdminProduct = {
  id: string
  name: string
  slug: string
  category: string
  base_price: number | null
  is_available: boolean
  is_featured: boolean
  stock_quantity: number | null
  images: string[]
  description: string | null
  created_at: string
}

// ─── Category badge ────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const meta = getCategoryMeta(category)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  )
}

// ─── Product card ──────────────────────────────────────────────────────────

function ProductCard({
  product,
  onToggle,
  toggling,
}: {
  product: AdminProduct
  onToggle: (id: string, current: boolean) => void
  toggling: boolean
}) {
  const thumb = product.images?.[0]
  const price = product.base_price != null
    ? `Rs. ${product.base_price.toLocaleString()}`
    : 'Custom pricing'
  const stock = product.stock_quantity != null
    ? `${product.stock_quantity} in stock`
    : 'Unlimited stock'

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-md ${product.is_available ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>

      {/* Photo */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
            <span className="text-4xl">🧁</span>
            <span className="text-xs font-inter">No photo</span>
          </div>
        )}

        {/* Top-right badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {product.is_featured && (
            <span className="bg-caramel text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              ★ Featured
            </span>
          )}
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm ${product.is_available ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {product.is_available ? 'Active' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-fraunces text-[15px] text-chocolate leading-tight mb-1">{product.name}</h3>
          <CategoryBadge category={product.category} />
        </div>

        <div className="flex flex-col gap-0.5 mt-auto">
          <p className="font-inter text-sm font-semibold text-gray-800">{price}</p>
          <p className="font-inter text-xs text-gray-400">{stock}</p>
        </div>

        {product.description && (
          <p className="font-inter text-xs text-gray-400 line-clamp-2">{product.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/admin/products/${product.id}`}
          className="flex-1 bg-chocolate text-white text-xs font-inter font-semibold text-center py-2 rounded-xl hover:bg-chocolate/90 transition-colors"
        >
          Edit
        </Link>
        <button
          type="button"
          disabled={toggling}
          onClick={() => onToggle(product.id, product.is_available)}
          className={`flex-1 text-xs font-inter font-semibold py-2 rounded-xl border transition-colors disabled:opacity-50 ${
            product.is_available
              ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
              : 'border-green-200 text-green-700 hover:bg-green-50'
          }`}
        >
          {product.is_available ? 'Hide' : 'Make Active'}
        </button>
      </div>
    </div>
  )
}

// ─── Main grid ────────────────────────────────────────────────────────────

export default function ProductGrid({ products }: { products: AdminProduct[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [, startTransition] = useTransition()

  const [optimisticProducts, updateOptimistic] = useOptimistic(
    products,
    (current, { id, is_available }: { id: string; is_available: boolean }) =>
      current.map(p => (p.id === id ? { ...p, is_available } : p))
  )

  function handleToggle(id: string, currentValue: boolean) {
    startTransition(async () => {
      updateOptimistic({ id, is_available: !currentValue })
      await toggleProductAvailability(id, currentValue)
    })
  }

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    products.length,
    active:   products.filter(p => p.is_available).length,
    hidden:   products.filter(p => !p.is_available).length,
    featured: products.filter(p => p.is_featured).length,
  }), [products])

  // ── Filtered list ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return optimisticProducts.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      if (statusFilter === 'active' && !p.is_available) return false
      if (statusFilter === 'hidden' && p.is_available) return false
      return true
    })
  }, [optimisticProducts, search, categoryFilter, statusFilter])

  // ── Which categories are actually in use ───────────────────────────────
  const usedCategories = useMemo(() => {
    const used = new Set(products.map(p => p.category))
    return CATEGORIES.filter(c => used.has(c.value))
  }, [products])

  return (
    <div className="flex flex-col gap-6">

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: stats.total, color: 'text-chocolate' },
          { label: 'Active (visible)', value: stats.active, color: 'text-green-600' },
          { label: 'Hidden (drafts)', value: stats.hidden, color: 'text-gray-400' },
          { label: 'On Homepage', value: stats.featured, color: 'text-caramel' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className={`font-fraunces text-3xl font-normal ${s.color}`}>{s.value}</p>
            <p className="font-inter text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">

        {/* Search */}
        <input
          type="search"
          placeholder="Search products by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
        />

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-inter font-medium transition-colors ${categoryFilter === 'all' ? 'bg-chocolate text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All categories
          </button>
          {usedCategories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(categoryFilter === c.value ? 'all' : c.value)}
              className={`px-3 py-1 rounded-full text-xs font-inter font-medium transition-colors ${categoryFilter === c.value ? 'bg-chocolate text-white' : `${c.color} hover:opacity-80`}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { key: 'all',    label: 'All' },
            { key: 'active', label: '● Active' },
            { key: 'hidden', label: '○ Hidden' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium transition-colors ${statusFilter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
        <p className="font-inter text-sm text-gray-500">
          Showing {filtered.length} of {products.length} products
          {search && <> matching &ldquo;{search}&rdquo;</>}
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onToggle={handleToggle}
              toggling={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-fraunces text-lg text-chocolate mb-1">
            {products.length === 0 ? 'No products yet' : 'No products match your filters'}
          </p>
          <p className="font-inter text-sm text-gray-400 mb-4">
            {products.length === 0
              ? 'Add your first product to get started.'
              : 'Try a different search or clear your filters.'}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin/products/new"
              className="inline-block bg-chocolate text-white font-inter font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors"
            >
              + Add First Product
            </Link>
          )}
          {products.length > 0 && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all') }}
              className="font-inter text-sm text-chocolate hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
