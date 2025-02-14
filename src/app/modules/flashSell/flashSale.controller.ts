import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { FlashSaleService } from "./flashSale.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";

const createFlashSale = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleService.createFlashSale(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Flash Sale created succesfully',
    data: result,
  });
});

const getActiveFlashSalesService = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleService.getActiveFlashSalesService(
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash Sale created succesfully',
    meta: result.meta,
    data: result.result
  });
});

export const FlashSaleController = {
  createFlashSale,
  getActiveFlashSalesService
}