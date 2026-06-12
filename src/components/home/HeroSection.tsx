'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

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
    <section className="min-h-[70vh] lg:min-h-screen w-full max-w-[1440px] mx-auto flex flex-col lg:grid lg:grid-cols-2 bg-ivory">
      {/* Left column */}
      <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-20 py-16 sm:py-20 lg:py-36">
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

      {/* Right column — hidden on mobile, shown lg+ */}
      <div className="hidden lg:block relative overflow-hidden">
        <Image src="/001.jpg" alt="Freshly baked goods from The Cozy Crumbs" fill className="object-cover" priority />
      </div>
    </section>
  )
}
