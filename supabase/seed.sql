-- ============================================================
-- The Cozy Crumb — Seed Data
-- ============================================================
-- Run this AFTER schema.sql has been applied.
-- Uses ON CONFLICT DO NOTHING so it is safe to re-run.
-- base_price is intentionally NULL — pricing to be set later.
-- ============================================================


-- ============================================================
-- PRODUCTS  (15 total across all categories)
-- ============================================================

insert into public.products
  (id, name, slug, description, category, base_price, is_available, is_featured, sort_order)
values

  -- COOKIES (3)
  (
    '11111111-0001-0000-0000-000000000001',
    'Chocolate Chip Delight',
    'chocolate-chip-delight',
    'Golden, crispy-edged cookies loaded with pools of melted dark chocolate chips baked fresh to order. Each batch uses premium Valrhona chocolate for an indulgent bite that never gets old.',
    'cookies', null, true, true, 10
  ),
  (
    '11111111-0001-0000-0000-000000000002',
    'Brown Butter Snickerdoodle',
    'brown-butter-snickerdoodle',
    'Classic snickerdoodles elevated with nutty browned butter and rolled generously in cinnamon sugar. Soft and chewy in the centre with a perfectly crinkled sugary crust.',
    'cookies', null, true, false, 20
  ),
  (
    '11111111-0001-0000-0000-000000000003',
    'Double Chocolate Chunk',
    'double-chocolate-chunk',
    'For the serious chocolate lover — a rich, fudgy cocoa-based cookie studded with oversized semi-sweet chocolate chunks. Pairs beautifully with a glass of cold milk.',
    'cookies', null, true, false, 30
  ),

  -- BROWNIES (2)
  (
    '11111111-0002-0000-0000-000000000001',
    'Fudge Walnut Brownie',
    'fudge-walnut-brownie',
    'Dense, ultra-fudgy brownies with a crackly top and generous pockets of toasted walnut throughout. Made with real dark chocolate for a deep, bittersweet flavour.',
    'brownies', null, true, true, 10
  ),
  (
    '11111111-0002-0000-0000-000000000002',
    'Caramel Sea Salt Brownie',
    'caramel-sea-salt-brownie',
    'Swirls of house-made caramel ribboned through a dark chocolate brownie base, finished with a pinch of flaky Himalayan sea salt. The sweet-salty contrast is absolutely addictive.',
    'brownies', null, true, false, 20
  ),

  -- CAKES (3)
  (
    '11111111-0003-0000-0000-000000000001',
    'Vanilla Dream Cake',
    'vanilla-dream-cake',
    'A light, airy vanilla sponge layered with silky vanilla bean buttercream — elegant in its simplicity and perfect for every celebration. Can be personalised with a custom message and your choice of frosting colour.',
    'cakes', null, true, true, 10
  ),
  (
    '11111111-0003-0000-0000-000000000002',
    'Chocolate Ganache Celebration Cake',
    'chocolate-ganache-celebration-cake',
    'Three moist chocolate sponge layers stacked high with luscious dark chocolate ganache and a mirror-glaze finish that makes every party unforgettable. Available in multiple sizes for any occasion.',
    'cakes', null, true, false, 20
  ),
  (
    '11111111-0003-0000-0000-000000000003',
    'Lemon Drizzle Layer Cake',
    'lemon-drizzle-layer-cake',
    'Zesty lemon sponge drenched in a sharp lemon syrup and frosted with a light lemon cream cheese filling. Bright, refreshing, and a guaranteed crowd-pleaser at afternoon gatherings.',
    'cakes', null, true, false, 30
  ),

  -- CUPCAKES (2)
  (
    '11111111-0004-0000-0000-000000000001',
    'Red Velvet with Cream Cheese Frosting',
    'red-velvet-cream-cheese-cupcake',
    'Striking crimson red velvet cupcakes topped with a generous swirl of tangy cream cheese frosting. A timeless favourite that looks as stunning as it tastes.',
    'cupcakes', null, true, true, 10
  ),
  (
    '11111111-0004-0000-0000-000000000002',
    'Nutella Stuffed Cupcake',
    'nutella-stuffed-cupcake',
    'Fluffy chocolate cupcakes hiding a warm, molten Nutella centre, crowned with a hazelnut buttercream rosette and a chocolate drizzle. Every bite reveals a hidden surprise.',
    'cupcakes', null, true, false, 20
  ),

  -- BREADS (2)
  (
    '11111111-0005-0000-0000-000000000001',
    'Artisan Sourdough Loaf',
    'artisan-sourdough-loaf',
    'Slow-fermented over 24 hours using our own active starter, producing an open crumb, chewy crust, and complex tangy flavour. Baked in a Dutch oven for that perfect bakery-style crust.',
    'breads', null, true, true, 10
  ),
  (
    '11111111-0005-0000-0000-000000000002',
    'Garlic Herb Focaccia',
    'garlic-herb-focaccia',
    'Pillowy Italian-style focaccia dimpled and drizzled with good olive oil, scattered with fresh rosemary, garlic, and flaky salt. Best enjoyed warm with a bowl of soup or as a sharing starter.',
    'breads', null, true, false, 20
  ),

  -- PASTRIES (2)
  (
    '11111111-0006-0000-0000-000000000001',
    'Almond Croissant',
    'almond-croissant',
    'Buttery, flaky croissants filled with rich almond frangipane cream and topped with toasted flaked almonds and a dusting of icing sugar. A classic French patisserie favourite made fresh each morning.',
    'pastries', null, true, false, 10
  ),
  (
    '11111111-0006-0000-0000-000000000002',
    'Cinnamon Danish',
    'cinnamon-danish',
    'Layers of laminated dough wrapped around a fragrant cinnamon-sugar swirl, baked until golden and finished with a vanilla glaze drizzle. Flaky, soft, and wonderfully aromatic.',
    'pastries', null, true, false, 20
  ),

  -- GIFT BOXES (1)
  (
    '11111111-0007-0000-0000-000000000001',
    'The Crumb Hamper',
    'the-crumb-hamper',
    'Our signature gift hamper packed with a curated selection of our best-sellers — cookies, brownies, and mini pastries — beautifully arranged in a keepsake box with a hand-written note. The perfect gift for any occasion.',
    'gift-boxes', null, true, true, 10
  )

