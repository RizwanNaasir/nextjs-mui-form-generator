export type FormStatus = 'completed' | 'pending' | 'failed';

export interface CryptoOrder {
  id: string;
  status: FormStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  sourceDesc: string;
  amountCrypto: number;
  amount: number;
  cryptoCurrency: string;
  currency: string;
}
