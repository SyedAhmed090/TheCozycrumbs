export type OrderInput = {
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  deliveryDate: string
  paymentMethod: 'easypaisa' | 'cod'
  notes: string
  discountCode?: string
  discountAmount?: number
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

export type ValidationError = { field: string; message: string }

export function sanitise(str: string): string {
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function validateOrderInput(input: OrderInput): ValidationError[] {
  const errors: ValidationError[] = []

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

  const phone = input.customerPhone.trim().replace(/\s/g, '')
  if (!phone) {
    errors.push({ field: 'customerPhone', message: 'Phone number is required' })
  } else if (!/^(\+92|0)3\d{9}$/.test(phone)) {
    errors.push({ field: 'customerPhone', message: 'Enter a valid Pakistani mobile number (e.g. 03XX XXXXXXX)' })
  }

  if (input.customerEmail) {
    const email = input.customerEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'customerEmail', message: 'Enter a valid email address' })
    }
  }

  const address = input.customerAddress.trim()
  if (!address) {
    errors.push({ field: 'customerAddress', message: 'Delivery address is required' })
  } else if (address.length < 10) {
    errors.push({ field: 'customerAddress', message: 'Please enter a more complete address' })
  } else if (address.length > 500) {
    errors.push({ field: 'customerAddress', message: 'Address must be under 500 characters' })
  }

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

  if (!['easypaisa', 'cod'].includes(input.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: 'Invalid payment method' })
  }

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
      if (item.customMessage && item.customMessage.length > 200) {
        errors.push({ field: 'items', message: 'Custom message must be under 200 characters' })
        break
      }
    }
  }

  if (typeof input.subtotal !== 'number' || isNaN(input.subtotal) || input.subtotal < 0) {
    errors.push({ field: 'subtotal', message: 'Invalid order total' })
  }

  if (input.notes && input.notes.trim().length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be under 500 characters' })
  }

  return errors
}
