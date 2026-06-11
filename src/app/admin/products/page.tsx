import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import ProductGrid, { type AdminProduct } from '@/components/admin/ProductGrid'
import { seedProducts } from './seed-action'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  let products: AdminProduct[] = []
  let fetchError: string | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, category, base_price, is_available, is_featured, stock_quantity, images, description, created_at')
      .order('sort_order', { ascending: true })

    if (error) throw error
    products = (data ?? []) as AdminProduct[]
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Could not load products'
  }

  const isEmpty = !fetchError && products.length === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-fraunces text-2xl text-chocolate">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-chocolate text-white text-sm font-inter font-medium px-4 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* DB error */}
      {fetchError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="font-inter font-semibold text-sm text-red-700 mb-1">Could not connect to database</p>
          <p className="font-inter text-xs text-red-500 mb-2">{fetchError}</p>
          <p className="font-inter text-xs text-gray-500">
            Make sure <code className="bg-gray-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is set in your <code className="bg-gray-100 px-1 rounded">.env.local</code> file and the database migrations have been run.
          </p>
        </div>
      )}

      {/* Empty state — database connected but no products seeded yet */}
      {isEmpty && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl">📦</div>
          <div className="flex-1">
            <p className="font-inter font-semibold text-sm text-amber-900">Your products aren&apos;t in the database yet</p>
            <p className="font-inter text-xs text-amber-700 mt-0.5">
              The website is currently showing placeholder products. Click the button to load all 24 real menu items into the database so you can manage them here.
            </p>
          </div>
          <form action={seedProducts}>
            <button
              type="submit"
              className="shrink-0 bg-amber-600 text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Load products into database
            </button>
          </form>
        </div>
      )}

      {/* Product grid */}
      {!fetchError && (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
