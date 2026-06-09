'use client'

import { motion } from 'framer-motion'
import type { SeasonalCollection } from '@/types'

interface SeasonalBannerProps {
  collection?: SeasonalCollection | null
}

export default function SeasonalBanner({ collection }: SeasonalBannerProps) {
  // Use live collection data if available; fall back to default Eid content
  const title = collection?.title ?? 'The Eid Collection\nis Here'
  const subtitle = collection?.subtitle ?? 'Limited Edition'
  const description =
    collection?.description ??
    'Celebrate the season with our hand-crafted Eid specials — exclusively available for a limited time.'
  const ctaLabel = collection?.cta_label ?? 'Shop the Collection'

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
              {subtitle}
            </p>

            {collection ? (
              <h2 className="font-fraunces text-[44px] font-normal text-white leading-[1.15] tracking-[-1px] mb-5">
                {title}
              </h2>
            ) : (
              <h2 className="font-fraunces text-[44px] font-normal text-white leading-[1.15] tracking-[-1px] mb-5">
                The <em className="italic text-caramel">Eid</em> Collection
                <br />
                is Here
              </h2>
            )}

            <p className="text-base text-white/60 leading-[1.7] mb-8">
              {description}
            </p>

            <button className="bg-caramel text-white rounded-full px-9 py-4 font-semibold text-sm hover:bg-caramel-dark transition-all hover:-translate-y-0.5">
              {ctaLabel}
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
              {collection?.title ?? 'Eid Collection Preview'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
