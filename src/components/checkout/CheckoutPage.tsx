'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader2, CheckCircle, Tag, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { submitOrder } from '@/app/actions/orders'
import { validateDiscount } from '@/app/actions/discounts'
import type { PaymentMethod } from '@/types'

const HONEYPOT_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: '-9999px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
}

type FormErrors = {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
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

async function uploadBlobUrl(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl)
  const blob = await res.blob()
  const ext = blob.type.split('/')[1] ?? 'jpg'
  const formData = new FormData()
  formData.append('file', blob, `reference.${ext}`)
  const upload = await fetch('/api/upload', { method: 'POST', body: formData })
  if (!upload.ok) throw new Error('Image upload failed')
  const json = await upload.json() as { url: string }
  return json.url
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [discountCodeInput, setDiscountCodeInput] = useState('')
  const [discountApplied, setDiscountApplied] = useState<{ code: string; label: string; amount: number } | null>(null)
  const [discountError, setDiscountError] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Cart comes from localStorage — render it only after mount so the first
  // client render matches the server HTML (avoids hydration mismatch)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const cartItems = mounted ? items : []

  const hasNullPrice = cartItems.some((i) => i.price == null)
  const rawSubtotal = mounted ? totalPrice() : 0
  const discountAmount = discountApplied?.amount ?? 0
  const subtotal = rawSubtotal - discountAmount

  async function applyDiscount() {
    if (!discountCodeInput.trim()) return
    setDiscountLoading(true)
    setDiscountError('')
    try {
      const result = await validateDiscount(discountCodeInput.trim(), rawSubtotal)
      if (result.valid) {
        const amount = result.type === 'percentage'
          ? Math.round((rawSubtotal * result.value) / 100)
          : result.value
        setDiscountApplied({
          code: result.code,
          label: result.type === 'percentage' ? `${result.value}% off` : `PKR ${result.value} off`,
          amount: Math.min(amount, rawSubtotal),
        })
        setDiscountCodeInput('')
      } else {
        setDiscountError(result.error)
      }
    } catch {
      setDiscountError('Could not validate code.')
    } finally {
      setDiscountLoading(false)
    }
  }

  function removeDiscount() {
    setDiscountApplied(null)
    setDiscountError('')
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!customerName.trim()) newErrors.customerName = 'Full name is required'
    const phone = customerPhone.trim().replace(/\s/g, '')
    if (!phone) newErrors.customerPhone = 'Phone number is required'
    else if (!/^(\+92|0)3\d{9}$/.test(phone)) newErrors.customerPhone = 'Enter a valid Pakistani mobile number (e.g. 03XX XXXXXXX)'
    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.customerEmail = 'Enter a valid email address'
    }
    if (!customerAddress.trim()) newErrors.customerAddress = 'Delivery address is required'
    if (!deliveryDate) newErrors.deliveryDate = 'Please select a delivery date'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePlaceOrder() {
    if (honeypot) return
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    try {
      // Upload any blob: reference images to Supabase Storage first
      const uploadedItems = await Promise.all(
        items.map(async (item) => {
          let referenceImageUrl = item.reference_image_url ?? ''
          if (referenceImageUrl.startsWith('blob:')) {
            try {
              referenceImageUrl = await uploadBlobUrl(referenceImageUrl)
            } catch {
              referenceImageUrl = ''
            }
          }
          return {
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            variant: Object.fromEntries(
              Object.entries(item.variant).filter((entry): entry is [string, string] => entry[1] != null)
            ),
            customMessage: item.custom_message ?? '',
            referenceImageUrl,
            price: item.price,
          }
        })
      )

      const result = await submitOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerAddress: customerAddress.trim(),
        deliveryDate,
        paymentMethod,
        notes: notes.trim(),
        discountCode: discountApplied?.code,
        discountAmount: discountApplied?.amount,
        subtotal: rawSubtotal,
        items: uploadedItems,
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
      <div className="bg-cream border-b border-edge px-4 sm:px-8 lg:px-20 py-5 flex items-center justify-between">
        <span className="font-fraunces text-xl text-chocolate">The Cozy Crumb</span>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-muted" />
          <span className="text-sm text-muted">Secure Checkout</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-20 py-8 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start">
        {/* Left — Checkout Form */}
        <div className="flex flex-col gap-8">
          {/* Section 1 — Contact & Delivery */}
          <div>
            <h2 className="font-fraunces text-2xl text-chocolate mb-6">Contact &amp; Delivery</h2>
            <div className="bg-white rounded-2xl border border-edge p-8 flex flex-col gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                {errors.customerName && <p className="text-terracotta text-sm mt-1">{errors.customerName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="+92 3XX XXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                {errors.customerPhone && <p className="text-terracotta text-sm mt-1">{errors.customerPhone}</p>}
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Email Address <span className="text-muted font-normal">(optional — for order updates)</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                {errors.customerEmail && <p className="text-terracotta text-sm mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Delivery Address *</label>
                <textarea
                  name="customerAddress"
                  placeholder="Street address, area, Karachi"
                  rows={3}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors resize-none"
                />
                {errors.customerAddress && <p className="text-terracotta text-sm mt-1">{errors.customerAddress}</p>}
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Delivery Date *</label>
                <input
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                <p className="text-xs text-muted mt-1">Same day before 12pm · Next day before 9pm · Or schedule ahead</p>
                {errors.deliveryDate && <p className="text-terracotta text-sm mt-1">{errors.deliveryDate}</p>}
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
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'easypaisa' ? 'border-chocolate' : 'border-edge'}`}>
                      {paymentMethod === 'easypaisa' && <div className="w-2 h-2 rounded-full bg-chocolate" />}
                    </div>
                    <span className="font-semibold text-sm text-ink">EasyPaisa</span>
                  </div>
                  <p className="text-sm text-muted pl-7">03XX-XXXXXXX</p>
                  <div className="mt-2 pl-7">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Mobile Payment</span>
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
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'border-chocolate' : 'border-edge'}`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-chocolate" />}
                    </div>
                    <span className="font-semibold text-sm text-ink">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-muted pl-7">Pay when you receive</p>
                </button>
              </div>

              {paymentMethod === 'easypaisa' && (
                <div className="bg-caramel/10 border border-caramel/30 rounded-xl p-4 mt-4 text-sm text-ink">
                  After placing your order, send payment to:{' '}
                  <strong>+92 335 0253548</strong> (Tooba Arsal) via EasyPaisa. Use your order ID as the reference.
                </div>
              )}
            </div>
          </div>

          {/* Honeypot */}
          <div aria-hidden="true" style={HONEYPOT_STYLE}>
            <label htmlFor="website">Website</label>
            <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {/* Section 3 — Special Notes */}
          <div>
            <h2 className="font-fraunces text-2xl text-chocolate mb-6">Special Notes</h2>
            <label htmlFor="order-notes" className="sr-only">Special instructions, allergies, or notes</label>
            <textarea
              id="order-notes"
              placeholder="Any special instructions, allergies, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink resize-none focus:border-caramel outline-none h-24 bg-white"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <p className="text-terracotta text-sm bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3">{submitError}</p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting || cartItems.length === 0}
            className="w-full bg-chocolate text-white rounded-full py-4 font-semibold text-base hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" />Placing Order…</>
            ) : (
              <>Place Order<ArrowRight size={18} /></>
            )}
          </button>
        </div>

        {/* Right — Order Summary */}
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl border border-edge p-8">
            <h3 className="font-fraunces text-xl text-chocolate mb-6">Order Summary</h3>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted text-sm mb-4">Your cart is empty</p>
                <Link href="/shop" className="text-sm font-semibold text-chocolate hover:text-chocolate-dark transition-colors">
                  Back to Shop →
                </Link>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="max-h-80 overflow-y-auto flex flex-col gap-4 pr-1">
                  {cartItems.map((item) => {
                    const variantParts = [item.variant.flavor, item.variant.weight, item.variant.shape, item.variant.frosting].filter(Boolean)
                    return (
                      <div key={item.cartId} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: CATEGORY_COLORS[item.product.category] ?? '#C89B6D' }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm text-ink leading-tight">{item.product.name}</p>
                            <span className="text-sm text-chocolate font-medium flex-shrink-0">
                              {item.price != null ? `PKR ${(item.price * item.quantity).toLocaleString()}` : 'TBD'}
                            </span>
                          </div>
                          {variantParts.length > 0 && <p className="text-xs text-muted mt-0.5">{variantParts.join(' · ')}</p>}
                          {item.custom_message && <p className="text-xs text-muted italic mt-0.5 truncate">&ldquo;{item.custom_message}&rdquo;</p>}
                          <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Discount code input */}
                <div className="mt-5 pt-4 border-t border-edge">
                  {discountApplied ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700 font-mono">{discountApplied.code}</p>
                          <p className="text-xs text-green-600">{discountApplied.label} applied</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeDiscount} className="text-green-500 hover:text-green-700 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Discount code"
                          value={discountCodeInput}
                          onChange={(e) => { setDiscountCodeInput(e.target.value.toUpperCase()); setDiscountError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
                          className="flex-1 border border-edge rounded-xl px-3 py-2.5 text-sm font-mono text-ink focus:border-caramel outline-none bg-white transition-colors uppercase"
                        />
                        <button
                          type="button"
                          onClick={applyDiscount}
                          disabled={discountLoading || !discountCodeInput.trim()}
                          className="bg-chocolate/10 text-chocolate font-inter font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-chocolate/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {discountLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                      {discountError && <p className="text-terracotta text-xs mt-1 px-1">{discountError}</p>}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-edge mt-4 pt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="text-sm text-ink font-medium">
                      {hasNullPrice ? 'Price TBD' : `PKR ${rawSubtotal.toLocaleString()}`}
                    </span>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">Discount ({discountApplied.code})</span>
                      <span className="text-sm text-green-600 font-medium">−PKR {discountApplied.amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-edge pt-2 mt-1">
                    <span className="text-sm text-muted font-medium">Total</span>
                    <span className="font-fraunces text-lg text-chocolate">
                      {hasNullPrice ? 'Price TBD' : `PKR ${Math.max(0, subtotal).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted mt-3 leading-relaxed">
                  Prices for custom cakes and specialty items will be confirmed after order placement.
                </p>

                {/* Trust items */}
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-edge">
                  {['Made fresh to order', 'Karachi delivery', 'EasyPaisa & Cash on Delivery'].map((item) => (
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
