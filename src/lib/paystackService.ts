// lib/paystackService.ts
import { PaystackConfig } from '../types/paystack';
//PaystackResponse
export const generateReference = (): string => {
  const prefix = 'GHA_';
  const uniqueId = Math.floor(Math.random() * 1000000000) + Date.now();
  return `${prefix}${uniqueId}`;
};

export const extractPrice = (priceString: string): number => {
  const match = priceString.match(/₦([\d,]+)/);
  if (match && match[1]) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 100000; // Default fallback
};

export const calculateTotalAmount = (
  pricePerNight: number, 
  checkIn: string, 
  checkOut: string
): number => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  // Calculate number of nights
  const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate total amount
  return pricePerNight * nights;
};

export const initializePaystack = (config: PaystackConfig): { openIframe: () => void } => {
  // Ensure PaystackPop is available
  if (typeof window !== 'undefined' && window.PaystackPop) {
    return window.PaystackPop.setup(config);
  } else {
    console.error('Paystack not loaded correctly');
    return {
      openIframe: () => {
        alert('Paystack payment service is not available at the moment. Please try again later.');
      }
    };
  }
};