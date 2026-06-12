import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse fresh cookies, brownies, custom cakes, savoury breads, and gift boxes from The Cozy Crumbs. Filter by category and order online.',
  openGraph: {
    title: 'Shop | The Cozy Crumbs',
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
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const products = await getProducts(category, q)

  return (
    <>
      <ShopHero />
      <Suspense fallback={<div className="bg-cream h-[57px] border-b border-edge" />}>
        <ShopFilters />
      </Suspense>
      <Suspense
        fallback={
          <section className="px-4 sm:px-8 lg:px-20 py-10 lg:py-16 bg-cream">
            <p className="text-sm text-muted mb-8">Loading products…</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-[340px] border border-edge animate-pulse" />
              ))}
            </div>
          </section>
        }
      >
        <ProductGrid products={products} q={q} />
      </Suspense>
    </>
  )
}
