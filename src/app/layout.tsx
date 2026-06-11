import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thecozycrumbs.com'),
  title: {
    default: 'The Cozy Crumb | Freshly Baked Happiness',
    template: '%s | The Cozy Crumb',
  },
  description:
    'The Cozy Crumb is a premium home bakery in Karachi crafting fresh cookies, brownies, cakes, cupcakes, and gift boxes made with love.',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://thecozycrumbs.com',
    siteName: 'The Cozy Crumb',
    title: 'The Cozy Crumb | Freshly Baked Happiness',
    description:
      'A premium home bakery in Karachi crafting fresh cookies, brownies, cakes, cupcakes, and gift boxes made with love.',
    images: [{ url: '/001.jpg', width: 1200, height: 630, alt: 'The Cozy Crumb bakery treats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Cozy Crumb | Freshly Baked Happiness',
    description: 'A premium home bakery in Karachi crafting fresh cookies, brownies, cakes, and gift boxes.',
    images: ['/001.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
