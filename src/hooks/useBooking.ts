// hooks/useBooking.ts
import { useState } from 'react';
import { PaystackResponse } from '@/types/paystack';
import { 
  generateReference, 
  extractPrice, 
  calculateTotalAmount, 
  initializePaystack 
} from '@/lib/paystackService';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface Property {
  id: number;
  title: string;
  price: string;
  // Add other property fields as needed
}

interface UseBookingReturn {
  formData: BookingFormData;
  isLoading: boolean;
  paymentSuccess: { reference: string } | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePaystackCheckout: (e: React.FormEvent) => Promise<void>;
  resetBookingState: () => void;
}

export const useBooking = (property: Property): UseBookingReturn => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{ reference: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const verifyTransaction = async (reference: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/paystack/verify/${reference}`);
      const data = await response.json();
      
      if (data.status && data.data.status === 'success') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  };

  const handlePaystackCheckout = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create unique reference for this transaction
      const reference = generateReference();
      
      // Calculate price from string (e.g. "₦200,000/night")
      const price = extractPrice(property.price);
      
      // Calculate total amount based on nights
      const totalAmount = calculateTotalAmount(
        price,
        formData.checkIn,
        formData.checkOut
      );
      
      // Initialize Paystack checkout
      const paystackConfig = {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: formData.email,
        amount: totalAmount * 100, // Paystack amount is in kobo (multiply by 100)
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Guest Name",
              variable_name: "guest_name",
              value: formData.name
            },
            {
              display_name: "Check In",
              variable_name: "check_in",
              value: formData.checkIn
            },
            {
              display_name: "Check Out",
              variable_name: "check_out",
              value: formData.checkOut
            },
            {
              display_name: "Number of Guests",
              variable_name: "guests",
              value: formData.guests.toString()
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: formData.phone
            },
            {
              display_name: "Property",
              variable_name: "property",
              value: property.title
            }
          ]
        },
        onClose: function() {
          setIsLoading(false);
          console.log('Payment window closed');
        },
        callback: async function(response: PaystackResponse) {
          console.log('Payment complete! Reference: ' + response.reference);
          
          // Verify the transaction
          const isVerified = await verifyTransaction(response.reference);
          
          if (isVerified) {
            setPaymentSuccess({ reference: response.reference });
            
            // Here you would typically save the booking to your database
            try {
              // Example of saving booking data to your backend
              await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  propertyId: property.id,
                  reference: response.reference,
                  ...formData,
                  paymentStatus: 'completed',
                }),
              });
            } catch (error) {
              console.error('Error saving booking:', error);
            }
            
            // Reset form
            setFormData({
              name: '',
              email: '',
              phone: '',
              checkIn: '',
              checkOut: '',
              guests: 1
            });
          } else {
            alert('Payment verification failed. Please contact support with reference: ' + response.reference);
          }
          
          setIsLoading(false);
        }
      };
      
      const handler = initializePaystack(paystackConfig);
      handler.openIframe();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setIsLoading(false);
      alert('An error occurred while initiating payment. Please try again.');
    }
  };

  const resetBookingState = () => {
    setPaymentSuccess(null);
    setIsLoading(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 1
    });
  };

  return {
    formData,
    isLoading,
    paymentSuccess,
    handleInputChange,
    handlePaystackCheckout,
    resetBookingState
  };
};