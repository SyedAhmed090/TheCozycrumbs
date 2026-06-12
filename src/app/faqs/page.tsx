'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQ_CATEGORIES = [
  {
    title: 'Ordering',
    faqs: [
      {
        q: 'How do I place an order?',
        a: "Browse our shop and add items to your cart. When you're ready, go to checkout and fill in your delivery details. We'll confirm your order on WhatsApp within a few hours.",
      },
      {
        q: 'How much notice do I need?',
        a: 'For regular baked goods (cookies, brownies, cupcakes), we typically need 24 hours notice. For custom cakes, at least 48 hours. For large orders, please give us 3–5 days.',
      },
      {
        q: 'Can I modify or cancel an order?',
        a: 'You can modify or cancel your order up to 24 hours before your requested delivery date. Please message us on WhatsApp as soon as possible. Once baking has started, cancellations may not be possible.',
      },
      {
        q: 'Do you take same-day orders?',
        a: 'Same-day orders are subject to availability and must be placed before 12pm. Please message us on WhatsApp at +92 335 0253548 to check if same-day delivery is possible.',
      },
    ],
  },
  {
    title: 'Delivery',
    faqs: [
      {
        q: 'Where do you deliver?',
        a: "We deliver across all major areas of Karachi including DHA, Clifton, Gulshan, Gulistan-e-Johar, North Karachi, PECHS, and more. Message us if you're unsure about your area.",
      },
      {
        q: 'What are the delivery charges?',
        a: 'Delivery charges are confirmed by us on WhatsApp after your order is placed, based on your delivery area. Standard delivery within central Karachi is between Rs. 100–200. Further areas may have higher charges. See our Delivery Policy for standard charges.',
      },
      {
        q: 'How are orders packaged?',
        a: 'All orders are packed in premium, food-safe packaging designed to keep your treats fresh and presentable. Gift box orders come with extra decorative packaging.',
      },
      {
        q: 'Can I pick up my order?',
        a: 'Yes, self-pickup is available. Please mention this in your order notes or message us on WhatsApp at +92 335 0253548 and we will share the pickup address and time.',
      },
    ],
  },
  {
    title: 'Payment',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept EasyPaisa and Cash on Delivery (COD). For EasyPaisa, payment details are shared after order confirmation. COD payment is collected at delivery.',
      },
      {
        q: 'When do I pay for EasyPaisa orders?',
        a: "After you place your order, we'll confirm it on WhatsApp and share our EasyPaisa number. Payment is required before we begin baking.",
      },
      {
        q: 'Is there a minimum order value?',
        a: 'There is no minimum order value for most items. However, delivery charges apply regardless of order size. For custom cakes, pricing is discussed individually.',
      },
    ],
  },
  {
    title: 'Products',
    faqs: [
      {
        q: 'Are your products made fresh?',
        a: 'Yes, every item is made to order. Nothing is pre-baked or sitting on a shelf. This is why we need advance notice — your order is made fresh specifically for you.',
      },
      {
        q: 'Do you cater to dietary restrictions?',
        a: "We currently offer some eggless options. Please mention any allergies or dietary requirements in your order notes and we'll do our best to accommodate. We cannot guarantee a fully allergen-free environment.",
      },
      {
        q: 'How long do your baked goods stay fresh?',
        a: 'Most items stay fresh for 3–5 days in an airtight container at room temperature, or up to a week when refrigerated. Custom cakes are best consumed within 2–3 days.',
      },
      {
        q: 'Do you offer seasonal or limited items?',
        a: "Yes! We regularly introduce seasonal specials for Eid, Valentine's Day, and other occasions. Follow us on Instagram @thecozycrumb180 to stay updated.",
      },
    ],
  },
  {
    title: 'Custom Cakes',
    faqs: [
      {
        q: 'How does the custom cake process work?',
        a: "Use our Cake Builder to specify your preferences — flavor, weight, frosting, message, and delivery date. Submit the form and we'll reach out on WhatsApp within 2 hours to confirm details and pricing.",
      },
      {
        q: 'Can I upload a reference image?',
        a: "Yes, you can share a reference image via WhatsApp after placing the order. We do our best to recreate designs, though results may vary based on complexity.",
      },
      {
        q: 'How is custom cake pricing determined?',
        a: "Pricing is based on size, flavor complexity, frosting type, and design details. We'll give you a quote on WhatsApp before we start. No surprises.",
      },
      {
        q: 'Do you offer tasting boxes?',
        a: 'Yes! For large custom cake orders, we can arrange a tasting. Contact us on WhatsApp at +92 335 0253548 to discuss.',
      },
    ],
  },
]

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}) {
  const panelId = `faq-panel-${q.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`
  const buttonId = `faq-button-${q.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`

  return (
    <div className="border-b border-edge">
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between py-5 font-medium text-ink text-[15px] text-left cursor-pointer"
      >
        <span>{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown size={18} className="text-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-muted leading-[1.7] mt-3 pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-20 lg:py-28 px-4 sm:px-8 lg:px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Questions
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[30px] sm:text-[50px] lg:text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Frequently Asked
          <br />
          <em className="italic text-terracotta">Questions</em>
        </h1>
        <p className="text-base lg:text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">
          Everything you need to know about ordering, delivery, payment, and our baked goods.
        </p>
      </section>

      <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div className="max-w-[800px] mx-auto flex flex-col gap-16">
          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h2 className="font-fraunces text-[22px] sm:text-[26px] lg:text-[30px] text-chocolate mb-6 pb-4 border-b-2 border-caramel/20">
                {cat.title}
              </h2>
              <div>
                {cat.faqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    q={faq.q}
                    a={faq.a}
                    isOpen={!!openItems[`${cat.title}-${i}`]}
                    onToggle={() => toggle(`${cat.title}-${i}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige py-16 lg:py-20 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="font-fraunces text-[28px] sm:text-[34px] lg:text-[38px] font-normal text-chocolate tracking-[-1px] mb-4">
          Still have questions?
        </h2>
        <p className="text-base text-muted max-w-[400px] mx-auto leading-[1.7] mb-8">
          We&apos;re happy to help. Reach out on WhatsApp for the fastest response.
        </p>
        <a
          href="https://wa.me/923350253548"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-full font-medium hover:bg-terracotta/90 transition-colors text-sm"
        >
          Message Us on WhatsApp
        </a>
      </section>
    </>
  )
}
