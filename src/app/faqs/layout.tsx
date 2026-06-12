import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Got questions about ordering, delivery, custom cakes, or gift boxes? Find all the answers in our frequently asked questions.',
  openGraph: {
    title: 'FAQs | The Cozy Crumbs',
    description: 'Find answers to common questions about ordering, delivery, custom cakes, and gift boxes from The Cozy Crumbs.',
  },
}

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
