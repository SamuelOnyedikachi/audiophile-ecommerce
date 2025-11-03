'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmationPage() {
  const params = useSearchParams();
  const orderId = params?.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const res = await fetch(
        `/api/orders?orderId=${encodeURIComponent(orderId)}`
      );
      if (res.ok) setOrder(await res.json());
    }
    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="py-20 text-center">Loading order...</div>;

  return (
    <section className="py-12 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Thank you, {order.customer?.name}
      </h2>
      <p className="text-gray-600 mb-6">
        Your order <strong>{order._id}</strong> was placed successfully.
      </p>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Shipping</h3>
        <p>
          {order.shipping?.address}, {order.shipping?.city}{' '}
          {order.shipping?.zipcode}
        </p>
        <h3 className="font-semibold mt-4 mb-2">Items</h3>
        <ul className="divide-y">
          {order.items.map((it: any) => (
            <li key={it.id} className="py-2 flex justify-between">
              <span>
                {it.name} x {it.qty}
              </span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${order.totals.total.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
