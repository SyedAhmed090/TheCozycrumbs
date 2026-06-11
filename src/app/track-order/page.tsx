import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Track Your Order | The Cozy Crumb',
  description: 'Track the status of your cake order.',
}

const STATUS_STEPS = [
  { key: 'pending',           label: 'Order Placed',    icon: '🎉' },
  { key: 'confirmed',         label: 'Confirmed',       icon: '✅' },
  { key: 'baking',            label: 'Baking',          icon: '🎂' },
  { key: 'out_for_delivery',  label: 'Out for Delivery',icon: '🚗' },
  { key: 'delivered',         label: 'Delivered',       icon: '💝' },
]

function getStepIndex(status: string) {
  if (status === 'cancelled') return -1
  return STATUS_STEPS.findIndex((s) => s.key === status)
}


export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; phone?: string }>
}) {
  const { id, phone } = await searchParams

  type OrderData = {
    id: string
    customer_name: string
    customer_phone: string
    status: string
    delivery_date: string
    created_at: string
    subtotal: number
    payment_method: string
    notes: string | null
    order_items: Array<{ product_name: string; quantity: number; price: number | null; variant: Record<string, string> }>
  }

  let order: OrderData | null = null

  let error: string | null = null

  if (id || phone) {
    try {
      const supabase = createAdminClient()
      let query = supabase
        .from('orders')
        .select('id, customer_name, customer_phone, status, delivery_date, created_at, subtotal, payment_method, notes, order_items(product_name, quantity, price, variant)')

      if (id) {
        query = query.eq('id', id)
      } else if (phone) {
        const cleaned = phone.trim().replace(/\s/g, '')
        query = query.eq('customer_phone', cleaned).order('created_at', { ascending: false }).limit(1)
      }

      const { data, error: dbError } = await query.single()

      if (dbError || !data) {
        error = 'Order not found. Please check your order ID or phone number.'
      } else {
        order = data as OrderData
      }
    } catch {
      error = 'Something went wrong. Please try again.'
    }
  }

  const stepIndex = order ? getStepIndex(order.status) : -2
  const isCancelled = order?.status === 'cancelled'

  return (
    <main className="min-h-screen bg-cream pt-[68px] lg:pt-[88px]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-fraunces text-3xl sm:text-4xl text-chocolate mb-2">Track Your Order</h1>
          <p className="font-inter text-muted">Enter your order ID or phone number to see live status.</p>
        </div>

        {/* Search form */}
        <form method="GET" action="/track-order" className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-inter">Order ID</label>
              <input
                name="id"
                defaultValue={id ?? ''}
                placeholder="Paste your order ID…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter font-mono focus:outline-none focus:ring-2 focus:ring-caramel/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-inter">— or — Phone Number</label>
              <input
                name="phone"
                defaultValue={phone ?? ''}
                placeholder="03XX XXXXXXX"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-chocolate text-white font-inter font-semibold text-sm py-3 rounded-xl hover:bg-chocolate/90 transition-colors"
          >
            Track Order
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
            <p className="text-red-600 font-inter text-sm">{error}</p>
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-chocolate/5 px-6 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-fraunces text-lg text-chocolate">Order for {order.customer_name}</p>
                  <p className="font-mono text-xs text-gray-400 mt-0.5">#{order.id.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-inter text-sm font-semibold text-gray-900">Rs. {order.subtotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 capitalize">{order.payment_method === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery'}</p>
                </div>
              </div>
              <p className="font-inter text-xs text-gray-500 mt-2">
                Delivery: <span className="font-medium text-gray-700">
                  {new Date(order.delivery_date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>

            {/* Status tracker */}
            <div className="px-6 py-6">
              {isCancelled ? (
                <div className="text-center py-4">
                  <p className="text-4xl mb-2">❌</p>
                  <p className="font-fraunces text-lg text-red-600">Order Cancelled</p>
                  <p className="font-inter text-sm text-gray-400 mt-1">Please contact us if you have questions.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden sm:block" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-chocolate hidden sm:block transition-all duration-500"
                    style={{ width: `${stepIndex > 0 ? (stepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%`, right: 'unset' }}
                  />

                  <div className="grid grid-cols-5 gap-1 relative">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= stepIndex
                      const current = i === stepIndex
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                            done ? 'bg-chocolate border-chocolate text-white' : 'bg-white border-gray-200 text-gray-300'
                          } ${current ? 'ring-4 ring-caramel/20 scale-110' : ''}`}>
                            {step.icon}
                          </div>
                          <p className={`text-xs font-inter text-center leading-tight ${done ? 'text-chocolate font-medium' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4">
                <p className="font-inter text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Items</p>
                <div className="flex flex-col gap-2">
                  {order.order_items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{item.product_name}</span>
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </div>
                      {item.price != null && (
                        <span className="text-gray-600 font-inter">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.notes && (
              <div className="border-t border-gray-100 px-6 py-4">
                <p className="font-inter text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Order Notes</p>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
