import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read The Cozy Crumb terms and conditions for purchasing baked goods, custom orders, and gift boxes.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By placing an order with The Cozy Crumb, you agree to these Terms and Conditions. These terms apply to all purchases made through our website (thecozycrumbs.com). If you do not agree with any part of these terms, please do not place an order.',
  },
  {
    title: '2. Orders & Confirmation',
    body: "All orders are subject to availability and confirmation. We reserve the right to decline or cancel any order at any time. An order is not confirmed until you receive a WhatsApp confirmation message from us.",
  },
  {
    title: '3. Pricing',
    body: 'All prices are displayed in Pakistani Rupees (PKR). Prices are subject to change without notice. Delivery charges are added at checkout based on your location. For custom cake orders, final pricing is confirmed via WhatsApp before baking begins.',
  },
  {
    title: '4. Payment',
    body: 'We accept EasyPaisa and Cash on Delivery. For EasyPaisa, payment must be completed within 2 hours of receiving our payment details, failing which your order may be cancelled. For COD, payment is due at the time of delivery. Delivery charges are non-refundable once dispatched.',
  },
  {
    title: '5. Delivery',
    body: 'We deliver across Karachi within the times specified in our Delivery Policy. While we make every effort to deliver on time, we are not liable for delays caused by circumstances outside our control. Please ensure someone is available to receive the order at the agreed time.',
  },
  {
    title: '6. Product Quality & Allergens',
    body: "All products are handmade to order in a home kitchen. Our products may contain or have been made in an environment with nuts, dairy, eggs, wheat, and other allergens. We are not liable for any allergic reactions. It is the customer's responsibility to review ingredients and inform us of any allergies.",
  },
  {
    title: '7. Cancellations & Modifications',
    body: 'Orders may be cancelled or modified up to 24 hours before the requested delivery date, or before baking has commenced, whichever is earlier. After this window, cancellations and modifications are not possible. EasyPaisa prepayments for eligible cancellations will be refunded within 24 hours.',
  },
  {
    title: '8. Complaints & Refunds',
    body: 'If you are dissatisfied with your order, please contact us within 24 hours of receiving it with photographic evidence. We will assess each complaint individually. Refunds, replacements, or store credit may be offered at our discretion. We do not offer refunds for change of mind.',
  },
  {
    title: '9. Intellectual Property',
    body: 'All content on this website, including images, text, and design, is the property of The Cozy Crumb. You may not reproduce, copy, or republish any content without our written permission.',
  },
  {
    title: '10. Changes to Terms',
    body: 'We reserve the right to update these terms at any time. Changes will be posted on this page. Continued use of our website after changes constitutes your acceptance of the new terms.',
  },
  {
    title: '11. Contact',
    body: 'For any questions about these Terms & Conditions, please contact us at hello@thecozycrumbs.com or via WhatsApp at +92 335 0253548.',
  },
]

export default function TermsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-20 lg:py-28 px-4 sm:px-8 lg:px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Legal
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[36px] sm:text-[50px] lg:text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Terms & Conditions
        </h1>
        <p className="text-base lg:text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">
          Last updated: June 2026
        </p>
      </section>

      <section className="bg-cream py-16 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div className="max-w-[760px] mx-auto flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-fraunces text-[24px] text-chocolate mb-3">{section.title}</h2>
              <p className="text-[15px] text-muted leading-[1.8]">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
