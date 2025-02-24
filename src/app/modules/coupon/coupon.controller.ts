import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CouponService } from './coupon.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtPayload } from '../auth/auth.interface';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
   const result = await CouponService.createCoupon(req.body, req.user as IJwtPayload);

   sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Coupon created successfully',
      data: result,
   });
});

const getAllCoupon = catchAsync(async (req: Request, res: Response) => {
   const result = await CouponService.getAllCoupon(req.query);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Coupon fetched successfully',
      data: result,
   });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
   const { couponCode } = req.params;
   const result = await CouponService.updateCoupon(req.body, couponCode);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Coupon updated successfully',
      data: result,
   });
});

const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
   const { couponCode } = req.params;
   const { orderAmount, shopId } = req.body;

   const result = await CouponService.getCouponByCode(orderAmount, couponCode, shopId);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Coupon fetched successfully',
      data: result,
   });
});
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
   const { couponId } = req.params;

   const result = await CouponService.deleteCoupon(couponId);

   res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
      data: null,
   });
});

export const couponController = {
   createCoupon,
   getAllCoupon,
   updateCoupon,
   getCouponByCode,
   deleteCoupon,
};
