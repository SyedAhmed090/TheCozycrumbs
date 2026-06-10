'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const steps = [
  { icon: '🍰', name: 'Choose Flavor', subtitle: 'Vanilla, chocolate, red velvet & more' },
  { icon: '⚖️', name: 'Select Weight & Shape', subtitle: 'Round, square, tiered — any occasion' },
  { icon: '✨', name: 'Pick Frosting', subtitle: 'Cream cheese, buttercream, ganache' },
  { icon: '💌', name: 'Add Custom Message', subtitle: 'Personalize with a special note' },
  { icon: '📷', name: 'Upload Reference Image', subtitle: 'Show us exactly what you have in mind' },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }
}

export default function CakeCustomization() {
  return (
    <section className="bg-ivory">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col">
          <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
            Design Yours
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            className="font-fraunces text-[30px] sm:text-[38px] lg:text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1] mb-5"
          >
            Every Cake, Perfectly Yours
          </motion.h2>

          <motion.p {...fadeUp(0.18)} className="text-base text-muted leading-[1.7] mb-8">
            Tell us your vision and we&apos;ll bring it to life. From flavor to frosting, every detail crafted to your taste.
          </motion.p>

          <motion.ul {...fadeUp(0.26)} className="flex flex-col gap-3 mb-9">
            {steps.map((step) => (
              <li
                key={step.name}
                className="flex items-center gap-4 p-4 bg-cream rounded-2xl border border-edge hover:border-caramel hover:bg-beige transition-all"
              >
                <span className="w-8 h-8 rounded-xl bg-beige flex items-center justify-center text-lg flex-shrink-0">
                  {step.icon}
                </span>
                <span className="text-sm text-ink">
                  <strong className="font-semibold">{step.name}</strong>
                  <span className="text-muted"> — {step.subtitle}</span>
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...fadeUp(0.34)}>
            <Link
              href="/cakes"
              className="inline-block bg-chocolate text-white rounded-full px-8 py-4 font-semibold text-sm hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Design Your Cake
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(0.2)}
          className="h-[300px] lg:h-[480px] rounded-[28px] bg-gradient-to-br from-beige to-[#DEC5A8] border border-edge flex items-center justify-center"
        >
          <span className="font-fraunces italic text-chocolate/30 text-[15px]">Cake Preview Illustration</span>
        </motion.div>
      </div>
    </section>
  )
}
