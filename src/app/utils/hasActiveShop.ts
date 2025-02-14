import { StatusCodes } from "http-status-codes";
import AppError from "../errors/appError";
import User from "../modules/user/user.model";
import Shop from "../modules/shop/shop.model";


export const hasActiveShop = async (userId: string) => {
    const isUserExists = await User.checkUserExist(userId);
    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!isUserExists.hasShop) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You don't have a shop!");
    }

    const shop = await Shop.findOne({ user: isUserExists._id }).select('isActive');
    if (!shop) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Shop does not exist!');
    }
    if (!shop.isActive) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Your shop is not active!');
    }

    return shop;
};
