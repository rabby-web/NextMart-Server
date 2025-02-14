import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtPayload } from '../auth/auth.interface';
import { BrandService } from './brand.service';

const createBrand = catchAsync(async (req: Request, res: Response) => {
   const result = await BrandService.createBrand(
      req.body,
      req.file as IImageFile,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Brand created successfully',
      data: result,
   });
});

const getAllBrand = catchAsync(async (req, res) => {
   const result = await BrandService.getAllBrand(req.query);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Brands are retrieved successfully',
      meta: result.meta,
      data: result.result,
   });
});

const updateBrand = catchAsync(async (req, res) => {
   const { id } = req.params;
   const result = await BrandService.updateBrandIntoDB(
      id,
      req.body,
      req.file as IImageFile,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Brand is updated successfully',
      data: result,
   });
});

const deleteBrand = catchAsync(async (req, res) => {
   const { id } = req.params;
   const result = await BrandService.deleteBrandIntoDB(
      id,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Brand is deleted successfully',
      data: result,
   });
});

export const BrandController = {
   createBrand,
   getAllBrand,
   updateBrand,
   deleteBrand
};
