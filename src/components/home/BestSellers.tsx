'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; light: boolean }> = {
  cookies:      { from: '#E8C4A4', to: '#D4A07A', light: false },
  brownies:     { from: '#6B3A2A', to: '#4A2818', light: true  },
  cakes:        { from: '#F0D4B8', to: '#E0BF9A', light: false },
  cupcakes:     { from: '#D97A52', to: '#BF6038', light: true  },
  breads:       { from: '#C49060', to: '#A87840', light: true  },
  pastries:     { from: '#DCBCA0', to: '#C8A480', light: false },
  'gift-boxes': { from: '#C89B6D', to: '#B08958', light: false },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

interface BestSellersProps {
  products: Product[]
}

export default function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="bg-cream py-24 px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
          <span className="w-7 h-px bg-caramel" />
          Most Loved
          <span className="w-7 h-px bg-caramel" />
        </p>
        <h2 className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.5px]">
          Customer Favorites
        </h2>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product, i) => {
          const gradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS.cookies
          const categoryLabel = product.category
            .replace('-', ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())

          return (
            <motion.div
              key={product.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group bg-white rounded-2xl overflow-hidden border border-edge cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(90,62,43,0.11)] transition-all duration-300 relative"
            >
              {/* Image placeholder */}
              <div
                className="h-[230px] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                }}
              >
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                  <span
                    className="font-fraunces italic text-sm"
                    style={{ color: gradient.light ? 'rgba(255,255,255,0.35)' : 'rgba(90,62,43,0.3)' }}
                  >
                    {product.name}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-caramel mb-1.5">
                  {categoryLabel}
                </p>
                <h3 className="font-fraunces text-xl font-normal text-ink mb-1.5">
                  {product.name}
                </h3>
                <p className="text-[13px] text-muted leading-[1.55] mb-5">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-fraunces text-xl text-chocolate">
                    {product.base_price ? `PKR ${product.base_price.toLocaleString()}` : 'PKR —'}
                  </span>
                  <span className="text-[12px] text-caramel">★★★★★</span>
                </div>
              </div>

              {/* Quick-add button */}
              <button
                className="absolute bottom-6 right-6 w-[38px] h-[38px] rounded-full bg-chocolate flex items-center justify-center text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
