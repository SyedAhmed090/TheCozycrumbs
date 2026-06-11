import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let order = null
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()
    order = data
  } catch {}

  if (!order) notFound()

  return <OrderConfirmation order={order} />
}
