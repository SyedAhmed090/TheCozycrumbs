import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import ProductGrid, { type AdminProduct } from '@/components/admin/ProductGrid'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  let products: AdminProduct[] = []
  let fetchError: string | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, category, base_price, is_available, is_featured, stock_quantity, images, description, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    products = (data ?? []) as AdminProduct[]
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Could not load products'
  }

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

      {fetchError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="font-inter text-sm text-red-600 mb-1">Could not load products</p>
          <p className="font-inter text-xs text-red-400">{fetchError}</p>
          <p className="font-inter text-xs text-red-400 mt-2">
            Make sure <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is set in your <code className="bg-red-100 px-1 rounded">.env.local</code> file.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
