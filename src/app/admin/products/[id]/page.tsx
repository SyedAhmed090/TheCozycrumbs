import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateProduct, deleteProduct } from '../actions'
import { CATEGORIES } from '@/lib/constants/products'
import ImageUploader from '@/components/admin/ImageUploader'

export const metadata: Metadata = { title: 'Edit Product' }

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error: actionError } = await searchParams
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
        <h1 className="font-fraunces text-2xl text-chocolate">Edit: {product.name}</h1>
      </div>

      {actionError && (
        <div className="max-w-2xl mb-4 bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="font-inter font-semibold text-sm text-red-700 mb-0.5">Could not save changes</p>
          <p className="font-inter text-xs text-red-500 font-mono">{actionError}</p>
        </div>
      )}

      <form action={updateAction} className="max-w-2xl flex flex-col gap-6">

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-inter font-semibold text-sm text-gray-700 mb-4">Product Photos</h2>
          <ImageUploader initialImages={product.images ?? []} />
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-inter font-semibold text-sm text-gray-700">Product Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
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
                <option key={c.value} value={c.value}>{c.label}</option>
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
        </div>

        {/* Pricing & stock */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-inter font-semibold text-sm text-gray-700">Pricing & Stock</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (PKR)</label>
              <input
                name="base_price" type="number" min="0" step="1"
                defaultValue={product.base_price ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. 1200"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for custom / varies pricing</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Available</label>
              <input
                name="stock_quantity" type="number" min="0" step="1"
                defaultValue={product.stock_quantity ?? ''}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. 10"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for unlimited</p>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-inter font-semibold text-sm text-gray-700">Visibility</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Show on website?</label>
            <select
              name="is_available" defaultValue={String(product.is_available)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
            >
              <option value="true">Yes — visible to customers</option>
              <option value="false">No — hidden (draft)</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" name="is_featured"
              defaultChecked={product.is_featured ?? false}
              className="w-4 h-4 rounded accent-chocolate"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Feature on homepage</p>
              <p className="text-xs text-gray-400">Show this product in the Best Sellers section</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
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

      {/* Danger zone */}
      <div className="max-w-2xl mt-8 bg-red-50 rounded-2xl border border-red-100 p-5 mb-8">
        <h3 className="font-inter font-semibold text-sm text-red-700 mb-1">Delete Product</h3>
        <p className="text-xs text-red-500 mb-3">
          This permanently removes the product from the website. Existing orders that included this product will keep the name but lose the link.
        </p>
        <form
          action={deleteAction}
          onSubmit={(e) => { if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) e.preventDefault() }}
        >
          <button
            type="submit"
            className="bg-red-600 text-white font-inter font-medium text-sm px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete this product
          </button>
        </form>
      </div>
    </div>
  )
}
