export default function ShopHero() {
  return (
    <section className="bg-ivory py-16 lg:py-20 px-4 sm:px-8 lg:px-20 text-center">
      <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-caramel mb-4">Our Menu</p>
      <h1 className="font-fraunces text-[34px] sm:text-[44px] lg:text-[54px] font-normal text-chocolate tracking-[-1.5px] leading-[1.1] mb-5">
        Everything Baked Fresh,
        <br className="hidden sm:block" />
        Just For You
      </h1>
      <p className="text-base lg:text-lg text-muted max-w-[480px] mx-auto leading-[1.7]">
        Every item is made to order. Browse our full selection of cookies, cakes, brownies, and more.
      </p>
    </section>
  )
}
