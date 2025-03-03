// types/paystack.ts

export interface PaystackResponse {
  reference: string;
  status: string;
  message: string;
  transaction?: string;
  trxref?: string;
}

export interface PaystackMetadataField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaystackMetadata {
  custom_fields: PaystackMetadataField[];
}

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata: PaystackMetadata;
  onClose: () => void;
  callback: (response: PaystackResponse) => void;
}