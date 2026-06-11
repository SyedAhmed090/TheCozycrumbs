'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createCollection(formData: FormData) {
  const supabase = createAdminClient()

  const name = (formData.get('name') as string).trim()
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const description = (formData.get('description') as string | null)?.trim() ?? null
  const banner_image = (formData.get('banner_image') as string | null)?.trim() || null
  const is_active = formData.get('is_active') === 'true'
  const start_date = (formData.get('start_date') as string | null) || null
  const end_date = (formData.get('end_date') as string | null) || null

  const { error } = await supabase.from('seasonal_collections').insert({
    name,
    slug,
    description,
    banner_image,
    is_active,
    start_date,
    end_date,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = createAdminClient()

  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() ?? null
  const banner_image = (formData.get('banner_image') as string | null)?.trim() || null
  const is_active = formData.get('is_active') === 'true'
  const start_date = (formData.get('start_date') as string | null) || null
  const end_date = (formData.get('end_date') as string | null) || null

  const { error } = await supabase.from('seasonal_collections').update({
    name,
    description,
    banner_image,
    is_active,
    start_date,
    end_date,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}

export async function toggleCollection(id: string, currentValue: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('seasonal_collections')
    .update({ is_active: !currentValue })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
}

export async function deleteCollection(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('seasonal_collections').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}
