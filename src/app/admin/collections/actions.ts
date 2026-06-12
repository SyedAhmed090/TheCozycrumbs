'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function createCollection(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const title = ((formData.get('title') as string) ?? '').trim()
  const subtitle = ((formData.get('subtitle') as string) ?? '').trim() || null
  const description = ((formData.get('description') as string) ?? '').trim()
  const image = ((formData.get('image') as string) ?? '').trim() || null
  const is_active = formData.get('is_active') === 'true'
  const end_date = (formData.get('end_date') as string | null) || null

  const { error } = await supabase.from('seasonal_collections').insert({
    title,
    subtitle,
    description,
    image,
    is_active,
    end_date,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}

export async function updateCollection(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const title = ((formData.get('title') as string) ?? '').trim()
  const subtitle = ((formData.get('subtitle') as string) ?? '').trim() || null
  const description = ((formData.get('description') as string) ?? '').trim()
  const image = ((formData.get('image') as string) ?? '').trim() || null
  const is_active = formData.get('is_active') === 'true'
  const end_date = (formData.get('end_date') as string | null) || null

  const { error } = await supabase.from('seasonal_collections').update({
    title,
    subtitle,
    description,
    image,
    is_active,
    end_date,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}

export async function toggleCollection(id: string, currentValue: boolean) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('seasonal_collections')
    .update({ is_active: !currentValue })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
}

export async function deleteCollection(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('seasonal_collections').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}
