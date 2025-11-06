// import { NextResponse } from 'next/server';
// import { ConvexHttpClient } from 'convex/browser';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const orderId = url.searchParams.get('orderId');

//     if (!orderId)
//       return NextResponse.json({ error: 'orderId required' }, { status: 400 });

//     const order = await convex.get(orderId);
//     return NextResponse.json(order);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'server error' }, { status: 500 });
//   }
// }
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

    // Use the Convex query to fetch the order
    const order = await convex.query(api.orders.getOrder, {
      orderId: orderId as any,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ _id: orderId, ...order });
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}