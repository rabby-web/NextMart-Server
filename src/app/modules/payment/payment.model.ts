import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    method: {
      type: String,
      enum: ['COD', 'Online'],
      required: true,
      default: 'Online',
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      required: true,
      default: 'Pending',
    },
    transactionId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
