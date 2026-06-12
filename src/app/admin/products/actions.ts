'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseFormData(formData: FormData) {
  const name = ((formData.get('name') as string) ?? '').trim()
  const description = ((formData.get('description') as string) ?? '').trim()
  const category = (formData.get('category') as string) ?? ''
  const base_price_raw = (formData.get('base_price') as string) ?? ''
  const base_price = base_price_raw ? parseFloat(base_price_raw) : null
  const stock_raw = (formData.get('stock_quantity') as string) ?? ''
  const stock_quantity = stock_raw ? parseInt(stock_raw) : null
  const is_available = formData.get('is_available') === 'true'
  const is_featured = formData.get('is_featured') === 'on'
  const images = (formData.getAll('images') as string[]).filter(Boolean)
  return { name, description, category, base_price, stock_quantity, is_available, is_featured, images }
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const { name, ...rest } = parseFormData(formData)
  const slug = slugify(name)
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').insert({ name, slug, ...rest })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()
  let dbError: string | null = null

  try {
    const { name, ...rest } = parseFormData(formData)
    const supabase = createAdminClient()
    const { error } = await supabase.from('products').update({ name, ...rest }).eq('id', id)
    if (error) dbError = error.message
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  if (dbError) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent(dbError)}`)
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  redirect('/admin/products')
}

export async function toggleProductAvailability(id: string, currentValue: boolean) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').update({ is_available: !currentValue }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
  redirect('/admin/products')
}
