'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoxSize, FilledSlot } from '@/types'

interface GiftBoxStore {
  boxSize: BoxSize | null
  slots: (FilledSlot | null)[]
  setBoxSize: (size: BoxSize) => void
  addItem: (item: Omit<FilledSlot, 'slotId'>) => boolean
  removeSlot: (slotId: string) => void
  removeLastOfItem: (itemId: string) => void
  clearBox: () => void
}

export const useGiftBoxStore = create<GiftBoxStore>()(
  persist(
    (set, get) => ({
  boxSize: null,
  slots: [],

  setBoxSize: (size) =>
    set({ boxSize: size, slots: Array<FilledSlot | null>(size).fill(null) }),

  addItem: (item) => {
    const idx = get().slots.findIndex((s) => s === null)
    if (idx === -1) return false
    set((state) => {
      const next = [...state.slots]
      next[idx] = { ...item, slotId: crypto.randomUUID() }
      return { slots: next }
    })
    return true
  },

  removeSlot: (slotId) =>
    set((state) => ({
      slots: state.slots.map((s) => (s?.slotId === slotId ? null : s)),
    })),

  removeLastOfItem: (itemId) =>
    set((state) => {
      const lastIdx = state.slots.reduceRight(
        (found, s, i) => (found === -1 && s?.itemId === itemId ? i : found),
        -1
      )
      if (lastIdx === -1) return state
      const next = [...state.slots]
      next[lastIdx] = null
      return { slots: next }
    }),

  clearBox: () => set({ boxSize: null, slots: [] }),
    }),
    { name: 'cozycrumbs-gift-box' }
  )
)
