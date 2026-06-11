import type { Metadata } from 'next'
import Link from 'next/link'
import { createProduct, CATEGORIES } from '../actions'
import ImageUploader from '@/components/admin/ImageUploader'

export const metadata: Metadata = { title: 'New Product' }

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-700 text-sm">← Products</Link>
        <h1 className="font-fraunces text-2xl text-chocolate">New Product</h1>
      </div>

      <form action={createProduct} className="max-w-2xl flex flex-col gap-6">

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-inter font-semibold text-sm text-gray-700 mb-4">Product Photos</h2>
          <ImageUploader />
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-inter font-semibold text-sm text-gray-700">Product Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name" required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
              placeholder="e.g. Chocolate Truffle Cake"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
            <select
              name="category" required
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
              name="description" rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30 resize-none"
              placeholder="A short description shown on the product page…"
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
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. 1200"
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank for custom / varies pricing</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Available</label>
              <input
                name="stock_quantity" type="number" min="0" step="1"
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
              name="is_available" defaultValue="true"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
            >
              <option value="true">Yes — visible to customers</option>
              <option value="false">No — hidden (draft)</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" className="w-4 h-4 rounded accent-chocolate" />
            <div>
              <p className="text-sm font-medium text-gray-700">Feature on homepage</p>
              <p className="text-xs text-gray-400">Show this product in the Best Sellers section</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            className="bg-chocolate text-white font-inter font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors"
          >
            Add Product
          </button>
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-gray-700 font-inter text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
