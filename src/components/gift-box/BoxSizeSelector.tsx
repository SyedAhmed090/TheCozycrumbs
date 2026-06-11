'use client'

import { motion } from 'framer-motion'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import type { BoxSize } from '@/types'

const CARD_INITIAL = { opacity: 0, y: 24 }
const CARD_ANIMATE = { opacity: 1, y: 0 }
const CARD_HOVER = { y: -5, transition: { duration: 0.2 } }

const OPTIONS: Array<{
  size: BoxSize
  label: string
  tagline: string
  minPrice: number
  cols: number
}> = [
  { size: 4,  label: '4-Pack',  tagline: 'A sweet little gesture',   minPrice: 340,  cols: 2 },
  { size: 6,  label: '6-Pack',  tagline: 'The classic gift box',     minPrice: 510,  cols: 3 },
  { size: 12, label: '12-Pack', tagline: 'The ultimate treat spread', minPrice: 1020, cols: 4 },
]

export default function BoxSizeSelector() {
  const setBoxSize = useGiftBoxStore((s) => s.setBoxSize)

  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel flex items-center justify-center gap-3 mb-4">
          <span className="w-7 h-px bg-caramel" />
          Step 1
          <span className="w-7 h-px bg-caramel" />
        </p>
        <h2 className="font-fraunces text-[28px] sm:text-[36px] text-chocolate tracking-tight">
          Choose Your Box Size
        </h2>
        <p className="font-inter text-muted text-sm mt-2">
          Pick the box that fits your gifting needs, then fill every slot.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.size}
            initial={CARD_INITIAL}
            animate={CARD_ANIMATE}
            transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
            whileHover={CARD_HOVER}
            onClick={() => setBoxSize(opt.size)}
            className="group flex flex-col items-center gap-6 p-8 bg-ivory rounded-2xl border border-edge hover:border-caramel hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Slot preview grid */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${opt.cols}, 1fr)` }}
            >
              {Array.from({ length: opt.size }).map((_, j) => (
                <div
                  key={j}
                  className="w-7 h-7 rounded-lg border-2 border-dashed border-caramel/30 group-hover:border-caramel/70 transition-colors duration-300"
                />
              ))}
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="font-fraunces text-2xl text-chocolate">{opt.label}</p>
              <p className="font-inter text-xs text-muted mt-1">{opt.tagline}</p>
              <p className="font-inter text-sm font-semibold text-caramel mt-3">
                from Rs.&nbsp;{opt.minPrice.toLocaleString()}
              </p>
            </div>

            <div className="w-full py-2.5 rounded-full bg-chocolate text-white font-inter text-sm font-semibold text-center group-hover:bg-chocolate-dark transition-colors">
              Select
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
