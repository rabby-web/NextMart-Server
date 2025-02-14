import { IUser } from "../user/user.interface";

export interface ICustomer extends Document {
  phoneNo?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  address?: string;
  photo?: string; // Assuming the photo is stored as a URL or path
  user?: IUser['_id'];
}
