'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

type ImageItem    = { image: string; label: string; rowSpan: boolean }
type GradientItem = { gradient: string; labelColor: string; label: string; rowSpan: boolean }

const items: (ImageItem | GradientItem)[] = [
  { image: '/003.jpg', label: 'Fresh from the oven', rowSpan: true },
  { gradient: 'from-[#D4A574] to-[#C08055]', label: 'Signature cookies', labelColor: 'text-white/30', rowSpan: false },
  { image: '/004.jpg', label: 'Beautiful packaging', rowSpan: false },
  { gradient: 'from-[#6B3A2A] to-[#4A2818]', label: 'Custom cakes', labelColor: 'text-white/30', rowSpan: true },
  { image: '/005.jpg', label: 'Behind the scenes', rowSpan: false },
  { gradient: 'from-[#DCBCA0] to-[#C8A480]', label: 'Pastry selection', labelColor: 'text-chocolate/30', rowSpan: false },
  { gradient: 'from-[#D97A52] to-[#BF6038]', label: 'Gift boxes', labelColor: 'text-white/30', rowSpan: false },
  { gradient: 'from-[#C89B6D] to-[#B08958]', label: 'Seasonal treats', labelColor: 'text-white/30', rowSpan: false },
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
        transition={{ duration: 0.7, ease: 'easeOut' }}
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
        style={{ gridAutoRows: '180px' }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className={`rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform relative${'gradient' in item ? ` bg-gradient-to-br ${item.gradient} flex items-center justify-center` : ''}${item.rowSpan ? ' row-span-2' : ''}`}
          >
            {'image' in item ? (
              <Image src={item.image} alt={item.label} fill className="object-cover" />
            ) : (
              <span className={`font-fraunces italic text-[12px] ${item.labelColor}`}>{item.label}</span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
