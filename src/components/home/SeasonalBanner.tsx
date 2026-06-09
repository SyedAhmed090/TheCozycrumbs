'use client'

import { motion } from 'framer-motion'

export default function SeasonalBanner() {
  return (
    <section className="bg-chocolate py-20 px-20">
      <div className="rounded-[28px] overflow-hidden relative bg-gradient-to-br from-[#6B3A2A] to-[#4A2818]">
        <div className="absolute top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full bg-caramel/[.07]" />
        <div className="absolute bottom-[-80px] left-[30%] w-[300px] h-[300px] rounded-full bg-terracotta/[.05]" />

        <div className="grid grid-cols-2 gap-16 items-center p-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5">
              Limited Edition
            </p>

            <h2 className="font-fraunces text-[44px] font-normal text-white leading-[1.15] tracking-[-1px] mb-5">
              The <em className="italic text-caramel">Eid</em> Collection
              <br />
              is Here
            </h2>

            <p className="text-base text-white/60 leading-[1.7] mb-8">
              Celebrate the season with our hand-crafted Eid specials — exclusively available for a limited time.
            </p>

            <button className="bg-caramel text-white rounded-full px-9 py-4 font-semibold text-sm hover:bg-caramel-dark transition-all hover:-translate-y-0.5">
              Shop the Collection
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="h-[340px] rounded-2xl flex items-center justify-center border border-caramel/[.18] bg-gradient-to-br from-caramel/[.18] to-terracotta/[.18]"
          >
            <span className="font-fraunces italic text-caramel/[.45] text-[15px]">
              Eid Collection Preview
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
