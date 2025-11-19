// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(), // 'client', 'admin', 'vendor', 'cashier'
    isAdmin: v.optional(v.boolean()),
    isSuperAdmin: v.optional(v.boolean()),
    createdAt: v.string(),
  }).index('by_email', ['email']),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    cost: v.optional(v.number()), // COGS per unit for profit calculation
    image: v.optional(v.string()), // Image URL
    category: v.string(), // 'headphones', 'earphones', 'speakers'
    stock: v.number(),
    vendor: v.optional(v.string()), // Vendor ID
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_category', ['category'])
    .index('by_vendor', ['vendor']),

  stock: defineTable({
    productId: v.id('products'),
    quantity: v.number(),
    reorderLevel: v.number(),
    lastRestockDate: v.optional(v.string()),
    restockHistory: v.optional(
      v.array(
        v.object({
          quantityAdded: v.number(),
          date: v.string(),
          addedBy: v.string(), // Admin/vendor name
        })
      )
    ),
  }).index('by_product', ['productId']),

  vendors: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    businessName: v.string(),
    registrationNumber: v.optional(v.string()),
    status: v.string(), // 'active', 'inactive', 'pending'
    createdAt: v.string(),
    createdBy: v.string(), // Admin ID
  }).index('by_email', ['email']),

  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.string(), // 'user', 'cashier'
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    status: v.string(), // 'active', 'inactive'
    createdAt: v.string(),
    createdBy: v.string(), // Admin ID
  }).index('by_email', ['email']),

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
        cost: v.optional(v.number()), // COGS per unit at time of sale
        qty: v.number(),
      })
    ),
    totals: v.object({
      subtotal: v.number(),
      shipping: v.number(),
      taxes: v.number(),
      total: v.number(),
    }),
    // Track all adjustments to revenue
    refunds: v.optional(
      v.array(
        v.object({
          amount: v.number(),
          reason: v.string(),
          date: v.string(),
          processedBy: v.string(), // Admin ID
        })
      )
    ),
    discounts: v.optional(
      v.array(
        v.object({
          amount: v.number(),
          code: v.optional(v.string()),
          description: v.string(),
          appliedDate: v.string(),
        })
      )
    ),
    status: v.string(),
    tracking: v.optional(
      v.object({
        trackingNumber: v.optional(v.string()),
        carrier: v.optional(v.string()),
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
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    verified: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_product', ['productId'])
    .index('by_order', ['orderId'])
    .index('by_email', ['customerEmail']),
});
