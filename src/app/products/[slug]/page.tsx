import { notFound } from 'next/navigation'
import { DUMMY_PRODUCTS } from '@/lib/data/products'
import ProductDetail from '@/components/product/ProductDetail'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = DUMMY_PRODUCTS.find((p) => p.slug === slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

export async function generateStaticParams() {
  return DUMMY_PRODUCTS.map((p) => ({ slug: p.slug }))
}
