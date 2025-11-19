import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get all vendors
export const getAllVendors = query({
  handler: async (ctx) => {
    return await ctx.db.query('vendors').collect();
  },
});

// Get vendor by email
export const getVendorByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const vendors = await ctx.db
      .query('vendors')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .collect();
    return vendors.length > 0 ? vendors[0] : null;
  },
});

// Create vendor
export const createVendor = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    businessName: v.string(),
    registrationNumber: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if vendor already exists
    const existing = await ctx.db
      .query('vendors')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .collect();

    if (existing.length > 0) {
      throw new Error('Vendor with this email already exists');
    }

    const vendorId = await ctx.db.insert('vendors', {
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      country: args.country,
      businessName: args.businessName,
      registrationNumber: args.registrationNumber,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: args.createdBy,
    });

    return vendorId;
  },
});

// Update vendor
export const updateVendor = mutation({
  args: {
    vendorId: v.id('vendors'),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    businessName: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor) throw new Error('Vendor not found');

    await ctx.db.patch(args.vendorId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.phone !== undefined && { phone: args.phone }),
      ...(args.address !== undefined && { address: args.address }),
      ...(args.city !== undefined && { city: args.city }),
      ...(args.country !== undefined && { country: args.country }),
      ...(args.businessName !== undefined && {
        businessName: args.businessName,
      }),
      ...(args.status !== undefined && { status: args.status }),
    });

    return args.vendorId;
  },
});

// Delete vendor
export const deleteVendor = mutation({
  args: { vendorId: v.id('vendors') },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor) throw new Error('Vendor not found');

    await ctx.db.delete(args.vendorId);
    return args.vendorId;
  },
});
