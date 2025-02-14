import { Types, Document } from 'mongoose';
import { IPayment } from '../payment/payment.interface';

export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  color: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  shop: Types.ObjectId;
  products: IOrderProduct[];
  coupon: Types.ObjectId | null;
  totalAmount: number;
  discount: number;
  deliveryCharge: number;
  finalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  shippingAddress: string;
  paymentMethod: 'Cash' | 'Card' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt?: Date;
  updatedAt?: Date;
  payment?: IPayment | null;
}
