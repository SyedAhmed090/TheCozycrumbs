import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = { title: 'Analytics' }

const STATUS_COLORS: Record<string, string> = {
  pending:          'bg-yellow-100 text-yellow-800',
  confirmed:        'bg-blue-100 text-blue-800',
  baking:           'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered:        'bg-green-100 text-green-800',
  cancelled:        'bg-red-100 text-red-800',
}

export default async function AdminAnalyticsPage() {
  let stats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0,
    easypaisaCount: 0,
    codCount: 0,
    todayOrders: 0,
    statusBreakdown: [] as Array<{ status: string; count: number; revenue: number }>,
    recentOrders: [] as Array<{
      id: string; customer_name: string; subtotal: number;
      status: string; created_at: string; payment_method: string
    }>,
  }

  try {
    const supabase = createAdminClient()
    const today = new Date().toISOString().slice(0, 10)

    const [ordersRes, recentRes] = await Promise.all([
      supabase.from('orders').select('status, subtotal, payment_method, created_at'),
      supabase.from('orders').select('id, customer_name, subtotal, status, created_at, payment_method')
        .order('created_at', { ascending: false }).limit(8),
    ])

    const orders = ordersRes.data ?? []
    const delivered = orders.filter((o) => o.status === 'delivered')
    const totalRevenue = delivered.reduce((s, o) => s + (o.subtotal ?? 0), 0)

    const breakdown: Record<string, { count: number; revenue: number }> = {}
    for (const o of orders) {
      if (!breakdown[o.status]) breakdown[o.status] = { count: 0, revenue: 0 }
      breakdown[o.status].count++
      if (o.status === 'delivered') breakdown[o.status].revenue += o.subtotal ?? 0
    }

    stats = {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      deliveredOrders: delivered.length,
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
      avgOrderValue: delivered.length ? Math.round(totalRevenue / delivered.length) : 0,
      easypaisaCount: orders.filter((o) => o.payment_method === 'easypaisa').length,
      codCount: orders.filter((o) => o.payment_method === 'cod').length,
      todayOrders: orders.filter((o) => o.created_at?.startsWith(today)).length,
      statusBreakdown: Object.entries(breakdown).map(([status, v]) => ({ status, ...v })),
      recentOrders: recentRes.data ?? [],
    }
  } catch {}

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.todayOrders} today` },
    { label: 'Revenue (Delivered)', value: `PKR ${stats.totalRevenue.toLocaleString()}`, sub: `Avg PKR ${stats.avgOrderValue.toLocaleString()}` },
    { label: 'Pending', value: stats.pendingOrders, sub: 'Need attention' },
    { label: 'Delivered', value: stats.deliveredOrders, sub: `${stats.cancelledOrders} cancelled` },
  ]

  return (
    <div>
      <h1 className="font-fraunces text-2xl text-chocolate mb-6">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
            <p className="font-fraunces text-2xl text-chocolate">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">Orders by Status</h2>
          <div className="flex flex-col gap-2">
            {stats.statusBreakdown.map(({ status, count, revenue }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">{count}</span>
                </div>
                {revenue > 0 && <span className="text-xs text-gray-400">PKR {revenue.toLocaleString()}</span>}
              </div>
            ))}
            {stats.statusBreakdown.length === 0 && <p className="text-sm text-gray-400">No orders yet.</p>}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">Payment Methods</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'EasyPaisa', count: stats.easypaisaCount, color: 'bg-green-500' },
              { label: 'Cash on Delivery', count: stats.codCount, color: 'bg-blue-500' },
            ].map((p) => {
              const pct = stats.totalOrders ? Math.round((p.count / stats.totalOrders) * 100) : 0
              return (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{p.label}</span>
                    <span className="text-gray-500">{p.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-sm">
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <a href={`/admin/orders/${o.id}`} className="text-chocolate hover:underline font-medium text-xs font-mono">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </a>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{o.customer_name}</td>
                  <td className="px-5 py-3 text-gray-600">Rs. {(o.subtotal ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
