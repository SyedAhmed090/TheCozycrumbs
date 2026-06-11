'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import { GIFT_BOX_ITEMS } from '@/lib/data/products'
import ItemCard from './ItemCard'

type Tab = 'all' | 'brownies' | 'cookies'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'all',      label: 'All Treats' },
  { key: 'brownies', label: 'Brownies'   },
  { key: 'cookies',  label: 'Cookies'    },
]

export default function ItemInventory() {
  const [tab, setTab] = useState<Tab>('all')
  const slots = useGiftBoxStore((s) => s.slots)
  const isFull = slots.length > 0 && slots.every(Boolean)

  const items = tab === 'all'
    ? GIFT_BOX_ITEMS
    : GIFT_BOX_ITEMS.filter((i) => i.category === tab)

  return (
    <div className="p-5 sm:p-7">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-fraunces text-xl text-chocolate">Choose Your Treats</h3>
        <p className="font-inter text-sm text-muted mt-0.5">
          Mix and match your favourites to fill every slot
        </p>
      </div>

      {/* Box-full banner */}
      <AnimatePresence>
        {isFull && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="px-4 py-3 bg-success/10 border border-success/20 rounded-xl">
              <p className="font-inter text-sm font-medium text-success text-center">
                🎉 Your box is full — head to the summary bar to add it to your cart!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-inter font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              tab === t.key
                ? 'bg-chocolate text-white'
                : 'bg-beige text-ink hover:bg-edge'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
