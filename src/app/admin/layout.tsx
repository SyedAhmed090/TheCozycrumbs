import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-[68px] lg:pt-[88px]">
      <div className="bg-chocolate text-white px-4 sm:px-8 py-3 flex items-center justify-between text-sm">
        <Link href="/admin/orders" className="font-fraunces text-lg text-white hover:text-caramel transition-colors">
          The Cozy Crumb — Admin
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/orders" className="text-white/80 hover:text-white transition-colors">
            Orders
          </Link>
          <Link href="/" className="text-white/60 hover:text-white/80 transition-colors text-xs">
            ← Back to site
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">{children}</div>
    </div>
  )
}
