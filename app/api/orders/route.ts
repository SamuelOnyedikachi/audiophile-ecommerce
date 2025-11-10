// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    // Fetch the order using Convex
    const order = await convex.query(api.orders.getOrder, {
      orderId: orderId as any,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Remove _id from order to avoid duplicate
    const { _id, ...rest } = order;

    return NextResponse.json({ _id: orderId, ...rest });
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
