export default function ShopLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 py-12">
      <div className="h-7 w-44 bg-beige rounded-lg mb-3 animate-pulse" />
      <div className="h-4 w-64 bg-beige rounded mb-10 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-beige rounded-2xl mb-3" />
            <div className="h-4 bg-beige rounded-lg w-3/4 mb-2" />
            <div className="h-4 bg-beige rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
