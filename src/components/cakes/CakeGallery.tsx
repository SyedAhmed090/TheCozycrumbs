'use client'

import { motion } from 'framer-motion'

type GalleryItem = {
  gradient: string
  label: string
  textColor: string
  className: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    gradient: 'from-[#F0D4B8] to-[#E0BF9A]',
    label: 'Vanilla Birthday Cake',
    textColor: 'text-chocolate/50',
    className: 'row-span-2 h-[480px]',
  },
  {
    gradient: 'from-[#6B3A2A] to-[#4A2818]',
    label: 'Chocolate Ganache',
    textColor: 'text-white/50',
    className: 'h-[220px]',
  },
  {
    gradient: 'from-[#D97A52] to-[#BF6038]',
    label: 'Red Velvet Celebration',
    textColor: 'text-white/60',
    className: 'h-[220px]',
  },
  {
    gradient: 'from-[#E8C4A4] to-[#D4A07A]',
    label: 'Caramel Drip Cake',
    textColor: 'text-chocolate/50',
    className: 'h-[220px]',
  },
  {
    gradient: 'from-[#F2D4B8] to-[#E4BF9A]',
    label: 'Tiered Wedding Cake',
    textColor: 'text-chocolate/50',
    className: 'row-span-2 h-[480px]',
  },
  {
    gradient: 'from-[#C49060] to-[#A87840]',
    label: 'Custom Birthday',
    textColor: 'text-white/60',
    className: 'h-[220px]',
  },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }
}

export default function CakeGallery() {
  return (
    <section className="bg-beige py-20 px-20">
      <motion.div {...fadeUp(0)} className="text-center mb-12">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Inspiration
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h2 className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
          Our Cake Gallery
        </h2>
      </motion.div>

      <motion.div
        {...fadeUp(0.1)}
        className="grid grid-cols-3 gap-5"
        style={{ gridAutoRows: 'min-content' }}
      >
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${item.gradient} flex items-center justify-center ${item.className}`}
            style={i === 0 || i === 4 ? { gridRow: 'span 2' } : {}}
          >
            <span className={`font-fraunces italic text-sm text-center px-4 ${item.textColor}`}>
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div {...fadeUp(0.2)} className="text-center mt-14">
        <p className="text-muted text-base mb-6 max-w-[440px] mx-auto leading-[1.7]">
          Inspired by what you see? We can create something just as beautiful — or even better — for your special occasion.
        </p>
        <a
          href="#cake-builder"
          className="inline-block bg-chocolate text-white rounded-full px-8 py-4 font-semibold text-sm hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Start Building Your Cake
        </a>
      </motion.div>
    </section>
  )
}
