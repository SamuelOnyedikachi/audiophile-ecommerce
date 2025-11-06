
// 'use client';

// import { useState } from 'react';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import Link from 'next/link';
// import { PackageSearch, MapPin, Truck, CheckCircle } from 'lucide-react';

// export default function TrackOrderPage() {
//   const [searchEmail, setSearchEmail] = useState('');
//   const [emailInput, setEmailInput] = useState('');

//   const orders = useQuery(
//     api.orders.getOrdersByEmail,
//     searchEmail ? { email: searchEmail } : 'skip'
//   );

//   const confirmDelivery = useMutation(api.orders.confirmDelivery);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearchEmail(emailInput.trim());
//   };

//   const handleConfirmDelivery = async (orderId: string) => {
//     try {
//       await confirmDelivery({ orderId });
//       alert('✅ Delivery confirmed successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('❌ Failed to confirm delivery.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#121212] text-white px-6 py-10">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-2 tracking-wide">
//           Track Your Order
//         </h1>
//         <p className="text-center text-gray-400 mb-10">
//           Enter your email address to view all your recent orders and their
//           tracking details.
//         </p>

//         {/* Email Search */}
//         <form
//           onSubmit={handleSearch}
//           className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto mb-10"
//         >
//           <input
//             type="email"
//             required
//             placeholder="Enter your email"
//             value={emailInput}
//             onChange={(e) => setEmailInput(e.target.value)}
//             className="flex-1 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
//           />
//           <button
//             type="submit"
//             className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto"
//           >
//             Search
//           </button>
//         </form>

//         {/* State Messages */}
//         {!searchEmail && (
//           <p className="text-gray-500 text-center">
//             Enter your email to see your orders.
//           </p>
//         )}
//         {searchEmail && !orders && (
//           <p className="text-gray-400 text-center">Fetching your orders...</p>
//         )}
//         {searchEmail && orders?.length === 0 && (
//           <p className="text-gray-500 text-center">
//             No orders found for <strong>{searchEmail}</strong>.
//           </p>
//         )}

