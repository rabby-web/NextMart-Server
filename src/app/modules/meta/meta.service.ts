import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { Order } from '../order/order.model';
import { IJwtPayload } from '../auth/auth.interface';
import Shop from '../shop/shop.model';
import User from '../user/user.model';
import { Product } from '../product/product.model';
import { Payment } from '../payment/payment.model';


const getMetaData = async (query: Record<string, unknown>, authUser: IJwtPayload) => {
   const { startDate, endDate } = query;

   // For Admin-based meta data
   if (authUser.role === 'admin') {
      const totalShops = await Shop.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();

      const totalRevenue = await Order.aggregate([
         { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]);

      const totalPayments = await Payment.countDocuments();

      const paymentStatusCounts = await Payment.aggregate([
         { $group: { _id: '$status', totalPayments: { $sum: 1 } } },
         { $project: { status: '$_id', totalPayments: 1, _id: 0 } },
      ]);

      // More statistics you can add for admin
      const activeShops = await Shop.countDocuments({ isActive: true });
      const inactiveShops = await Shop.countDocuments({ isActive: false });

      return {
         totalShops,
         totalUsers,
         totalOrders,
         totalProducts,
         totalRevenue: totalRevenue[0]?.totalRevenue || 0,
         totalPayments,
         paymentStatusCounts,
         activeShops,
         inactiveShops
      };
   }

   // For User-based data (when the user has a shop)
   if (authUser.role === 'user') {
      const userShop = await Shop.findOne({ user: authUser.userId });

      if (!userShop) {
         throw new Error('User does not have a valid shop.');
      }

      // Pie chart data
      const pieChartData = await Order.aggregate([
         { $match: { shop: userShop._id } },
         { $group: { _id: '$products.category', total: { $sum: '$totalAmount' } } },
         { $project: { category: '$_id', totalAmount: 1, _id: 0 } },
      ]);

      // Bar chart data (total orders per month)
      const barChartData = await Order.aggregate([
         { $match: { shop: userShop._id } },
         { $group: { _id: { $month: '$createdAt' }, totalOrders: { $sum: 1 } } },
         { $sort: { '_id': 1 } },
         { $project: { month: '$_id', totalOrders: 1, _id: 0 } },
      ]);

      // Line chart data (sales over time)
      const lineChartData = await Order.aggregate([
         { $match: { shop: userShop._id } },
         { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalSales: { $sum: '$totalAmount' } } },
         { $sort: { '_id': 1 } },
         { $project: { date: '$_id', totalSales: 1, _id: 0 } },
      ]);

      // Payment data (filter by start and end date)
      const paymentData = await Payment.aggregate([
         { $match: { shop: userShop._id } },
         ...(
            startDate && endDate
               ? [
                  {
                     $match: {
                        createdAt: {
                           $gte: new Date(startDate as string),
                           $lte: new Date(endDate as string),
                        },
                     },
                  },
               ]
               : []
         ),
         { $group: { _id: '$status', totalPayments: { $sum: 1 } } },
         { $project: { status: '$_id', totalPayments: 1, _id: 0 } },
      ]);


      // Order data (based on shop)
      const orderData = await Order.aggregate([
         { $match: { shop: userShop._id } },
         { $group: { _id: '$status', totalOrders: { $sum: 1 } } },
         { $project: { status: '$_id', totalOrders: 1, _id: 0 } },
      ]);

      // More statistics for user
      const totalOrdersForUser = await Order.countDocuments({ shop: userShop._id });
      const totalRevenueForUser = await Order.aggregate([
         { $match: { shop: userShop._id } },
         { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]);

      // Today's Sales - Filter orders placed today
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const todaysSales = await Order.aggregate([
         { $match: { shop: userShop._id, createdAt: { $gte: startOfDay, $lte: endOfDay } } },
         { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
      ]);

      const todaysSalesAmount = todaysSales[0]?.totalSales || 0;

      return {
         pieChartData,
         barChartData,
         lineChartData,
         paymentData,
         orderData,
         totalOrdersForUser,
         totalRevenueForUser: totalRevenueForUser[0]?.totalRevenue || 0,
         todaysSalesAmount,
      };
   }

   throw new Error('User does not have the required permissions or shop.');
};

export default getMetaData;


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
