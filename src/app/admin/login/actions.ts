'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string
  const from = (formData.get('from') as string) || '/admin/orders'

  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    redirect('/admin/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect(from.startsWith('/admin') ? from : '/admin/orders')
}
