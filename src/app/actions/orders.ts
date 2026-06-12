'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmation, sendAdminOrderAlert } from '@/lib/email'
import { validateOrderInput, sanitise, type OrderInput } from '@/lib/validation/orders'

// order_items.product_id is a uuid FK; custom cakes and gift boxes use
// synthetic ids ('custom-cake', 'gift-box-6') that must not reach the column.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function submitOrder(
  input: OrderInput
): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  const errors = validateOrderInput(input)
  if (errors.length > 0) {
    return { success: false, error: errors[0].message }
  }

  // Service role: anon has no SELECT policy on orders (migration 003), which
  // would make insert().select() fail, and cannot update discount used_count.
  const supabase = createAdminClient()

  // Validate discount code server-side if provided
  let verifiedDiscountAmount = 0
  if (input.discountCode && input.discountAmount && input.discountAmount > 0) {
    const { data: discount } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', input.discountCode.toUpperCase())
      .eq('is_active', true)
      .single()

    const expired = discount?.expires_at && new Date(discount.expires_at).getTime() < Date.now()
    const usedUp = discount?.max_uses != null && (discount.used_count ?? 0) >= discount.max_uses
    const belowMin = discount != null && input.subtotal < (discount.min_order_amount ?? 0)

    if (discount && !expired && !usedUp && !belowMin) {
      if (discount.discount_type === 'percentage') {
        verifiedDiscountAmount = Math.round((input.subtotal * discount.discount_value) / 100)
      } else {
        verifiedDiscountAmount = discount.discount_value
      }
      verifiedDiscountAmount = Math.min(verifiedDiscountAmount, input.subtotal)
    }
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: sanitise(input.customerName),
      customer_phone: input.customerPhone.trim().replace(/\s/g, ''),
      customer_email: input.customerEmail?.trim().toLowerCase() || null,
      customer_address: sanitise(input.customerAddress),
      delivery_date: input.deliveryDate,
      payment_method: input.paymentMethod,
      notes: input.notes ? sanitise(input.notes) : null,
      subtotal: input.subtotal,
      discount_code: input.discountCode || null,
      discount_amount: verifiedDiscountAmount,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? 'Failed to create order' }
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: UUID_RE.test(item.productId) ? item.productId : null,
    product_name: sanitise(item.productName),
    quantity: item.quantity,
    variant: item.variant,
    custom_message: item.customMessage ? sanitise(item.customMessage) : null,
    reference_image_url: item.referenceImageUrl || null,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) {
    // Don't leave an orphan order behind if its items couldn't be saved
    await supabase.from('orders').delete().eq('id', order.id)
    return { success: false, error: itemsError.message }
  }

  // Increment discount code usage
  if (input.discountCode && verifiedDiscountAmount > 0) {
    const { data: dc } = await supabase
      .from('discount_codes')
      .select('used_count')
      .eq('code', input.discountCode.toUpperCase())
      .single()
    if (dc) {
      await supabase
        .from('discount_codes')
        .update({ used_count: (dc.used_count ?? 0) + 1 })
        .eq('code', input.discountCode.toUpperCase())
    }
  }

  // Send emails (non-blocking — don't fail the order if email fails)
  const emailItems = input.items.map((item) => ({
    productName: item.productName,
    quantity: item.quantity,
    price: item.price,
    variant: item.variant,
  }))

  await Promise.allSettled([
    input.customerEmail
      ? sendOrderConfirmation({
          id: order.id,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          deliveryDate: input.deliveryDate,
          paymentMethod: input.paymentMethod,
          subtotal: input.subtotal,
          discountAmount: verifiedDiscountAmount,
          items: emailItems,
        })
      : Promise.resolve(),
    sendAdminOrderAlert({
      id: order.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerAddress: input.customerAddress,
      deliveryDate: input.deliveryDate,
      paymentMethod: input.paymentMethod,
      subtotal: input.subtotal - verifiedDiscountAmount,
      notes: input.notes,
      items: emailItems,
    }),
  ])

  return { success: true, orderId: order.id }
}
