import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateOrderStatus } from './actions'

export const metadata: Metadata = { title: 'Order Detail' }

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  baking: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const ALL_STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  price: number | null
  variant: Record<string, string>
  custom_message: string | null
}

type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_date: string
  payment_method: string
  notes: string | null
  subtotal: number | null
  discount_code: string | null
  discount_amount: number | null
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let order: Order | null = null

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()

    if (error || !data) notFound()
    order = data as Order
  } catch {
    notFound()
  }

  const updateStatus = updateOrderStatus.bind(null, order.id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Orders
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-fraunces text-xl text-chocolate">
          #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <span
          className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
            STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'
          }`}
        >
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order info + items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
              Customer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Name</p>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                <p className="font-medium text-gray-900">{order.customer_phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs mb-0.5">Address</p>
                <p className="font-medium text-gray-900">{order.customer_address}</p>
              </div>
              {order.notes && (
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-xs mb-0.5">Notes</p>
                  <p className="text-gray-700 italic">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
              Items ({order.order_items.length})
            </h2>
            <div className="flex flex-col gap-3">
              {order.order_items.map((item) => {
                const variantStr = Object.entries(item.variant ?? {})
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ')
                return (
                  <div key={item.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                      {variantStr && <p className="text-xs text-gray-400 mt-0.5">{variantStr}</p>}
                      {item.custom_message && (
                        <p className="text-xs text-gray-500 italic mt-0.5">&ldquo;{item.custom_message}&rdquo;</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    {item.price != null && (
                      <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1.5">
              {(order.discount_amount ?? 0) > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-gray-500">Subtotal</span>
                    <span className="font-inter text-sm text-gray-700">Rs. {(order.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-green-600">
                      Discount{order.discount_code ? ` (${order.discount_code})` : ''}
                    </span>
                    <span className="font-inter text-sm text-green-600">− Rs. {(order.discount_amount ?? 0).toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="font-inter font-semibold text-sm text-gray-700">Total</span>
                <span className="font-inter font-bold text-base text-chocolate">
                  Rs. {((order.subtotal ?? 0) - (order.discount_amount ?? 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order meta + status update */}
        <div className="flex flex-col gap-6">
          {/* Order details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
              Order Details
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Placed</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('en-PK', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Delivery Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.delivery_date).toLocaleDateString('en-PK', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'EasyPaisa'}
                </p>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
              Update Status
            </h2>
            <form action={updateStatus} className="flex flex-col gap-3">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-chocolate outline-none"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-chocolate text-white py-2.5 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors"
              >
                Save Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
