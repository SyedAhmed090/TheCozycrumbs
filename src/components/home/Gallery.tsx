'use client'

import { motion } from 'framer-motion'

const items = [
  { gradient: 'from-[#E8C4A4] to-[#D4A07A]', label: 'Fresh from the oven', labelColor: 'text-chocolate/30', rowSpan: true, height: 374 },
  { gradient: 'from-[#D4A574] to-[#C08055]', label: 'Signature cookies', labelColor: 'text-white/30', rowSpan: false, height: 180 },
  { gradient: 'from-[#F0D4B8] to-[#E0BF9A]', label: 'Beautiful packaging', labelColor: 'text-chocolate/30', rowSpan: false, height: 180 },
  { gradient: 'from-[#6B3A2A] to-[#4A2818]', label: 'Custom cakes', labelColor: 'text-white/30', rowSpan: true, height: 374 },
  { gradient: 'from-[#C49060] to-[#A87840]', label: 'Behind the scenes', labelColor: 'text-white/30', rowSpan: false, height: 180 },
  { gradient: 'from-[#DCBCA0] to-[#C8A480]', label: 'Pastry selection', labelColor: 'text-chocolate/30', rowSpan: false, height: 180 },
  { gradient: 'from-[#D97A52] to-[#BF6038]', label: 'Gift boxes', labelColor: 'text-white/30', rowSpan: false, height: 180 },
  { gradient: 'from-[#C89B6D] to-[#B08958]', label: 'Seasonal treats', labelColor: 'text-white/30', rowSpan: false, height: 180 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function Gallery() {
  return (
    <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        className="text-center"
      >
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">Behind the Crumb</p>
        <h2 className="font-fraunces text-[30px] sm:text-[38px] lg:text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
          Our Gallery
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-16"
        style={{ gridAutoRows: 'auto' }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${item.gradient} flex items-center justify-center${item.rowSpan ? ' row-span-2' : ''}`}
            style={{ height: item.height }}
          >
            <span className={`font-fraunces italic text-[12px] ${item.labelColor}`}>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
