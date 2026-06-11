import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse fresh cookies, brownies, custom cakes, savoury breads, and gift boxes from The Cozy Crumb. Filter by category and order online.',
  openGraph: {
    title: 'Shop | The Cozy Crumb',
    description: 'Browse our full range of freshly baked treats — cookies, brownies, cakes, savoury breads, and personalised gift boxes.',
  },
}
import ShopHero from '@/components/shop/ShopHero'
import ShopFilters from '@/components/shop/ShopFilters'
import ProductGrid from '@/components/shop/ProductGrid'
import { getProducts } from '@/lib/supabase/queries'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await getProducts(category)

  return (
    <>
      <ShopHero />
      <Suspense fallback={<div className="bg-cream h-[57px] border-b border-edge" />}>
        <ShopFilters />
      </Suspense>
      <Suspense
        fallback={
          <section className="px-20 py-16 bg-cream">
            <p className="text-sm text-muted mb-8">Loading products…</p>
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-[340px] border border-edge animate-pulse" />
              ))}
            </div>
          </section>
        }
      >
        <ProductGrid products={products} />
      </Suspense>
    </>
  )
}
