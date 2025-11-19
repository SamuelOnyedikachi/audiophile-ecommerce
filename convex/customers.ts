import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get all customers
export const getAllCustomers = query({
  handler: async (ctx) => {
    return await ctx.db.query('customers').collect();
  },
});

// Get customer by email
export const getCustomerByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const customers = await ctx.db
      .query('customers')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .collect();
    return customers.length > 0 ? customers[0] : null;
  },
});

// Create customer
export const createCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.string(), // 'user' or 'cashier'
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if customer already exists
    const existing = await ctx.db
      .query('customers')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .collect();

    if (existing.length > 0) {
      throw new Error('Customer with this email already exists');
    }

    const customerId = await ctx.db.insert('customers', {
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: args.role,
      address: args.address,
      city: args.city,
      country: args.country,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: args.createdBy,
    });

    return customerId;
  },
});

// Update customer
export const updateCustomer = mutation({
  args: {
    customerId: v.id('customers'),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) throw new Error('Customer not found');

    await ctx.db.patch(args.customerId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.phone !== undefined && { phone: args.phone }),
      ...(args.address !== undefined && { address: args.address }),
      ...(args.city !== undefined && { city: args.city }),
      ...(args.country !== undefined && { country: args.country }),
      ...(args.role !== undefined && { role: args.role }),
      ...(args.status !== undefined && { status: args.status }),
    });

    return args.customerId;
  },
});

// Delete customer
export const deleteCustomer = mutation({
  args: { customerId: v.id('customers') },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) throw new Error('Customer not found');

    await ctx.db.delete(args.customerId);
    return args.customerId;
  },
});
