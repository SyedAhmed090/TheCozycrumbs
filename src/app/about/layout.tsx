import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about The Cozy Crumb — a home bakery in Karachi built on a love for baking and a belief that every bite should bring a little joy.',
  openGraph: {
    title: 'About Us | The Cozy Crumb',
    description: 'A home bakery in Karachi built on love, fresh ingredients, and a belief that every bite should bring a little joy.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
