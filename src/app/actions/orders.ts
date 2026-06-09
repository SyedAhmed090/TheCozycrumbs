'use server'

import { createClient } from '@/lib/supabase/server'

type OrderInput = {
  customerName: string
  customerPhone: string
  customerAddress: string
  deliveryDate: string
  paymentMethod: 'easypaisa' | 'cod'
  notes: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    variant: Record<string, string>
    customMessage: string
    referenceImageUrl: string
    price: number | null
  }>
  subtotal: number
}

export async function submitOrder(
  input: OrderInput
): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_address: input.customerAddress,
      delivery_date: input.deliveryDate,
      payment_method: input.paymentMethod,
      notes: input.notes,
      subtotal: input.subtotal,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? 'Failed to create order' }
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    variant: item.variant,
    custom_message: item.customMessage,
    reference_image_url: item.referenceImageUrl,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  return { success: true, orderId: order.id }
}
