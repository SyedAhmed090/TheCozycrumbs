import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { toggleProductAvailability, deleteProduct } from './actions'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, category, base_price, is_available, is_featured, stock_quantity, images')
    .order('created_at', { ascending: false })

  const list = products ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-fraunces text-2xl text-chocolate">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-chocolate text-white text-sm font-inter font-medium px-4 py-2 rounded-xl hover:bg-chocolate/90 transition-colors"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 capitalize">{p.category?.replace(/-/g, ' ')}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {p.base_price != null ? `Rs. ${p.base_price.toLocaleString()}` : <span className="text-gray-400">Custom</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {p.stock_quantity != null ? p.stock_quantity : <span className="text-gray-400">∞</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_available ? 'Active' : 'Hidden'}
                      </span>
                      {p.is_featured && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-caramel/20 text-caramel">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${p.id}`} className="text-chocolate hover:underline text-xs font-medium">
                        Edit
                      </Link>
                      <form action={toggleProductAvailability.bind(null, p.id, p.is_available)}>
                        <button type="submit" className="text-gray-400 hover:text-gray-700 text-xs">
                          {p.is_available ? 'Hide' : 'Show'}
                        </button>
                      </form>
                      <form
                        action={deleteProduct.bind(null, p.id)}
                        onSubmit={(e) => { if (!confirm(`Delete "${p.name}"?`)) e.preventDefault() }}
                      >
                        <button type="submit" className="text-red-400 hover:text-red-600 text-xs">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No products yet.{' '}
                    <Link href="/admin/products/new" className="text-chocolate hover:underline">
                      Add one →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
