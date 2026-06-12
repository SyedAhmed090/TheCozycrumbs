import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read The Cozy Crumbs privacy policy to understand how we collect, use, and protect your personal information.',
}

const SECTIONS = [
  {
    title: 'Introduction',
    body: 'The Cozy Crumbs ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using our website and placing orders, you consent to the practices described here.',
  },
  {
    title: 'What Information We Collect',
    body: 'When you place an order, we collect your name, phone number, delivery address, and order details. We may also receive your email address if you contact us. We do not collect or store payment card details. EasyPaisa transactions are handled directly between you and EasyPaisa.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your personal information to process and fulfill your orders, communicate with you via WhatsApp about your order status, improve our products and services, and send you promotional updates (only with your consent — you can opt out any time).',
  },
  {
    title: 'Information Sharing',
    body: 'We do not sell, trade, or transfer your personal information to third parties. Your data is shared only with delivery personnel (name and address) as needed to fulfill your order. We may disclose information if required by law.',
  },
  {
    title: 'Data Retention',
    body: 'We retain your order information for up to 2 years for record-keeping purposes. You may request deletion of your data at any time by contacting us at hello@thecozycrumbs.com.',
  },
  {
    title: 'WhatsApp Communication',
    body: 'By providing your phone number, you consent to being contacted via WhatsApp for order confirmation and updates. We do not send unsolicited marketing messages. You may opt out of any marketing communications at any time by messaging us.',
  },
  {
    title: 'Cookies',
    body: 'Our website uses essential cookies to maintain your cart session and improve your browsing experience. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, though this may affect cart functionality.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and opt out of marketing communications. To exercise any of these rights, contact us at hello@thecozycrumbs.com.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Updates will be posted on this page. Continued use of our website after changes constitutes your acceptance of the updated policy.',
  },
  {
    title: 'Contact Us',
    body: 'If you have questions about this Privacy Policy or how we handle your data, please contact us at hello@thecozycrumbs.com or via WhatsApp at +92 335 0253548.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-20 lg:py-28 px-4 sm:px-8 lg:px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Legal
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[36px] sm:text-[50px] lg:text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Privacy Policy
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
