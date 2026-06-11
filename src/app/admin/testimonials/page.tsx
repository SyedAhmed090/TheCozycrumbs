import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = { title: 'Reviews' }

async function approveTestimonial(id: string) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('testimonials').update({ is_pending: false }).eq('id', id)
  revalidatePath('/admin/testimonials')
}

async function toggleFeatured(id: string, current: boolean) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('testimonials').update({ is_featured: !current }).eq('id', id)
  revalidatePath('/admin/testimonials')
}

async function deleteTestimonial(id: string) {
  'use server'
  const supabase = createAdminClient()
  await supabase.from('testimonials').delete().eq('id', id)
  revalidatePath('/admin/testimonials')
}

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★']

export default async function AdminTestimonialsPage() {
  let list: Record<string, unknown>[] = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('testimonials')
      .select('id, name, location, review, rating, is_featured, is_pending, created_at')
      .order('created_at', { ascending: false })
    list = data ?? []
  } catch {}
  const pending = list.filter((t) => t.is_pending)
  const approved = list.filter((t) => !t.is_pending)

  const Section = ({ title, items, badge }: { title: string; items: typeof list; badge?: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-inter font-semibold text-gray-700">{title}</h2>
        {badge && <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">None here.</p>
        ) : items.map((t) => (
          <div key={t.id} className="px-5 py-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{t.name}</span>
                {t.location && <span className="text-xs text-gray-400">{t.location}</span>}
                <span className="text-amber-400 text-xs">{STARS[t.rating ?? 5]}</span>
                {t.is_featured && (
                  <span className="bg-caramel/20 text-caramel text-xs px-1.5 py-0.5 rounded font-medium">Featured</span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{t.review}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(t.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              {t.is_pending && (
                <form action={approveTestimonial.bind(null, t.id)}>
                  <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                </form>
              )}
              {!t.is_pending && (
                <form action={toggleFeatured.bind(null, t.id, t.is_featured ?? false)}>
                  <button type="submit" className="text-xs text-caramel hover:text-chocolate transition-colors whitespace-nowrap">
                    {t.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                </form>
              )}
              <form action={deleteTestimonial.bind(null, t.id)}>
                <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="font-fraunces text-2xl text-chocolate mb-6">Reviews</h1>
      <Section title="Pending Approval" items={pending} badge={pending.length > 0 ? String(pending.length) : undefined} />
      <Section title="Approved" items={approved} />
    </div>
  )
}
