// export async function sendOrderEmail(order: any) {
//   const apiKey = process.env.BREVO_API_KEY;
//   const from = process.env.FROM_EMAIL || 'Audiophile <onboarding@resend.dev>';
//   const support = process.env.SUPPORT_EMAIL || 'support@resend.dev';
//   const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

//   const itemsHtml = order.items
//     .map(
//       (it: any) =>
//         `<tr><td>${it.name} x ${it.qty}</td><td style="text-align:right">$${(it.price * it.qty).toFixed(2)}</td></tr>`
//     )
//     .join('');

//   const html = `<div><h2>Hi ${order.customer.name}</h2><p>Thanks for your order</p><table>${itemsHtml}</table><p>Total: ${order.totals.total}</p><p>Support: ${support}</p><p><a href="${appUrl}/confirmation?orderId=${order._id}">View order</a></p></div>`;

//   const res = await fetch('https://api.resend.com/emails', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       from,
//       to: order.customer.email,
//       subject: `Order ${order._id}`,
//       html,
//     }),
//   });

//   if (!res.ok) {
//     const txt = await res.text();
//     throw new Error(`Resend failed: ${txt}`);
//   }

//   return true;
// }
