-- ============================================================
-- The Cozy Crumb — Supabase Database Schema
-- ============================================================

-- Enable UUID generation (available by default in Supabase)
-- create extension if not exists "pgcrypto";


-- ============================================================
-- TABLES
-- ============================================================

-- Products
create table if not exists public.products (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  slug          text        unique not null,
  description   text,
  category      text        not null check (
                              category in (
                                'cookies', 'brownies', 'cakes', 'cupcakes',
                                'breads', 'pastries', 'gift-boxes'
                              )
                            ),
  base_price    numeric,
  images        text[]      not null default '{}',
  is_available  boolean     not null default true,
  is_featured   boolean     not null default false,
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id               uuid        primary key default gen_random_uuid(),
  customer_name    text        not null,
  customer_phone   text        not null,
  customer_address text        not null,
  subtotal         numeric,
  status           text        not null default 'pending' check (
                                 status in (
                                   'pending', 'confirmed', 'preparing',
                                   'out_for_delivery', 'delivered', 'cancelled'
                                 )
                               ),
  delivery_date    date        not null,
  payment_method   text        not null check (
                                 payment_method in ('easypaisa', 'cod')
                               ),
  notes            text,
  created_at       timestamptz not null default now()
);

-- Order Items
create table if not exists public.order_items (
  id                   uuid        primary key default gen_random_uuid(),
  order_id             uuid        not null references public.orders (id) on delete cascade,
  product_id           uuid        references public.products (id) on delete set null,
  product_name         text        not null,
  quantity             int         not null default 1 check (quantity > 0),
  variant              jsonb       not null default '{}',
  custom_message       text,
  reference_image_url  text,
  price                numeric,
  created_at           timestamptz not null default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  location    text,
  review      text        not null,
  rating      int         check (rating between 1 and 5),
  is_featured boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- Gallery Items
create table if not exists public.gallery_items (
  id          uuid        primary key default gen_random_uuid(),
  image_url   text        not null,
  caption     text,
  category    text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

-- Seasonal Collections
create table if not exists public.seasonal_collections (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  subtitle    text,
  description text        not null,
  cta_label   text        not null default 'Shop the Collection',
  cta_href    text        not null default '/shop',
  image       text,
  is_active   boolean     not null default false,
  end_date    date,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_products_category      on public.products (category);
create index if not exists idx_products_is_featured   on public.products (is_featured);
create index if not exists idx_products_is_available  on public.products (is_available);
create index if not exists idx_orders_status          on public.orders (status);
create index if not exists idx_orders_created_at      on public.orders (created_at);
create index if not exists idx_order_items_order_id   on public.order_items (order_id);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.products            enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.testimonials        enable row level security;
alter table public.gallery_items       enable row level security;
alter table public.seasonal_collections enable row level security;


-- ---- products ----
-- Anonymous visitors can read available products only
create policy "anon_select_available_products"
  on public.products
  for select
  to anon
  using (is_available = true);

-- Authenticated (admin / service role) has full access
create policy "auth_all_products"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);


-- ---- orders ----
-- Anyone (anon) can place an order
create policy "anon_insert_orders"
  on public.orders
  for insert
  to anon
  with check (true);

-- Anyone can read orders (no per-user auth in this app)
create policy "anon_select_orders"
  on public.orders
  for select
  to anon
  using (true);

-- Authenticated has full access
create policy "auth_all_orders"
  on public.orders
  for all
  to authenticated
  using (true)
  with check (true);


-- ---- order_items ----
create policy "anon_insert_order_items"
  on public.order_items
  for insert
  to anon
  with check (true);

create policy "anon_select_order_items"
  on public.order_items
  for select
  to anon
  using (true);

create policy "auth_all_order_items"
  on public.order_items
  for all
  to authenticated
  using (true)
  with check (true);


-- ---- testimonials ----
-- Anon can only see featured testimonials
create policy "anon_select_featured_testimonials"
  on public.testimonials
  for select
  to anon
  using (is_featured = true);

create policy "auth_all_testimonials"
  on public.testimonials
  for all
  to authenticated
  using (true)
  with check (true);


-- ---- gallery_items ----
create policy "anon_select_gallery_items"
  on public.gallery_items
  for select
  to anon
  using (true);

create policy "auth_all_gallery_items"
  on public.gallery_items
  for all
  to authenticated
  using (true)
  with check (true);


-- ---- seasonal_collections ----
-- Anon can only see active collections
create policy "anon_select_active_collections"
  on public.seasonal_collections
  for select
  to anon
  using (is_active = true);

create policy "auth_all_seasonal_collections"
  on public.seasonal_collections
  for all
  to authenticated
  using (true)
  with check (true);


-- ============================================================
-- STORAGE BUCKET NOTE
-- ============================================================
-- A storage bucket named  reference-images  must be created
-- manually in the Supabase Dashboard (Storage → New bucket).
--
-- Settings:
--   Name:         reference-images
--   Public:       true  (so uploaded images can be served via
--                        the public URL without authentication)
--   File size limit: recommended 5 MB per file
--   Allowed MIME types: image/jpeg, image/png, image/webp
--
-- This bucket is used to store customer-uploaded reference
-- images attached to custom cake / cupcake orders.
-- ============================================================
