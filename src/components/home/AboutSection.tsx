'use client'

import { motion } from 'framer-motion'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }
}

export default function AboutSection() {
  return (
    <section className="bg-beige">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <motion.div
          {...fadeUp(0)}
          className="h-[300px] sm:h-[420px] lg:h-[560px] rounded-[28px] bg-gradient-to-br from-[#D4A07A] to-[#C08A65] flex items-center justify-center border border-edge"
        >
          <span className="font-fraunces italic text-white/30 text-[15px]">Portrait — Tooba Arsal</span>
        </motion.div>

        <div className="flex flex-col">
          <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
            Our Story
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            className="font-fraunces text-[28px] sm:text-[36px] lg:text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1] mb-6"
          >
            Homemade From The Heart
          </motion.h2>

          <motion.p {...fadeUp(0.18)} className="text-base text-muted leading-[1.7] mb-5">
            The Cozy Crumb began as a love letter to homemade baking — a small kitchen, a big passion, and a belief that the best things are made with time and care.
          </motion.p>

          <motion.p {...fadeUp(0.26)} className="text-base text-muted leading-[1.7]">
            Based in Karachi, every item is made to order, ensuring that what reaches your door is as fresh as if it came from your own oven. No compromises. No shortcuts. Just honest, delicious baking.
          </motion.p>

          <motion.div {...fadeUp(0.34)} className="mt-9 pt-7 border-t border-edge">
            <span className="font-fraunces text-xl italic text-chocolate">Tooba Arsal</span>
            <span className="text-xs text-muted font-medium font-inter mt-1 block">
              Founder & Head Baker, The Cozy Crumb
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
