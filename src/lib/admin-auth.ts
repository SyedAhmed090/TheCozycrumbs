import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken } from '@/lib/admin-session'

// Server actions can be invoked directly via POST from any route, bypassing
// the /admin proxy matcher — every admin action must verify the session itself.
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  const secret = process.env.ADMIN_PASSWORD

  if (!session || !secret || !(await verifySessionToken(session, secret))) {
    redirect('/admin/login')
  }
}