on conflict (slug) do nothing;


-- ============================================================
-- TESTIMONIALS  (5 Karachi customers, all featured)
-- ============================================================

insert into public.testimonials
  (id, name, location, review, rating, is_featured)
values
  (
    '22222222-0001-0000-0000-000000000001',
    'Sana Mirza',
    'DHA Phase 6, Karachi',
    'Ordered the Chocolate Ganache Cake for my daughter''s birthday and it was an absolute showstopper. The sponge was incredibly moist and the ganache finish looked straight out of a professional bakery. Everyone at the party kept asking where it was from!',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000002',
    'Hamza Qureshi',
    'Gulshan-e-Iqbal, Karachi',
    'The Caramel Sea Salt Brownies are honestly the best brownies I have ever had in Karachi. That sweet-salty combination is unreal. I placed a second order the very next day — couldn''t resist.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000003',
    'Nadia Farooq',
    'Clifton, Karachi',
    'I gifted The Crumb Hamper to a colleague and she was genuinely moved by how beautifully it was presented. The hand-written note was such a lovely personal touch. Will definitely order again for Eid.',
    5, true
  ),
  (
    '22222222-0001-0000-0000-000000000004',
    'Bilal Ahmed',
    'North Nazimabad, Karachi',
    'The Artisan Sourdough Loaf is something else entirely. I had no idea homemade sourdough could taste this good. Ordered it every week now. Next day delivery was right on time too.',
    4, true
  ),
  (
    '22222222-0001-0000-0000-000000000005',
    'Zara Hussain',
    'Bahria Town, Karachi',
    'The Red Velvet Cupcakes looked so elegant I almost didn''t want to eat them. Almost. They were just as delicious as they were beautiful — the cream cheese frosting had the perfect amount of tang. My whole family devoured the box in minutes.',
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
    'This Eid, make every moment sweeter with our limited-edition collection of hand-crafted celebration cakes, festive gift hampers, and rose-cardamom treats inspired by the flavours of the season. Each order is made fresh and packed with love — the perfect way to share joy with family and friends.',
    'Shop the Eid Collection',
    '/shop?collection=eid',
    null,
    true,
    '2026-06-30'
  )

on conflict (id) do nothing;
