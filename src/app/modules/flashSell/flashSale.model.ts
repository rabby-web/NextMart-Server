import { Schema, model } from "mongoose";
import { IFlashSale } from "./flashSale.interface";

const flashSaleSchema = new Schema<IFlashSale>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: 0,
      max: 100,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
  },
  { timestamps: true }
);

export const FlashSale = model<IFlashSale>("FlashSale", flashSaleSchema);
