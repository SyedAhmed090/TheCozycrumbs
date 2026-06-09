import CakesHero from '@/components/cakes/CakesHero'
import CakeBuilder from '@/components/cakes/CakeBuilder'
import CakeGallery from '@/components/cakes/CakeGallery'
import CakeFAQ from '@/components/cakes/CakeFAQ'

export const metadata = {
  title: 'Custom Cakes — The Cozy Crumb',
  description: 'Design your perfect custom cake. Choose flavor, size, shape, frosting and more.',
}

export default function CakesPage() {
  return (
    <main>
      <CakesHero />
      <CakeBuilder />
      <CakeGallery />
      <CakeFAQ />
    </main>
  )
}
