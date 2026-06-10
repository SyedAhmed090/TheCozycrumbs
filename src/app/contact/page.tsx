import Link from 'next/link'
import { MessageCircle, Camera, Mail, Clock, MapPin } from 'lucide-react'

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+92 335 025 3548',
    description: 'Fastest way to reach us. Most orders and custom cake inquiries are handled here.',
    href: 'https://wa.me/923350253548',
    cta: 'Message on WhatsApp',
    cardClass: 'bg-[#25D366]/5 border-[#25D366]/20',
    iconClass: 'bg-[#25D366]/10 text-[#25D366]',
  },
  {
    icon: Camera,
    label: 'Instagram',
    value: '@thecozycrumb180',
    description: 'See our latest bakes, behind-the-scenes, and daily specials. DMs are welcome.',
    href: 'https://www.instagram.com/thecozycrumb180/',
    cta: 'Follow on Instagram',
    cardClass: 'bg-[#E1306C]/5 border-[#E1306C]/20',
    iconClass: 'bg-[#E1306C]/10 text-[#E1306C]',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@thecozycrumbs.com',
    description: 'For partnership inquiries, bulk orders, or anything formal.',
    href: 'mailto:hello@thecozycrumbs.com',
    cta: 'Send an Email',
    cardClass: 'bg-caramel/5 border-caramel/20',
    iconClass: 'bg-caramel/10 text-caramel',
  },
]

const HOURS = [
  { day: 'Monday – Friday', hours: '9:00 AM – 9:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 8:00 PM' },
  { day: 'Sunday', hours: '11:00 AM – 6:00 PM' },
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-28 px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Say Hello
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Get In Touch
        </h1>
        <p className="text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">
          Whether you have a question, a custom order idea, or just want to say hi — we&apos;d love to hear from you.
        </p>
      </section>

      <section className="bg-cream py-24 px-20">
        <div className="max-w-[960px] mx-auto grid grid-cols-3 gap-6">
          {CONTACT_METHODS.map((m) => (
            <div key={m.label} className={`rounded-2xl border p-8 flex flex-col ${m.cardClass}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${m.iconClass}`}>
                <m.icon size={22} />
              </div>
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-muted mb-1">{m.label}</p>
              <p className="font-fraunces text-xl text-chocolate mb-3">{m.value}</p>
              <p className="text-sm text-muted leading-[1.7] mb-6 flex-1">{m.description}</p>
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink border border-edge bg-white rounded-full px-5 py-2.5 hover:bg-beige transition-colors text-center"
              >
                {m.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige py-20 px-20">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center">
                <Clock size={18} className="text-caramel" />
              </div>
              <h3 className="font-fraunces text-2xl text-chocolate">Response Hours</h3>
            </div>
            <div className="flex flex-col">
              {HOURS.map((row) => (
                <div key={row.day} className="flex justify-between py-3 border-b border-edge text-sm">
                  <span className="text-ink font-medium">{row.day}</span>
                  <span className="text-muted">{row.hours}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-4 leading-[1.6]">
              WhatsApp messages are typically answered within 1–2 hours during these hours.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center">
                <MapPin size={18} className="text-caramel" />
              </div>
              <h3 className="font-fraunces text-2xl text-chocolate">Location</h3>
            </div>
            <p className="text-base text-muted leading-[1.7] mb-4">
              We&apos;re a home bakery based in Karachi, Pakistan. We deliver across all major areas of the city.
            </p>
            <p className="text-base text-muted leading-[1.7] mb-6">
              We do not have a physical storefront — all orders are placed online and delivered to your door.
            </p>
            <Link
              href="/delivery-policy"
              className="text-sm font-medium text-caramel hover:text-chocolate transition-colors"
            >
              View Delivery Areas →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
