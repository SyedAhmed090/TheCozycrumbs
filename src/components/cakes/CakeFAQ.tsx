'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'How much notice do I need to order a custom cake?',
    a: 'For most cakes, we need at least 48 hours notice. For tiered or highly detailed cakes, we recommend 3-5 days. Same-day orders are accepted for simple designs before 12pm, subject to availability.',
  },
  {
    q: 'How do you determine the price?',
    a: "Prices vary based on size, flavor complexity, frosting type, and design details. After you place your order, we'll review it and contact you on WhatsApp within 2 hours with a final price confirmation.",
  },
  {
    q: 'Can I upload a reference image?',
    a: 'Yes! When building your cake, you can upload a reference photo to help us understand your vision. We do our best to recreate designs, but final results may vary based on complexity.',
  },
  {
    q: 'Do you deliver across all of Karachi?',
    a: 'Yes, we deliver across Karachi. Delivery charges vary by area and will be included in your final quote. We ensure cakes are transported carefully to maintain their presentation.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept EasyPaisa transfers and Cash on Delivery. For EasyPaisa, payment is made after order confirmation. COD payment is collected at the time of delivery.',
  },
  {
    q: 'Can I get a tasting before ordering a large cake?',
    a: 'Yes! We offer tasting boxes for custom cake orders. Contact us on WhatsApp at +92 335 0253548 to arrange a tasting.',
  },
]

export default function CakeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="bg-cream py-12 lg:py-20 px-4 sm:px-8 lg:px-20">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-caramel" />
            Questions?
            <span className="w-8 h-px bg-caramel" />
          </p>
          <h2 className="font-fraunces text-[28px] sm:text-[36px] lg:text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
            Frequently Asked Questions
          </h2>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="border-b border-edge py-5">
              <button
                type="button"
                className="w-full flex items-center justify-between font-medium text-ink text-[15px] text-left"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown size={18} className="text-muted" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-[14px] text-muted leading-[1.7] mt-3 pb-2">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
