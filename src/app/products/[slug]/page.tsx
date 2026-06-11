import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getProductBySlug, getProducts, getProductsByCategory } from '@/lib/supabase/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description ?? `Order ${product.name} from The Cozy Crumb — freshly baked and delivered to your door in Karachi.`,
    openGraph: {
      title: product.name,
      description: product.description ?? `Order ${product.name} from The Cozy Crumb.`,
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getProductsByCategory(product.category, slug, 4)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}
