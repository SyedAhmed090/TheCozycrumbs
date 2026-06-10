'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface OrderConfirmationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const isEasypaisa = order.payment_method === 'easypaisa'

  const details = [
    { label: 'Delivery Date', value: formatDate(order.delivery_date) },
    {
      label: 'Payment Method',
      value: order.payment_method === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery',
    },
    { label: 'Customer Name', value: order.customer_name },
    { label: 'Phone', value: order.customer_phone },
  ]

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center py-20 px-8 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-20 h-20 bg-success/15 border-2 border-success rounded-full flex items-center justify-center"
      >
        <CheckCircle2 size={36} className="text-success" />
      </motion.div>

      {/* Heading */}
      <h1 className="font-fraunces text-[36px] sm:text-[48px] font-normal text-chocolate tracking-[-1.2px] mt-8 mb-4">
        Order Placed!
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-muted mb-8 max-w-[440px] leading-[1.7]">
        Thank you for your order! We&apos;ll confirm it shortly and get baking.
      </p>

      {/* Order ID card */}
      <div className="bg-white rounded-2xl border border-edge px-8 py-5 mb-10">
        <p className="text-xs uppercase tracking-wider text-muted mb-1">Order ID</p>
        <p className="font-mono text-sm text-ink">{order.id}</p>
      </div>

      {/* EasyPaisa payment instructions */}
      {isEasypaisa && (
        <div className="bg-caramel/10 border border-caramel/30 rounded-2xl p-6 mb-10 text-left max-w-[480px] w-full">
          <p className="font-semibold text-ink mb-2">Complete Your Payment</p>
          <p className="text-sm text-ink leading-relaxed">
            Please send{' '}
            {order.subtotal ? (
              <strong>PKR {Number(order.subtotal).toLocaleString()}</strong>
            ) : (
              'the confirmed amount'
            )}{' '}
            to <strong>+92 335 0253548</strong> (Tooba Arsal) via EasyPaisa. Use your order ID{' '}
            <strong className="font-mono">{order.id}</strong> as the payment reference so we can
            match your payment quickly.
          </p>
        </div>
      )}

      {/* Order details grid */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12 text-left max-w-[480px] w-full">
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-medium text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="px-7 py-3 rounded-full border border-edge text-sm font-semibold text-ink hover:bg-cream transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="px-7 py-3 rounded-full bg-chocolate text-white text-sm font-semibold hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Order Again
        </Link>
      </div>
    </div>
  )
}
