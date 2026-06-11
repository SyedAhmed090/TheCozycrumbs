-- ============================================================
-- Migration 004: Admin audit log
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event       text        NOT NULL,  -- login_success | login_failure | logout
  ip_address  text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: no policies = only service role can read/write
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_log_event      ON public.admin_audit_log (event);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log (created_at DESC);
