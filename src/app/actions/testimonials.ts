'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitTestimonial(input: {
  name: string
  review: string
  rating: number
  location?: string
}): Promise<{ success: true } | { success: false; error: string }> {
  const name = input.name.trim()
  const review = input.review.trim()

  if (!name || name.length < 2) return { success: false, error: 'Name is required.' }
  if (!review || review.length < 20) return { success: false, error: 'Review must be at least 20 characters.' }
  if (input.rating < 1 || input.rating > 5) return { success: false, error: 'Rating must be 1–5.' }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('testimonials').insert({
      name: name.slice(0, 100),
      review: review.slice(0, 1000),
      rating: input.rating,
      location: input.location?.trim().slice(0, 100) || null,
      is_featured: false,
      is_pending: true,
    })
    if (error) return { success: false, error: 'Could not submit review. Please try again.' }
    return { success: true }
  } catch {
    return { success: false, error: 'Could not submit review. Please try again.' }
  }
}
