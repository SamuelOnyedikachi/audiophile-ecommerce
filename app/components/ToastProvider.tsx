'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={true}
      draggable={false}
      pauseOnHover={true}
      theme="dark"
      toastClassName="!bg-gray-900 !text-white !rounded-xl !shadow-xl border border-gray-700"
      progressClassName="!bg-orange-500"
      style={{
        zIndex: 9999,
      }}
    />
  );
}
