'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cakes', href: '/cakes' },
  { label: 'Gift Boxes', href: '/gift-box' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // Cart state comes from localStorage — render the badge only after mount so
  // the first client render matches the server HTML (avoids hydration mismatch)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const itemCount = totalItems()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/97 backdrop-blur-md border-b border-edge shadow-sm py-3 lg:py-4'
            : 'bg-cream/80 backdrop-blur-sm py-4 lg:py-6'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-16">
          {/* Logo — intrinsic sizing so it never overflows on mobile */}
          <Link href="/" className="flex-shrink-0 flex items-center" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.png"
              alt="The Cozy Crumbs"
              width={144}
              height={40}
              className="h-8 sm:h-9 lg:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-sm font-medium text-ink hover:text-chocolate transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1">
            {/* Search — hidden on small mobile to prevent crowding */}
            <button
              aria-label="Search"
              className="hidden sm:flex w-[38px] h-[38px] items-center justify-center rounded-full hover:bg-beige transition-colors"
            >
              <Search size={17} className="text-ink" />
            </button>
            <Link
              href="/order-help"
              aria-label="Account"
              className="hidden sm:flex w-[38px] h-[38px] items-center justify-center rounded-full hover:bg-beige transition-colors"
            >
              <User size={17} className="text-ink" />
            </Link>
            <button
              onClick={toggleDrawer}
              aria-label="Cart"
              className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-beige transition-colors"
            >
              <ShoppingBag size={17} className="text-ink" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-terracotta text-white text-[9px] font-bold rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-beige transition-colors ml-0.5"
            >
              {mobileOpen ? <X size={18} className="text-ink" /> : <Menu size={18} className="text-ink" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav className="lg:hidden bg-cream/98 backdrop-blur-sm border-t border-edge px-4 pt-4 pb-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-inter text-base font-medium text-ink hover:text-chocolate py-3 px-2 border-b border-edge/60 last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
    </header>
  )
}
