import { Document, Model } from 'mongoose';

// Enum for User Roles
export enum UserRole {
   ADMIN = 'admin',
   USER = 'user'
}

// User Schema Definition
export interface IUser extends Document {
   email: string;
   password: string;
   name: string;
   role: UserRole;
   hasShop: boolean;
   clientInfo: {
      device: 'pc' | 'mobile'; // Device type
      browser: string; // Browser name
      ipAddress: string; // User IP address
      pcName?: string; // Optional PC name
      os?: string; // Optional OS name (Windows, MacOS, etc.)
      userAgent?: string; // Optional user agent string
   };
   lastLogin: Date;
   isActive: boolean;
   otpToken?: string | null;
   createdAt: Date;
   updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
   //instance methods for checking if passwords are matched
   isPasswordMatched(
      plainTextPassword: string,
      hashedPassword: string
   ): Promise<boolean>;
   isUserExistsByEmail(id: string): Promise<IUser>;
   checkUserExist(userId: string): Promise<IUser>;
}
