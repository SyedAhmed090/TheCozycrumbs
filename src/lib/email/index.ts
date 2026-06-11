import nodemailer from 'nodemailer'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })
}

function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

const FROM = process.env.EMAIL_FROM ?? 'The Cozy Crumb <noreply@thecozycrumbs.com>'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? 'asad@cloudfruit.com'

// ── Order confirmation to customer ─────────────────────────────────────────

export async function sendOrderConfirmation(order: {
  id: string
  customerName: string
  customerEmail: string
  deliveryDate: string
  paymentMethod: string
  subtotal: number
  discountAmount?: number
  items: Array<{ productName: string; quantity: number; price: number | null; variant: Record<string, string> }>
}) {
  if (!emailConfigured()) return

  const paymentLabel = order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery'
  const finalTotal = order.subtotal - (order.discountAmount ?? 0)

  const itemRows = order.items.map((item) => {
    const variantStr = Object.values(item.variant).filter(Boolean).join(' · ')
    const lineTotal = item.price != null ? `PKR ${(item.price * item.quantity).toLocaleString()}` : 'TBD'
    return `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ebe6;">
          <strong>${item.productName}</strong>${variantStr ? `<br><span style="color:#9B8B7A;font-size:12px;">${variantStr}</span>` : ''}
        </td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ebe6;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ebe6;text-align:right;">${lineTotal}</td>
      </tr>`
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#faf7f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2A2A2A;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ede8e3;">
        <div style="background:#5A3E2B;padding:32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:400;font-family:Georgia,serif;">The Cozy Crumb</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Order Confirmation</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:16px;margin:0 0 8px;">Hi ${order.customerName},</p>
          <p style="font-size:14px;color:#6B5744;margin:0 0 24px;">Your order has been placed successfully! We'll confirm it shortly and get baking.</p>

          <div style="background:#faf7f4;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
            <p style="margin:0;font-family:monospace;font-size:13px;color:#2A2A2A;">${order.id}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#faf7f4;">
                <th style="padding:10px 16px;text-align:left;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Item</th>
                <th style="padding:10px 16px;text-align:center;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Qty</th>
                <th style="padding:10px 16px;text-align:right;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          ${order.discountAmount ? `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#9B8B7A;border-top:1px solid #f0ebe6;"><span>Discount</span><span>- PKR ${order.discountAmount.toLocaleString()}</span></div>` : ''}
          <div style="display:flex;justify-content:space-between;padding:12px 0;font-size:16px;font-weight:700;border-top:1px solid #ede8e3;">
            <span>Total</span>
            <span style="color:#5A3E2B;">PKR ${finalTotal.toLocaleString()}</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px;">
            <div style="background:#faf7f4;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Delivery Date</p>
              <p style="margin:0;font-size:13px;font-weight:600;">${new Date(order.deliveryDate).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div style="background:#faf7f4;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 4px;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Payment</p>
              <p style="margin:0;font-size:13px;font-weight:600;">${paymentLabel}</p>
            </div>
          </div>

          ${order.paymentMethod === 'easypaisa' ? `
          <div style="background:#fff8ec;border:1px solid #e8c97a;border-radius:10px;padding:16px;margin-top:20px;">
            <p style="margin:0 0 6px;font-weight:600;font-size:14px;">Complete Your EasyPaisa Payment</p>
            <p style="margin:0;font-size:13px;color:#6B5744;">Send <strong>PKR ${finalTotal.toLocaleString()}</strong> to <strong>+92 335 0253548</strong> (Tooba Arsal). Use order ID as the reference.</p>
          </div>` : ''}

          <p style="margin:28px 0 0;font-size:13px;color:#9B8B7A;text-align:center;">Questions? WhatsApp us at <strong>+92 335 0253548</strong></p>
        </div>
        <div style="padding:20px;text-align:center;border-top:1px solid #f0ebe6;">
          <p style="margin:0;font-size:12px;color:#C4B0A0;">The Cozy Crumb · Karachi · Made with love</p>
        </div>
      </div>
    </body>
    </html>`

  await getTransporter().sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()} | The Cozy Crumb`,
    html,
  })
}

// ── New order alert to admin ───────────────────────────────────────────────

export async function sendAdminOrderAlert(order: {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerEmail?: string | null
  deliveryDate: string
  paymentMethod: string
  subtotal: number
  notes?: string | null
  items: Array<{ productName: string; quantity: number; price: number | null; variant: Record<string, string> }>
}) {
  if (!emailConfigured()) return

  const paymentLabel = order.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Cash on Delivery'
  const itemList = order.items.map((item) => {
    const variantStr = Object.values(item.variant).filter(Boolean).join(' · ')
    return `&bull; ${item.productName} &times; ${item.quantity}${variantStr ? ` (${variantStr})` : ''}${item.price != null ? ` &mdash; PKR ${(item.price * item.quantity).toLocaleString()}` : ''}`
  }).join('<br>')

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#faf7f4;font-family:Helvetica,Arial,sans-serif;color:#2A2A2A;">
      <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede8e3;">
        <div style="background:#D97A52;padding:24px 32px;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Order Received!</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">#${order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div style="padding:28px 32px;">
          <h3 style="margin:0 0 12px;font-size:13px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Customer</h3>
          <p style="margin:0 0 4px;"><strong>${order.customerName}</strong></p>
          <p style="margin:0 0 4px;font-size:14px;">${order.customerPhone}</p>
          ${order.customerEmail ? `<p style="margin:0 0 4px;font-size:14px;">${order.customerEmail}</p>` : ''}
          <p style="margin:0;font-size:14px;color:#6B5744;">${order.customerAddress}</p>

          <hr style="border:none;border-top:1px solid #f0ebe6;margin:20px 0;">

          <h3 style="margin:0 0 12px;font-size:13px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Order Items</h3>
          <p style="margin:0;font-size:14px;line-height:1.8;">${itemList}</p>

          <hr style="border:none;border-top:1px solid #f0ebe6;margin:20px 0;">

          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
            <span style="color:#9B8B7A;">Total</span>
            <strong>PKR ${order.subtotal.toLocaleString()}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
            <span style="color:#9B8B7A;">Payment</span>
            <strong>${paymentLabel}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:14px;">
            <span style="color:#9B8B7A;">Delivery</span>
            <strong>${new Date(order.deliveryDate).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
          </div>

          ${order.notes ? `<div style="background:#faf7f4;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:13px;"><strong>Notes:</strong> ${order.notes}</div>` : ''}

          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecozycrumbs.com'}/admin/orders/${order.id}"
             style="display:block;margin-top:24px;text-align:center;background:#5A3E2B;color:#fff;padding:12px;border-radius:50px;font-weight:600;font-size:14px;text-decoration:none;">
            View Order in Admin
          </a>
        </div>
      </div>
    </body>
    </html>`

  await getTransporter().sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Order #${order.id.slice(0, 8).toUpperCase()} — ${order.customerName} — PKR ${order.subtotal.toLocaleString()}`,
    html,
  })
}

