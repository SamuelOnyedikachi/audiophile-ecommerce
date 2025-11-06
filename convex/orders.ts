// // convex/orders.ts
// import { mutation, query, action } from './_generated/server';
// import { v } from 'convex/values';
// import { api } from './_generated/api';

// /**
//  * Get a single order by ID
//  */
// export const getOrder = query({
//   args: { orderId: v.id('orders') },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.orderId);
//   },
// });

// /**
//  * Get all orders for a specific email
//  */
// export const getOrdersByEmail = query({
//   args: { email: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query('orders')
//       .withIndex('by_email', (q) => q.eq('customer.email', args.email))
//       .order('desc')
//       .collect();
//   },
// });

// /**
//  * Create a new order
//  * (includes tracking + automatic confirmation email)
//  */
// export const createOrder = mutation({
//   args: {
//     customer: v.object({
//       name: v.string(),
//       email: v.string(),
//       phone: v.string(),
//     }),
//     shipping: v.object({
//       address: v.string(),
//       city: v.string(),
//       zipcode: v.string(),
//       country: v.string(),
//     }),
//     items: v.array(
//       v.object({
//         id: v.string(),
//         name: v.string(),
//         price: v.number(),
//         qty: v.number(),
//       })
//     ),
//     totals: v.object({
//       subtotal: v.number(),
//       shipping: v.number(),
//       taxes: v.number(),
//       total: v.number(),
//     }),
//     status: v.string(),
//     createdAt: v.string(),
//   },
//   handler: async (ctx, args) => {
//     // Insert order into database
//     const id = await ctx.db.insert('orders', {
//       ...args,
//       tracking: {
//         history: [
//           {
//             status: 'Pending',
//             location: 'Order Placed',
//             timestamp: new Date().toISOString(),
//             description: 'Your order has been received and is being processed.',
//           },
//         ],
//       },
//       deliveryConfirmed: false,
//     });

//     // Send confirmation email (same logic preserved)
//     await ctx.scheduler.runAfter(0, api.orders.sendOrderConfirmation, {
//       orderId: id,
//     });

//     const savedOrder = await ctx.db.get(id);
//     return { _id: id, ...savedOrder };
//   },
// });

// /**
//  * Send order confirmation email
//  * (This is the same logic your old version used — intact)
//  */
// export const sendOrderConfirmation = action({
//   args: { orderId: v.id('orders') },
//   handler: async (ctx, args) => {
//     const order = await ctx.runQuery(api.orders.getOrder, {
//       orderId: args.orderId,
//     });
//     if (!order) return;

//     const resendKey = process.env.RESEND_API_KEY;
//     if (!resendKey) throw new Error('Missing RESEND_API_KEY');

//     const response = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${resendKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: 'Audiophile <no-reply@audiophile.com>',
//         to: order.customer.email,
//         subject: `Order Confirmation — ${args.orderId}`,
//         html: `
//           <div style="font-family:Arial, sans-serif; color:#333;">
//             <h2>Hi ${order.customer.name},</h2>
//             <p>Thank you for your order! Here’s your summary:</p>
//             <ul>
//               ${order.items
//                 .map(
//                   (item) =>
//                     `<li>${item.name} x ${item.qty} — $${(
//                       item.price * item.qty
//                     ).toFixed(2)}</li>`
//                 )
//                 .join('')}
//             </ul>
//             <p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
//             <p><strong>Shipping address:</strong><br/>
//               ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.country}
//             </p>
//             <hr/>
//             <p>We’ll notify you when your order ships.</p>
//             <p>— The Audiophile Team</p>
//           </div>
//         `,
//       }),
//     });

//     const result = await response.json();
//     console.log('✅ Order confirmation email sent:', result);
//   },
// });
import { mutation, query, action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

/**
 * ✅ Get a single order by ID
 */
export const getOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

/**
 * ✅ Get all orders (for admin dashboard)
 */
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('orders').order('desc').collect();
  },
});

/**
 * ✅ Get all orders for a specific email
 */
export const getOrdersByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_email', (q) => q.eq('customer.email', args.email))
      .order('desc')
      .collect();
  },
});

/**
 * ✅ Create a new order
 */
export const createOrder = mutation({
  args: {
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    shipping: v.object({
      address: v.string(),
      city: v.string(),
      zipcode: v.string(),
      country: v.string(),
    }),
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        qty: v.number(),
      })
    ),
    totals: v.object({
      subtotal: v.number(),
      shipping: v.number(),
      taxes: v.number(),
      total: v.number(),
    }),
    status: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('orders', {
      ...args,
      tracking: {
        history: [
          {
            status: 'Pending',
            location: 'Order Placed',
            timestamp: new Date().toISOString(),
            description: 'Your order has been received and is being processed.',
          },
        ],
      },
      deliveryConfirmed: false,
    });

    // Send confirmation email
    await ctx.scheduler.runAfter(0, api.orders.sendOrderConfirmation, {
      orderId: id,
    });

    const savedOrder = await ctx.db.get(id);
    return { _id: id, ...savedOrder };
  },
});

/**
 * ✅ Update tracking information (for admin dashboard)
 */
export const updateOrderTracking = mutation({
  args: {
    orderId: v.id('orders'),
    trackingNumber: v.optional(v.string()),
    carrier: v.optional(v.string()),
    currentLocation: v.optional(v.string()),
    estimatedDelivery: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');

    const updatedTracking = {
      ...(order.tracking || {}),
      trackingNumber: args.trackingNumber ?? order.tracking?.trackingNumber,
      carrier: args.carrier ?? order.tracking?.carrier,
      currentLocation: args.currentLocation ?? order.tracking?.currentLocation,
      estimatedDelivery:
        args.estimatedDelivery ?? order.tracking?.estimatedDelivery,
      lastUpdated: new Date().toISOString(),
      history: [
        ...(order.tracking?.history || []),
        {
          status: args.status || 'Updated',
          location: args.currentLocation || '—',
          timestamp: new Date().toISOString(),
          description: `Order status updated to "${args.status || 'Updated'}"`,
        },
      ],
    };

    await ctx.db.patch(args.orderId, { tracking: updatedTracking });

    return { success: true, message: 'Order tracking updated successfully' };
  },
});

/**
 * ✅ Send order confirmation email
 */
export const sendOrderConfirmation = action({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.orders.getOrder, {
      orderId: args.orderId,
    });
    if (!order) return;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) throw new Error('Missing RESEND_API_KEY');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Audiophile <no-reply@audiophile.com>',
        to: order.customer.email,
        subject: `Order Confirmation — ${args.orderId}`,
        html: `
          <div style="font-family:Arial, sans-serif; color:#333;">
            <h2>Hi ${order.customer.name},</h2>
            <p>Thank you for your order! Here’s your summary:</p>
            <ul>
              ${order.items
                .map(
                  (item) =>
                    `<li>${item.name} x ${item.qty} — $${(
                      item.price * item.qty
                    ).toFixed(2)}</li>`
                )
                .join('')}
            </ul>
            <p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
            <p><strong>Shipping address:</strong><br/>
              ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.country}
            </p>
            <hr/>
            <p>We’ll notify you when your order ships.</p>
            <p>— The Audiophile Team</p>
          </div>
        `,
      }),
    });

    const result = await response.json();
    console.log('✅ Order confirmation email sent:', result);
  },
});
