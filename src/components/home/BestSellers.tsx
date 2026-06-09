'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  description: string
  gradientFrom: string
  gradientTo: string
  lightText?: boolean
}

const products: Product[] = [
  {
    id: 1,
    name: 'Chocolate Chip Delight',
    category: 'Cookies',
    description: 'Buttery, golden-edged cookies loaded with rich chocolate chips baked to soft perfection.',
    gradientFrom: '#E8C4A4',
    gradientTo: '#D4A07A',
  },
  {
    id: 2,
    name: 'Fudge Walnut Brownie',
    category: 'Brownies',
    description: 'Dense, intensely chocolatey brownies crowned with toasted walnuts and a glossy crust.',
    gradientFrom: '#6B3A2A',
    gradientTo: '#4A2818',
    lightText: true,
  },
  {
    id: 3,
    name: 'Vanilla Dream Cake',
    category: 'Cakes',
    description: 'Fluffy vanilla sponge layered with silky buttercream — classic elegance for every occasion.',
    gradientFrom: '#F0D4B8',
    gradientTo: '#E0BF9A',
  },
  {
    id: 4,
    name: 'Red Velvet Cupcake',
    category: 'Cupcakes',
    description: 'Velvety crimson cupcakes crowned with clouds of cream cheese frosting.',
    gradientFrom: '#D97A52',
    gradientTo: '#BF6038',
    lightText: true,
  },
  {
    id: 5,
    name: 'Artisan Sourdough',
    category: 'Breads',
    description: 'Slow-fermented sourdough with a crackling crust and an open, chewy crumb.',
    gradientFrom: '#C49060',
    gradientTo: '#A87840',
    lightText: true,
  },
  {
    id: 6,
    name: 'The Crumb Hamper',
    category: 'Gift Boxes',
    description: 'A curated selection of our finest bakes — the perfect gift for any occasion.',
    gradientFrom: '#C89B6D',
    gradientTo: '#B08958',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

export default function BestSellers() {
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
        {products.map((product, i) => (
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
                background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})`,
              }}
            >
              <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                <span
                  className="font-fraunces italic text-sm"
                  style={{ color: product.lightText ? 'rgba(255,255,255,0.35)' : 'rgba(90,62,43,0.3)' }}
                >
                  {product.name}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-caramel mb-1.5">
                {product.category}
              </p>
              <h3 className="font-fraunces text-xl font-normal text-ink mb-1.5">
                {product.name}
              </h3>
              <p className="text-[13px] text-muted leading-[1.55] mb-5">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-fraunces text-xl text-chocolate">PKR —</span>
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
        ))}
      </div>
    </section>
  )
}
