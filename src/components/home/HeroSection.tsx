'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const bobVariants = {
  main: { y: [0, -12, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } },
  a: { y: [0, -8, 0], transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.6 } },
  b: { y: [0, -6, 0], transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.2 } },
  c: { y: [0, -5, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 } },
  stamp: { rotate: [0, 360], transition: { duration: 14, repeat: Infinity, ease: 'linear' as const } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }),
}

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-ivory">
      {/* Left column */}
      <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-20 py-28 lg:py-36">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-7 flex items-center gap-3"
        >
          <span className="w-7 h-px bg-caramel" />
          Made To Order · Delivered Fresh
        </motion.div>

        <motion.h1
          custom={0.12}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-fraunces text-[42px] sm:text-[54px] lg:text-[68px] font-normal leading-[1.08] text-chocolate tracking-[-2px] mb-7"
        >
          Freshly Baked{' '}
          <em className="italic text-terracotta">Happiness</em>
          {','}
          <br />
          Made Just For You
        </motion.h1>

        <motion.p
          custom={0.22}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base lg:text-lg text-muted leading-[1.75] max-w-[460px] mb-12 font-light"
        >
          Cookies, brownies, cakes, cupcakes, breads and pastries baked fresh
          to order and delivered across Karachi.
        </motion.p>

        <motion.div
          custom={0.32}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap gap-4 mb-14"
        >
          <Link
            href="/shop"
            className="bg-chocolate text-white rounded-full px-8 py-4 font-semibold text-sm hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Order Today
          </Link>
          <Link
            href="/shop"
            className="border border-edge text-chocolate rounded-full px-8 py-4 font-semibold text-sm hover:border-chocolate transition-all hover:-translate-y-0.5"
          >
            Browse Menu
          </Link>
        </motion.div>

        <motion.ul
          custom={0.42}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col gap-3"
        >
          {['Made Fresh To Order', 'Local Delivery Across Karachi', 'EasyPaisa & Cash On Delivery'].map((item) => (
            <li key={item} className="flex items-center gap-3 text-[14px] text-muted font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel flex-shrink-0" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Right column — hidden on mobile, shown md+ */}
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-[#F2E4D5] via-[#E8D5BE] to-[#DDC8AD]">
        <motion.div animate={bobVariants.c} className="absolute rounded-2xl bg-gradient-to-br from-[#EDD8C0] to-[#DCBC98]" style={{ width: 95, height: 95, top: '10%', left: '14%' }} />
        <motion.div animate={bobVariants.a} className="absolute rounded-2xl bg-gradient-to-br from-[#FAF4EE] to-[#F0E0CC]" style={{ width: 155, height: 155, top: '10%', right: '10%' }} />
        <motion.div animate={bobVariants.main} className="absolute rounded-2xl bg-gradient-to-br from-[#E8D0B4] to-[#DCBC98] flex items-center justify-center" style={{ width: 280, height: 340, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <span className="font-fraunces italic text-chocolate/30 text-sm text-center px-4">Signature Basket</span>
        </motion.div>
        <motion.div animate={bobVariants.b} className="absolute rounded-2xl bg-gradient-to-br from-[#FFF9F4] to-[#EDD8C0]" style={{ width: 135, height: 135, bottom: '16%', left: '8%' }} />
        <div className="absolute flex items-center justify-center" style={{ width: 90, height: 90, bottom: '9%', right: '9%' }}>
          <div className="w-full h-full rounded-full bg-chocolate flex items-center justify-center overflow-hidden">
            <motion.div animate={bobVariants.stamp} className="font-fraunces italic text-caramel text-[10px] text-center leading-tight px-2">
              Made with Love ♥
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
