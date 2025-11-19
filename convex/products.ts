import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './authHelpers';

// Query all products
export const getAllProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query('products').collect();
  },
});

// Query products by category
export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .collect();
  },
});

// Get single product by ID
export const getProductById = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Create new product
export const createProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    category: v.string(),
    stock: v.number(),
    vendor: v.optional(v.string()),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify user is admin
    const user = await ctx.db.get(args.userId);
    requireAdmin(user);

    const productId = await ctx.db.insert('products', {
      name: args.name,
      slug: args.slug,
      description: args.description,
      price: args.price,
      image: args.image,
      category: args.category,
      stock: args.stock,
      vendor: args.vendor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create stock entry
    await ctx.db.insert('stock', {
      productId,
      quantity: args.stock,
      reorderLevel: 10,
      lastRestockDate: new Date().toISOString(),
      restockHistory: [
        {
          quantityAdded: args.stock,
          date: new Date().toISOString(),
          addedBy: 'admin',
        },
      ],
    });

    return productId;
  },
});

// Update product
export const updateProduct = mutation({
  args: {
    productId: v.id('products'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    category: v.optional(v.string()),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify user is admin
    const user = await ctx.db.get(args.userId);
    requireAdmin(user);

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error('Product not found');

    await ctx.db.patch(args.productId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.slug !== undefined && { slug: args.slug }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.price !== undefined && { price: args.price }),
      ...(args.image !== undefined && { image: args.image }),
      ...(args.category !== undefined && { category: args.category }),
      updatedAt: new Date().toISOString(),
    });

    return args.productId;
  },
});

// Delete product
export const deleteProduct = mutation({
  args: {
    productId: v.id('products'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify user is admin
    const user = await ctx.db.get(args.userId);
    requireAdmin(user);

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error('Product not found');

    // Delete stock record
    const stockRecords = await ctx.db
      .query('stock')
      .withIndex('by_product', (q) => q.eq('productId', args.productId))
      .collect();

    for (const stock of stockRecords) {
      await ctx.db.delete(stock._id);
    }

    // Delete product
    await ctx.db.delete(args.productId);

    return args.productId;
  },
});

// Add stock to product
export const addStock = mutation({
  args: {
    productId: v.id('products'),
    quantity: v.number(),
    addedBy: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify user is admin
    const user = await ctx.db.get(args.userId);
    requireAdmin(user);

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error('Product not found');

    // Update product stock
    await ctx.db.patch(args.productId, {
      stock: product.stock + args.quantity,
      updatedAt: new Date().toISOString(),
    });

    // Get stock record
    const stockRecords = await ctx.db
      .query('stock')
      .withIndex('by_product', (q) => q.eq('productId', args.productId))
      .collect();

    if (stockRecords.length > 0) {
      const stockRecord = stockRecords[0];
      const history = stockRecord.restockHistory || [];

      await ctx.db.patch(stockRecord._id, {
        quantity: stockRecord.quantity + args.quantity,
        lastRestockDate: new Date().toISOString(),
        restockHistory: [
          ...history,
          {
            quantityAdded: args.quantity,
            date: new Date().toISOString(),
            addedBy: args.addedBy,
          },
        ],
      });
    }

    return args.productId;
  },
});

// Reduce stock
export const reduceStock = mutation({
  args: {
    productId: v.id('products'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error('Product not found');

    if (product.stock < args.quantity) {
      throw new Error('Insufficient stock');
    }

    await ctx.db.patch(args.productId, {
      stock: product.stock - args.quantity,
      updatedAt: new Date().toISOString(),
    });

    return args.productId;
  },
});

// Get stock balance for product
export const getStockBalance = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error('Product not found');

    const stockRecords = await ctx.db
      .query('stock')
      .withIndex('by_product', (q) => q.eq('productId', args.productId))
      .collect();

    return {
      productId: args.productId,
      productName: product.name,
      currentStock: product.stock,
      reorderLevel: stockRecords.length > 0 ? stockRecords[0].reorderLevel : 10,
      lastRestockDate:
        stockRecords.length > 0
          ? stockRecords[0].lastRestockDate
          : product.createdAt,
      restockHistory:
        stockRecords.length > 0 ? stockRecords[0].restockHistory : [],
    };
  },
});
