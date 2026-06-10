import { Cake, Clock, MapPin } from 'lucide-react'

export default function CakesHero() {
  return (
    <section className="bg-gradient-to-br from-[#F2E4D5] via-[#EDD8C2] to-[#E4C9AA] py-16 lg:py-24 px-4 sm:px-8 lg:px-20 text-center relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-caramel/10" />

      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-5 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-caramel" />
          Custom Cakes
          <span className="w-8 h-px bg-caramel" />
        </p>

        <h1 className="font-fraunces text-[36px] sm:text-[48px] lg:text-[58px] font-normal text-chocolate tracking-[-1.8px] leading-[1.08] mb-6">
          Every Celebration
          <br />
          Deserves a <em className="italic text-terracotta">Perfect Cake</em>
        </h1>

        <p className="text-base lg:text-lg text-muted max-w-[520px] mx-auto leading-[1.7] mb-10">
          Tell us your vision and we&apos;ll bring it to life. Custom flavors, shapes, frostings, and personal messages — made to order for your special moment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-caramel" />
            <span>48hr notice needed</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-caramel" />
            <span>Delivered across Karachi</span>
          </div>
          <div className="flex items-center gap-2">
            <Cake size={15} className="text-caramel" />
            <span>100% made to order</span>
          </div>
        </div>
      </div>
    </section>
  )
}
