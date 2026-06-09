'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '1',
    title: 'Browse Treats',
    description: "Explore our full menu of freshly baked goods and find exactly what you're craving.",
  },
  {
    number: '2',
    title: 'Customize Order',
    description: 'Choose flavors, sizes, and add a personal touch with custom messages or a reference photo.',
  },
  {
    number: '3',
    title: 'Select Delivery',
    description: 'Pick same day, next day, or schedule ahead. We deliver across Karachi.',
  },
  {
    number: '4',
    title: 'Enjoy Fresh Bakes',
    description: 'Receive your order packed fresh and beautifully presented, ready to enjoy.',
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

export default function HowItWorks() {
  return (
    <section className="bg-cream py-24 px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        className="text-center"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
          Simple Process
        </p>
        <h2 className="font-fraunces text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
          How It Works
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-4 gap-5 mt-16 relative before:content-[''] before:absolute before:top-[27px] before:left-[12.5%] before:right-[12.5%] before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge before:to-transparent"
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={itemVariants}
            className="text-center relative z-10 px-3"
          >
            <div className="w-14 h-14 rounded-full mx-auto mb-6 bg-beige border border-edge flex items-center justify-center font-fraunces text-xl text-chocolate hover:bg-chocolate hover:text-white hover:border-chocolate transition-all cursor-default">
              {step.number}
            </div>
            <h3 className="font-fraunces text-[19px] font-normal text-ink mb-3">{step.title}</h3>
            <p className="text-sm text-muted leading-[1.6]">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
