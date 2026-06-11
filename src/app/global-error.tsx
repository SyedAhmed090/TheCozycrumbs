'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#FFFDF8',
          color: '#2A2A2A',
          margin: 0,
        }}
      >
        <p style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🍪</p>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.75rem',
            marginBottom: '0.75rem',
            color: '#4A2C1A',
            fontWeight: 400,
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            color: '#888',
            fontSize: '0.875rem',
            maxWidth: '22rem',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#4A2C1A',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
