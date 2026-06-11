export type Category =
  | 'cookies'
  | 'brownies'
  | 'cakes'
  | 'cupcakes'
  | 'breads'
  | 'pastries'
  | 'gift-boxes'
  | 'savory'

export type ProductVariant = {
  flavor?: string
  weight?: string
  shape?: string
  frosting?: string
  box_contents?: string
}

export type BoxSize = 4 | 6 | 12

export type GiftBoxItem = {
  id: string
  name: string
  category: Category
  unit_price: number
  emoji: string
  description: string
  color: string
  lightText: boolean
}

export type FilledSlot = {
  slotId: string
  itemId: string
  name: string
  unit_price: number
  emoji: string
  color: string
  lightText: boolean
  category: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  category: Category
  base_price: number | null
  images: string[]
  is_available: boolean
  is_featured: boolean
  created_at: string
}

export type CartItem = {
  cartId: string
  product: Product
  quantity: number
  variant: ProductVariant
  custom_message?: string
  reference_image_url?: string
  price: number | null
  is_gift_box?: boolean
  box_size?: BoxSize
  box_contents?: FilledSlot[]
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'easypaisa' | 'cod'

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  variant: ProductVariant
  custom_message: string | null
  reference_image_url: string | null
  price: number | null
}

export type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  items: OrderItem[]
  subtotal: number | null
  status: OrderStatus
  delivery_date: string
  payment_method: PaymentMethod
  notes: string | null
  created_at: string
}

export type Testimonial = {
  id: string
  name: string
  location: string
  review: string
  rating: number
  is_featured: boolean
  created_at: string
}

export type GalleryItem = {
  id: string
  image_url: string
  caption: string | null
  category: string | null
  sort_order: number
}

export type SeasonalCollection = {
  id: string
  title: string
  subtitle: string | null
  description: string
  cta_label: string
  cta_href: string
  image: string | null
  is_active: boolean
  end_date: string | null
}
