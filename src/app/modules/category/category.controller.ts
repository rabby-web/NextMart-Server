import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CategoryService } from './category.service';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../user/user.interface';
import { IJwtPayload } from '../auth/auth.interface';

const createCategory = catchAsync(async (req: Request, res: Response) => {

  const result = await CategoryService.createCategory(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category created succesfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategoryIntoDB(
    id,
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category is updated succesfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategoryIntoDB(
    id,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category is deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
}
