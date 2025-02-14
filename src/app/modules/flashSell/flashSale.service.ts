import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IJwtPayload } from "../auth/auth.interface";
import { ICreateFlashSaleInput, IFlashSale } from "./flashSale.interface";
import { FlashSale } from "./flashSale.model";
import User from "../user/user.model";
import Shop from "../shop/shop.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Product } from "../product/product.model";


const createFlashSale = async (flashSellData: ICreateFlashSaleInput, authUser: IJwtPayload) => {
  const userHasShop = await User.findById(authUser.userId).select('isActive hasShop');

  if (!userHasShop) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  if (!userHasShop.isActive) throw new AppError(StatusCodes.BAD_REQUEST, "User account is not active!");
  if (!userHasShop.hasShop) throw new AppError(StatusCodes.BAD_REQUEST, "User does not have any shop!");

  const shopIsActive = await Shop.findOne({
    user: userHasShop._id,
    isActive: true
  }).select("isActive");

  if (!shopIsActive) throw new AppError(StatusCodes.BAD_REQUEST, "Shop is not active!");

  const { products, discountPercentage } = flashSellData;
  const createdBy = authUser.userId;

  const operations = products.map((product) => ({
    updateOne: {
      filter: { product },
      update: {
        $setOnInsert: {
          product,
          discountPercentage,
          createdBy,
        },
      },
      upsert: true,
    },
  }));

  const result = await FlashSale.bulkWrite(operations);
  return result;
};

const getActiveFlashSalesService = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...pQuery } = query;

  const flashSaleQuery = new QueryBuilder(
    FlashSale.find()
      .populate('product')
      .populate('product.category', 'name')
      .populate('product.shop', 'shopName')
      .populate('product.brand', 'name'),
    query
  )
    .paginate();

  const flashSales = await flashSaleQuery.modelQuery.lean();

  const flashSaleMap = flashSales.reduce((acc, flashSale) => {
    //@ts-ignore
    acc[flashSale.product._id.toString()] = flashSale.discountPercentage;
    return acc;
  }, {});

  const productsWithOfferPrice = flashSales.map((flashSale: any) => {
    const product = flashSale.product;
    //@ts-ignore
    const discountPercentage = flashSaleMap[product._id.toString()];

    if (discountPercentage) {
      const discount = (discountPercentage / 100) * product.price;
      product.offerPrice = product.price - discount;
    } else {
      product.offerPrice = null;
    }

    return product;
  });

  const meta = await flashSaleQuery.countTotal();

  return {
    meta,
    result: productsWithOfferPrice,
  };
};



export const FlashSaleService = {
  createFlashSale,
  getActiveFlashSalesService
}