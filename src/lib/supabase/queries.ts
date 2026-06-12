import { createClient } from '@/lib/supabase/server'
import { DUMMY_PRODUCTS } from '@/lib/data/products'
import type { Product, SeasonalCollection } from '@/types'

function hasEnvVars(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/** Get all available products, optionally filtered by category and/or search query. */
export async function getProducts(category?: string, q?: string): Promise<Product[]> {
  function applyLocalFilters(products: Product[]) {
    let result = products.filter((p) => p.is_available)
    if (category) result = result.filter((p) => p.category === category)
    if (q) {
      const lower = q.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          (p.description?.toLowerCase().includes(lower) ?? false)
      )
    }
    return result
  }

  if (!hasEnvVars()) return applyLocalFilters(DUMMY_PRODUCTS)

  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)
    if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)

    const { data, error } = await query

    if (error) throw error
    if (!data || data.length === 0) return applyLocalFilters(DUMMY_PRODUCTS)
    return data as Product[]
  } catch {
    return applyLocalFilters(DUMMY_PRODUCTS)
  }
}

/** Get a single product by slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasEnvVars()) {
    return DUMMY_PRODUCTS.find((p) => p.slug === slug && p.is_available) ?? null
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_available', true)
      .single()

    if (error) throw error
    return (data as Product) ?? null
  } catch {
    return DUMMY_PRODUCTS.find((p) => p.slug === slug && p.is_available) ?? null
  }
}

/** Get featured products for the homepage. */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  if (!hasEnvVars()) {
    return DUMMY_PRODUCTS.filter((p) => p.is_featured && p.is_available).slice(0, limit)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .limit(limit)

    if (error) throw error
    return (data as Product[]) ?? []
  } catch {
    return DUMMY_PRODUCTS.filter((p) => p.is_featured && p.is_available).slice(0, limit)
  }
}

/** Get products by category, optionally excluding one slug (for related products). */
export async function getProductsByCategory(
  category: string,
  excludeSlug?: string,
  limit = 4
): Promise<Product[]> {
  if (!hasEnvVars()) {
    return DUMMY_PRODUCTS
      .filter(
        (p) =>
          p.category === category &&
          p.is_available &&
          (!excludeSlug || p.slug !== excludeSlug)
      )
      .slice(0, limit)
  }

  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .limit(limit)

    if (excludeSlug) {
      query = query.neq('slug', excludeSlug)
    }

    const { data, error } = await query

    if (error) throw error
    return (data as Product[]) ?? []
  } catch {
    return DUMMY_PRODUCTS
      .filter(
        (p) =>
          p.category === category &&
          p.is_available &&
          (!excludeSlug || p.slug !== excludeSlug)
      )
      .slice(0, limit)
  }
}

/** Get the currently active seasonal collection. */
export async function getActiveSeasonalCollection(): Promise<SeasonalCollection | null> {
  if (!hasEnvVars()) {
    return null
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seasonal_collections')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error
    return (data as SeasonalCollection) ?? null
  } catch {
    return null
  }
}
