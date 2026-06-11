'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import type { FilledSlot } from '@/types'

export default function BoxSlot({ slot, index }: { slot: FilledSlot | null; index: number }) {
  const removeSlot = useGiftBoxStore((s) => s.removeSlot)

  return (
    <div className="relative aspect-square">
      <AnimatePresence mode="wait">
        {slot ? (
          <motion.div
            key={slot.slotId}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 p-2 overflow-hidden"
            style={{ backgroundColor: slot.color }}
          >
            <span className="text-xl sm:text-2xl leading-none select-none">{slot.emoji}</span>
            <p
              className="font-inter text-[9px] sm:text-[10px] font-medium text-center leading-tight line-clamp-2 px-1"
              style={{ color: slot.lightText ? 'rgba(255,255,255,0.88)' : 'rgba(42,42,42,0.8)' }}
            >
              {slot.name}
            </p>
            <button
              onClick={() => removeSlot(slot.slotId)}
              aria-label={`Remove ${slot.name}`}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-opacity hover:opacity-100 opacity-70"
              style={{
                backgroundColor: slot.lightText ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)',
              }}
            >
              <X
                size={10}
                style={{ color: slot.lightText ? '#ffffff' : '#2A2A2A' }}
              />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-xl border-2 border-dashed border-edge flex items-center justify-center"
          >
            <Plus size={16} className="text-edge" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
