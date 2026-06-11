import type { Metadata } from 'next'
import { Edit, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Order',
  description:
    'Step-by-step guide to placing an order at The Cozy Crumb. Browse, add to cart, choose delivery, and pay via EasyPaisa or Cash on Delivery.',
}

const STEPS = [
  { step: '01', title: 'Browse & Add to Cart', body: 'Visit our Shop and browse all available items. Click on any product to see details, then add it to your cart. You can view your cart at any time by clicking the bag icon in the header.' },
  { step: '02', title: 'Go to Checkout', body: "When ready, click checkout in your cart. Fill in your name, phone number, delivery address, and your preferred delivery date." },
  { step: '03', title: 'Choose Your Payment', body: "Select EasyPaisa or Cash on Delivery. For EasyPaisa, we'll send you payment details via WhatsApp after order confirmation." },
  { step: '04', title: 'Order Confirmation', body: "Once submitted, you'll see an order confirmation screen. We'll also reach out on WhatsApp within 2 hours to confirm your order details and delivery time." },
]

export default function OrderHelpPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-20 lg:py-28 px-4 sm:px-8 lg:px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Help Center
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[36px] sm:text-[50px] lg:text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">Order Help</h1>
        <p className="text-base lg:text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">Everything you need to place, modify, or get help with your order.</p>
      </section>

      <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-fraunces text-[28px] sm:text-[34px] lg:text-[38px] text-chocolate tracking-[-1px] mb-12 text-center">How to Place an Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-edge p-8">
                <span className="font-fraunces text-[40px] text-caramel/30 leading-none block mb-4">{s.step}</span>
                <h3 className="font-fraunces text-2xl text-chocolate mb-3">{s.title}</h3>
                <p className="text-sm text-muted leading-[1.7]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige py-16 lg:py-20 px-4 sm:px-8 lg:px-20">
        <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                <Edit size={18} className="text-caramel" />
              </div>
              <h2 className="font-fraunces text-2xl text-chocolate">Modifying an Order</h2>
            </div>
            <p className="text-sm text-muted leading-[1.7] mb-3">Need to change your delivery date, address, or items? Message us on WhatsApp as soon as possible.</p>
            <p className="text-sm text-muted leading-[1.7]">Modifications are possible up to <strong className="text-ink">24 hours before your delivery date</strong>, or before baking has started — whichever comes first.</p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                <XCircle size={18} className="text-caramel" />
              </div>
              <h2 className="font-fraunces text-2xl text-chocolate">Cancelling an Order</h2>
            </div>
            <p className="text-sm text-muted leading-[1.7] mb-3">You may cancel your order up to 24 hours before your requested delivery date. Please message us on WhatsApp as soon as possible.</p>
            <p className="text-sm text-muted leading-[1.7]">Once baking has started, cancellations are not possible. EasyPaisa prepayments for eligible cancellations will be refunded within 24 hours.</p>
          </div>
        </div>
      </section>

      <section className="bg-chocolate py-16 lg:py-20 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="font-fraunces text-[28px] sm:text-[34px] lg:text-[38px] font-normal text-white tracking-[-1px] mb-4">Still need help?</h2>
        <p className="text-base text-white/60 max-w-[400px] mx-auto leading-[1.7] mb-8">Our team is available 7 days a week. WhatsApp is the fastest way to get a response.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/923350253548" target="_blank" rel="noopener noreferrer" className="bg-white text-chocolate px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors text-sm">WhatsApp Us</a>
          <a href="mailto:hello@thecozycrumbs.com" className="border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors text-sm">Send an Email</a>
        </div>
      </section>
    </>
  )
}
