-- ============================================================
-- Migration 002: Add features (newsletter, discounts, stock,
--                customer email, fix status constraint)
-- ============================================================

-- Fix orders status constraint: schema had 'preparing' but code uses 'baking'
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'));

-- Add customer email to orders (optional — for email confirmation)
alter table public.orders add column if not exists customer_email text;

-- Add discount fields to orders
alter table public.orders add column if not exists discount_code text;
alter table public.orders add column if not exists discount_amount numeric not null default 0;

-- Add stock tracking to products (null = unlimited)
alter table public.products add column if not exists stock_quantity int;

-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id             uuid        primary key default gen_random_uuid(),
  email          text        unique not null,
  name           text,
  is_active      boolean     not null default true,
  subscribed_at  timestamptz not null default now()
);

-- Discount codes
create table if not exists public.discount_codes (
  id                uuid        primary key default gen_random_uuid(),
  code              text        unique not null,
  description       text,
  discount_type     text        not null check (discount_type in ('percentage', 'fixed')),
  discount_value    numeric     not null,
  min_order_amount  numeric     not null default 0,
  max_uses          int,
  used_count        int         not null default 0,
  is_active         boolean     not null default true,
  expires_at        timestamptz,
  created_at        timestamptz not null default now()
);

-- Testimonial submissions (pending admin approval)
alter table public.testimonials add column if not exists is_pending boolean not null default false;

-- ---- RLS for newsletter_subscribers ----
alter table public.newsletter_subscribers enable row level security;

create policy "anon_insert_subscribers"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

create policy "auth_all_subscribers"
  on public.newsletter_subscribers
  for all
  to authenticated
  using (true)
  with check (true);

-- ---- RLS for discount_codes ----
alter table public.discount_codes enable row level security;

-- Anon can only read active non-expired codes (to validate at checkout)
create policy "anon_select_active_discounts"
  on public.discount_codes
  for select
  to anon
  using (is_active = true and (expires_at is null or expires_at > now()));

create policy "auth_all_discounts"
  on public.discount_codes
  for all
  to authenticated
  using (true)
  with check (true);

-- Indexes
create index if not exists idx_newsletter_email on public.newsletter_subscribers (email);
create index if not exists idx_discount_codes_code on public.discount_codes (code);
