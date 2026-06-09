'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { submitOrder } from '@/app/actions/orders'
import type { PaymentMethod } from '@/types'

type FormErrors = {
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  deliveryDate?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  cookies: '#C89B6D',
  brownies: '#5A3E2B',
  cakes: '#D97A52',
  cupcakes: '#B89B72',
  breads: '#C4A882',
  pastries: '#E8C99A',
  'gift-boxes': '#4A7C59',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#C89B6D'
}

function getTodayStr(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const todayStr = getTodayStr()

  const hasNullPrice = items.some((i) => i.price == null)
  const subtotal = totalPrice()

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!customerName.trim()) newErrors.customerName = 'Full name is required'
    if (!customerPhone.trim()) newErrors.customerPhone = 'Phone number is required'
    if (!customerAddress.trim()) newErrors.customerAddress = 'Delivery address is required'
    if (!deliveryDate) newErrors.deliveryDate = 'Please select a delivery date'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePlaceOrder() {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const result = await submitOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        deliveryDate,
        paymentMethod,
        notes: notes.trim(),
        subtotal,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          variant: Object.fromEntries(
            Object.entries(item.variant).filter(([, v]) => v != null) as [string, string][]
          ),
          customMessage: item.custom_message ?? '',
          referenceImageUrl: item.reference_image_url ?? '',
          price: item.price,
        })),
      })

      if (result.success) {
        clearCart()
        router.push(`/order-confirmation/${result.orderId}`)
      } else {
        setSubmitError(result.error)
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Bar */}
      <div className="bg-cream border-b border-edge px-20 py-5 flex items-center justify-between">
        <span className="font-fraunces text-xl text-chocolate">The Cozy Crumb</span>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-muted" />
          <span className="text-sm text-muted">Secure Checkout</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1200px] mx-auto px-20 py-14 grid grid-cols-[1fr_420px] gap-14 items-start">
        {/* Left — Checkout Form */}
        <div className="flex flex-col gap-8">
          {/* Section 1 — Contact & Delivery */}
          <div>
            <h2 className="font-fraunces text-2xl text-chocolate mb-6">Contact &amp; Delivery</h2>
            <div className="bg-white rounded-2xl border border-edge p-8 flex flex-col gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                {errors.customerName && (
                  <p className="text-terracotta text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="+92 3XX XXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                {errors.customerPhone && (
                  <p className="text-terracotta text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="customerAddress"
                  placeholder="Street address, area, Karachi"
                  rows={3}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors resize-none"
                />
                {errors.customerAddress && (
                  <p className="text-terracotta text-sm mt-1">{errors.customerAddress}</p>
                )}
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                <p className="text-xs text-muted mt-1">
                  Same day before 12pm · Next day before 9pm · Or schedule ahead
                </p>
                {errors.deliveryDate && (
                  <p className="text-terracotta text-sm mt-1">{errors.deliveryDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 — Payment Method */}
          <div>
            <h2 className="font-fraunces text-2xl text-chocolate mb-6">Payment Method</h2>
            <div className="bg-white rounded-2xl border border-edge p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  className={`rounded-xl p-5 cursor-pointer transition-all text-left ${
                    paymentMethod === 'easypaisa'
                      ? 'border-2 border-chocolate bg-cream'
                      : 'border border-edge hover:border-caramel'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'easypaisa'
                          ? 'border-chocolate'
                          : 'border-edge'
                      }`}
                    >
                      {paymentMethod === 'easypaisa' && (
                        <div className="w-2 h-2 rounded-full bg-chocolate" />
                      )}
                    </div>
                    <span className="font-semibold text-sm text-ink">EasyPaisa</span>
                  </div>
                  <p className="text-sm text-muted pl-7">03XX-XXXXXXX</p>
                  <div className="mt-2 pl-7">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Mobile Payment
                    </span>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-xl p-5 cursor-pointer transition-all text-left ${
                    paymentMethod === 'cod'
                      ? 'border-2 border-chocolate bg-cream'
                      : 'border border-edge hover:border-caramel'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'cod' ? 'border-chocolate' : 'border-edge'
                      }`}
                    >
                      {paymentMethod === 'cod' && (
                        <div className="w-2 h-2 rounded-full bg-chocolate" />
                      )}
                    </div>
                    <span className="font-semibold text-sm text-ink">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-muted pl-7">Pay when you receive</p>
                </button>
              </div>

              {/* EasyPaisa instructions */}
              {paymentMethod === 'easypaisa' && (
                <div className="bg-caramel/10 border border-caramel/30 rounded-xl p-4 mt-4 text-sm text-ink">
                  After placing your order, send payment to:{' '}
                  <strong>+92 335 0253548</strong> (Tooba Arsal) via EasyPaisa. Use your order ID
                  as the reference.
                </div>
              )}
            </div>
          </div>

          {/* Section 3 — Special Notes */}
          <div>
            <h2 className="font-fraunces text-2xl text-chocolate mb-6">Special Notes</h2>
            <textarea
              placeholder="Any special instructions, allergies, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink resize-none focus:border-caramel outline-none h-24 bg-white"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <p className="text-terracotta text-sm bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3">
              {submitError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting || items.length === 0}
            className="w-full bg-chocolate text-white rounded-full py-4 font-semibold text-base hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing Order…
              </>
            ) : (
              <>
                Place Order
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Right — Order Summary */}
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl border border-edge p-8">
            <h3 className="font-fraunces text-xl text-chocolate mb-6">Order Summary</h3>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted text-sm mb-4">Your cart is empty</p>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-chocolate hover:text-chocolate-dark transition-colors"
                >
                  Back to Shop →
                </Link>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="max-h-80 overflow-y-auto flex flex-col gap-4 pr-1">
                  {items.map((item) => {
                    const variantParts = [
                      item.variant.flavor,
                      item.variant.weight,
                      item.variant.shape,
                      item.variant.frosting,
                    ].filter(Boolean)

                    return (
                      <div key={item.cartId} className="flex gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: getCategoryColor(item.product.category) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm text-ink leading-tight">
                              {item.product.name}
                            </p>
                            <span className="text-sm text-chocolate font-medium flex-shrink-0">
                              {item.price != null
                                ? `PKR ${(item.price * item.quantity).toLocaleString()}`
                                : 'TBD'}
                            </span>
                          </div>
                          {variantParts.length > 0 && (
                            <p className="text-xs text-muted mt-0.5">
                              {variantParts.join(' · ')}
                            </p>
                          )}
                          {item.custom_message && (
                            <p className="text-xs text-muted italic mt-0.5 truncate">
                              &ldquo;{item.custom_message}&rdquo;
                            </p>
                          )}
                          <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Divider + Subtotal */}
                <div className="border-t border-edge mt-4 pt-4 flex items-center justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="font-fraunces text-lg text-chocolate">
                    {hasNullPrice ? 'Price TBD' : `PKR ${subtotal.toLocaleString()}`}
                  </span>
                </div>

                <p className="text-xs text-muted mt-3 leading-relaxed">
                  Prices for custom cakes and specialty items will be confirmed after order
                  placement.
                </p>

                {/* Trust items */}
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-edge">
                  {[
                    'Made fresh to order',
                    'Karachi delivery',
                    'EasyPaisa & Cash on Delivery',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-success flex-shrink-0" />
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
