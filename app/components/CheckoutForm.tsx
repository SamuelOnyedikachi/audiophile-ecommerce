'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from './CartProvider';

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
};

export default function CheckoutForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const createOrder = useMutation(api.orders.createOrder);
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const shipping = subtotal > 0 ? 25 : 0;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + taxes;

  // -------------------- VALIDATION --------------------
  function validate() {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email.';
    if (!form.phone) e.phone = 'Phone is required.';
    else if (!/^\+?[0-9\s-()]{7,}$/.test(form.phone))
      e.phone = 'Invalid phone.';
    if (!form.address) e.address = 'Address is required.';
    if (!form.city) e.city = 'City is required.';
    if (!form.zipcode) e.zipcode = 'ZIP code required.';
    if (!form.country) e.country = 'Country required.';
    if (items.length === 0) e.cart = 'Your cart is empty.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      zipcode: true,
      country: true,
    });

    const order = {
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
      shipping: {
        address: form.address,
        city: form.city,
        zipcode: form.zipcode,
        country: form.country,
      },
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      totals: { subtotal, shipping, taxes, total },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = await createOrder(order);
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: saved._id, order: saved }),
      });

      clear();
      router.push(`/confirmation?orderId=${encodeURIComponent(saved._id)}`);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Something went wrong. Try again.' });
    }
  }

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // -------------------- FORM UI --------------------
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto space-y-10 bg-white p-10 rounded-2xl shadow-lg"
      noValidate
    >
      <h2 className="text-3xl font-bold uppercase tracking-wide text-black mb-6">
        Checkout
      </h2>

      {errors.cart && (
        <div className="text-red-500 font-semibold text-center">
          {errors.cart}
        </div>
      )}

      {/* Billing Details */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold uppercase tracking-wide text-orange-500">
          Billing Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'name', label: 'Name' },
            { id: 'email', label: 'Email Address' },
          ].map(({ id, label }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
              </label>
              <input
                id={id}
                type={id === 'email' ? 'email' : 'text'}
                value={(form as any)[id]}
                onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                onBlur={() => handleBlur(id as keyof FormState)}
                className={`p-3 border rounded-lg w-full focus:outline-none ${
                  touched[id] && errors[id]
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
              />
              {touched[id] && errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onBlur={() => handleBlur('phone')}
            className={`p-3 border rounded-lg w-full focus:outline-none ${
              touched.phone && errors.phone
                ? 'border-red-500'
                : 'border-gray-300 focus:border-orange-500'
            }`}
          />
        </div>
      </section>

      {/* Shipping Info */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold uppercase tracking-wide text-orange-500">
          Shipping Info
        </h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            id="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            onBlur={() => handleBlur('address')}
            className={`p-3 border rounded-lg w-full focus:outline-none ${
              touched.address && errors.address
                ? 'border-red-500'
                : 'border-gray-300 focus:border-orange-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="p-3 border rounded-lg focus:border-orange-500"
          />
          <input
            placeholder="ZIP Code"
            value={form.zipcode}
            onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
            className="p-3 border rounded-lg focus:border-orange-500"
          />
          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="p-3 border rounded-lg focus:border-orange-500"
          />
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gray-50 p-6 rounded-xl space-y-3">
        <h3 className="text-lg font-semibold uppercase tracking-wide">
          Summary
        </h3>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Taxes</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      {errors.submit && (
        <div className="text-red-500 text-center text-sm">{errors.submit}</div>
      )}

      <button
        type="submit"
        disabled={items.length === 0}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wide hover:bg-orange-700 transition-colors disabled:bg-gray-400"
      >
        Continue & Pay
      </button>
    </form>
  );
}
