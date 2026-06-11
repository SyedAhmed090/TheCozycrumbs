import { describe, it, expect } from 'vitest'
import { validateOrderInput, sanitise, type OrderInput } from '@/lib/validation/orders'

const FUTURE_DATE = '2030-01-15'

function baseInput(overrides: Partial<OrderInput> = {}): OrderInput {
  return {
    customerName: 'Sara Ahmed',
    customerPhone: '03001234567',
    customerAddress: '123 Main Street, DHA Phase 5, Karachi',
    deliveryDate: FUTURE_DATE,
    paymentMethod: 'cod',
    notes: '',
    subtotal: 1200,
    items: [
      {
        productId: 'prod-1',
        productName: 'Chocolate Brownie',
        quantity: 2,
        variant: {},
        customMessage: '',
        referenceImageUrl: '',
        price: 600,
      },
    ],
    ...overrides,
  }
}

// ─── sanitise ──────────────────────────────────────────────────────────────

describe('sanitise', () => {
  it('trims whitespace', () => {
    expect(sanitise('  hello  ')).toBe('hello')
  })

  it('escapes < and >', () => {
    expect(sanitise('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('leaves safe strings unchanged', () => {
    expect(sanitise('Sara Ahmed')).toBe('Sara Ahmed')
  })
})

// ─── validateOrderInput ────────────────────────────────────────────────────

describe('validateOrderInput — valid input', () => {
  it('returns no errors for a complete valid order', () => {
    expect(validateOrderInput(baseInput())).toEqual([])
  })

  it('accepts +92 phone format', () => {
    expect(validateOrderInput(baseInput({ customerPhone: '+923001234567' }))).toEqual([])
  })

  it('accepts optional email when valid', () => {
    expect(validateOrderInput(baseInput({ customerEmail: 'sara@example.com' }))).toEqual([])
  })

  it('accepts no email (optional field)', () => {
    expect(validateOrderInput(baseInput({ customerEmail: undefined }))).toEqual([])
  })
})

describe('validateOrderInput — customerName', () => {
  it('rejects empty name', () => {
    const [err] = validateOrderInput(baseInput({ customerName: '' }))
    expect(err.field).toBe('customerName')
  })

  it('rejects name shorter than 2 chars', () => {
    const [err] = validateOrderInput(baseInput({ customerName: 'A' }))
    expect(err.field).toBe('customerName')
  })

  it('rejects name longer than 100 chars', () => {
    const [err] = validateOrderInput(baseInput({ customerName: 'A'.repeat(101) }))
    expect(err.field).toBe('customerName')
  })

  it('rejects name containing HTML tags', () => {
    const [err] = validateOrderInput(baseInput({ customerName: '<b>Sara</b>' }))
    expect(err.field).toBe('customerName')
  })
})

describe('validateOrderInput — customerPhone', () => {
  it('rejects empty phone', () => {
    const [err] = validateOrderInput(baseInput({ customerPhone: '' }))
    expect(err.field).toBe('customerPhone')
  })

  it('rejects non-Pakistani numbers', () => {
    const [err] = validateOrderInput(baseInput({ customerPhone: '01234567890' }))
    expect(err.field).toBe('customerPhone')
  })

  it('rejects too-short Pakistani number', () => {
    const [err] = validateOrderInput(baseInput({ customerPhone: '0300123' }))
    expect(err.field).toBe('customerPhone')
  })
})

describe('validateOrderInput — customerEmail', () => {
  it('rejects malformed email', () => {
    const [err] = validateOrderInput(baseInput({ customerEmail: 'not-an-email' }))
    expect(err.field).toBe('customerEmail')
  })

  it('rejects email missing @', () => {
    const [err] = validateOrderInput(baseInput({ customerEmail: 'saraexample.com' }))
    expect(err.field).toBe('customerEmail')
  })
})

describe('validateOrderInput — customerAddress', () => {
  it('rejects empty address', () => {
    const [err] = validateOrderInput(baseInput({ customerAddress: '' }))
    expect(err.field).toBe('customerAddress')
  })

  it('rejects address shorter than 10 chars', () => {
    const [err] = validateOrderInput(baseInput({ customerAddress: 'Short' }))
    expect(err.field).toBe('customerAddress')
  })

  it('rejects address longer than 500 chars', () => {
    const [err] = validateOrderInput(baseInput({ customerAddress: 'A'.repeat(501) }))
    expect(err.field).toBe('customerAddress')
  })
})

describe('validateOrderInput — deliveryDate', () => {
  it('rejects empty date', () => {
    const [err] = validateOrderInput(baseInput({ deliveryDate: '' }))
    expect(err.field).toBe('deliveryDate')
  })

  it('rejects past date', () => {
    const [err] = validateOrderInput(baseInput({ deliveryDate: '2020-01-01' }))
    expect(err.field).toBe('deliveryDate')
    expect(err.message).toMatch(/past/)
  })

  it('rejects invalid date string', () => {
    const [err] = validateOrderInput(baseInput({ deliveryDate: 'not-a-date' }))
    expect(err.field).toBe('deliveryDate')
  })
})

describe('validateOrderInput — paymentMethod', () => {
  it('rejects unknown payment method', () => {
    const [err] = validateOrderInput(baseInput({ paymentMethod: 'bitcoin' as 'cod' }))
    expect(err.field).toBe('paymentMethod')
  })

  it('accepts easypaisa', () => {
    expect(validateOrderInput(baseInput({ paymentMethod: 'easypaisa' }))).toEqual([])
  })
})

describe('validateOrderInput — items', () => {
  it('rejects empty cart', () => {
    const [err] = validateOrderInput(baseInput({ items: [] }))
    expect(err.field).toBe('items')
    expect(err.message).toMatch(/empty/)
  })

  it('rejects item with quantity 0', () => {
    const [err] = validateOrderInput(
      baseInput({ items: [{ productId: 'p1', productName: 'Cookie', quantity: 0, variant: {}, customMessage: '', referenceImageUrl: '', price: 100 }] })
    )
    expect(err.field).toBe('items')
  })

  it('rejects item with custom message over 200 chars', () => {
    const [err] = validateOrderInput(
      baseInput({ items: [{ productId: 'p1', productName: 'Cookie', quantity: 1, variant: {}, customMessage: 'A'.repeat(201), referenceImageUrl: '', price: 100 }] })
    )
    expect(err.field).toBe('items')
  })
})

describe('validateOrderInput — subtotal', () => {
  it('rejects negative subtotal', () => {
    const [err] = validateOrderInput(baseInput({ subtotal: -1 }))
    expect(err.field).toBe('subtotal')
  })

  it('rejects non-numeric subtotal', () => {
    const [err] = validateOrderInput(baseInput({ subtotal: NaN }))
    expect(err.field).toBe('subtotal')
  })
})

describe('validateOrderInput — notes', () => {
  it('rejects notes over 500 chars', () => {
    const [err] = validateOrderInput(baseInput({ notes: 'A'.repeat(501) }))
    expect(err.field).toBe('notes')
  })
})
