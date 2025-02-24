import { IUser, UserRole } from './user.interface';
import User from './user.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';
import Customer from '../customer/customer.model';
import mongoose from 'mongoose';
import { IImageFile } from '../../interface/IImageFile';
import { AuthService } from '../auth/auth.service';
import { ICustomer } from '../customer/customer.interface';
import { IJwtPayload } from '../auth/auth.interface';

// Function to register user
const registerUser = async (userData: IUser) => {
   const session = await mongoose.startSession();

   try {
      session.startTransaction();

      if ([UserRole.ADMIN].includes(userData.role)) {
         throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid role. Only User is allowed.');
      }

      // Check if the user already exists by email
      const existingUser = await User.findOne({ email: userData.email }).session(session);
      if (existingUser) {
         throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
      }

      // Create the user
      const user = new User(userData);
      const createdUser = await user.save({ session });

      const profile = new Customer({
         user: createdUser._id,
      });

      await profile.save({ session });

      await session.commitTransaction();

      return await AuthService.loginUser({ email: createdUser.email, password: userData.password, clientInfo: userData.clientInfo });
   } catch (error) {
      if (session.inTransaction()) {
         await session.abortTransaction();
      }
      throw error;
   } finally {
      session.endSession();
   }
};



const getAllUser = async (query: Record<string, unknown>) => {
   const UserQuery = new QueryBuilder(User.find(), query)
      .search(UserSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await UserQuery.modelQuery;
   const meta = await UserQuery.countTotal();
   return {
      result,
      meta,
   };
};

const myProfile = async (authUser: IJwtPayload) => {
   const isUserExists = await User.findById(authUser.userId);
   if (!isUserExists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
   }
   if (!isUserExists.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
   }

   const profile = await Customer.findOne({ user: isUserExists._id });


   return {
      ...isUserExists.toObject(),
      profile: profile || null
   }

}

const updateProfile = async (
   payload: Partial<ICustomer>,
   file: IImageFile,
   authUser: IJwtPayload
) => {
   const isUserExists = await User.findById(authUser.userId);

   if (!isUserExists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
   }
   if (!isUserExists.isActive) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
   }

   if (file && file.path) {
      payload.photo = file.path;
   }

   const result = await Customer.findOneAndUpdate(
      { user: authUser.userId },
      payload,
      {
         new: true,
      }
   ).populate('user');

   return result;
};

const updateUserStatus = async (userId: string) => {
   const user = await User.findById(userId);

   console.log('comes here');
   if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
   }

   user.isActive = !user.isActive;
   const updatedUser = await user.save();
   return updatedUser;
};

export const UserServices = {
   registerUser,
   getAllUser,
   myProfile,
   updateUserStatus,
   updateProfile,
};
