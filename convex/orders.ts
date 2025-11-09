// convex/orders.ts
import { mutation, query, action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

/* -------------------- TYPES -------------------- */
type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  _id: string;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; zipcode: string; country: string };
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; taxes: number; total: number };
  status: string;
  tracking?: any;
  deliveryConfirmed?: boolean;
};

/* -------------------- UTIL: SEND EMAIL VIA BREVO -------------------- */
async function sendBrevoEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log('🔔 sendBrevoEmail called');
  console.log('📧 Recipient:', to);
  console.log('📝 Subject:', subject);

  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ CRITICAL: BREVO_API_KEY is not set!');
    console.error('📝 Please add it in Convex Dashboard: Settings → Environment Variables');
    throw new Error('Missing BREVO_API_KEY');
  }

  console.log('✅ BREVO_API_KEY found (length:', apiKey.length, ')');

  const payload = {
    sender: { name: 'Audiophile', email: 'velionsystems@gmail.com' },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  console.log('📤 Sending to Brevo API...');
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Response status:', res.status);

    const responseText = await res.text();
    console.log('📨 Response body:', responseText);

    if (!res.ok) {
      console.error('❌ Brevo API error:', responseText);
      throw new Error(`Brevo API error: ${responseText}`);
    }

    console.log(`✅ ✨ Email sent successfully to ${to}!`);
    return JSON.parse(responseText);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

/* -------------------- QUERIES -------------------- */
export const getOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => await ctx.db.get(args.orderId),
});

export const getOrdersByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query('orders')
      .withIndex('by_email', (q) => q.eq('customer.email', args.email))
      .order('desc')
      .collect(),
});

export const getAllOrders = query({
  handler: async (ctx) => await ctx.db.query('orders').order('desc').collect(),
});

/* -------------------- GET PRODUCT REVIEWS -------------------- */
export const getProductReviews = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reviews')
      .withIndex('by_product', (q) => q.eq('productId', args.productId))
      .order('desc')
      .collect();
  },
});

