import type { MetadataRoute } from 'next'
import { DUMMY_PRODUCTS } from '@/lib/data/products'
import { getProducts } from '@/lib/supabase/queries'

const BASE_URL = 'https://thecozycrumbs.com'

const STATIC_ROUTES = [
  { path: '/', changeFreq: 'weekly', priority: 1.0 },
  { path: '/shop', changeFreq: 'weekly', priority: 0.9 },
  { path: '/cakes', changeFreq: 'monthly', priority: 0.8 },
  { path: '/gift-box', changeFreq: 'monthly', priority: 0.8 },
  { path: '/about', changeFreq: 'monthly', priority: 0.6 },
  { path: '/contact', changeFreq: 'monthly', priority: 0.6 },
  { path: '/faqs', changeFreq: 'monthly', priority: 0.6 },
  { path: '/order-help', changeFreq: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFreq: 'yearly', priority: 0.3 },
  { path: '/terms', changeFreq: 'yearly', priority: 0.3 },
  { path: '/returns', changeFreq: 'yearly', priority: 0.4 },
  { path: '/delivery-policy', changeFreq: 'yearly', priority: 0.4 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productSlugs: string[] = []

  try {
    const products = await getProducts()
    productSlugs = products
      .filter((p) => !['custom-gift-box-4', 'custom-gift-box-6', 'custom-gift-box-12'].includes(p.slug))
      .map((p) => p.slug)
  } catch {
    productSlugs = DUMMY_PRODUCTS
      .filter((p) => p.is_available && !p.slug.startsWith('custom-gift-box'))
      .map((p) => p.slug)
  }

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }))

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
