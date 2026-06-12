'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import { useCartStore } from '@/store/cartStore'
import { GIFT_BOX_PRODUCTS } from '@/lib/data/products'
import type { FilledSlot } from '@/types'

function buildContentsLabel(slots: FilledSlot[]): string {
  const counts: Record<string, { name: string; count: number }> = {}
  for (const s of slots) {
    if (counts[s.itemId]) counts[s.itemId].count++
    else counts[s.itemId] = { name: s.name, count: 1 }
  }
  return Object.values(counts)
    .map(({ count, name }) => (count > 1 ? `${count}× ${name}` : name))
    .join(', ')
}

export default function BoxSummaryBar() {
  const boxSize  = useGiftBoxStore((s) => s.boxSize)
  const slots    = useGiftBoxStore((s) => s.slots)
  const clearBox = useGiftBoxStore((s) => s.clearBox)
  const addItem  = useCartStore((s) => s.addItem)
  const openDrawer = useCartStore((s) => s.openDrawer)

  if (!boxSize) return null

  const filled     = slots.filter((s): s is FilledSlot => s !== null)
  const isFull     = slots.length > 0 && filled.length === slots.length
  const totalPrice = filled.reduce((sum, s) => sum + s.unit_price, 0)

  function handleAddToCart() {
    if (!isFull || !boxSize) return
    addItem({
      product:      GIFT_BOX_PRODUCTS[boxSize],
      quantity:     1,
      variant:      { box_contents: buildContentsLabel(filled) },
      price:        totalPrice,
      is_gift_box:  true,
      box_size:     boxSize,
      box_contents: filled,
    })
    openDrawer()
    clearBox()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur-md border-t border-edge">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-3 sm:gap-4">

        {/* Progress dots — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          {slots.map((slot, i) => (
            <motion.div
              key={i}
              animate={{ scale: slot ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                slot ? 'bg-chocolate' : 'bg-edge'
              }`}
            />
          ))}
        </div>

        {/* Count label */}
        <p className="font-inter text-sm text-muted flex-shrink-0">
          <span className="font-semibold text-ink">{filled.length}</span>
          {' / '}
          <span className="font-semibold text-ink">{boxSize}</span>
          <span className="hidden sm:inline"> items</span>
        </p>

        <div className="flex-1" />

        {/* Running total */}
        {totalPrice > 0 && (
          <p className="font-inter text-sm sm:text-base font-semibold text-ink flex-shrink-0">
            Rs.&nbsp;{totalPrice.toLocaleString()}
          </p>
        )}

        {/* CTA */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!isFull}
          animate={isFull ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={isFull ? { duration: 0.6, repeat: Infinity, repeatDelay: 2.5 } : {}}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-inter text-sm font-semibold transition-all flex-shrink-0 ${
            isFull
              ? 'bg-chocolate text-white hover:bg-chocolate-dark shadow-md'
              : 'bg-edge text-muted cursor-not-allowed'
          }`}
        >
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">Add Box to Cart</span>
          <span className="sm:hidden">Add to Cart</span>
        </motion.button>

        {/* Change size */}
        <button
          onClick={clearBox}
          className="hidden lg:block font-inter text-xs text-muted hover:text-ink transition-colors underline underline-offset-2 flex-shrink-0"
        >
          Change size
        </button>
      </div>
    </div>
  )
}
