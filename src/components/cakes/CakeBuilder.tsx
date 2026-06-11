'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle2, ImagePlus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

const FLAVORS = [
  'Vanilla Bean', 'Chocolate Fudge', 'Red Velvet', 'Lemon Drizzle',
  'Strawberry', 'Carrot Cake', 'Nutella', 'Black Forest', 'Marble',
]

const WEIGHTS = [
  '500g (serves 4-6)', '1kg (serves 8-10)', '1.5kg (serves 12-15)',
  '2kg (serves 16-20)', '2.5kg+ (custom)',
]

const SHAPES = [
  { emoji: '🔵', label: 'Round' },
  { emoji: '⬛', label: 'Square' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '🎂', label: 'Tiered' },
  { emoji: '🟢', label: 'Oval' },
  { emoji: '⬡', label: 'Hexagon' },
  { emoji: '🎁', label: 'Custom' },
]

const FROSTINGS = [
  'Cream Cheese', 'Vanilla Buttercream', 'Chocolate Ganache',
  'Whipped Cream', 'Swiss Meringue', 'Fondant', 'No Frosting',
]

const MOCK_PRODUCT: Product = {
  id: 'custom-cake',
  name: 'Custom Cake',
  slug: 'custom-cake',
  description: 'A fully custom cake made to your specifications.',
  category: 'cakes',
  base_price: null,
  images: [],
  is_available: true,
  is_featured: false,
  created_at: new Date().toISOString(),
}


type StepCardProps = {
  step: number
  title: string
  isActive: boolean
  onToggle: () => void
  children: React.ReactNode
}

