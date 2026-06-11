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
  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <OrderConfirmation order={order} />
}
