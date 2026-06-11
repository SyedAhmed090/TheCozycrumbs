import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = { title: 'Orders' }

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  baking: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

const TH_CLASS = 'px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  let orders: Array<{
    id: string
    customer_name: string
    customer_phone: string
    subtotal: number
    status: string
    payment_method: string
    delivery_date: string
    created_at: string
  }> = []

  let fetchError = false

  try {
    const supabase = createAdminClient()
    let query = supabase
      .from('orders')
      .select('id, customer_name, customer_phone, subtotal, status, payment_method, delivery_date, created_at')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    orders = data ?? []
  } catch {
    fetchError = true
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-fraunces text-2xl text-chocolate">Orders</h1>
        <span className="font-inter text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !status ? 'bg-chocolate text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              status === s
                ? 'bg-chocolate text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </Link>
        ))}
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          Could not load orders. Check that <code>SUPABASE_SERVICE_ROLE_KEY</code> is set in your environment.
        </div>
      )}

      {!fetchError && orders.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-inter text-sm">
          No orders found.
        </div>
      )}

      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-inter text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className={TH_CLASS}>Order</th>
                  <th className={TH_CLASS}>Customer</th>
                  <th className={TH_CLASS}>Total</th>
                  <th className={TH_CLASS}>Payment</th>
                  <th className={TH_CLASS}>Delivery</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={TH_CLASS}>Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-chocolate hover:underline font-medium"
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-gray-400 text-xs">{order.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      Rs. {order.subtotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {order.payment_method === 'cod' ? 'COD' : 'EasyPaisa'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(order.delivery_date).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
