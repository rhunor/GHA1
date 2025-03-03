// lib/paystackService.ts
import { PaystackConfig } from '../types/paystack';

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
  if (!checkIn || !checkOut) return pricePerNight;
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  // Check for valid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return pricePerNight;
  }
  
  // Calculate number of nights
  const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate total amount
  return pricePerNight * nights;
};

// Modified to handle the PaystackPop global type
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

export const initializePaystack = (config: any): { openIframe: () => void } => {
  // Ensure PaystackPop is available
  if (typeof window !== 'undefined' && window.PaystackPop) {
    try {
      // Make sure config has the right structure
      const paystackConfig = {
        ...config,
        // Ensure callback is a function reference, not a serialized function
        onClose: function() {
          if (typeof config.onClose === 'function') {
            config.onClose();
          }
        },
        callback: function(response: any) {
          if (typeof config.callback === 'function') {
            config.callback(response);
          }
        }
      };
      
      return window.PaystackPop.setup(paystackConfig);
    } catch (error) {
      console.error('Error setting up Paystack:', error);
      return {
        openIframe: () => {
          alert('Paystack payment service encountered an error. Please try again later.');
        }
      };
    }
  } else {
    console.error('Paystack not loaded correctly');
    return {
      openIframe: () => {
        alert('Paystack payment service is not available at the moment. Please try again later.');
      }
    };
  }
};