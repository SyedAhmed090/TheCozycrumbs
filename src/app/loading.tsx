export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-16 lg:pt-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9 border-2 border-caramel/30 border-t-caramel rounded-full animate-spin" />
        <p className="font-inter text-sm text-muted">Loading...</p>
      </div>
    </div>
  )
}
