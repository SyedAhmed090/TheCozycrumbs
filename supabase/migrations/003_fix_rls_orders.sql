-- ============================================================
-- Migration 003: Remove unrestricted anon read on orders
-- ============================================================
-- All customer-facing order reads (order confirmation page,
-- order tracking page) are performed server-side using the
-- service role key, which bypasses RLS entirely.
-- Removing these policies prevents anyone from dumping the
-- full orders table via the public anon key.
-- ============================================================

drop policy if exists "anon_select_orders"      on public.orders;
drop policy if exists "anon_select_order_items" on public.order_items;
