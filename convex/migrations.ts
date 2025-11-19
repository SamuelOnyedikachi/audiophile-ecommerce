import { action, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

/**
 * Migration: Promote user to super-admin by email
 * IMPORTANT: This should only be called locally or via a secure admin endpoint.
 * Usage: run from Convex dashboard or call via a protected endpoint.
 */
export const promoteToSuperAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    // Find user by email
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Promote to super-admin
    await ctx.db.patch(user._id, {
      isAdmin: true,
      isSuperAdmin: true,
      role: 'superadmin',
    });

    console.log(`✅ User ${email} promoted to super-admin`);
    return { success: true, userId: user._id, email };
  },
});

/**
 * Migration: Set default isAdmin/isSuperAdmin for users lacking these fields
 * Ensures existing records without these flags are normalized.
 */
export const normalizeUserFlags = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    let patched = 0;

    for (const u of users) {
      const needsPatch =
        u.isAdmin === undefined || u.isSuperAdmin === undefined;

      if (needsPatch) {
        await ctx.db.patch(u._id, {
          isAdmin: u.isAdmin ?? false,
          isSuperAdmin: u.isSuperAdmin ?? false,
        });
        patched++;
      }
    }

    console.log(`✅ Patched ${patched} users with default flags`);
    return { success: true, patched };
  },
});

/**
 * Helper Query: Get all users (internal use for actions)
 */
export const getAllUsersInternal = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});

/**
 * Action: List all users and their admin status (for debugging/auditing)
 */
export const listUsersAdminStatus = action({
  handler: async (
    ctx
  ): Promise<
    Array<{
      id: string;
      email: string;
      name: string;
      role: string;
      isAdmin: boolean;
      isSuperAdmin: boolean;
    }>
  > => {
    const users = await ctx.runQuery(api.migrations.getAllUsersInternal);
    const adminUsers = (
      users as Array<{
        _id: string;
        email: string;
        name: string;
        role: string;
        isAdmin?: boolean;
        isSuperAdmin?: boolean;
      }>
    ).map((u) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      isAdmin: !!u.isAdmin,
      isSuperAdmin: !!u.isSuperAdmin,
    }));

    console.log('📋 Admin Users:', adminUsers);
    return adminUsers;
  },
});
