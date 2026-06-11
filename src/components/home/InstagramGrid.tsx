'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
const INSTAGRAM_URL = 'https://www.instagram.com/thecozycrumb180/'

const TILES: Array<
  | { type: 'image'; src: string; alt: string }
  | { type: 'gradient'; from: string; to: string; label: string }
> = [
  { type: 'image', src: '/001.jpg', alt: 'Freshly baked treats' },
  { type: 'image', src: '/003.jpg', alt: 'Fresh from the oven' },
  { type: 'image', src: '/004.jpg', alt: 'Beautiful packaging' },
  { type: 'gradient', from: '#6B3A2A', to: '#4A2818', label: 'Made with love' },
  { type: 'image', src: '/005.jpg', alt: 'Behind the scenes' },
  { type: 'image', src: '/002.jpg', alt: 'Baked with care' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const tileVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function InstagramGrid() {
  return (
    <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="text-center mb-10 lg:mb-14"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
          Follow Along
        </p>
        <h2 className="font-fraunces text-[28px] sm:text-[36px] lg:text-[44px] font-normal text-chocolate tracking-[-1px] leading-[1.1]">
          As Seen on Instagram
        </h2>
        <p className="font-inter text-muted text-sm mt-3">
          @thecozycrumb180
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto"
      >
        {TILES.map((tile, i) => (
          <motion.a
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variants={tileVariants}
            className="group relative aspect-square rounded-xl overflow-hidden block"
          >
            {tile.type === 'image' ? (
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 220px"
              />
            ) : (
              <div
                className="w-full h-full flex items-end p-3"
                style={{ background: `linear-gradient(135deg, ${tile.from}, ${tile.to})` }}
              >
                <span className="font-fraunces italic text-[11px] text-white/50 leading-tight">
                  {tile.label}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/30 transition-colors duration-300 flex items-center justify-center">
              <InstagramIcon
                size={22}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
              />
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="text-center mt-8 lg:mt-10"
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-chocolate text-chocolate font-inter font-semibold text-sm hover:bg-chocolate hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <InstagramIcon size={16} />
          Follow @thecozycrumb180
        </a>
      </motion.div>
    </section>
  )
}
