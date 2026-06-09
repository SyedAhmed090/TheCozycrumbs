'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cakes', href: '/shop/cakes' },
  { label: 'Gift Boxes', href: '/shop/gift-boxes' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const itemCount = totalItems()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-sm border-b border-edge shadow-sm py-4'
          : 'py-6'
      }`}
    >
      <div className="flex items-center justify-between px-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0" />
          <span className="font-fraunces text-xl font-medium text-chocolate">
            The Cozy Crumb
          </span>
        </Link>

        <nav className="flex items-center gap-8">
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

        <div className="flex items-center gap-1">
          <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-beige transition-colors">
            <Search size={17} className="text-ink" />
          </button>
          <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-beige transition-colors">
            <User size={17} className="text-ink" />
          </button>
          <button
            onClick={toggleDrawer}
            className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full hover:bg-beige transition-colors"
          >
            <ShoppingBag size={17} className="text-ink" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-terracotta text-white text-[9px] font-bold rounded-full">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
