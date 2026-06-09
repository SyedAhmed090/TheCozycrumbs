import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { getProductBySlug, getProducts, getProductsByCategory } from '@/lib/supabase/queries'

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
