'use client'

import { useSearchParams } from 'next/navigation'
import { Product } from '@/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? 'all'

  const filtered =
    category === 'all' ? products : products.filter((p) => p.category === category)

  return (
    <section className="px-20 py-16 bg-cream">
      <p className="text-sm text-muted mb-8">Showing {filtered.length} products</p>
      <div className="grid grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
