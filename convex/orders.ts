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
  createdAt: string;
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

    // Build items rows for table
    const itemsRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0;">
            ${item.name}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">
            ${item.qty}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
            ${item.price.toFixed(2)}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 600;">
            ${(item.price * item.qty).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #d87d4a; padding: 40px 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 2px;">
                      AUDIOPHILE
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #333333; font-size: 24px; font-weight: 600;">
                      Hi ${order.customer.name},
                    </h2>
                    <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Thank you for your order! Here's a summary of your purchase:
                    </p>

                    <!-- Order Details -->
                    <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Order ID:</strong> ${args.orderId}
                      </p>
                      <p style="margin: 0; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    <!-- Order Items Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #f9f9f9;">
                          <th style="padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Product
                          </th>
                          <th style="padding: 12px 8px; text-align: center; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Qty
                          </th>
                          <th style="padding: 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Price
                          </th>
                          <th style="padding: 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsRows}
                      </tbody>
                    </table>

                    <!-- Order Summary -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 15px;">
                          Subtotal
                        </td>
                        <td style="padding: 8px 0; text-align: right; color: #333333; font-size: 15px;">
                          ${order.totals.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 15px;">
                          Shipping
                        </td>
                        <td style="padding: 8px 0; text-align: right; color: #333333; font-size: 15px;">
                          ${order.totals.shipping.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 15px;">
                          Taxes
                        </td>
                        <td style="padding: 8px 0; text-align: right; color: #333333; font-size: 15px;">
                          ${order.totals.taxes.toFixed(2)}
                        </td>
                      </tr>
                      <tr style="border-top: 2px solid #e0e0e0;">
                        <td style="padding: 16px 0 0; color: #333333; font-size: 18px; font-weight: 600;">
                          Grand Total
                        </td>
                        <td style="padding: 16px 0 0; text-align: right; color: #d87d4a; font-size: 20px; font-weight: 700;">
                          ${order.totals.total.toFixed(2)}
                        </td>
                      </tr>
                    </table>

                    <!-- Shipping Address -->
                    <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 12px; color: #333333; font-size: 16px; font-weight: 600;">
                        Shipping Address
                      </h3>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        ${order.customer.name}<br/>
                        ${order.shipping.address}<br/>
                        ${order.shipping.city}, ${order.shipping.zipcode}<br/>
                        ${order.shipping.country}
                      </p>
                    </div>

                    <p style="margin: 0 0 16px; color: #666666; font-size: 14px; line-height: 1.5;">
                      We'll send you a shipping confirmation email as soon as your order ships.
                    </p>

                    <!-- Track Order Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                      <tr>
                        <td style="background-color: #d87d4a; border-radius: 6px; text-align: center;">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order" 
                             style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                            TRACK YOUR ORDER
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 32px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 8px; color: #999999; font-size: 13px;">
                      Need help? Contact us at <a href="mailto:velionsystems@gmail.com" style="color: #d87d4a; text-decoration: none;">velionsystems@gmail.com</a>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} Audiophile. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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

    // Status emoji
    const statusEmoji: Record<string, string> = {
      pending: '⏳',
      processing: '📦',
      shipped: '🚚',
      'in-transit': '✈️',
      'out-for-delivery': '🚗',
      delivered: '✅',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #d87d4a; padding: 40px 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 2px;">
                      AUDIOPHILE
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #333333; font-size: 24px; font-weight: 600;">
                      Hi ${order.customer.name},
                    </h2>
                    <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your order status has been updated! Here are the latest details:
                    </p>

                    <!-- Status Update Box -->
                    <div style="background: linear-gradient(135deg, #d87d4a 0%, #fbaf85 100%); border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 12px;">
                        ${statusEmoji[args.update.status] || '📦'}
                      </div>
                      <h3 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        ${args.update.status.replace('-', ' ')}
                      </h3>
                    </div>

                    <!-- Update Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                Location
                              </td>
                              <td style="color: #333333; font-size: 15px; text-align: right;">
                                ${args.update.location}
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #999999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding-top: 12px;">
                                Updated
                              </td>
                              <td style="color: #333333; font-size: 15px; text-align: right; padding-top: 12px;">
                                ${new Date(args.update.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          </table>
                          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                              ${args.update.description}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Order Summary -->
                    <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 12px; color: #333333; font-size: 16px; font-weight: 600;">
                        Order Summary
                      </h3>
                      <p style="margin: 0 0 4px; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Order ID:</strong> ${args.orderId}
                      </p>
                      <p style="margin: 0 0 4px; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Total:</strong> ${order.totals.total.toFixed(2)}
                      </p>
                      ${order.tracking?.carrier ? `
                      <p style="margin: 0 0 4px; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Carrier:</strong> ${order.tracking.carrier}
                      </p>
                      ` : ''}
                      ${order.tracking?.trackingNumber ? `
                      <p style="margin: 0; color: #666666; font-size: 14px;">
                        <strong style="color: #333333;">Tracking #:</strong> ${order.tracking.trackingNumber}
                      </p>
                      ` : ''}
                    </div>

                    <!-- Track Order Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                      <tr>
                        <td style="background-color: #d87d4a; border-radius: 6px; text-align: center;">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order" 
                             style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                            VIEW FULL TRACKING DETAILS
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 24px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                      You can track your order anytime by entering your email at our tracking page.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 32px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 8px; color: #999999; font-size: 13px;">
                      Need help? Contact us at <a href="mailto:velionsystems@gmail.com" style="color: #d87d4a; text-decoration: none;">velionsystems@gmail.com</a>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © ${new Date().getFullYear()} Audiophile. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await sendBrevoEmail({
        to: order.customer.email,
        subject: `Order Update — ${args.update.status.toUpperCase().replace('-', ' ')}`,
        html,
      });
      console.log('✅ ✨ Tracking update email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send tracking update:', error);
      throw error;
    }
  },
});