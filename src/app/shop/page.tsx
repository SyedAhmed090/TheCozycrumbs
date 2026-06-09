import { Suspense } from 'react'
import { Product } from '@/types'
import ShopHero from '@/components/shop/ShopHero'
import ShopFilters from '@/components/shop/ShopFilters'
import ProductGrid from '@/components/shop/ProductGrid'

const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chocolate Chip Delight',
    slug: 'chocolate-chip-delight',
    description: 'Buttery, golden-edged cookies loaded with rich chocolate chips baked to soft perfection.',
    category: 'cookies',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
  {
    id: '2',
    name: 'Brown Butter Snickerdoodle',
    slug: 'brown-butter-snickerdoodle',
    description: 'Nutty browned butter cookies rolled in cinnamon sugar with a perfectly chewy centre.',
    category: 'cookies',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '3',
    name: 'Fudge Walnut Brownie',
    slug: 'fudge-walnut-brownie',
    description: 'Dense, intensely chocolatey brownies crowned with toasted walnuts and a glossy crust.',
    category: 'brownies',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
  {
    id: '4',
    name: 'Salted Caramel Brownie',
    slug: 'salted-caramel-brownie',
    description: 'Fudgy dark-chocolate brownies swirled with house-made salted caramel and a flaky sea salt finish.',
    category: 'brownies',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '5',
    name: 'Vanilla Dream Cake',
    slug: 'vanilla-dream-cake',
    description: 'Fluffy vanilla sponge layered with silky buttercream — classic elegance for every occasion.',
    category: 'cakes',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
  {
    id: '6',
    name: 'Tres Leches',
    slug: 'tres-leches',
    description: 'A cloud-light sponge soaked in three milks, finished with freshly whipped cream and cinnamon.',
    category: 'cakes',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '7',
    name: 'Red Velvet Cupcake',
    slug: 'red-velvet-cupcake',
    description: 'Velvety crimson cupcakes crowned with clouds of cream cheese frosting.',
    category: 'cupcakes',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
  {
    id: '8',
    name: 'Lemon Blueberry Cupcake',
    slug: 'lemon-blueberry-cupcake',
    description: 'Bright lemon cupcakes bursting with blueberries and topped with zesty lemon buttercream.',
    category: 'cupcakes',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '9',
    name: 'Artisan Sourdough',
    slug: 'artisan-sourdough',
    description: 'Slow-fermented sourdough with a crackling crust and an open, chewy crumb.',
    category: 'breads',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '10',
    name: 'Almond Croissant',
    slug: 'almond-croissant',
    description: 'Buttery, shatteringly flaky croissants filled and finished with rich almond frangipane.',
    category: 'pastries',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
  {
    id: '11',
    name: 'Mille-Feuille',
    slug: 'mille-feuille',
    description: 'Crisp puff pastry layered with vanilla pastry cream and finished with a delicate fondant glaze.',
    category: 'pastries',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: false,
    created_at: '',
  },
  {
    id: '12',
    name: 'The Crumb Hamper',
    slug: 'the-crumb-hamper',
    description: 'A curated selection of our finest bakes — the perfect gift for any occasion.',
    category: 'gift-boxes',
    base_price: null,
    images: [],
    is_available: true,
    is_featured: true,
    created_at: '',
  },
]

export default function ShopPage() {
  return (
    <>
      <ShopHero />
      <Suspense fallback={<div className="bg-cream h-[57px] border-b border-edge" />}>
        <ShopFilters />
      </Suspense>
      <Suspense
        fallback={
          <section className="px-20 py-16 bg-cream">
            <p className="text-sm text-muted mb-8">Loading products…</p>
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-[340px] border border-edge animate-pulse" />
              ))}
            </div>
          </section>
        }
      >
        <ProductGrid products={DUMMY_PRODUCTS} />
      </Suspense>
    </>
  )
}
