'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

const EMPTY_VARIANT = {}

// Categories whose required variant selections (shape, frosting, delivery date)
// are enforced in ProductDetail. These cannot be safely quick-added with an
// empty variant, so the quick-add button routes to the product page instead.
const VARIANT_REQUIRED_CATEGORIES = ['cakes']

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; light: boolean }> = {
  cookies:      { from: '#E8C4A4', to: '#D4A07A', light: false },
  brownies:     { from: '#6B3A2A', to: '#4A2818', light: true },
  cakes:        { from: '#F0D4B8', to: '#E0BF9A', light: false },
  cupcakes:     { from: '#D97A52', to: '#BF6038', light: true },
  breads:       { from: '#C49060', to: '#A87840', light: true },
  savory:       { from: '#8B9B6B', to: '#6B7B4B', light: true },
  pastries:     { from: '#DCBCA0', to: '#C8A480', light: false },
  'gift-boxes': { from: '#C89B6D', to: '#B08958', light: false },
}

export default function ProductCard({ product }: { product: Product }) {
  const gradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS['cakes']
  const { addItem, openDrawer } = useCartStore()
  const router = useRouter()

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    // Categories with required variant selections (shape, frosting, delivery
    // date) cannot be safely added with an empty variant — send the user to the
    // product page so those fields can be collected and validated there.
    if (VARIANT_REQUIRED_CATEGORIES.includes(product.category)) {
      router.push(`/products/${product.slug}`)
      return
    }
    addItem({ product, quantity: 1, variant: EMPTY_VARIANT, price: product.base_price })
    openDrawer()
  }, [product, addItem, openDrawer, router])

  return (
    <div className="relative group">
      <Link href={`/products/${product.slug}`} className="block">
      <article className="bg-white rounded-2xl overflow-hidden border border-edge cursor-pointer group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(90,62,43,0.11)] transition-all duration-300 relative">
        <div
          className="h-[160px] sm:h-[200px] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
        >
          <div className="w-full h-full group-hover:scale-[1.05] transition-transform duration-400 flex items-center justify-center">
            <span
              className="font-fraunces italic text-sm"
              style={{ color: gradient.light ? 'rgba(255,255,255,0.35)' : 'rgba(90,62,43,0.3)' }}
            >
              {product.name}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-caramel mb-1">
            {product.category.replaceAll('-', ' ')}
          </p>
          <h3 className="font-fraunces text-base sm:text-lg font-normal text-ink mb-1.5 leading-tight">
            {product.name}
          </h3>
          <p className="text-[12px] sm:text-[13px] text-muted leading-[1.5] mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-fraunces text-base sm:text-lg text-chocolate">
              {product.base_price != null ? `PKR ${product.base_price.toLocaleString()}` : 'PKR —'}
            </span>
            <span className="text-xs text-caramel font-medium hover:text-chocolate transition-colors hidden sm:block">
              View Details
            </span>
          </div>
        </div>
      </article>
      </Link>

      <button
        onClick={handleQuickAdd}
        className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-9 h-9 rounded-full bg-chocolate flex items-center justify-center text-white opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300"
        aria-label={`Quick add ${product.name}`}
      >
        <Plus size={15} strokeWidth={2.5} />
      </button>
    </div>
  )
}
