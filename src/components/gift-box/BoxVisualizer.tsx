'use client'

import { useGiftBoxStore } from '@/store/giftBoxStore'
import BoxSlot from './BoxSlot'
import type { BoxSize } from '@/types'

const GRID_COLS: Record<BoxSize, string> = {
  4:  'grid-cols-2',
  6:  'grid-cols-3',
  12: 'grid-cols-4',
}

export default function BoxVisualizer() {
  const boxSize = useGiftBoxStore((s) => s.boxSize)
  const slots   = useGiftBoxStore((s) => s.slots)

  if (!boxSize) return null

  const filledCount = slots.filter(Boolean).length

  return (
    <div className="p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-fraunces text-xl text-chocolate">Your Gift Box</h3>
          <p className="font-inter text-sm text-muted mt-0.5">
            <span className="font-semibold text-ink">{filledCount}</span>
            {' '}of{' '}
            <span className="font-semibold text-ink">{boxSize}</span>
            {' '}slots filled
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center select-none">
          <span className="text-xl" aria-hidden="true">🎁</span>
        </div>
      </div>

      {/* Slot grid */}
      <div
        className={`grid ${GRID_COLS[boxSize]} gap-3`}
        role="list"
        aria-label="Gift box slots"
      >
        {slots.map((slot, i) => (
          <div key={slot?.slotId ?? `empty-${i}`} role="listitem">
            <BoxSlot slot={slot} index={i} />
          </div>
        ))}
      </div>
    </div>
  )
}
