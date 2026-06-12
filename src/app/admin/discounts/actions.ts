'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function createDiscount(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const code = (formData.get('code') as string).trim().toUpperCase()
  const description = (formData.get('description') as string | null)?.trim() ?? null
  const discount_type = formData.get('discount_type') as 'percentage' | 'fixed'
  const discount_value = parseFloat(formData.get('discount_value') as string)
  const min_order_raw = formData.get('min_order_amount') as string
  // Column is NOT NULL with default 0 — an explicit null bypasses the default
  const min_order_amount = min_order_raw ? parseFloat(min_order_raw) : 0
  const max_uses_raw = formData.get('max_uses') as string
  const max_uses = max_uses_raw ? parseInt(max_uses_raw) : null
  const expires_at = (formData.get('expires_at') as string | null) || null
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase.from('discount_codes').insert({
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    is_active,
    expires_at,
    used_count: 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/discounts')
  redirect('/admin/discounts')
}

export async function toggleDiscount(id: string, currentValue: boolean) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('discount_codes').update({ is_active: !currentValue }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/discounts')
}

export async function deleteDiscount(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from('discount_codes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/discounts')
  redirect('/admin/discounts')
}
