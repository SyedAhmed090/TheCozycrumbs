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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BestSellers />
      <StorySection />
      <CategoryGrid />
      <CakeCustomization />
      <SeasonalBanner />
      <HowItWorks />
      <Testimonials />
      <Gallery />
      <AboutSection />
      <Newsletter />
    </>
  )
}
