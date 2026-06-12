'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { sendStatusUpdate } from '@/lib/email'

const VALID_STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin()
  const status = formData.get('status') as string
  if (!VALID_STATUSES.includes(status)) {
    throw new Error('Invalid status')
  }

  const supabase = createAdminClient()

  // Fetch order before updating (to get customer email)
  const { data: order } = await supabase
    .from('orders')
    .select('customer_name, customer_email, delivery_date')
    .eq('id', orderId)
    .single()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw error

  // Send status email if customer provided one and status is notable
  if (order?.customer_email && ['confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
    // Must be awaited — serverless freezes the process once the action returns
    await sendStatusUpdate({
      id: orderId,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      status,
      deliveryDate: order.delivery_date,
    }).catch(() => {})
  }

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}
