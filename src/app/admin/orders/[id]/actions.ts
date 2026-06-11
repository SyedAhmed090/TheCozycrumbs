'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = formData.get('status') as string
  if (!VALID_STATUSES.includes(status)) {
    throw new Error('Invalid status')
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw error

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}
