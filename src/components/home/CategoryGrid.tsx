'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  name: string
  tagline: string
  gradientFrom: string
  gradientTo: string
  colSpan?: number
  height: number
  row?: number
  href: string
}

const categories: Category[] = [
  { name: 'Cakes',         tagline: 'Three Milk & more',       gradientFrom: '#E8C4A4', gradientTo: '#D09A74', colSpan: 2, height: 280, row: 1, href: '/shop/cakes' },
  { name: 'Brownies',      tagline: '5 fudgy flavours',        gradientFrom: '#6B3A2A', gradientTo: '#4A2818', height: 280, row: 1, href: '/shop/brownies' },
  { name: 'Chicken Bakes', tagline: 'Bread & buns',            gradientFrom: '#C49060', gradientTo: '#A87840', height: 280, row: 1, href: '/shop/breads' },
  { name: 'Nankhatai',     tagline: 'Classic & cardamom',      gradientFrom: '#D4A574', gradientTo: '#C08055', height: 240, row: 2, href: '/shop/cookies' },
  { name: 'Savory',        tagline: 'Pasta made fresh',        gradientFrom: '#8B9B6B', gradientTo: '#6B7B4B', colSpan: 2, height: 240, row: 2, href: '/shop/savory' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const, delay: i * 0.07 },
  }),
}

export default function CategoryGrid() {
  const row1 = categories.filter((c) => c.row === 1)
  const row2 = categories.filter((c) => c.row === 2)

  return (
    <section className="bg-ivory py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
          <span className="w-7 h-px bg-caramel" />
          Explore
          <span className="w-7 h-px bg-caramel" />
        </p>
        <h2 className="font-fraunces text-[30px] sm:text-[38px] lg:text-[46px] font-normal text-chocolate tracking-[-1.5px]">
          Shop by Category
        </h2>
      </motion.div>

      <div className="flex flex-col gap-[18px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {row1.map((cat, i) => <CategoryCard key={cat.name} cat={cat} index={i} />)}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {row2.map((cat, i) => <CategoryCard key={cat.name} cat={cat} index={row1.length + i} />)}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const colSpanClass = cat.colSpan === 2 ? 'col-span-2' : 'col-span-1'

  return (
    <Link href={cat.href}>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className={`${colSpanClass} group rounded-2xl overflow-hidden cursor-pointer relative flex items-end hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(90,62,43,0.15)] transition-all duration-300`}
        style={{ height: cat.height }}
      >
        <div
          className="absolute inset-0 transition-transform duration-[400ms] group-hover:scale-[1.04]"
          style={{ background: `linear-gradient(135deg, ${cat.gradientFrom}, ${cat.gradientTo})` }}
        />
        <div className="relative z-10 w-full p-5 bg-gradient-to-t from-black/65 to-transparent">
          <h3 className="font-fraunces text-xl font-normal text-white">{cat.name}</h3>
          <span className="text-xs text-white/65 font-medium">{cat.tagline}</span>
        </div>
      </motion.div>
    </Link>
  )
}
