import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'The Cozy Crumb returns and refunds policy. Learn when refunds are offered and how to request one for your order.',
}

const REFUND_YES = [
  'Your order arrived in a damaged or unacceptable condition.',
  'A significant error was made in your order (wrong flavour, missing items, etc.).',
  'Your order was not delivered within the agreed timeframe due to our fault.',
  'An item contained an ingredient not declared at the time of ordering.',
]

const REFUND_NO = [
  'Change of mind or the product not meeting subjective taste expectations.',
  'Damage caused by improper storage after delivery.',
  'Complaints raised more than 24 hours after receiving the order.',
  'Complaints submitted without photographic evidence.',
  'Minor variations in appearance — each handmade piece is unique by nature.',
]

const COMPLAINT_STEPS = [
  'Take clear photos of the issue immediately upon receiving your order.',
  'Message us on WhatsApp at +92 335 0253548 within 24 hours of delivery.',
  'Include your order number (from your confirmation screen) and the photos.',
  'We will review your complaint and respond within 24 hours with a resolution.',
]

export default function ReturnsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-20 lg:py-28 px-4 sm:px-8 lg:px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Our Policy
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[36px] sm:text-[50px] lg:text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">Returns & Refunds</h1>
        <p className="text-base lg:text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">Our commitment is your satisfaction. Here&apos;s how we handle issues with your order.</p>
      </section>

      <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { title: 'Quality Guarantee', body: "Every item is made fresh and inspected before dispatch. If something doesn't meet our quality standards, we'll make it right." },
              { title: '24-Hour Window', body: 'All complaints must be raised within 24 hours of receiving your order, along with photographic evidence.' },
              { title: 'No Physical Returns', body: 'As a food business, we cannot accept physical returns. Resolution is via refund, replacement, or store credit.' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-edge p-8">
                <h3 className="font-fraunces text-xl text-chocolate mb-3">{card.title}</h3>
                <p className="text-sm text-muted leading-[1.7]">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mb-14">
            <h2 className="font-fraunces text-[26px] sm:text-[32px] text-chocolate tracking-[-0.8px] mb-6">When We Offer a Refund or Replacement</h2>
            <div className="flex flex-col gap-3">
              {REFUND_YES.map((point) => (
                <div key={point} className="flex items-start gap-3 bg-[#4A7C59]/5 border border-[#4A7C59]/15 rounded-xl px-6 py-4">
                  <span className="text-[#4A7C59] font-bold mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-sm text-muted leading-[1.7]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <h2 className="font-fraunces text-[26px] sm:text-[32px] text-chocolate tracking-[-0.8px] mb-6">When We Cannot Offer a Refund</h2>
            <div className="flex flex-col gap-3">
              {REFUND_NO.map((point) => (
                <div key={point} className="flex items-start gap-3 bg-terracotta/5 border border-terracotta/15 rounded-xl px-6 py-4">
                  <span className="text-terracotta font-bold mt-0.5 flex-shrink-0">✕</span>
                  <p className="text-sm text-muted leading-[1.7]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-beige rounded-2xl p-8 lg:p-10">
            <h2 className="font-fraunces text-[26px] lg:text-[28px] text-chocolate mb-4">How to Raise a Complaint</h2>
            <ol className="flex flex-col gap-4">
              {COMPLAINT_STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-caramel/15 text-caramel text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <p className="text-sm text-muted leading-[1.7] pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 pt-6 border-t border-edge flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="https://wa.me/923350253548" target="_blank" rel="noopener noreferrer" className="bg-terracotta text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-terracotta/90 transition-colors">WhatsApp Us</a>
              <Link href="/contact" className="text-sm text-muted hover:text-ink transition-colors">Other contact methods →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
