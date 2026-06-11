'use server'

import { createClient } from '@/lib/supabase/server'

export async function subscribeNewsletter(
  email: string,
  name?: string
): Promise<{ success: true } | { success: false; error: string }> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: trimmed, name: name?.trim() || null, is_active: true },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (error) return { success: false, error: 'Could not subscribe. Please try again.' }
    return { success: true }
  } catch {
    return { success: false, error: 'Could not subscribe. Please try again.' }
  }
}
