import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export const metadata: Metadata = { title: 'Subscribers' }

async function toggleSubscriber(id: string, currentValue: boolean) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('newsletter_subscribers').update({ is_active: !currentValue }).eq('id', id)
  revalidatePath('/admin/subscribers')
}

async function deleteSubscriber(id: string) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('newsletter_subscribers').delete().eq('id', id)
  revalidatePath('/admin/subscribers')
}

export default async function AdminSubscribersPage() {
  let list: Record<string, unknown>[] = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, is_active, subscribed_at')
      .order('subscribed_at', { ascending: false })
    list = data ?? []
  } catch {}
  const activeCount = list.filter((s) => s.is_active).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-fraunces text-2xl text-chocolate">Subscribers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{activeCount} active of {list.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Email', 'Name', 'Status', 'Subscribed', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{s.email}</td>
                  <td className="px-5 py-3 text-gray-600">{s.name ?? <span className="text-gray-300">—</span>}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {s.is_active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(s.subscribed_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <form action={toggleSubscriber.bind(null, s.id, s.is_active)}>
                        <button type="submit" className="text-gray-400 hover:text-gray-700 text-xs">
                          {s.is_active ? 'Unsubscribe' : 'Reactivate'}
                        </button>
                      </form>
                      <form action={deleteSubscriber.bind(null, s.id)}>
                        <button type="submit" className="text-red-400 hover:text-red-600 text-xs">
                          Remove
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">No subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
