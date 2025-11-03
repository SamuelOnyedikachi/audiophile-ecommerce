// convex/schema.ts
import { defineSchema } from 'convex/schema';

export default defineSchema({
  orders: {
    customer: { name: 'string', email: 'string', phone: 'string' },
    shipping: {
      address: 'string',
      city: 'string',
      zipcode: 'string',
      country: 'string',
    },
    items: [{ id: 'string', name: 'string', price: 'number', qty: 'number' }],
    totals: {
      subtotal: 'number',
      shipping: 'number',
      taxes: 'number',
      total: 'number',
    },
    status: 'string',
    createdAt: 'string',
  },
});
