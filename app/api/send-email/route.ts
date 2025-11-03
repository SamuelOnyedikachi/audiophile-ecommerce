import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.FROM_EMAIL || 'Audiophile <onboarding@resend.dev>';
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@resend.dev';
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!RESEND_API_KEY)
      return new NextResponse('Missing RESEND_API_KEY', { status: 500 });

    const itemsHtml = order.items
      .map(
        (it: any) => `
        <tr>
          <td style="padding:8px 0">${it.name} x ${it.qty}</td>
          <td style="padding:8px 0;text-align:right">$${(
            it.price * it.qty
          ).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <div style="font-family:system-ui,Arial;color:#111;line-height:1.4">
        <h2>Hi ${order.customer.name},</h2>
        <p>Thanks for your order — here is a summary:</p>
        <table width="100%" style="margin-top:16px">
          ${itemsHtml}
          <tr><td style="padding-top:12px">Subtotal</td><td style="text-align:right">$${order.totals.subtotal.toFixed(
            2
          )}</td></tr>
          <tr><td>Shipping</td><td style="text-align:right">$${order.totals.shipping.toFixed(
            2
          )}</td></tr>
          <tr><td>Taxes</td><td style="text-align:right">$${order.totals.taxes.toFixed(
            2
          )}</td></tr>
          <tr style="font-weight:bold"><td>Total</td><td style="text-align:right">$${order.totals.total.toFixed(
            2
          )}</td></tr>
        </table>
        <p style="margin-top:20px">Shipping to: ${order.shipping.address}, ${
          order.shipping.city
        }, ${order.shipping.zipcode}, ${order.shipping.country}</p>
        <p style="margin-top:20px">If you need help, contact ${SUPPORT_EMAIL}.</p>
        <p><a href="${APP_URL}/confirmation?orderId=${order._id}">View your order</a></p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from,
      to: [order.customer.email],
      subject: `Order confirmation — ${order._id}`,
      html,
    });

    if (error) {
      console.error('Resend error', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new NextResponse('Server error', { status: 500 });
  }
}
