'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ShoppingBag, Clock, MapPin, CreditCard } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { DUMMY_PRODUCTS } from '@/lib/data/products'
import RelatedProducts from './RelatedProducts'
import type { Product, ProductVariant } from '@/types'

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; light: boolean }> = {
  cookies:     { from: '#E8C4A4', to: '#D4A07A', light: false },
  brownies:    { from: '#6B3A2A', to: '#4A2818', light: true  },
  cakes:       { from: '#F0D4B8', to: '#E0BF9A', light: false },
  cupcakes:    { from: '#D97A52', to: '#BF6038', light: true  },
  breads:      { from: '#C49060', to: '#A87840', light: true  },
  pastries:    { from: '#DCBCA0', to: '#C8A480', light: false },
  'gift-boxes':{ from: '#C89B6D', to: '#B08958', light: false },
}

const FLAVOR_OPTIONS   = ['Vanilla', 'Chocolate', 'Red Velvet', 'Lemon', 'Carrot', 'Strawberry']
const SHAPE_OPTIONS    = ['Round', 'Square', 'Heart', 'Tiered']
const FROSTING_OPTIONS = ['Cream Cheese', 'Buttercream', 'Chocolate Ganache', 'Whipped Cream', 'No Frosting']

const WEIGHT_OPTIONS: Record<string, string[]> = {
  cakes:       ['500g', '1kg', '1.5kg', '2kg'],
  cupcakes:    ['500g', '1kg', '1.5kg', '2kg'],
  cookies:     ['250g', '500g', '1kg'],
  brownies:    ['250g', '500g', '1kg'],
  pastries:    ['250g', '500g', '1kg'],
  breads:      ['400g', '800g'],
  'gift-boxes':['Small', 'Medium', 'Large'],
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function categoryLabel(category: string): string {
  return category.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface VariantSelectorProps {
  label: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
}

function VariantSelector({ label, options, selected, onSelect }: VariantSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-ink mb-3">{label} *</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={
              selected === opt
                ? 'px-4 py-2 rounded-full text-sm font-medium bg-chocolate text-white border border-chocolate'
                : 'px-4 py-2 rounded-full text-sm font-medium border border-edge text-ink hover:border-chocolate transition-all'
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, openDrawer } = useCartStore()

  const gradient = CATEGORY_GRADIENTS[product.category] ?? CATEGORY_GRADIENTS.cookies
  const cat = product.category
  const showFlavor   = ['cakes', 'cupcakes', 'cookies', 'brownies', 'pastries'].includes(cat)
  const showWeight   = Object.keys(WEIGHT_OPTIONS).includes(cat)
  const showShape    = ['cakes', 'cupcakes'].includes(cat)
  const showFrosting = ['cakes', 'cupcakes'].includes(cat)

  const [flavor,   setFlavor]   = useState('')
  const [weight,   setWeight]   = useState('')
  const [shape,    setShape]    = useState('')
  const [frosting, setFrosting] = useState('')
  const [message,  setMessage]  = useState('')
  const [date,     setDate]     = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error,    setError]    = useState('')

  const relatedProducts = DUMMY_PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAddToCart() {
    if (showFlavor && !flavor) {
      setError('Please select a flavor.')
      return
    }
    if (showWeight && !weight) {
      setError('Please select a weight.')
      return
    }
    if (showShape && !shape) {
      setError('Please select a shape.')
      return
    }
    if (showFrosting && !frosting) {
      setError('Please select a frosting.')
      return
    }
    if (!date) {
      setError('Please select a delivery date.')
      return
    }

    setError('')

    const variant: ProductVariant = {}
    if (showFlavor)   variant.flavor   = flavor
    if (showWeight)   variant.weight   = weight
    if (showShape)    variant.shape    = shape
    if (showFrosting) variant.frosting = frosting

    addItem({
      product,
      quantity,
      variant,
      custom_message: message || undefined,
      price: product.base_price,
    })
    openDrawer()
  }

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <nav className="px-20 pt-8 pb-0 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-chocolate transition-colors">Home</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link href="/shop" className="hover:text-chocolate transition-colors">Shop</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link
          href={`/shop/${product.category}`}
          className="hover:text-chocolate transition-colors capitalize"
        >
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-ink font-medium truncate">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-16 px-20 py-10 items-start">

        {/* Left — Image area */}
        <div>
          <div
            className="h-[520px] rounded-[28px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
          >
            <span
              className="font-fraunces italic text-2xl"
              style={{ color: gradient.light ? 'rgba(255,255,255,0.4)' : 'rgba(90,62,43,0.35)' }}
            >
              {product.name}
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[100px] h-[100px] rounded-xl cursor-pointer border-2 border-transparent hover:border-chocolate transition-all flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
              />
            ))}
          </div>
        </div>

        {/* Right — Product info */}
        <div>
          {/* Header */}
          <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-caramel mb-3">
            {categoryLabel(product.category)}
          </p>
          <h1 className="font-fraunces text-[44px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1] mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-caramel text-base">★★★★★</span>
            <span className="text-sm text-muted">(12 reviews)</span>
          </div>
          <p className="font-fraunces text-[28px] text-chocolate mt-3">
            {product.base_price ? `PKR ${product.base_price.toLocaleString()}` : 'Price on request'}
          </p>
          <p className="text-[16px] text-muted leading-[1.8] mt-4 mb-8 border-t border-edge pt-8">
            {product.description}
          </p>

          {/* Variant selectors */}
          {showFlavor && (
            <VariantSelector
              label="Flavor"
              options={FLAVOR_OPTIONS}
              selected={flavor}
              onSelect={setFlavor}
            />
          )}
          {showWeight && (
            <VariantSelector
              label="Weight"
              options={WEIGHT_OPTIONS[cat] ?? []}
              selected={weight}
              onSelect={setWeight}
            />
          )}
          {showShape && (
            <VariantSelector
              label="Shape"
              options={SHAPE_OPTIONS}
              selected={shape}
              onSelect={setShape}
            />
          )}
          {showFrosting && (
            <VariantSelector
              label="Frosting"
              options={FROSTING_OPTIONS}
              selected={frosting}
              onSelect={setFrosting}
            />
          )}

          {/* Custom message */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-3">
              Custom Message <span className="font-normal text-muted">(Optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g. Happy Birthday Aisha! ♥"
              className="w-full border border-edge rounded-2xl px-4 py-3 text-sm text-ink resize-none focus:border-caramel outline-none h-20 bg-white"
            />
          </div>

          {/* Delivery date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-1">
              Select Delivery Date *
            </label>
            <p className="text-xs text-muted mb-3">
              Same day orders before 12pm · Next day orders before 9pm
            </p>
            <input
              type="date"
              min={getToday()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-edge rounded-2xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white"
            />
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-ink mb-3">Quantity</label>
            <div className="flex items-center gap-4 border border-edge rounded-full px-2 py-1 w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-chocolate hover:bg-beige transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold text-ink">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-chocolate hover:bg-beige transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-chocolate text-white rounded-full py-4 font-semibold text-base hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-3"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>

          {error && (
            <p className="text-terracotta text-sm mt-2">{error}</p>
          )}

          {/* Trust badges */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-edge">
            <div className="flex items-center gap-2 text-xs text-muted font-medium">
              <Clock size={14} className="text-caramel flex-shrink-0" />
              Made Fresh To Order
            </div>
            <div className="flex items-center gap-2 text-xs text-muted font-medium">
              <MapPin size={14} className="text-caramel flex-shrink-0" />
              Karachi Delivery
            </div>
            <div className="flex items-center gap-2 text-xs text-muted font-medium">
              <CreditCard size={14} className="text-caramel flex-shrink-0" />
              EasyPaisa &amp; COD
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
