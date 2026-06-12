import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 lg:pt-24 text-center">
      <p className="font-fraunces text-8xl sm:text-9xl text-caramel font-light mb-2 leading-none">
        404
      </p>
      <h1 className="font-fraunces text-2xl sm:text-3xl text-chocolate mb-3 mt-4">
        This page got eaten.
      </h1>
      <p className="font-inter text-muted text-sm max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist — but we have plenty of treats that do.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-8 py-3 bg-chocolate text-white font-semibold text-sm rounded-full hover:bg-chocolate-dark transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="px-8 py-3 border border-edge text-ink font-semibold text-sm rounded-full hover:bg-beige transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  )
}
