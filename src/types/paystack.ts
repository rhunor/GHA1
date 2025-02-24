// types/paystack.ts

export interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    callback?: (response: PaystackResponse) => void;
    onClose?: () => void;
    metadata?: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
  }
  
  export interface PaystackResponse {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
    redirecturl?: string;
  }
  
  declare global {
    interface Window {
      PaystackPop: {
        setup(config: PaystackConfig): {
          openIframe(): void;
        };
      };
    }
  }