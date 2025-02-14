import { Schema, model } from "mongoose";
import { IBrand } from "./brand.interface";

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "Brand logo URL is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Brand = model<IBrand>("Brand", brandSchema);
