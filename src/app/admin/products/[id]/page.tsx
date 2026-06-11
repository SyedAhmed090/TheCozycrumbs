import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateProduct, deleteProduct } from '../actions'

export const metadata: Metadata = { title: 'Edit Product' }

const CATEGORIES = ['custom-cakes', 'cupcakes', 'brownies', 'cookies', 'gift-boxes', 'seasonal']

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const updateAction = updateProduct.bind(null, id)
  const deleteAction = deleteProduct.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-700 text-sm">← Products</Link>
        <h1 className="font-fraunces text-2xl text-chocolate">Edit Product</h1>
      </div>

      <div className="max-w-2xl">
        <form action={updateAction} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input
              name="name" required defaultValue={product.name}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              name="category" defaultValue={product.category}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description" rows={3} defaultValue={product.description ?? ''}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Price (PKR)</label>
              <input
                name="base_price" type="number" min="0" step="1"
                defaultValue={product.base_price ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="Leave blank if custom pricing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input
                name="stock_quantity" type="number" min="0" step="1"
                defaultValue={product.stock_quantity ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="Leave blank for unlimited"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URLs</label>
            <textarea
              name="images" rows={3}
              defaultValue={(product.images ?? []).join('\n')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter font-mono text-xs focus:outline-none focus:ring-2 focus:ring-caramel/30 resize-none"
              placeholder="One URL per line"
            />
            <p className="text-xs text-gray-400 mt-1">One image URL per line. First image is the main thumbnail.</p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label>
              <select
                name="is_available"
                defaultValue={String(product.is_available)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
              >
                <option value="true">Active (visible)</option>
                <option value="false">Hidden</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox" name="is_featured" id="is_featured"
                defaultChecked={product.is_featured ?? false}
                className="rounded"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured on homepage</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-chocolate text-white font-inter font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/products"
              className="text-gray-500 hover:text-gray-700 font-inter text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="mt-6 bg-red-50 rounded-2xl border border-red-100 p-5">
          <h3 className="font-inter font-semibold text-sm text-red-700 mb-2">Danger Zone</h3>
          <p className="text-xs text-red-600 mb-3">This will permanently delete the product. Orders referencing it will keep the product name but lose the link.</p>
          <form
            action={deleteAction}
            onSubmit={(e) => { if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) e.preventDefault() }}
          >
            <button
              type="submit"
              className="bg-red-600 text-white font-inter font-medium text-sm px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Delete Product
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
