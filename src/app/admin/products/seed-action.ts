'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const SEED_PRODUCTS = [
  // CAKES
  { id: '11111111-0003-0000-0000-000000000001', name: 'Pound Cake', slug: 'pound-cake', description: 'A classic butter pound cake made with real butter, eggs, and vanilla. Dense, moist, and perfectly golden — a timeless treat that pairs beautifully with a cup of chai.', category: 'cakes', base_price: 400, is_available: true, is_featured: false, sort_order: 10 },
  { id: '11111111-0003-0000-0000-000000000002', name: 'Marble Cake', slug: 'marble-cake', description: 'A beautifully swirled combination of vanilla and chocolate sponge, lightly sweetened and perfectly moist. A home-baked favourite that is hard to resist at any time of day.', category: 'cakes', base_price: 400, is_available: true, is_featured: false, sort_order: 20 },
  { id: '11111111-0003-0000-0000-000000000003', name: 'Cozy Special Three Milk Cake – 500g', slug: 'cozy-special-tres-leches-500g', description: 'Our signature tres leches — a light sponge soaked in three kinds of milk until impossibly moist, topped with fresh whipped cream. The cake Karachi talks about. 500g.', category: 'cakes', base_price: 800, is_available: true, is_featured: true, sort_order: 30 },
  { id: '11111111-0003-0000-0000-000000000004', name: 'Cozy Special Three Milk Cake – 1kg', slug: 'cozy-special-tres-leches-1kg', description: 'Our signature tres leches in a generous 1kg portion. Perfect for family gatherings and celebrations. Feeds 8–10.', category: 'cakes', base_price: 1500, is_available: true, is_featured: false, sort_order: 40 },
  { id: '11111111-0003-0000-0000-000000000005', name: 'Three Milk Cake Box – 500g', slug: 'tres-leches-box-500g', description: 'Individual tres leches portions in presentation-ready gift packaging. The same beloved recipe, beautifully boxed. 500g.', category: 'cakes', base_price: 650, is_available: true, is_featured: false, sort_order: 50 },
  { id: '11111111-0003-0000-0000-000000000006', name: 'Three Milk Cake Box – 1kg', slug: 'tres-leches-box-1kg', description: 'A 1kg tres leches in elegant gift packaging — perfect for Eid, birthdays, and every celebration worth celebrating. 1kg.', category: 'cakes', base_price: 1100, is_available: true, is_featured: false, sort_order: 60 },
  // BROWNIES
  { id: '11111111-0002-0000-0000-000000000001', name: 'Classic Fudge Brownies – 6 Pieces', slug: 'classic-fudge-brownies-6pc', description: 'Pure, unadulterated fudge brownie — dense, crackle-topped, and deeply chocolatey. Six perfect squares of everything a brownie should be.', category: 'brownies', base_price: 500, is_available: true, is_featured: true, sort_order: 10 },
  { id: '11111111-0002-0000-0000-000000000002', name: 'Classic Fudge Brownies – 12 Pieces', slug: 'classic-fudge-brownies-12pc', description: 'A full dozen of our signature fudge brownies — dense, crackle-topped, and deeply chocolatey. Perfect for sharing, though you might not want to.', category: 'brownies', base_price: 1000, is_available: true, is_featured: false, sort_order: 20 },
  { id: '11111111-0002-0000-0000-000000000003', name: 'Chocolate Chunk Brownies – 6 Pieces', slug: 'chocolate-chunk-brownies-6pc', description: 'Our fudge brownie base studded with generous pockets of melted chocolate chunks that pool in every bite. Rich, gooey, and completely irresistible. 6 pieces.', category: 'brownies', base_price: 700, is_available: true, is_featured: true, sort_order: 30 },
  { id: '11111111-0002-0000-0000-000000000004', name: 'Chocolate Chunk Brownies – 12 Pieces', slug: 'chocolate-chunk-brownies-12pc', description: 'A full dozen chocolate chunk brownies — pools of melted chocolate in every bite. 12 pieces.', category: 'brownies', base_price: 1200, is_available: true, is_featured: false, sort_order: 40 },
  { id: '11111111-0002-0000-0000-000000000005', name: 'Salted Caramel Brownies – 6 Pieces', slug: 'salted-caramel-brownies-6pc', description: 'Ribbons of house-made caramel swirled through a fudgy brownie base, finished with a pinch of salt. The sweet-salty contrast is impossible to stop eating. 6 pieces.', category: 'brownies', base_price: 700, is_available: true, is_featured: true, sort_order: 50 },
  { id: '11111111-0002-0000-0000-000000000006', name: 'Salted Caramel Brownies – 12 Pieces', slug: 'salted-caramel-brownies-12pc', description: 'Twelve salted caramel brownies — the sweet-salty combination everyone keeps requesting. Caramel ribboned through a fudgy base, finished with a pinch of salt.', category: 'brownies', base_price: 1200, is_available: true, is_featured: false, sort_order: 60 },
  { id: '11111111-0002-0000-0000-000000000007', name: 'Oreo Madness Brownies – 6 Pieces', slug: 'oreo-madness-brownies-6pc', description: 'A chocolatey brownie base loaded with crushed Oreos baked right in, with whole ones pressed on top. 6 pieces.', category: 'brownies', base_price: 700, is_available: true, is_featured: false, sort_order: 70 },
  { id: '11111111-0002-0000-0000-000000000008', name: 'Oreo Madness Brownies – 12 Pieces', slug: 'oreo-madness-brownies-12pc', description: 'Twelve Oreo madness brownies — crushed Oreos baked into every square with whole ones on top. 12 pieces.', category: 'brownies', base_price: 1200, is_available: true, is_featured: false, sort_order: 80 },
  { id: '11111111-0002-0000-0000-000000000009', name: 'Chocolate Chip Brownies – 6 Pieces', slug: 'chocolate-chip-brownies-6pc', description: 'A fudge brownie base loaded with chocolate chips throughout, giving you pockets of melted chocolate in every square. 6 pieces.', category: 'brownies', base_price: 700, is_available: true, is_featured: false, sort_order: 90 },
  { id: '11111111-0002-0000-0000-000000000010', name: 'Chocolate Chip Brownies – 12 Pieces', slug: 'chocolate-chip-brownies-12pc', description: 'A full dozen chocolate chip brownies — pockets of melted chocolate chips in every bite. 12 pieces.', category: 'brownies', base_price: 1200, is_available: true, is_featured: false, sort_order: 100 },
  // BREADS
  { id: '11111111-0005-0000-0000-000000000001', name: 'Chicken Bread – Classic Creamy Filling', slug: 'chicken-bread-classic-creamy', description: 'A soft, golden bread loaf stuffed generously with a creamy chicken filling — the kind of savoury bake that disappears before it even cools down. Classic and crowd-pleasing.', category: 'breads', base_price: 500, is_available: true, is_featured: true, sort_order: 10 },
  { id: '11111111-0005-0000-0000-000000000002', name: 'Chicken Bread – Spicy Tikka Filling', slug: 'chicken-bread-spicy-tikka', description: 'A soft, golden bread loaf packed with a bold, spicy chicken tikka filling. All the comfort of chicken bread, turned up a notch.', category: 'breads', base_price: 500, is_available: true, is_featured: false, sort_order: 20 },
  { id: '11111111-0005-0000-0000-000000000003', name: 'Chicken Buns – 6 Pieces', slug: 'chicken-buns-6pc', description: 'Soft, pillowy buns stuffed with a savoury chicken filling. Freshly baked and best enjoyed warm. 6 pieces.', category: 'breads', base_price: 800, is_available: true, is_featured: false, sort_order: 30 },
  { id: '11111111-0005-0000-0000-000000000004', name: 'Chicken Buns – 12 Pieces', slug: 'chicken-buns-12pc', description: 'A full dozen soft chicken buns — great for parties, gatherings, or just having extras on hand. 12 pieces.', category: 'breads', base_price: 1200, is_available: true, is_featured: false, sort_order: 40 },
  // SAVORY
  { id: '11111111-0006-0000-0000-000000000001', name: 'Spaghetti – 450g', slug: 'spaghetti-450g', description: 'Comforting, home-cooked spaghetti made from scratch. Rich tomato sauce with a Pakistani twist — the kind of pasta that hits different because it is made with love. 450g.', category: 'savory', base_price: 500, is_available: true, is_featured: false, sort_order: 10 },
  { id: '11111111-0006-0000-0000-000000000002', name: 'Macaroni – 450g', slug: 'macaroni-450g', description: 'Home-cooked macaroni in a rich, flavourful sauce. A comfort dish made fresh to order with simple, quality ingredients. Best served warm. 450g.', category: 'savory', base_price: 500, is_available: true, is_featured: false, sort_order: 20 },
  // COOKIES
  { id: '11111111-0001-0000-0000-000000000001', name: 'Nankhatai – 500g', slug: 'nankhatai-500g', description: 'Traditional Pakistani shortbread biscuits made with ghee, flour, and a touch of cardamom. Crumbly, melt-in-your-mouth perfection — a beloved teatime classic. 500g.', category: 'cookies', base_price: 700, is_available: true, is_featured: true, sort_order: 10 },
  { id: '11111111-0001-0000-0000-000000000002', name: 'Nankhatai – 1kg', slug: 'nankhatai-1kg', description: 'Our beloved Pakistani ghee shortbread in a generous 1kg portion — perfect for gifting, Eid boxes, or simply having a full tin at home. 1kg.', category: 'cookies', base_price: 1200, is_available: true, is_featured: false, sort_order: 20 },
]

export async function seedProducts() {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .upsert(SEED_PRODUCTS, { onConflict: 'slug', ignoreDuplicates: false })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/products')
}
