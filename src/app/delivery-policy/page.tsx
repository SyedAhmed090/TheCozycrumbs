import { MapPin, Clock, Package, AlertCircle } from 'lucide-react'

const DELIVERY_AREAS = [
  { area: 'DHA (All Phases)', charge: 'Rs. 150' },
  { area: 'Clifton', charge: 'Rs. 150' },
  { area: 'Gulshan-e-Iqbal', charge: 'Rs. 150' },
  { area: 'Gulistan-e-Johar', charge: 'Rs. 150' },
  { area: 'PECHS / Bahadurabad', charge: 'Rs. 120' },
  { area: 'North Nazimabad', charge: 'Rs. 150' },
  { area: 'Saddar / City Area', charge: 'Rs. 180' },
  { area: 'Malir / Landhi', charge: 'Rs. 200' },
  { area: 'Korangi', charge: 'Rs. 200' },
  { area: 'Other areas', charge: 'On request' },
]

export default function DeliveryPolicyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-28 px-20 text-center">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Shipping & Delivery
          <span className="w-8 h-px bg-caramel" />
        </p>
        <h1 className="font-fraunces text-[62px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Delivery Policy
        </h1>
        <p className="text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">
          Fresh, on-time, and handled with care — here&apos;s how we get your treats to you.
        </p>
      </section>

      <section className="bg-cream py-24 px-20">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-caramel" />
                </div>
                <h2 className="font-fraunces text-2xl text-chocolate">Delivery Times</h2>
              </div>
              <p className="text-sm text-muted leading-[1.7] mb-3">
                We deliver 7 days a week between <strong className="text-ink">10:00 AM – 8:00 PM</strong>.
              </p>
              <p className="text-sm text-muted leading-[1.7]">
                Your preferred delivery time can be requested at checkout. We&apos;ll confirm the exact slot via WhatsApp.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-caramel" />
                </div>
                <h2 className="font-fraunces text-2xl text-chocolate">Packaging</h2>
              </div>
              <p className="text-sm text-muted leading-[1.7] mb-3">
                All orders are packed in premium, food-safe packaging designed to keep your treats fresh and presentable from our kitchen to your door.
              </p>
              <p className="text-sm text-muted leading-[1.7]">
                Custom cakes are transported in specially designed boxes to protect their shape. We take extra care with tiered and sculpted cakes.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} className="text-caramel" />
                </div>
                <h2 className="font-fraunces text-2xl text-chocolate">Important Notes</h2>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-muted leading-[1.7]">
                {[
                  'Please ensure someone is available to receive your order at the selected time.',
                  'We are not responsible for quality issues if the recipient is unavailable and the order is left unattended.',
                  'For custom cakes, please have the recipient ready — they should be refrigerated promptly on arrival.',
                  'Delivery charges are non-refundable once the order has been dispatched.',
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="text-caramel mt-1 flex-shrink-0">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-caramel" />
              </div>
              <h2 className="font-fraunces text-2xl text-chocolate">Delivery Areas & Charges</h2>
            </div>
            <div className="bg-white rounded-2xl border border-edge overflow-hidden">
              {DELIVERY_AREAS.map((row, i) => (
                <div
                  key={row.area}
                  className={`flex justify-between items-center px-6 py-4 text-sm ${i !== DELIVERY_AREAS.length - 1 ? 'border-b border-edge' : ''}`}
                >
                  <span className="text-ink font-medium">{row.area}</span>
                  <span className="text-muted">{row.charge}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-4 leading-[1.6]">
              For areas not listed above, message us on WhatsApp at +92 335 0253548 to confirm availability and charges.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
