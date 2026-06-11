import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { createDiscount, toggleDiscount, deleteDiscount } from './actions'

export const metadata: Metadata = { title: 'Discount Codes' }

export default async function AdminDiscountsPage() {
  let list: Record<string, unknown>[] = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('discount_codes')
      .select('id, code, description, discount_type, discount_value, min_order_amount, max_uses, used_count, is_active, expires_at')
      .order('created_at', { ascending: false })
    list = data ?? []
  } catch {}

  return (
    <div>
      <h1 className="font-fraunces text-2xl text-chocolate mb-6">Discount Codes</h1>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">New Discount Code</h2>
        <form action={createDiscount} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Code <span className="text-red-500">*</span></label>
              <input
                name="code" required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter font-mono uppercase focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. EID20"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input
                name="description"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="Internal note"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select name="discount_type" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30">
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed PKR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value <span className="text-red-500">*</span></label>
              <input
                name="discount_value" type="number" min="0" step="0.01" required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (PKR)</label>
              <input
                name="min_order_amount" type="number" min="0" step="1"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses</label>
              <input
                name="max_uses" type="number" min="1" step="1"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="Unlimited"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
              <input type="datetime-local" name="expires_at" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select name="is_active" defaultValue="true" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" className="bg-chocolate text-white font-inter font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors">
              Create Code
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Code', 'Discount', 'Usage', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const isExpired = c.expires_at && new Date(c.expires_at) < new Date()
                const isFull = c.max_uses != null && c.used_count >= c.max_uses
                return (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-mono font-bold text-gray-900 tracking-wider">{c.code}</p>
                      {c.description && <p className="text-xs text-gray-400">{c.description}</p>}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `PKR ${c.discount_value}`}
                      {c.min_order_amount && <span className="text-xs text-gray-400 block">Min Rs. {c.min_order_amount.toLocaleString()}</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {c.used_count ?? 0}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                      {isFull && <span className="ml-1 text-xs text-red-500">(full)</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {c.expires_at
                        ? <span className={isExpired ? 'text-red-500' : ''}>{new Date(c.expires_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.is_active && !isExpired && !isFull ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {!c.is_active ? 'Inactive' : isExpired ? 'Expired' : isFull ? 'Full' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <form action={toggleDiscount.bind(null, c.id, c.is_active)}>
                          <button type="submit" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                            {c.is_active ? 'Disable' : 'Enable'}
                          </button>
                        </form>
                        <form action={deleteDiscount.bind(null, c.id)}>
                          <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No discount codes yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
