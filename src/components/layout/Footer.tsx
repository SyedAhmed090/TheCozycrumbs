import Link from 'next/link'
import { Camera, MessageCircle, Mail } from 'lucide-react'

const shopLinks = [
  { label: 'Cookies', href: '/shop/cookies' },
  { label: 'Brownies', href: '/shop/brownies' },
  { label: 'Cakes', href: '/shop/cakes' },
  { label: 'Cupcakes', href: '/shop/cupcakes' },
  { label: 'Breads', href: '/shop/breads' },
  { label: 'Pastries', href: '/shop/pastries' },
  { label: 'Gift Boxes', href: '/shop/gift-boxes' },
]

const informationLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Delivery Policy', href: '/delivery-policy' },
  { label: 'Contact', href: '/contact' },
]

const supportLinks = [
  { label: 'Order Help', href: '/order-help' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Returns', href: '/returns' },
]

const socialLinks = [
  { href: 'https://www.instagram.com/thecozycrumb180/', icon: Camera, label: 'Instagram' },
  { href: 'https://wa.me/923350253548', icon: MessageCircle, label: 'WhatsApp' },
  { href: 'mailto:hello@thecozycrumbs.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-chocolate px-4 sm:px-8 lg:px-20 pt-12 lg:pt-20 pb-8 lg:pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-14 mb-12 lg:mb-16">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <p className="font-fraunces text-2xl text-white mb-3">The Cozy Crumb</p>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Freshly baked happiness delivered to your door. Premium home bakery
            in Karachi crafting every treat with love and the finest ingredients.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 hover:border-caramel hover:bg-caramel/10 transition-all"
              >
                <Icon size={15} className="text-white/65" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[11px] font-semibold tracking-[1.5px] uppercase text-white/35 mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="text-[11px] font-semibold tracking-[1.5px] uppercase text-white/35 mb-5">Information</h4>
          <ul className="flex flex-col gap-3">
            {informationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-[11px] font-semibold tracking-[1.5px] uppercase text-white/35 mb-5">Support</h4>
          <ul className="flex flex-col gap-3">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-white/30">© 2026 The Cozy Crumb. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 border border-white/10 rounded text-xs text-white/45 font-medium">EasyPaisa</span>
          <span className="px-3 py-1.5 border border-white/10 rounded text-xs text-white/45 font-medium">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  )
}
