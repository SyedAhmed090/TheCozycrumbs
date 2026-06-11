'use client'

interface Props {
  productName: string
  action: (formData: FormData) => Promise<void>
}

export default function DeleteProductButton({ productName, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="bg-red-600 text-white font-inter font-medium text-sm px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
      >
        Delete this product
      </button>
    </form>
  )
}
