import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './authHelpers';

/* -------------------- TYPES -------------------- */
export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
};

/* -------------------- QUERIES -------------------- */

/**
 * Get all users (admin-only query)
 * Returns list of users for admin dashboard
 */
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').order('desc').collect();
  },
});

/**
 * Get single user by ID
 */
export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/* -------------------- MUTATIONS -------------------- */

/**
 * Update user info and rights (super-admin only)
 * Allows updating: name, email, role, isAdmin, isSuperAdmin
 */
export const updateUserInfo = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    isSuperAdmin: v.optional(v.boolean()),
    callerUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify caller is super-admin
    const caller = await ctx.db.get(args.callerUserId);
    requireAdmin(caller);

    if (!caller?.isSuperAdmin) {
      throw new Error('Access denied: Super Administrator role required');
    }

    // Get target user
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check email uniqueness if changing email
    if (args.email && args.email !== user.email) {
      const newEmail = args.email.toLowerCase();
      const existingUser = await ctx.db
        .query('users')
        .withIndex('by_email', (q) => q.eq('email', newEmail))
        .first();

      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Update user with provided fields
    const emailToSet = args.email ? args.email.toLowerCase() : user.email;
    await ctx.db.patch(args.userId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.email !== undefined && { email: emailToSet }),
      ...(args.role !== undefined && { role: args.role }),
      ...(args.isAdmin !== undefined && { isAdmin: args.isAdmin }),
      ...(args.isSuperAdmin !== undefined && {
        isSuperAdmin: args.isSuperAdmin,
      }),
    });

    return { success: true, userId: args.userId };
  },
});

/**
 * Delete user (super-admin only)
 */
export const deleteUser = mutation({
  args: {
    userId: v.id('users'),
    callerUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify caller is super-admin
    const caller = await ctx.db.get(args.callerUserId);
    requireAdmin(caller);

    if (!caller?.isSuperAdmin) {
      throw new Error('Access denied: Super Administrator role required');
    }

    // Prevent self-deletion
    if (args.userId === args.callerUserId) {
      throw new Error('Cannot delete your own account');
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.delete(args.userId);

    return { success: true, deletedUserId: args.userId };
  },
});
