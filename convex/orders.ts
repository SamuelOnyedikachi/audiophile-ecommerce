// convex/orders.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Mutation to create a new order.
 * Called from CheckoutForm via useMutation(api.orders.createOrder)
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
    // Insert order into database
    const id = await ctx.db.insert('orders', args);

    // Retrieve the saved order
    const savedOrder = await ctx.db.get(id);

    return {
      _id: id,
      ...savedOrder,
    };
  },
});
