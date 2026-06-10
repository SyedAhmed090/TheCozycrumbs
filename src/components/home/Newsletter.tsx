'use client'

import { motion } from 'framer-motion'
import { useState, FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }
}

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-ivory py-16 lg:py-24 px-4 sm:px-8 lg:px-20 text-center">
      <div className="max-w-[540px] mx-auto">
        <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-3">
          Stay in the Loop
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="font-fraunces text-[28px] sm:text-[34px] lg:text-[38px] font-normal text-chocolate leading-[1.2] tracking-[-1px] mb-4 mt-4"
        >
          Fresh Bakes, New Flavors & Exclusive Offers
        </motion.h2>

        <motion.p {...fadeUp(0.18)} className="text-base text-muted leading-[1.6] mb-9">
          Join our community and be the first to know about seasonal collections, new flavors, and exclusive offers.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-6"
          >
            <CheckCircle2 size={36} className="text-success" />
            <p className="font-fraunces text-xl text-chocolate">You&apos;re on the list!</p>
            <p className="text-sm text-muted">We&apos;ll let you know about new arrivals and specials.</p>
          </motion.div>
        ) : (
          <motion.form {...fadeUp(0.26)} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[460px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-6 py-4 border border-edge rounded-full font-inter text-sm bg-white text-ink outline-none focus:border-caramel transition-colors placeholder:text-muted"
            />
            <button
              type="submit"
              className="bg-chocolate text-white rounded-full px-8 py-4 font-semibold text-sm hover:bg-chocolate-dark transition-all hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
            >
              Subscribe
            </button>
            {error && (
              <p className="text-terracotta text-xs w-full text-left px-2 -mt-1">{error}</p>
            )}
          </motion.form>
        )}
      </div>
    </section>
  )
}
