'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import Link from 'next/link';

export default function Cart({
  setCartOpen,
}: {
  setCartOpen: (v: boolean) => void;
}) {
  const { items, remove, updateQty, subtotal, clear } = useCart();
  const shipping = subtotal > 0 ? 25 : 0;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + taxes;

  return (
    <aside className="fixed right-30 top-30 h-[70%] rounded-xl w-full md:w-96 bg-[#ffffff] shadow-lg z-50 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <button onClick={() => setCartOpen(false)} className="text-gray-600">
          Close
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block text-orange-600">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  {it.image && (
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{it.name}</p>
                    <p className="font-semibold">
                      ${(it.price * it.qty).toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={it.qty}
                      min={1}
                      onChange={(e) => updateQty(it.id, Number(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                    <button
                      onClick={() => remove(it.id)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block text-center bg-orange-600 text-white py-3 rounded"
            >
              Checkout
            </Link>

            <button
              onClick={() => clear()}
              className="mt-4 block w-full text-center text-sm text-gray-600"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