function StepCard({ step, title, isActive, onToggle, children }: StepCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
        isActive
          ? 'border-chocolate shadow-[0_4px_24px_rgba(90,62,43,0.1)]'
          : 'border-edge'
      }`}
    >
      <div
        className="flex items-center gap-4 p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-8 h-8 rounded-full bg-chocolate text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
          {step}
        </div>
        <span className="font-fraunces text-lg text-chocolate flex-1">{title}</span>
        {isActive ? (
          <ChevronUp size={18} className="text-muted flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-muted flex-shrink-0" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type SummaryRowProps = {
  label: string
  value: string | undefined
}

function SummaryRow({ label, value }: SummaryRowProps) {
  const hasValue = Boolean(value)
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={16}
        className={`mt-0.5 flex-shrink-0 ${hasValue ? 'text-success' : 'text-edge'}`}
      />
      <span className={`text-sm ${hasValue ? 'text-ink' : 'text-muted'}`}>
        <span className="font-medium">{label}:</span>{' '}
        {value ? (
          <span>{value.length > 40 ? value.slice(0, 40) + '…' : value}</span>
        ) : (
          <span className="text-muted italic">Not selected</span>
        )}
      </span>
    </div>
  )
}

export default function CakeBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [flavor, setFlavor] = useState('')
  const [weight, setWeight] = useState('')
  const [shape, setShape] = useState('')
  const [frosting, setFrosting] = useState('')
  const [message, setMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [validationError, setValidationError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addItem, openDrawer } = useCartStore()
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setValidationError('Please upload a JPG, PNG, WebP, or GIF image.')
      e.target.value = ''
      return
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setValidationError('Image must be under 5MB.')
      e.target.value = ''
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  function handleAddToCart() {
    if (!flavor || !weight) {
      setValidationError('Please select a flavor and weight before adding to cart.')
      return
    }
    setValidationError('')
    addItem({
      product: MOCK_PRODUCT,
      quantity,
      variant: {
        flavor,
        weight,
        shape: shape || undefined,
        frosting: frosting || undefined,
      },
      custom_message: message || undefined,
      reference_image_url: previewUrl || undefined,
      price: null,
    })
    openDrawer()
  }

  return (
    <section id="cake-builder" className="bg-ivory py-12 lg:py-20 px-4 sm:px-8 lg:px-20">
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Build Your Cake
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h2 className="font-fraunces text-[30px] sm:text-[38px] lg:text-[46px] font-normal text-chocolate tracking-[-1.2px] leading-[1.1]">
          Design Your Perfect Cake
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-14 items-start">
        {/* Left — Steps */}
        <div className="flex flex-col gap-4">
          {/* Step 1 — Flavor */}
          <StepCard
            step={1}
            title="Choose Flavor"
            isActive={currentStep === 1}
            onToggle={() => setCurrentStep(currentStep === 1 ? 0 : 1)}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FLAVORS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlavor(f)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all text-center ${
                    flavor === f
                      ? 'bg-chocolate text-white border-chocolate'
                      : 'border-edge text-ink hover:border-caramel'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </StepCard>

          {/* Step 2 — Weight */}
          <StepCard
            step={2}
            title="Select Weight"
            isActive={currentStep === 2}
            onToggle={() => setCurrentStep(currentStep === 2 ? 0 : 2)}
          >
            <div className="flex flex-wrap gap-3">
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeight(w)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                    weight === w
                      ? 'bg-chocolate text-white border-chocolate'
                      : 'border-edge text-ink hover:border-caramel'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </StepCard>

          {/* Step 3 — Shape */}
          <StepCard
            step={3}
            title="Choose Shape"
            isActive={currentStep === 3}
            onToggle={() => setCurrentStep(currentStep === 3 ? 0 : 3)}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {SHAPES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setShape(s.label)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer transition-all text-sm ${
                    shape === s.label
                      ? 'bg-chocolate text-white border-chocolate'
                      : 'border-edge text-ink hover:border-caramel'
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </StepCard>

          {/* Step 4 — Frosting */}
          <StepCard
            step={4}
            title="Pick Frosting"
            isActive={currentStep === 4}
            onToggle={() => setCurrentStep(currentStep === 4 ? 0 : 4)}
          >
            <div className="grid grid-cols-2 gap-3">
              {FROSTINGS.map((fr) => (
                <button
                  key={fr}
                  type="button"
                  onClick={() => setFrosting(fr)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all text-center ${
                    frosting === fr
                      ? 'bg-chocolate text-white border-chocolate'
                      : 'border-edge text-ink hover:border-caramel'
                  }`}
                >
                  {fr}
                </button>
              ))}
            </div>
          </StepCard>

          {/* Step 5 — Personalize */}
          <StepCard
            step={5}
            title="Personalize"
            isActive={currentStep === 5}
            onToggle={() => setCurrentStep(currentStep === 5 ? 0 : 5)}
          >
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="cake-message" className="block font-inter text-sm font-medium text-ink mb-1.5">
                  Message for the cake
                </label>
                <textarea
                  id="cake-message"
                  value={message}
                  maxLength={100}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="E.g. Happy Birthday Aisha! Wishing you all the joy ♥"
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm resize-none h-20 focus:border-caramel outline-none"
                />
                <p className="text-xs text-muted text-right mt-1">{message.length}/100</p>
              </div>

              <div>
                <div
                  className="border-2 border-dashed border-edge rounded-xl p-6 text-center cursor-pointer hover:border-caramel transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Reference"
                      className="mx-auto max-h-40 rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus size={24} className="text-muted mx-auto mb-2" />
                      <p className="text-sm font-medium text-ink mb-1">Upload a reference image</p>
                      <p className="text-xs text-muted">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </StepCard>

          {/* Step 6 — Delivery */}
          <StepCard
            step={6}
            title="Delivery"
            isActive={currentStep === 6}
            onToggle={() => setCurrentStep(currentStep === 6 ? 0 : 6)}
          >
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink focus:border-caramel outline-none bg-white transition-colors"
                />
                <p className="text-xs text-muted mt-1">
                  Same day before 12pm · Next day before 9pm · Or schedule ahead
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-edge text-ink font-semibold hover:border-chocolate transition-colors flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <span className="font-fraunces text-xl text-chocolate w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-full border border-edge text-ink font-semibold hover:border-chocolate transition-colors flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </StepCard>
        </div>

        {/* Right — Preview Card */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-edge p-8">
            <div className="h-48 rounded-xl bg-gradient-to-br from-[#F0D4B8] to-[#E0BF9A] flex items-center justify-center mb-6">
              <span className="font-fraunces italic text-chocolate/40 text-sm text-center px-4">
                Your Custom Cake
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <SummaryRow label="Flavor" value={flavor} />
              <SummaryRow label="Weight" value={weight} />
              <SummaryRow label="Shape" value={shape} />
              <SummaryRow label="Frosting" value={frosting} />
              <SummaryRow label="Message" value={message || undefined} />
              <SummaryRow
                label="Delivery"
                value={
                  deliveryDate
                    ? new Date(deliveryDate + 'T00:00:00').toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : undefined
                }
              />
            </div>

            <div className="border-t border-edge pt-5 mb-1">
              <p className="font-fraunces text-2xl text-chocolate">Price on Request</p>
            </div>
            <p className="text-xs text-muted mb-6">Final price confirmed after order review</p>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-chocolate text-white rounded-full py-4 font-semibold text-sm hover:bg-chocolate-dark transition-all"
            >
              Add to Cart
            </button>

            {validationError && (
              <p className="text-terracotta text-sm mt-2">{validationError}</p>
            )}

            <p className="text-xs text-muted text-center mt-3">
              We&apos;ll contact you on WhatsApp to confirm the final design and price
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
