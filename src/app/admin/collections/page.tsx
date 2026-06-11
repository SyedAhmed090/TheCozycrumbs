import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { createCollection, toggleCollection, deleteCollection } from './actions'

export const metadata: Metadata = { title: 'Collections' }

type Collection = {
  id: string; title: string; subtitle: string | null
  description: string | null; image: string | null
  is_active: boolean; end_date: string | null; created_at: string
}

export default async function AdminCollectionsPage() {
  let list: Collection[] = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('seasonal_collections')
      .select('id, title, subtitle, description, image, is_active, end_date, created_at')
      .order('created_at', { ascending: false })
    list = data ?? []
  } catch {}

  return (
    <div>
      <h1 className="font-fraunces text-2xl text-chocolate mb-6">Seasonal Collections</h1>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">New Collection</h2>
        <form action={createCollection} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                name="title" required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. Eid Collection 2025"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
              <input
                name="subtitle"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="e.g. Limited edition Eid treats"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Banner Image URL</label>
              <input
                name="image"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input type="date" name="end_date" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description <span className="text-red-500">*</span></label>
            <input
              name="description" required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30"
              placeholder="Short tagline for the collection…"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select name="is_active" defaultValue="true" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-caramel/30">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" className="bg-chocolate text-white font-inter font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-chocolate/90 transition-colors">
              Create Collection
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Collection', 'Ends', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{c.title}</p>
                        {c.subtitle && <p className="text-xs text-gray-400">{c.subtitle}</p>}
                        {c.description && <p className="text-xs text-gray-300 truncate max-w-[200px]">{c.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">
                    {c.end_date ? new Date(c.end_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <form action={toggleCollection.bind(null, c.id, c.is_active)}>
                        <button type="submit" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                          {c.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </form>
                      <form action={deleteCollection.bind(null, c.id)}>
                        <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">No collections yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