/* -------------------- CONFIRM DELIVERY -------------------- */
export const confirmDelivery = mutation({
  args: {
    orderId: v.id('orders'),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');

    await ctx.db.patch(args.orderId, {
      status: 'delivered',
      deliveryConfirmed: true,
      deliveryConfirmedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

/* -------------------- CREATE REVIEW -------------------- */
export const createReview = mutation({
  args: {
    orderId: v.id('orders'),
    productId: v.string(),
    productName: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error('Order not found');
    if (!order.deliveryConfirmed) {
      throw new Error('Cannot review until order is delivered');
    }

    const reviewId = await ctx.db.insert('reviews', {
      ...args,
      verified: true,
      createdAt: new Date().toISOString(),
    });

    return { success: true, reviewId };
  },
});

/* -------------------- CREATE ORDER -------------------- */
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
    console.log('🛒 Creating new order...');
    
    const id = await ctx.db.insert('orders', {
      ...args,
      tracking: {
        history: [
          {
            status: 'pending',
            location: 'Order Placed',
            timestamp: new Date().toISOString(),
            description:
              'Your order has been received and is being processed.',
          },
        ],
      },
      deliveryConfirmed: false,
    });

    console.log('✅ Order created with ID:', id);
    console.log('📧 Scheduling confirmation email...');

    await ctx.scheduler.runAfter(0, api.orders.sendOrderConfirmation, {
      orderId: id,
    });

    console.log('✅ Email scheduled');

    const savedOrder = await ctx.db.get(id);
    return { _id: id, ...savedOrder };
  },
});

/* -------------------- ORDER CONFIRMATION EMAIL -------------------- */
export const sendOrderConfirmation = action({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    console.log('📧 sendOrderConfirmation ACTION started');
    console.log('📦 Order ID:', args.orderId);

    const order = (await ctx.runQuery(api.orders.getOrder, {
      orderId: args.orderId,
    })) as Order | null;

    if (!order) {
      console.error('❌ Order not found:', args.orderId);
      return;
    }

    console.log('✅ Order found:', order.customer.email);

    const html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h2>Hi ${order.customer.name},</h2>
        <p>Thank you for your order! Here's your summary:</p>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li>${item.name} × ${item.qty} — $${(
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
        <p>We'll notify you when your order ships.</p>
        <p>— The Audiophile Team</p>
      </div>
    `;

    try {
      await sendBrevoEmail({
        to: order.customer.email,
        subject: `Order Confirmation — ${args.orderId}`,
        html,
      });
      console.log('✅ ✨ Order confirmation email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send order confirmation:', error);
      throw error;
    }
  },
});

/* -------------------- UPDATE TRACKING -------------------- */
export const updateOrderTracking = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
    carrier: v.optional(v.string()),
    currentLocation: v.string(),
    estimatedDelivery: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🚚 Updating order tracking...');
    console.log('📦 Order ID:', args.orderId);
    console.log('📍 New status:', args.status);

    const order = (await ctx.db.get(args.orderId)) as Order | null;
    if (!order) {
      console.error('❌ Order not found:', args.orderId);
      throw new Error('Order not found');
    }

    console.log('✅ Order found:', order.customer.email);

    const newUpdate = {
      status: args.status,
      location: args.currentLocation,
      description: args.description,
      timestamp: new Date().toISOString(),
    };

    const tracking = {
      trackingNumber: args.trackingNumber || order.tracking?.trackingNumber,
      carrier: args.carrier || order.tracking?.carrier,
      currentLocation: args.currentLocation,
      estimatedDelivery:
        args.estimatedDelivery || order.tracking?.estimatedDelivery,
      lastUpdated: new Date().toISOString(),
      history: [...(order.tracking?.history || []), newUpdate],
    };

    await ctx.db.patch(args.orderId, { status: args.status, tracking });
    console.log('✅ Order tracking updated in database');

    console.log('📧 Scheduling tracking update email...');
    await ctx.scheduler.runAfter(0, api.orders.sendTrackingUpdateEmail, {
      orderId: args.orderId,
      update: newUpdate,
    });

    console.log('✅ Email scheduled');
    return { success: true };
  },
});

/* -------------------- TRACKING UPDATE EMAIL -------------------- */
export const sendTrackingUpdateEmail = action({
  args: {
    orderId: v.id('orders'),
    update: v.object({
      status: v.string(),
      location: v.string(),
      description: v.string(),
      timestamp: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    console.log('📧 sendTrackingUpdateEmail ACTION started');
    console.log('📦 Order ID:', args.orderId);

    const order = (await ctx.runQuery(api.orders.getOrder, {
      orderId: args.orderId,
    })) as Order | null;

    if (!order) {
      console.error('❌ Order not found:', args.orderId);
      return;
    }

    console.log('✅ Order found:', order.customer.email);

    const html = `
      <div style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;">
        <h2 style="color:#d87d4a;">Hi ${order.customer.name},</h2>
        <p>Your order status has been updated:</p>
        <div style="background:#f7f7f7;padding:15px;border-radius:8px;margin:15px 0;">
          <p><strong>Status:</strong> ${args.update.status}</p>
          <p><strong>Location:</strong> ${args.update.location}</p>
          <p><strong>Details:</strong> ${args.update.description}</p>
          <p><strong>Time:</strong> ${new Date(
            args.update.timestamp
          ).toLocaleString()}</p>
        </div>
        <p>Track your order here:</p>
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }/track-order" 
           style="display:inline-block;background:#d87d4a;color:#fff;padding:10px 20px;
                  border-radius:5px;text-decoration:none;">Track Order</a>
        <p style="margin-top:20px;">— The Audiophile Team</p>
      </div>
    `;

    try {
      await sendBrevoEmail({
        to: order.customer.email,
        subject: `Order Update — ${args.update.status}`,
        html,
      });
      console.log('✅ ✨ Tracking update email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send tracking update:', error);
      throw error;
    }
  },
});