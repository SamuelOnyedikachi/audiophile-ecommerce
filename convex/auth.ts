// convex/auth.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Sign up a new user
 */
export const signup = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, email, password, role = 'client' } = args;

    // Check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user (in production, hash the password!)
    const isAdmin = role === 'admin';
    const isSuperAdmin = role === 'superadmin' || role === 'super-admin';
    const userId = await ctx.db.insert('users', {
      name,
      email: email.toLowerCase(),
      password, // WARNING: Not hashed! Use bcrypt or similar in production
      role,
      isAdmin,
      isSuperAdmin,
      createdAt: new Date().toISOString(),
    });

    return { success: true, userId };
  },
});

/**
 * Log in a user
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = args;

    // Find user by email
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password (in production, use proper hashing comparison)
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: !!user.isAdmin,
        isSuperAdmin: !!user.isSuperAdmin,
      },
    };
  },
});

/**
 * Get current user by ID
 */
export const getCurrentUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
});

/**
 * Check if email exists
 */
export const emailExists = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    return !!user;
  },
});
