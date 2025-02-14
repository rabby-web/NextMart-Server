import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { Order } from '../order/order.model';

const getMetaData = async () => {
   const startOfDay = new Date().setHours(0, 0, 0, 0);
   const endOfDay = new Date().setHours(23, 59, 59, 999);

   const todaysOrders = await Order.aggregate([
      {
         $match: {
            createdAt: {
               $gte: new Date(startOfDay),
               $lte: new Date(endOfDay),
            },
         },
      },
      {
         $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$finalAmount' },
         },
      },
      {
         $project: {
            _id: 0,
            totalOrders: 1,
            totalAmount: 1,
         },
      },
   ]);
   const bestProduct = await Order.aggregate([
      {
         $unwind: '$products',
      },
      {
         $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'productDetails',
         },
      },
      {
         $group: {
            _id: '$productDetails._id',
            count: { $sum: '$products.quantity' },
            productName: { $first: '$productDetails.name' }, // Get the product name
         },
      },
      {
         $sort: {
            count: -1,
         },
      },
      {
         $limit: 1,
      },
      {
         $project: {
            _id: 0,
            productName: 1,
            count: 1,
         },
      },
   ]);

   const bestCategory = await Order.aggregate([
      { $unwind: '$products' },
      {
         $lookup: {
            from: 'products', // Product collection
            localField: 'products.product',
            foreignField: '_id',
            as: 'productDetails',
         },
      },
      { $unwind: '$productDetails' },
      {
         $group: {
            _id: '$productDetails.category',
            orderCount: { $sum: 1 },
         },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 1 },
      {
         $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryDetails',
         },
      },
      { $unwind: '$categoryDetails' },
      {
         $project: {
            _id: 0,
            categoryId: '$_id',
            categoryName: '$categoryDetails.name',
            orderCount: 1,
         },
      },
   ]);

   const bestBrand = await Order.aggregate([
      { $unwind: '$products' },
      {
         $lookup: {
            from: 'products', // Product collection
            localField: 'products.product',
            foreignField: '_id',
            as: 'productDetails',
         },
      },
      { $unwind: '$productDetails' },
      {
         $group: {
            _id: '$productDetails.brand',
            orderCount: { $sum: 1 },
         },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 1 },
      {
         $lookup: {
            from: 'brands',
            localField: '_id',
            foreignField: '_id',
            as: 'brandDetails',
         },
      },
      { $unwind: '$brandDetails' },
      {
         $project: {
            _id: 0,
            brandId: '$_id',
            brandName: '$brandDetails.name',
            orderCount: 1,
         },
      },
   ]);
   const bestShop = await Order.aggregate([
      {
         $group: {
            _id: '$shop',
            orderCount: { $sum: 1 },
         },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 1 },
      {
         $lookup: {
            from: 'shops',
            localField: '_id',
            foreignField: '_id',
            as: 'shopDetails',
         },
      },
      { $unwind: '$shopDetails' },
      {
         $project: {
            _id: 0,
            shopId: '$_id',
            shopName: '$shopDetails.shopName',
            orderCount: 1,
         },
      },
   ]);

   const orderStatuses = await Order.aggregate([
      {
         $group: {
            _id: '$status',
            count: { $sum: 1 },
         },
      },
   ]);

   return {
      todaysOrders,
      bestProduct,
      bestBrand,
      bestCategory,
      bestShop,
      orderStatuses,
   };
};

const getOrdersByDate = async (
   startDate: string,
   endDate?: string,
   groupBy?: string
) => {
   console.log({ startDate });

   if (startDate && !endDate) {
      const orders = await Order.aggregate([
         {
            $group: {
               _id: {
                  date: {
                     $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
               },
               count: { $sum: 1 },
            },
         },
         {
            $match: {
               '_id.date': startDate,
            },
         },
      ]);

      if (orders.length === 0) {
         throw new AppError(
            StatusCodes.NOT_FOUND,
            'No orders found for the given date'
         );
      }

      return orders;
   }

   if (startDate && endDate) {
      const orders = await Order.aggregate([
         {
            $group: {
               _id: {
                  date: {
                     $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
               },
               count: { $sum: 1 },
            },
         },
         {
            $match: {
               '_id.date': {
                  $gte: startDate,
                  $lte: endDate,
               },
            },
         },
      ]);

      if (orders.length === 0) {
         throw new AppError(
            StatusCodes.NOT_FOUND,
            'No orders found for the given date range'
         );
      }

      return orders;
   }

   if (startDate && endDate && groupBy === 'week') {
   }
};

export const MetaService = {
   getMetaData,
   getOrdersByDate,
};
