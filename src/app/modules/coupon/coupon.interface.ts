import { Document } from 'mongoose';

export interface ICoupon extends Document {
   code: string;
   discountType: 'Flat' | 'Percentage';
   discountValue: number;
   maxDiscountAmount?: number;
   startDate: Date;
   endDate: Date;
   minOrderAmount: number;
   isActive: boolean;
   isDeleted: boolean;
}
