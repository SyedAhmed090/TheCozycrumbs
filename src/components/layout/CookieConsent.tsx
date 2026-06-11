'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie_notice_dismissed'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-50 bg-chocolate text-white px-4 py-3 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 shadow-lg"
    >
      <p className="font-inter text-sm leading-relaxed flex-1">
        We use essential cookies to keep your cart and admin session working.
        No tracking or advertising cookies.{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-caramel transition-colors">
          Privacy Policy
        </Link>
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 bg-white text-chocolate font-inter font-semibold text-sm px-4 py-2 rounded-lg hover:bg-caramel hover:text-white transition-colors"
      >
        Got it
      </button>
    </div>
  )
}
