import { Types } from "mongoose";

export interface IFlashSale {
  product: Types.ObjectId;
  discountPercentage: number;
  createdBy?: Types.ObjectId
}

export interface ICreateFlashSaleInput {
  products: string[];
  discountPercentage: number;
}