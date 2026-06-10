'use client'

import Link from 'next/link'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const items = useCartStore((s) => s.items)
  const closeDrawer = useCartStore((s) => s.closeDrawer)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const subtotal = totalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
          />

          <motion.div
            key="drawer"
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-ivory flex flex-col z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-edge">
              <h2 className="font-fraunces text-xl text-chocolate">Your Cart</h2>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-beige transition-colors"
              >
                <X size={18} className="text-ink" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <span className="text-5xl">🍪</span>
                <p className="font-inter text-muted text-sm">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="mt-2 px-6 py-2.5 bg-chocolate text-white text-sm font-semibold rounded-full hover:bg-chocolate-dark transition-colors"
                >
                  Browse Treats
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.cartId} className="flex gap-4 py-4 border-b border-edge last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-medium text-ink truncate">
                          {item.product.name}
                        </p>
                        {(item.variant.flavor || item.variant.weight || item.variant.shape || item.variant.frosting) && (
                          <p className="font-inter text-xs text-muted mt-0.5">
                            {[item.variant.flavor, item.variant.weight, item.variant.shape, item.variant.frosting]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                        {item.custom_message && (
                          <p className="font-inter text-xs text-muted mt-0.5 italic truncate">
                            &ldquo;{item.custom_message}&rdquo;
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) removeItem(item.cartId)
                                else updateQuantity(item.cartId, item.quantity - 1)
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-edge hover:bg-beige transition-colors"
                            >
                              <Minus size={11} className="text-ink" />
                            </button>
                            <span className="font-inter text-sm text-ink w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-edge hover:bg-beige transition-colors"
                            >
                              <Plus size={11} className="text-ink" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            {item.price != null && (
                              <span className="font-inter text-sm font-medium text-chocolate">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                            )}
                            <button onClick={() => removeItem(item.cartId)} className="text-muted hover:text-terracotta transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 border-t border-edge bg-ivory">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-inter text-sm text-muted">Subtotal</span>
                    <span className="font-inter text-base font-semibold text-ink">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="block w-full text-center py-3.5 bg-chocolate text-white font-semibold text-sm rounded-full hover:bg-chocolate-dark transition-colors"
                  >
                    Checkout
                  </Link>
                  <p className="font-inter text-xs text-muted text-center mt-3">
                    Pay via EasyPaisa or Cash on Delivery
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
