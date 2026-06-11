'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { signSessionToken } from '@/lib/admin-session'
import { createAdminClient } from '@/lib/supabase/admin'

async function logAdminEvent(event: string): Promise<void> {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
    const userAgent = headersList.get('user-agent') ?? 'unknown'
    const supabase = createAdminClient()
    await supabase.from('admin_audit_log').insert({ event, ip_address: ip, user_agent: userAgent })
  } catch {
    // Non-fatal — never interrupt auth flow for logging errors
  }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  await logAdminEvent('logout')
  redirect('/admin/login')
}

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string
  const from = (formData.get('from') as string) || '/admin/orders'

  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    await logAdminEvent('login_failure')
    redirect('/admin/login?error=1')
  }

  const token = crypto.randomUUID()
  const signature = await signSessionToken(token, adminPassword)
  const sessionValue = `${token}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  await logAdminEvent('login_success')
  redirect(from.startsWith('/admin') ? from : '/admin/orders')
}
