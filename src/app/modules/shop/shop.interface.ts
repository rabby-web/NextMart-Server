import { Schema } from "mongoose";

export interface IShop extends Document {
  shopName: string;
  businessLicenseNumber: string;
  address: string;
  contactNumber: string;
  website?: string;
  user?: Schema.Types.ObjectId;
  servicesOffered: string[];
  ratings?: number;
  establishedYear: number;
  socialMediaLinks?: Map<string, string>;
  taxIdentificationNumber: string;
  logo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}