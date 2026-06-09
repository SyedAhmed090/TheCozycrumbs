import { createClient } from '@/lib/supabase/server'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <OrderConfirmation order={order} />
}
