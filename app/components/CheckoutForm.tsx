'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'react-toastify';

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    { id: 'gtb', name: 'Guaranty Trust Bank (GTB)', code: '044' },
    { id: 'access', name: 'Access Bank', code: '044' },
    { id: 'firstbank', name: 'First Bank', code: '011' },
    { id: 'zenith', name: 'Zenith Bank', code: '057' },
    { id: 'uba', name: 'United Bank for Africa (UBA)', code: '033' },
    { id: 'stanbic', name: 'Stanbic IBTC', code: '221' },
    { id: 'opay', name: 'Opay', code: '999992' },
    { id: 'palmpay', name: 'Palmpay', code: '999999' },
    { id: 'moniepoint', name: 'Moniepoint', code: '50150' },
  ];

  const shipping = subtotal > 0 ? 1000 : 0;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + taxes;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
      newErrors.zipcode = 'Invalid zip code (e.g., 12345 or 12345-6789)';
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      const msg = '🛒 Add items to your cart to proceed with checkout.';
      console.error(' Checkout Error:', msg);
      toast.warning(msg);
      return;
    }

    if (!validateForm()) {
      const msg = 'Please complete all required fields to continue.';
      console.error('❌ Form Validation Error:', msg);
      toast.warning(msg);
      return;
    }

    // Validate payment method specific requirements
    if (
      paymentMethod === 'credit-card' &&
      (!cardDetails.cardName ||
        !cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvc)
    ) {
      const msg = 'Please fill in all card details to continue.';
      console.error('Card Details Error:', msg);
      toast.warning(msg);
      return;
    }

    if (paymentMethod === 'bank-transfer' && !selectedBank) {
      const msg = '🏦 Please select a bank to continue.';
      console.error('❌ Bank Selection Error:', msg);
      toast.warning(msg);
      return;
    }

    setSubmitting(true);

    try {
      // Create order in Convex
      const order = await createOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          zipcode: formData.zipcode,
          country: formData.country,
        },
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          qty: it.qty,
        })),
        totals: {
          subtotal,
          shipping,
          taxes,
          total,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Log payment method info for reference
      console.log('💳 Payment Method:', paymentMethod);
      if (paymentMethod === 'credit-card') {
        console.log('💳 Card last 4:', cardDetails.cardNumber.slice(-4));
      }
      if (paymentMethod === 'bank-transfer') {
        console.log('🏦 Bank:', selectedBank);
      }

      // Send confirmation email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      // Clear cart
      clear();

      console.log('✅ Order created successfully:', order._id);
      toast.success(
        ' Order placed successfully! Preparing your confirmation...'
      );

      // Redirect to confirmation page
      router.push(`/confirmation?orderId=${order._id}`);
    } catch (error) {
      console.error(' Checkout error:', error);
      toast.warning(' Please review your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Add some products to your cart before checking out.
        </p>
        <a href="/" className="btn inline-block">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
            Billing Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 202-555-0123"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 uppercase tracking-wider">
              Shipping Info
            </h3>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 Main St"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* City & Zip Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                    errors.zipcode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10001"
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="United States"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4 uppercase tracking-wider">
              Payment Method
            </h3>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d87d4a] transition">
                <input
                  type="radio"
                  name="payment"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#d87d4a] cursor-pointer"
                />
                <span className="ml-3 font-semibold">💳 Credit Card</span>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d87d4a] transition">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#d87d4a] cursor-pointer"
                />
                <span className="ml-3 font-semibold">💵 Cash on Delivery</span>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d87d4a] transition">
                <input
                  type="radio"
                  name="payment"
                  value="bank-transfer"
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#d87d4a] cursor-pointer"
                />
                <span className="ml-3 font-semibold">🏦 Bank Transfer</span>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d87d4a] transition">
                <input
                  type="radio"
                  name="payment"
                  value="USSD"
                  checked={paymentMethod === 'USSD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#d87d4a] cursor-pointer"
                />
                <span className="ml-3 font-semibold">📱 USSD</span>
              </label>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit-card' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <p className="text-sm text-blue-800 font-semibold">
                  💳 Card Details
                </p>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      // Format as XXXX XXXX XXXX XXXX
                      value = value.replace(/(\d{4})/g, '$1 ').trim();
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: value,
                      });
                    }}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] font-mono"
                  />
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardDetails({
                          ...cardDetails,
                          expiryDate: value,
                        });
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      CVC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setCardDetails({
                          ...cardDetails,
                          cvc: value.slice(0, 4),
                        });
                      }}
                      placeholder="123"
                      maxLength={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] font-mono"
                    />
                  </div>
                </div>

                <p className="text-xs text-blue-700 mt-3">
                  ℹ️ <strong>Demo Mode:</strong> Test card: 4242 4242 4242 4242
                  with any future date and CVC.
                </p>
              </div>
            )}

            {/* Bank Transfer Options */}
            {paymentMethod === 'bank-transfer' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                <p className="text-sm text-green-800 font-semibold">
                  🏦 Select Your Bank
                </p>

                <div className="space-y-2">
                  {banks.map((bank) => (
                    <label
                      key={bank.id}
                      className="flex items-center p-3 border border-green-300 rounded-lg cursor-pointer hover:bg-green-100 transition"
                    >
                      <input
                        type="radio"
                        name="bank"
                        value={bank.id}
                        checked={selectedBank === bank.id}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-4 h-4 text-[#d87d4a]"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-sm">{bank.name}</p>
                        <p className="text-xs text-gray-600">
                          Sort Code: {bank.code}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-white p-3 rounded border border-green-300 mt-4">
                  <p className="text-xs text-gray-700">
                    💡 <strong>Note:</strong> After completing this order, you
                    will receive transfer details for the selected bank.
                  </p>
                </div>
              </div>
            )}

            {/* Cash on Delivery Info */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💵 <strong>Cash on Delivery:</strong> You will pay the amount
                  when the package is delivered to you.
                </p>
              </div>
            )}

            {/* USSD Info */}
            {paymentMethod === 'USSD' && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  📱 <strong>USSD Payment:</strong> Dial the USSD code provided
                  after order confirmation to complete your payment.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#d87d4a] text-white py-4 rounded-lg font-semibold uppercase tracking-widest hover:bg-[#fbaf85] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {submitting ? 'Processing...' : 'Continue & Pay'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
            Summary
          </h2>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-gray-500 text-sm">x{item.qty}</p>
                </div>
                <p className="font-semibold">
                  ₦{(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes (7%)</span>
              <span className="font-semibold">${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Grand Total</span>
              <span className="text-[#d87d4a]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
