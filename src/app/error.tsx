'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 lg:pt-24 text-center">
      <p className="text-6xl mb-5">🍪</p>
      <h2 className="font-fraunces text-2xl sm:text-3xl text-chocolate mb-3">
        Something went wrong
      </h2>
      <p className="font-inter text-muted text-sm max-w-sm mb-8">
        We hit a snag loading this page. Try refreshing or head back home.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-chocolate text-white font-semibold text-sm rounded-full hover:bg-chocolate-dark transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-edge text-ink font-semibold text-sm rounded-full hover:bg-beige transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
