'use server'

import { createClient } from '@/lib/supabase/server'

export type DiscountResult =
  | { valid: true; code: string; type: 'percentage' | 'fixed'; value: number; description: string | null }
  | { valid: false; error: string }

export async function validateDiscount(code: string, orderSubtotal: number): Promise<DiscountResult> {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return { valid: false, error: 'Enter a discount code.' }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', trimmed)
      .eq('is_active', true)
      .single()

    if (error || !data) return { valid: false, error: 'Invalid or expired discount code.' }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'This discount code has expired.' }
    }
    if (data.max_uses != null && data.used_count >= data.max_uses) {
      return { valid: false, error: 'This discount code has reached its usage limit.' }
    }
    if (orderSubtotal < data.min_order_amount) {
      return { valid: false, error: `Minimum order of PKR ${data.min_order_amount.toLocaleString()} required.` }
    }

    return {
      valid: true,
      code: trimmed,
      type: data.discount_type as 'percentage' | 'fixed',
      value: data.discount_value,
      description: data.description,
    }
  } catch {
    return { valid: false, error: 'Could not validate discount code.' }
  }
}
