import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { adminLogout } from './login/actions'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin/orders',      label: 'Orders' },
  { href: '/admin/analytics',   label: 'Analytics' },
  { href: '/admin/products',    label: 'Products' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/discounts',   label: 'Discounts' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/testimonials',label: 'Reviews' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-chocolate text-white px-4 sm:px-8 py-3 flex items-center justify-between text-sm overflow-x-auto">
        <Link href="/admin/orders" className="font-fraunces text-lg text-white hover:text-caramel transition-colors flex-shrink-0 mr-6">
          Cozy Crumb Admin
        </Link>
        <div className="flex items-center gap-4 flex-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-white/80 hover:text-white transition-colors whitespace-nowrap text-xs font-medium">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <Link href="/" className="text-white/50 hover:text-white/70 transition-colors text-xs whitespace-nowrap">
            ← Site
          </Link>
          <form action={adminLogout}>
            <button type="submit" className="text-white/60 hover:text-white transition-colors text-xs whitespace-nowrap">
              Log out
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">{children}</div>
    </div>
  )
}
