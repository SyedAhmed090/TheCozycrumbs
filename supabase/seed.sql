-- ============================================================
-- The Cozy Crumb — Seed Data
-- ============================================================
-- Run this AFTER schema.sql has been applied.
-- The DELETE at the top clears existing products so this file
-- can be re-run safely when the menu changes.
-- ============================================================


-- ============================================================
-- CLEAR EXISTING PRODUCTS  (safe — order_items uses SET NULL)
-- ============================================================

delete from public.products where true;


-- ============================================================
-- PRODUCTS  (24 total — real Cozy Crumb menu)
-- ============================================================

insert into public.products
  (id, name, slug, description, category, base_price, is_available, is_featured, sort_order)
values

  -- ── CAKES (6) ────────────────────────────────────────────

  (
    '11111111-0003-0000-0000-000000000001',
    'Pound Cake',
    'pound-cake',
    'A classic butter pound cake made with real butter, eggs, and vanilla. Dense, moist, and perfectly golden — a timeless treat that pairs beautifully with a cup of chai.',
    'cakes', 400, true, false, 10
  ),
  (
    '11111111-0003-0000-0000-000000000002',
    'Marble Cake',
    'marble-cake',
    'A beautifully swirled combination of vanilla and chocolate sponge, lightly sweetened and perfectly moist. A home-baked favourite that is hard to resist at any time of day.',
    'cakes', 400, true, false, 20
  ),
  (
    '11111111-0003-0000-0000-000000000003',
    'Cozy Special Three Milk Cake – 500g',
    'cozy-special-tres-leches-500g',
    'Our signature tres leches — a light sponge soaked in three kinds of milk until impossibly moist, topped with fresh whipped cream. The cake Karachi talks about. 500g.',
    'cakes', 800, true, true, 30
  ),
  (
    '11111111-0003-0000-0000-000000000004',
    'Cozy Special Three Milk Cake – 1kg',
    'cozy-special-tres-leches-1kg',
    'Our signature tres leches in a generous 1kg portion. Perfect for family gatherings and celebrations — a light sponge soaked in three milks, topped with whipped cream. Feeds 8–10.',
    'cakes', 1500, true, false, 40
  ),
  (
    '11111111-0003-0000-0000-000000000005',
    'Three Milk Cake Box – 500g',
    'tres-leches-box-500g',
    'Individual tres leches portions in presentation-ready gift packaging. The same beloved recipe, beautifully boxed. Perfect for gifting. 500g.',
    'cakes', 650, true, false, 50
  ),
  (
    '11111111-0003-0000-0000-000000000006',
    'Three Milk Cake Box – 1kg',
    'tres-leches-box-1kg',
    'A 1kg tres leches in elegant gift packaging — perfect for Eid, birthdays, and every celebration worth celebrating. The gift people remember. 1kg.',
    'cakes', 1100, true, false, 60
  ),

  -- ── BROWNIES (10 — 5 flavours × 2 sizes) ────────────────

  (
    '11111111-0002-0000-0000-000000000001',
    'Classic Fudge Brownies – 6 Pieces',
    'classic-fudge-brownies-6pc',
    'Pure, unadulterated fudge brownie — dense, crackle-topped, and deeply chocolatey. No frills, just six perfect squares of everything a brownie should be.',
    'brownies', 500, true, true, 10
  ),
  (
    '11111111-0002-0000-0000-000000000002',
    'Classic Fudge Brownies – 12 Pieces',
    'classic-fudge-brownies-12pc',
    'A full dozen of our signature fudge brownies — dense, crackle-topped, and deeply chocolatey. Perfect for sharing, though you might not want to.',
    'brownies', 1000, true, false, 20
  ),
  (
    '11111111-0002-0000-0000-000000000003',
    'Chocolate Chunk Brownies – 6 Pieces',
    'chocolate-chunk-brownies-6pc',
    'Our fudge brownie base studded with generous pockets of melted chocolate chunks that pool in every bite. Rich, gooey, and completely irresistible. 6 pieces.',
    'brownies', 700, true, true, 30
  ),
  (
    '11111111-0002-0000-0000-000000000004',
    'Chocolate Chunk Brownies – 12 Pieces',
    'chocolate-chunk-brownies-12pc',
    'A full dozen chocolate chunk brownies — pools of melted chocolate in every bite. Order a box and there will not be leftovers. 12 pieces.',
    'brownies', 1200, true, false, 40
  ),
  (
    '11111111-0002-0000-0000-000000000005',
    'Salted Caramel Brownies – 6 Pieces',
    'salted-caramel-brownies-6pc',
    'Ribbons of house-made caramel swirled through a fudgy brownie base, finished with a pinch of salt. The sweet-salty contrast is impossible to stop eating. 6 pieces.',
    'brownies', 700, true, true, 50
  ),
  (
    '11111111-0002-0000-0000-000000000006',
    'Salted Caramel Brownies – 12 Pieces',
    'salted-caramel-brownies-12pc',
    'Twelve salted caramel brownies — the sweet-salty combination everyone keeps requesting. Caramel ribboned through a fudgy base, finished with a pinch of salt.',
    'brownies', 1200, true, false, 60
  ),
  (
    '11111111-0002-0000-0000-000000000007',
    'Oreo Madness Brownies – 6 Pieces',
    'oreo-madness-brownies-6pc',
    'A chocolatey brownie base loaded with crushed Oreos baked right in, with whole ones pressed on top. For the cookie-and-chocolate obsessed. 6 pieces.',
    'brownies', 700, true, false, 70
  ),
  (
    '11111111-0002-0000-0000-000000000008',
    'Oreo Madness Brownies – 12 Pieces',
    'oreo-madness-brownies-12pc',
    'Twelve Oreo madness brownies — crushed Oreos baked into every square with whole ones on top. A box that disappears fast. 12 pieces.',
    'brownies', 1200, true, false, 80
  ),
  (
    '11111111-0002-0000-0000-000000000009',
    'Chocolate Chip Brownies – 6 Pieces',
    'chocolate-chip-brownies-6pc',
    'A fudge brownie base loaded with chocolate chips throughout, giving you pockets of melted chocolate in every square. Simple, perfect, and always a hit. 6 pieces.',
    'brownies', 700, true, false, 90
  ),
  (
    '11111111-0002-0000-0000-000000000010',
    'Chocolate Chip Brownies – 12 Pieces',
    'chocolate-chip-brownies-12pc',
    'A full dozen chocolate chip brownies — pockets of melted chocolate chips in every bite. Stock up while you can. 12 pieces.',
    'brownies', 1200, true, false, 100
  ),

  -- ── BREADS — Savory Chicken Items (4) ───────────────────

  (
    '11111111-0005-0000-0000-000000000001',
    'Chicken Bread – Classic Creamy Filling',
    'chicken-bread-classic-creamy',
    'A soft, golden bread loaf stuffed generously with a creamy chicken filling — the kind of savoury bake that disappears before it even cools down. Classic and crowd-pleasing.',
    'breads', 500, true, true, 10
  ),
  (
    '11111111-0005-0000-0000-000000000002',
    'Chicken Bread – Spicy Tikka Filling',
    'chicken-bread-spicy-tikka',
    'A soft, golden bread loaf packed with a bold, spicy chicken tikka filling. All the comfort of chicken bread, turned up a notch. For when you want that extra kick.',
    'breads', 500, true, false, 20
  ),
  (
    '11111111-0005-0000-0000-000000000003',
    'Chicken Buns – 6 Pieces',
    'chicken-buns-6pc',
    'Soft, pillowy buns stuffed with a savoury chicken filling. Freshly baked and best enjoyed warm. Great as a snack, lunch box addition, or party platter. 6 pieces.',
    'breads', 800, true, false, 30
  ),
  (
    '11111111-0005-0000-0000-000000000004',
    'Chicken Buns – 12 Pieces',
    'chicken-buns-12pc',
    'A full dozen soft chicken buns — great for parties, gatherings, or just having extras on hand. Freshly baked and perfectly portioned. 12 pieces.',
    'breads', 1200, true, false, 40
  ),

  -- ── SAVORY — Pasta (2) ──────────────────────────────────

  (
    '11111111-0006-0000-0000-000000000001',
    'Spaghetti – 450g',
    'spaghetti-450g',
    'Comforting, home-cooked spaghetti made from scratch. Rich tomato sauce with a Pakistani twist — the kind of pasta that hits different because it is made with love. 450g.',
    'savory', 500, true, false, 10
  ),
  (
    '11111111-0006-0000-0000-000000000002',
    'Macaroni – 450g',
    'macaroni-450g',
    'Home-cooked macaroni in a rich, flavourful sauce. A comfort dish made fresh to order with simple, quality ingredients. Best served warm. 450g.',
    'savory', 500, true, false, 20
  ),

  -- ── COOKIES — Nankhatai (2) ─────────────────────────────

  (
    '11111111-0001-0000-0000-000000000001',
    'Nankhatai – 500g',
    'nankhatai-500g',
    'Traditional Pakistani shortbread biscuits made with ghee, flour, and a touch of cardamom. Crumbly, melt-in-your-mouth perfection — a beloved teatime classic. 500g.',
    'cookies', 700, true, true, 10
  ),
  (
    '11111111-0001-0000-0000-000000000002',
    'Nankhatai – 1kg',
    'nankhatai-1kg',
    'Our beloved Pakistani ghee shortbread in a generous 1kg portion — perfect for gifting, Eid boxes, or simply having a full tin at home. Crumbly and fragrantly spiced with cardamom. 1kg.',
    'cookies', 1200, true, false, 20
  )

