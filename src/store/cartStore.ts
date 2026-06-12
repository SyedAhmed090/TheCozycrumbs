'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'cartId'>) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          // For standard (non-custom) items, merge into an existing matching
          // line instead of appending a duplicate line.
          const isCustom =
            !!item.reference_image_url ||
            !!item.custom_message ||
            !!item.is_gift_box
          if (!isCustom) {
            const existing = state.items.find(
              (i) =>
                i.product.id === item.product.id &&
                JSON.stringify(i.variant) === JSON.stringify(item.variant) &&
                !i.reference_image_url &&
                !i.custom_message &&
                !i.is_gift_box
            )
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.cartId === existing.cartId
                    ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                    : i
                ),
              }
            }
          }
          return {
            items: [...state.items, { ...item, cartId: crypto.randomUUID() }],
          }
        }),

      removeItem: (cartId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        })),

      updateQuantity: (cartId, quantity) =>
        set((state) => ({
          // When quantity drops to 0 or below, remove the line entirely;
          // otherwise floor it at 1 so totals stay valid.
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartId !== cartId)
              : state.items.map((i) =>
                  i.cartId === cartId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0),
    }),
    {
      name: 'cozy-crumb-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not drawer open state
      partialize: (state) => ({ items: state.items }),
    }
  )
)
