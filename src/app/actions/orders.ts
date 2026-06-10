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

type ValidationError = { field: string; message: string }

function validateOrderInput(input: OrderInput): ValidationError[] {
  const errors: ValidationError[] = []

  // Name: required, 2–100 chars, no HTML
  const name = input.customerName.trim()
  if (!name) {
    errors.push({ field: 'customerName', message: 'Full name is required' })
  } else if (name.length < 2) {
    errors.push({ field: 'customerName', message: 'Name must be at least 2 characters' })
  } else if (name.length > 100) {
    errors.push({ field: 'customerName', message: 'Name must be under 100 characters' })
  } else if (/<[^>]*>/.test(name)) {
    errors.push({ field: 'customerName', message: 'Name contains invalid characters' })
  }

  // Phone: required, Pakistani mobile format (03XXXXXXXXX or +923XXXXXXXXX)
  const phone = input.customerPhone.trim().replace(/\s/g, '')
  if (!phone) {
    errors.push({ field: 'customerPhone', message: 'Phone number is required' })
  } else if (!/^(\+92|0)3\d{9}$/.test(phone)) {
    errors.push({ field: 'customerPhone', message: 'Enter a valid Pakistani mobile number (e.g. 03XX XXXXXXX)' })
  }

  // Address: required, 10–500 chars
  const address = input.customerAddress.trim()
  if (!address) {
    errors.push({ field: 'customerAddress', message: 'Delivery address is required' })
  } else if (address.length < 10) {
    errors.push({ field: 'customerAddress', message: 'Please enter a more complete address' })
  } else if (address.length > 500) {
    errors.push({ field: 'customerAddress', message: 'Address must be under 500 characters' })
  }

  // Delivery date: required, must not be in the past
  if (!input.deliveryDate) {
    errors.push({ field: 'deliveryDate', message: 'Delivery date is required' })
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const chosen = new Date(input.deliveryDate + 'T00:00:00')
    if (isNaN(chosen.getTime())) {
      errors.push({ field: 'deliveryDate', message: 'Invalid delivery date' })
    } else if (chosen < today) {
      errors.push({ field: 'deliveryDate', message: 'Delivery date cannot be in the past' })
    }
  }

  // Payment method
  if (!['easypaisa', 'cod'].includes(input.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: 'Invalid payment method' })
  }

  // Items: at least one
  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push({ field: 'items', message: 'Your cart is empty' })
  } else {
    for (const item of input.items) {
      if (!item.productId || !item.productName) {
        errors.push({ field: 'items', message: 'Invalid item in cart' })
        break
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        errors.push({ field: 'items', message: 'Invalid item quantity' })
        break
      }
      // Sanitise free-text fields
      if (item.customMessage && item.customMessage.length > 200) {
        errors.push({ field: 'items', message: 'Custom message must be under 200 characters' })
        break
      }
    }
  }

  // Subtotal: non-negative
  if (typeof input.subtotal !== 'number' || input.subtotal < 0) {
    errors.push({ field: 'subtotal', message: 'Invalid order total' })
  }

  // Notes: max 500 chars
  if (input.notes && input.notes.trim().length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be under 500 characters' })
  }

  return errors
}

function sanitise(str: string): string {
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function submitOrder(
  input: OrderInput
): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  // Server-side validation
  const errors = validateOrderInput(input)
  if (errors.length > 0) {
    return { success: false, error: errors[0].message }
  }

  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: sanitise(input.customerName),
      customer_phone: input.customerPhone.trim().replace(/\s/g, ''),
      customer_address: sanitise(input.customerAddress),
      delivery_date: input.deliveryDate,
      payment_method: input.paymentMethod,
      notes: input.notes ? sanitise(input.notes) : null,
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
    product_name: sanitise(item.productName),
    quantity: item.quantity,
    variant: item.variant,
    custom_message: item.customMessage ? sanitise(item.customMessage) : null,
    reference_image_url: item.referenceImageUrl || null,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  return { success: true, orderId: order.id }
}
