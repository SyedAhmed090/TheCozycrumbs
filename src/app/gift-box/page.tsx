import type { Metadata } from 'next'
import GiftBoxBuilder from '@/components/gift-box/GiftBoxBuilder'

export const metadata: Metadata = {
  title: 'Build a Gift Box | The Cozy Crumb',
  description:
    'Mix and match your favourite brownies, cookies, and treats to build a personalised gift box. Choose a 4, 6, or 12-pack and fill every slot.',
}

export default function GiftBoxPage() {
  return <GiftBoxBuilder />
}
