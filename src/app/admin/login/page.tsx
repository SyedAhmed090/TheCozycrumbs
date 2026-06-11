import type { Metadata } from 'next'
import { adminLogin } from './actions'

export const metadata: Metadata = { title: 'Login' }

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>
}) {
  const { error, from } = await searchParams

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="font-fraunces text-2xl text-chocolate text-center mb-8">Admin Login</h1>
        <form action={adminLogin} className="flex flex-col gap-4">
          <input type="hidden" name="from" value={from ?? '/admin/orders'} />
          <div>
            <label htmlFor="password" className="block font-inter text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-chocolate outline-none"
              placeholder="Enter admin password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-chocolate text-white py-3 rounded-full font-semibold text-sm hover:bg-chocolate-dark transition-colors mt-1"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
