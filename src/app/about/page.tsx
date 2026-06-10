'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Clock, Star } from 'lucide-react'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }
}

const VALUES = [
  {
    icon: Heart,
    title: 'Made with Love',
    body: 'Every item is crafted by hand in our home kitchen. No factory lines, no shortcuts — just honest baking the way it should be done.',
  },
  {
    icon: Clock,
    title: 'Always Fresh',
    body: 'We bake to order. Nothing sits on a shelf. When your order arrives, it was made for you — hours ago, not days.',
  },
  {
    icon: Star,
    title: 'No Compromises',
    body: "We use real butter, pure cocoa, and fresh eggs. Our standards are simple: if we wouldn't eat it ourselves, we won't sell it.",
  },
]

const STATS = [
  { value: '3+', label: 'Years Baking' },
  { value: '1,000+', label: 'Orders Delivered' },
  { value: '500+', label: 'Happy Customers' },
  { value: '4.9', label: 'Average Rating' },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-28 px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Our Story
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Baked from Karachi,
          <br />
          With <em className="italic text-terracotta">Love</em>
        </h1>
        <p className="text-lg text-muted max-w-[520px] mx-auto leading-[1.7]">
          A home bakery built on one belief — that homemade food, made with care, is always worth it.
        </p>
      </section>

      <section className="bg-beige">
        <div className="grid grid-cols-2 gap-20 items-center py-28 px-20">
          <motion.div
            {...fadeUp(0)}
            className="h-[560px] rounded-[28px] bg-gradient-to-br from-[#D4A07A] to-[#C08A65] flex items-center justify-center border border-edge"
          >
            <span className="font-fraunces italic text-white/30 text-[15px]">
              Portrait — Tooba Arsal
            </span>
          </motion.div>

          <div className="flex flex-col">
            <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
              How It Started
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1] mb-6"
            >
              Homemade From The Heart
            </motion.h2>
            <motion.p {...fadeUp(0.18)} className="text-base text-muted leading-[1.7] mb-5">
              The Cozy Crumb began as a love letter to homemade baking — a small kitchen, a big passion, and a belief that the best things are made with time and care.
            </motion.p>
            <motion.p {...fadeUp(0.26)} className="text-base text-muted leading-[1.7] mb-5">
              What started as sharing baked goods with friends and family quickly became something more. People kept asking: &ldquo;Where can we order these?&rdquo; And so, The Cozy Crumb was born.
            </motion.p>
            <motion.p {...fadeUp(0.34)} className="text-base text-muted leading-[1.7]">
              Based in Karachi, every item is made to order, ensuring that what reaches your door is as fresh as if it came from your own oven. No compromises. No shortcuts. Just honest, delicious baking.
            </motion.p>
            <motion.div {...fadeUp(0.42)} className="mt-9 pt-7 border-t border-edge">
              <span className="font-fraunces text-xl italic text-chocolate">Tooba Arsal</span>
              <span className="text-xs text-muted font-medium font-inter mt-1 block">
                Founder & Head Baker, The Cozy Crumb
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 px-20">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-caramel" />
            What We Stand For
            <span className="w-8 h-px bg-caramel" />
          </p>
          <h2 className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
            Our Values
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              {...fadeUp(i * 0.1)}
              className="bg-white rounded-2xl border border-edge p-10"
            >
              <div className="w-12 h-12 rounded-xl bg-beige flex items-center justify-center mb-6">
                <v.icon size={22} className="text-caramel" />
              </div>
              <h3 className="font-fraunces text-2xl text-chocolate mb-3">{v.title}</h3>
              <p className="text-sm text-muted leading-[1.7]">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-chocolate py-20 px-20">
        <div className="grid grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-fraunces text-[52px] text-white tracking-[-1.5px] leading-none mb-2">{s.value}</p>
              <p className="text-sm text-white/50 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige py-20 px-20 text-center">
        <h2 className="font-fraunces text-[42px] font-normal text-chocolate tracking-[-1.2px] mb-4">
          Ready to Order?
        </h2>
        <p className="text-base text-muted max-w-[400px] mx-auto leading-[1.7] mb-8">
          Browse our full range of freshly baked treats, all made to order and delivered across Karachi.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/shop"
            className="bg-terracotta text-white px-8 py-4 rounded-full font-medium hover:bg-terracotta/90 transition-colors text-sm"
          >
            Shop Now
          </Link>
          <Link
            href="/contact"
            className="border border-edge text-ink px-8 py-4 rounded-full font-medium hover:bg-white transition-colors text-sm"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