// ── Order status update to customer ───────────────────────────────────────

export async function sendStatusUpdate(order: {
  id: string
  customerName: string
  customerEmail: string
  status: string
  deliveryDate: string
}) {
  if (!emailConfigured()) return

  const STATUS_MESSAGES: Record<string, { label: string; message: string; color: string }> = {
    confirmed: {
      label: 'Order Confirmed!',
      message: "Great news! We've confirmed your order and are preparing your treats.",
      color: '#3B82F6',
    },
    baking: {
      label: "We're Baking!",
      message: 'Your order is in the oven! Our bakers are crafting your treats with love.',
      color: '#F97316',
    },
    out_for_delivery: {
      label: 'Out for Delivery!',
      message: "Your treats are on their way! Keep an eye out for our delivery.",
      color: '#8B5CF6',
    },
    delivered: {
      label: 'Delivered!',
      message: 'Your order has been delivered. We hope you enjoy every bite!',
      color: '#10B981',
    },
    cancelled: {
      label: 'Order Cancelled',
      message: 'Your order has been cancelled. Please contact us if this was unexpected.',
      color: '#EF4444',
    },
  }

  const info = STATUS_MESSAGES[order.status]
  if (!info) return

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#faf7f4;font-family:Helvetica,Arial,sans-serif;color:#2A2A2A;">
      <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede8e3;">
        <div style="background:${info.color};padding:28px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:400;font-family:Georgia,serif;">${info.label}</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <p style="font-size:16px;margin:0 0 8px;">Hi ${order.customerName},</p>
          <p style="font-size:14px;color:#6B5744;margin:0 0 24px;">${info.message}</p>
          <div style="background:#faf7f4;border-radius:10px;padding:14px 20px;display:inline-block;margin-bottom:24px;">
            <p style="margin:0 0 2px;font-size:11px;color:#9B8B7A;text-transform:uppercase;letter-spacing:1px;">Order</p>
            <p style="margin:0;font-family:monospace;font-size:13px;">#${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="font-size:13px;color:#9B8B7A;margin:0;">Questions? WhatsApp us at <strong>+92 335 0253548</strong></p>
        </div>
        <div style="padding:16px;text-align:center;border-top:1px solid #f0ebe6;">
          <p style="margin:0;font-size:12px;color:#C4B0A0;">The Cozy Crumb · Karachi</p>
        </div>
      </div>
    </body>
    </html>`

  await getTransporter().sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `${info.label} — Order #${order.id.slice(0, 8).toUpperCase()} | The Cozy Crumb`,
    html,
  })
}
