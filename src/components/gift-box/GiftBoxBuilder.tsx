'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useGiftBoxStore } from '@/store/giftBoxStore'
import BoxSizeSelector from './BoxSizeSelector'
import ItemInventory from './ItemInventory'
import BoxVisualizer from './BoxVisualizer'
import BoxSummaryBar from './BoxSummaryBar'

type MobileTab = 'items' | 'box'

export default function GiftBoxBuilder() {
  const boxSize  = useGiftBoxStore((s) => s.boxSize)
  const slots    = useGiftBoxStore((s) => s.slots)
  const clearBox = useGiftBoxStore((s) => s.clearBox)
  const [mobileTab, setMobileTab] = useState<MobileTab>('items')

  const filledCount = slots.filter(Boolean).length

  function tabClass(tab: MobileTab) {
    return `flex-1 py-3.5 font-inter text-sm font-medium transition-colors ${
      mobileTab === tab ? 'text-chocolate border-b-2 border-chocolate' : 'text-muted'
    }`
  }

  return (
    <div className={`min-h-screen bg-cream ${boxSize ? 'pb-28' : 'pb-20'}`}>

      {/* Page header */}
      <div className="bg-ivory border-b border-edge">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 py-7 lg:py-9">
          {boxSize && (
            <button
              onClick={clearBox}
              className="flex items-center gap-1.5 font-inter text-sm text-muted hover:text-ink transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              Change box size
            </button>
          )}
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel flex items-center gap-3 mb-3">
            <span className="w-7 h-px bg-caramel" />
            Gift Box Builder
          </p>
          <h1 className="font-fraunces text-[28px] sm:text-[36px] lg:text-[44px] text-chocolate tracking-tight leading-tight">
            Build Your Gift Box
          </h1>
          {!boxSize && (
            <p className="font-inter text-muted text-sm mt-2 max-w-lg">
              Choose a size, pick your treats one by one, and create a box someone will remember.
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!boxSize ? (
          /* ── Size selector ──────────────────────────────── */
          <motion.div
            key="size-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 py-12 lg:py-20"
          >
            <BoxSizeSelector />
          </motion.div>
        ) : (
          /* ── Builder layout ─────────────────────────────── */
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Mobile tab bar */}
            <div className="lg:hidden sticky top-16 z-20 flex bg-ivory border-b border-edge">
              <button
                onClick={() => setMobileTab('items')}
                className={tabClass('items')}
              >
                Choose Treats
              </button>
              <button
                onClick={() => setMobileTab('box')}
                className={tabClass('box')}
              >
                My Box{filledCount > 0 ? ` (${filledCount}/${boxSize})` : ''}
              </button>
            </div>

            {/* Split layout */}
            <div className="max-w-[1400px] mx-auto lg:grid lg:grid-cols-[1fr_460px]">
              {/* Left: Inventory */}
              <div
                className={`${mobileTab === 'items' ? 'block' : 'hidden'} lg:block lg:border-r lg:border-edge`}
              >
                <ItemInventory />
              </div>

              {/* Right: Visualizer (sticky on desktop) */}
              <div
                className={`${mobileTab === 'box' ? 'block' : 'hidden'} lg:block`}
              >
                <div className="lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                  <BoxVisualizer />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BoxSummaryBar />
    </div>
  )
}
