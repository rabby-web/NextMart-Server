import { Types } from 'mongoose';

export interface IPayment {
  user: Types.ObjectId;
  order: Types.ObjectId;
  shop: Types.ObjectId;
  method: 'COD' | 'Online';
  status: 'Pending' | 'Paid' | 'Failed';
  transactionId?: string;
  amount: number;
  gatewayResponse?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
