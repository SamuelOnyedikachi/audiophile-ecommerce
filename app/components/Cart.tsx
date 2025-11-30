'use client';

import { useCart } from './CartProvider';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Cart({
  setCartOpen,
}: {
  setCartOpen: (v: boolean) => void;
}) {
  const { items, remove, updateQty, subtotal, clear } = useCart();
  const { requireAuth } = useAuthGuard();
  const shipping = subtotal > 0 ? 1000 : 0;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + taxes;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start md:items-center z-50 p-4">
      <aside className="relative w-full sm:w-[90%] md:w-[400px] bg-white rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button
            onClick={() => setCartOpen(false)}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            ✕
          </button>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link
              href="/"
              className="inline-block text-orange-600 font-medium hover:underline"
              onClick={() => setCartOpen(false)}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ul className="space-y-4">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-4 border-b pb-4 last:border-none"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
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
                      <p className="font-medium text-gray-800">{it.name}</p>
                      <p className="font-semibold text-gray-900">
                        ₦{(it.price * it.qty).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        value={it.qty}
                        min={1}
                        onChange={(e) =>
                          updateQty(it.id, Number(e.target.value))
                        }
                        className="w-16 p-1 text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => remove(it.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="mt-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₦{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
                <span>Total</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() =>
                  requireAuth(() => setCartOpen(false), '/checkout')
                }
                className="block w-full text-center bg-orange-600 text-white py-3 rounded-md hover:bg-orange-500 transition"
              >
                Checkout
              </button>

              <button
                onClick={() => {
                  console.log('🛒 Clear cart clicked');
                  toast.info('🗑️ Cart cleared');
                  clear();
                }}
                className="block w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
