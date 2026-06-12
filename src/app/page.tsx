import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import BestSellers from '@/components/home/BestSellers'
import StorySection from '@/components/home/StorySection'
import CategoryGrid from '@/components/home/CategoryGrid'
import CakeCustomization from '@/components/home/CakeCustomization'
import SeasonalBanner from '@/components/home/SeasonalBanner'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import Gallery from '@/components/home/Gallery'
import AboutSection from '@/components/home/AboutSection'
import Newsletter from '@/components/home/Newsletter'
import InstagramGrid from '@/components/home/InstagramGrid'
import { getFeaturedProducts, getActiveSeasonalCollection } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'The Cozy Crumbs | Freshly Baked Happiness',
  description:
    'Premium home bakery in Karachi. Fresh cookies, brownies, custom cakes, cupcakes, and personalised gift boxes — baked with love and delivered to your door.',
  openGraph: {
    title: 'The Cozy Crumbs | Freshly Baked Happiness',
    description: 'Premium home bakery in Karachi. Fresh cookies, brownies, custom cakes, and gift boxes baked with love.',
    images: [{ url: '/001.jpg', width: 1200, height: 630, alt: 'The Cozy Crumbs freshly baked treats' }],
  },
}

export default async function HomePage() {
  const [featuredProducts, seasonalCollection] = await Promise.all([
    getFeaturedProducts(6),
    getActiveSeasonalCollection(),
  ])

  return (
    <>
      <HeroSection />
      <BestSellers products={featuredProducts} />
      <StorySection />
      <CategoryGrid />
      <CakeCustomization />
      <SeasonalBanner collection={seasonalCollection} />
      <HowItWorks />
      <Testimonials />
      <Gallery />
      <AboutSection />
      <Newsletter />
      <InstagramGrid />
    </>
  )
}