on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  base_price  = excluded.base_price,
  is_featured = excluded.is_featured,
  sort_order  = excluded.sort_order;


-- ============================================================
-- TESTIMONIALS  (updated to reference real menu items)
-- ============================================================

insert into public.testimonials
  (id, name, location, review, rating, is_featured)
values
  (
    '22222222-0001-0000-0000-000000000001',
    'Sana Mirza',
    'DHA Phase 6, Karachi',
    'Ordered the Three Milk Cake for my daughter''s birthday and everyone was blown away. The sponge was soaked perfectly and the cream on top was so light. I have had tres leches at restaurants and this beats all of them.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000002',
    'Hamza Qureshi',
    'Gulshan-e-Iqbal, Karachi',
    'The Salted Caramel Brownies are honestly the best brownies I have had in Karachi. That sweet-salty combination is unreal. I ordered the 6-piece box and immediately reordered the 12-piece because they were gone too fast.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000003',
    'Nadia Farooq',
    'Clifton, Karachi',
    'The Chicken Bread is something else. I have been ordering it every week since I tried it. The creamy filling is so generous and the bread itself is perfectly soft. This is our new family staple.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000004',
    'Bilal Ahmed',
    'North Nazimabad, Karachi',
    'Ordered Nankhatai as a gift for Eid and my mother-in-law loved them. The cardamom flavour is exactly right — not too strong, not too light. The ghee is clearly real. Delivery was on time too.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000005',
    'Zara Hussain',
    'Bahria Town, Karachi',
    'The Oreo Madness Brownies were a hit at my daughter''s study group. All 12 pieces were gone in under 20 minutes. The girls kept asking for the bakery name. Will be a regular customer for sure.',
    5, true
  )

on conflict (id) do nothing;


-- ============================================================
-- SEASONAL COLLECTION  (Eid collection, active)
-- ============================================================

insert into public.seasonal_collections
  (id, title, subtitle, description, cta_label, cta_href, image, is_active, end_date)
values
  (
    '33333333-0001-0000-0000-000000000001',
    'Eid Mubarak Collection',
    'Celebrate with something sweet',
    'This Eid, make every moment sweeter with our limited-edition collection — Three Milk Cake boxes, Nankhatai gift tins, and fresh brownie assortments. Each order is made fresh and packed with love, perfect for sharing joy with family and friends.',
    'Shop the Eid Collection',
    '/shop',
    null,
    true,
    '2026-06-30'
  )

on conflict (id) do nothing;
