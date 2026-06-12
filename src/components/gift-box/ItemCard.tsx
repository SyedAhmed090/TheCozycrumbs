'use client'

import { useMemo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import type { GiftBoxItem } from '@/types'

export default function ItemCard({ item }: { item: GiftBoxItem }) {
  const slots    = useGiftBoxStore((s) => s.slots)
  const addItem  = useGiftBoxStore((s) => s.addItem)
  const removeLast = useGiftBoxStore((s) => s.removeLastOfItem)
  const controls = useAnimation()

  const count  = useMemo(() => slots.filter((s) => s?.itemId === item.id).length, [slots, item.id])
  const isFull = useMemo(() => slots.length > 0 && slots.every(Boolean), [slots])

  function handleAdd() {
    const added = addItem({
      itemId:     item.id,
      name:       item.name,
      unit_price: item.unit_price,
      emoji:      item.emoji,
      color:      item.color,
      lightText:  item.lightText,
      category:   item.category,
    })
    if (!added) {
      controls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
  }

  return (
    <motion.div
      animate={controls}
      className="flex items-center gap-4 p-4 bg-ivory rounded-xl border border-edge"
    >
      {/* Colour swatch / placeholder */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 select-none"
        style={{ backgroundColor: item.color }}
        aria-hidden="true"
      >
        {item.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-inter text-sm font-semibold text-ink truncate">{item.name}</p>
        <p className="font-inter text-xs text-muted mt-0.5 line-clamp-1">{item.description}</p>
        <p className="font-inter text-xs font-medium text-caramel mt-1">
          Rs.&nbsp;{item.unit_price}/pc
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => removeLast(item.id)}
          disabled={count === 0}
          aria-label={`Remove ${item.name} from box`}
          className="w-11 h-11 flex items-center justify-center disabled:cursor-not-allowed group"
        >
          <span className="w-7 h-7 rounded-full border border-edge flex items-center justify-center group-hover:bg-beige group-disabled:opacity-30 transition-colors">
            <Minus size={12} className="text-ink" />
          </span>
        </button>

        <span className="font-inter text-sm font-medium text-ink w-5 text-center select-none">
          {count}
        </span>

        <button
          onClick={handleAdd}
          disabled={isFull}
          aria-label={`Add ${item.name} to box`}
          className="w-11 h-11 flex items-center justify-center disabled:cursor-not-allowed group"
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isFull
                ? 'bg-beige opacity-40'
                : 'bg-chocolate group-hover:bg-chocolate-dark'
            }`}
          >
            <Plus size={12} className={isFull ? 'text-muted' : 'text-white'} />
          </span>
        </button>
      </div>
    </motion.div>
  )
}
