'use client'

import Link from 'next/link'
import type { Product } from '@/types'

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; light: boolean }> = {
  cookies:     { from: '#E8C4A4', to: '#D4A07A', light: false },
  brownies:    { from: '#6B3A2A', to: '#4A2818', light: true  },
  cakes:       { from: '#F0D4B8', to: '#E0BF9A', light: false },
  cupcakes:    { from: '#D97A52', to: '#BF6038', light: true  },
  breads:      { from: '#C49060', to: '#A87840', light: true  },
  pastries:    { from: '#DCBCA0', to: '#C8A480', light: false },
  'gift-boxes':{ from: '#C89B6D', to: '#B08958', light: false },
}

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-beige py-20 px-20">
      <h2 className="font-fraunces text-[38px] font-normal text-chocolate mb-10 tracking-[-1px]">
        You Might Also Love
      </h2>

      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => {
          const gradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS.cookies
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-edge hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(90,62,43,0.11)] transition-all duration-300"
            >
              <div
                className="h-[200px] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                }}
              >
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                  <span
                    className="font-fraunces italic text-sm"
                    style={{
                      color: gradient.light ? 'rgba(255,255,255,0.35)' : 'rgba(90,62,43,0.3)',
                    }}
                  >
                    {product.name}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-caramel mb-1.5 capitalize">
                  {product.category.replace('-', ' ')}
                </p>
                <h3 className="font-fraunces text-lg font-normal text-ink mb-3 leading-snug">
                  {product.name}
                </h3>
                <span className="font-fraunces text-base text-chocolate">
                  {product.base_price ? `PKR ${product.base_price.toLocaleString()}` : 'Price on request'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
