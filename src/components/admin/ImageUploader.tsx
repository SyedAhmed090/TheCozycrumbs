'use client'

import { useState, useRef } from 'react'

interface Props {
  initialImages?: string[]
  name?: string
}

export default function ImageUploader({ initialImages = [], name = 'images' }: Props) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setError(null)
    setUploading(true)
    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('folder', 'products')
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error ?? 'Upload failed')
          return data.url as string
        })
      )
      setImages(prev => [...prev, ...results])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function remove(url: string) {
    setImages(prev => prev.filter(u => u !== url))
  }

  function move(from: number, to: number) {
    setImages(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  return (
    <div>
      {images.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Product photo ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-chocolate text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                  Main
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    title="Move left"
                    className="bg-white/90 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-white"
                  >
                    ‹
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Remove photo"
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 text-center hover:border-caramel/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {uploading ? (
          <span className="text-sm text-gray-400">Uploading…</span>
        ) : (
          <span className="text-sm text-gray-400 group-hover:text-caramel transition-colors">
            {images.length === 0 ? '📷  Click to upload photos' : '+ Add more photos'}
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
      <p className="text-xs text-gray-400 mt-1.5">
        JPG, PNG or WebP · max 5 MB each · first photo appears as the main thumbnail · hover a photo to reorder or remove
      </p>
    </div>
  )
}
