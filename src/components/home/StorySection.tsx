'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const stats = [
  { value: '100%', label: 'Made to Order' },
  { value: '0', label: 'Days on Shelf' },
  { value: '∞', label: 'Made with Love' },
]

export default function StorySection() {
  return (
    <section className="bg-beige py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-[320px] sm:h-[420px] lg:h-[520px] rounded-[28px] overflow-hidden relative"
        >
          <Image src="/002.jpg" alt="Our bakery kitchen" fill className="object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel flex items-center gap-3">
            <span className="w-7 h-px bg-caramel" />
            Our Promise
          </p>

          <h2 className="font-fraunces text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-chocolate leading-[1.15] tracking-[-1px] mb-6 mt-4">
            Baked Fresh, Never Sitting On Shelves
          </h2>

          <p className="text-[15px] lg:text-[17px] text-muted leading-[1.8] mb-4">
            Every item that leaves our kitchen was made for you — not made in advance and
            left to sit. When you place an order, we bake. That&apos;s the promise behind
            every cookie, cake, and loaf we make.
          </p>
          <p className="text-[15px] lg:text-[17px] text-muted leading-[1.8] mb-4">
            We believe the difference between good and extraordinary is care — in
            sourcing quality ingredients, in giving doughs time to develop flavour, and
            in packaging each order with the attention it deserves.
          </p>

          <div className="flex gap-8 lg:gap-10 mt-10 lg:mt-12 pt-8 lg:pt-10 border-t border-edge">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-fraunces text-[28px] lg:text-[34px] font-normal text-chocolate tracking-[-1px]">{stat.value}</p>
                <p className="text-[12px] text-muted font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
