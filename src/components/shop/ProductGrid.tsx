import { Product } from '@/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, q }: { products: Product[]; q?: string }) {
  return (
    <section className="px-4 sm:px-8 lg:px-20 py-10 lg:py-16 bg-cream">
      <div className="max-w-[1400px] mx-auto">
        <p className="text-sm text-muted mb-8">
          {q
            ? `${products.length} result${products.length !== 1 ? 's' : ''} for "${q}"`
            : `Showing ${products.length} products`}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
