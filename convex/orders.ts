// convex/orders.ts
import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';

export default mutation(async ({ db }, order) => {
  const id = await db.insert('orders', order);
  const saved = await db.get(id);
  return saved;
});
