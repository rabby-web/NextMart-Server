import { Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId;
  isActive: boolean;
  createdBy: Types.ObjectId;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}