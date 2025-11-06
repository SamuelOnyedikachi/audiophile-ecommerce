// // convex/schema.ts
// import { defineSchema, defineTable } from 'convex/server';
// import { v } from 'convex/values';

// export default defineSchema({
//   orders: defineTable({
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
//   }),
// });
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  orders: defineTable({
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
    // Enhanced status tracking
    status: v.string(), // 'pending', 'processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'cancelled'
    tracking: v.optional(
      v.object({
        trackingNumber: v.optional(v.string()),
        carrier: v.optional(v.string()), // 'DHL', 'FedEx', 'UPS', etc.
        currentLocation: v.optional(v.string()),
        estimatedDelivery: v.optional(v.string()),
        lastUpdated: v.optional(v.string()),
        history: v.optional(
          v.array(
            v.object({
              status: v.string(),
              location: v.string(),
              timestamp: v.string(),
              description: v.string(),
            })
          )
        ),
      })
    ),
    deliveryConfirmed: v.optional(v.boolean()),
    deliveryConfirmedAt: v.optional(v.string()),
    createdAt: v.string(),
  }).index('by_email', ['customer.email']),

  reviews: defineTable({
    orderId: v.id('orders'),
    productId: v.string(),
    productName: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    rating: v.number(), // 1-5
    title: v.string(),
    comment: v.string(),
    verified: v.boolean(), // True if purchased
    createdAt: v.string(),
  })
    .index('by_product', ['productId'])
    .index('by_order', ['orderId'])
    .index('by_email', ['customerEmail']),
});