//         {/* Orders */}
//         <div className="grid md:grid-cols-2 gap-6 mt-8">
//           {orders?.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1A1A1A]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all shadow-lg"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="font-semibold text-lg">
//                   Order <span className="text-orange-400">#{order._id}</span>
//                 </h2>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
//                     order.status === 'delivered'
//                       ? 'bg-green-500/20 text-green-400'
//                       : order.status === 'cancelled'
//                         ? 'bg-red-500/20 text-red-400'
//                         : 'bg-yellow-500/20 text-yellow-400'
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               {/* Items */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-400 mb-2">
//                   Items in your order:
//                 </p>
//                 <ul className="space-y-1 text-gray-300 text-sm">
//                   {order.items.map((item: any) => (
//                     <li
//                       key={item.id}
//                       className="flex justify-between border-b border-white/5 pb-1"
//                     >
//                       <span>
//                         {item.name} × {item.qty}
//                       </span>
//                       <span className="font-semibold">
//                         ₦{item.price.toLocaleString()}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Tracking */}
//               <div className="border-t border-white/10 pt-4 mt-3">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Truck className="text-orange-500" size={18} />
//                   <p className="font-semibold text-gray-200">Tracking Info</p>
//                 </div>

//                 <div className="text-sm text-gray-400 space-y-1 ml-6">
//                   <p>
//                     <strong>Carrier:</strong>{' '}
//                     {order.tracking?.carrier || 'Not assigned'}
//                   </p>
//                   <p>
//                     <strong>Current Location:</strong>{' '}
//                     {order.tracking?.currentLocation || '—'}
//                   </p>
//                   <p>
//                     <strong>Estimated Delivery:</strong>{' '}
//                     {order.tracking?.estimatedDelivery || '—'}
//                   </p>
//                 </div>

//                 {order.tracking?.history &&
//                   order.tracking.history.length > 0 && (
//                     <div className="mt-3 ml-6 border-l border-gray-700 pl-3 space-y-2">
//                       {order.tracking.history.map((step: any, i: number) => (
//                         <div key={i} className="text-sm text-gray-400">
//                           <div className="flex items-center gap-2">
//                             <MapPin size={14} className="text-orange-500" />
//                             <span className="text-gray-300 font-medium">
//                               {step.status}
//                             </span>
//                           </div>
//                           <p className="ml-6 text-xs">
//                             {step.location} •{' '}
//                             {new Date(step.timestamp).toLocaleString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//               </div>

//               {/* Buttons */}
//               <div className="mt-5 flex gap-3">
//                 {!order.deliveryConfirmed && order.status === 'delivered' && (
//                   <button
//                     onClick={() => handleConfirmDelivery(order._id)}
//                     className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
//                   >
//                     <CheckCircle size={16} /> Confirm Delivery
//                   </button>
//                 )}

//                 {order.deliveryConfirmed && (
//                   <Link
//                     href={`/review/${order._id}`}
//                     className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
//                   >
//                     <PackageSearch size={16} /> Leave a Review
//                   </Link>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { PackageSearch, MapPin, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const orders = useQuery(
    api.orders.getOrdersByEmail,
    searchEmail ? { email: searchEmail } : 'skip'
  );

  const confirmDelivery = useMutation(api.orders.confirmDelivery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchEmail(emailInput.trim());
  };

  const handleConfirmDelivery = async (orderId: string) => {
    try {
      await confirmDelivery({ orderId });
      alert('✅ Delivery confirmed successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to confirm delivery.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 tracking-wide">
          Track Your Order
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Enter your email address to view all your recent orders and their
          tracking details.
        </p>

        {/* Email Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto mb-10"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        {/* State Messages */}
        {!searchEmail && (
          <p className="text-gray-500 text-center">
            Enter your email to see your orders.
          </p>
        )}
        {searchEmail && !orders && (
          <p className="text-gray-400 text-center">Fetching your orders...</p>
        )}
        {searchEmail && orders?.length === 0 && (
          <p className="text-gray-500 text-center">
            No orders found for <strong>{searchEmail}</strong>.
          </p>
        )}

        {/* Orders */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="bg-[#1A1A1A]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-semibold text-lg">
                  Order <span className="text-orange-400">#{order._id}</span>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                    order.status === 'delivered'
                      ? 'bg-green-500/20 text-green-400'
                      : order.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Items in your order:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b border-white/5 pb-1"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-semibold">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tracking */}
              <div className="border-t border-white/10 pt-4 mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="text-orange-500" size={18} />
                  <p className="font-semibold text-gray-200">Tracking Info</p>
                </div>

                <div className="text-sm text-gray-400 space-y-1 ml-6">
                  <p>
                    <strong>Carrier:</strong>{' '}
                    {order.tracking?.carrier || 'Not assigned'}
                  </p>
                  <p>
                    <strong>Current Location:</strong>{' '}
                    {order.tracking?.currentLocation || '—'}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong>{' '}
                    {order.tracking?.estimatedDelivery || '—'}
                  </p>
                </div>

                {order.tracking?.history &&
                  order.tracking.history.length > 0 && (
                    <div className="mt-3 ml-6 border-l border-gray-700 pl-3 space-y-2">
                      {order.tracking.history.map((step: any, i: number) => (
                        <div key={i} className="text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-orange-500" />
                            <span className="text-gray-300 font-medium">
                              {step.status}
                            </span>
                          </div>
                          <p className="ml-6 text-xs">
                            {step.location} •{' '}
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-3">
                {!order.deliveryConfirmed && order.status === 'delivered' && (
                  <button
                    onClick={() => handleConfirmDelivery(order._id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    <CheckCircle size={16} /> Confirm Delivery
                  </button>
                )}

                {order.deliveryConfirmed && (
                  <Link
                    href={`/review/${order._id}`}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    <PackageSearch size={16} /> Leave a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
