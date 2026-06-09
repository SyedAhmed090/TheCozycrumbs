'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    initial: 'S',
    name: 'Sara Ahmed',
    meta: 'Regular Customer · Karachi',
    review:
      "The brownies were absolutely divine — rich, fudgy, and better than anything I've had at a café. The packaging was stunning too. Will definitely order again!",
  },
  {
    initial: 'F',
    name: 'Fatima Malik',
    meta: 'First Time Customer',
    review:
      'Ordered a custom birthday cake and it exceeded every expectation. Beautiful, delicious, and delivered on time. My new go-to for all celebrations.',
  },
  {
    initial: 'A',
    name: 'Aisha Qureshi',
    meta: 'Loyal Customer',
    review:
      'The gift box was the perfect present. Everything was fresh, beautifully wrapped, and tasted homemade. My family was so impressed. Thank you, Tooba!',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

export default function Testimonials() {
  return (
    <section className="bg-beige py-24 px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        className="text-center"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
          Happy Customers
        </p>
        <h2 className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
          What People Are Saying
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-6 mt-16"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={itemVariants}
            className={`bg-ivory rounded-2xl p-9 border border-edge relative before:content-['“'] before:font-fraunces before:text-[68px] before:text-caramel/25 before:absolute before:top-3 before:left-7 before:leading-none`}
          >
            <p className="text-[13px] text-caramel tracking-wide mb-3.5">★★★★★</p>
            <p className="text-[15px] text-ink leading-[1.75] italic mb-7 pt-5">{t.review}</p>
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-beige to-[#DEC5A8] flex items-center justify-center font-fraunces text-[15px] text-chocolate font-medium flex-shrink-0">
                {t.initial}
              </div>
              <div>
                <span className="block text-[13px] font-semibold text-ink">{t.name}</span>
                <span className="text-xs text-muted">{t.meta}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
