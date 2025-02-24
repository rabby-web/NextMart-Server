import { Document, Types } from 'mongoose';

export interface ICoupon extends Document {
   code: string;
   shop: Types.ObjectId;
   discountType: 'Flat' | 'Percentage';
   discountValue: number;
   maxDiscountAmount?: number;
   startDate: Date;
   endDate: Date;
   minOrderAmount: number;
   isActive: boolean;
   isDeleted: boolean;
}
