import { toast } from 'react-toastify';

export const useToast = () => {
  const success = (message: string) => {
    console.log('✅ Success:', message);
    toast.success(message);
  };

  const error = (message: string, error?: Error | unknown) => {
    console.error('❌ Error:', message, error);
    toast.error(message);
  };

  const warning = (message: string) => {
    console.warn(' Warning:', message);
    toast.warning(message);
  };

  const info = (message: string) => {
    console.info('ℹ️ Info:', message);
    toast.info(message);
  };

  return { success, error, warning, info };
};
