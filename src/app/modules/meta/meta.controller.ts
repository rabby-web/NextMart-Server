import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { MetaService } from './meta.service';

const getMetaData = catchAsync(async (req: Request, res: Response) => {
   const result = await MetaService.getMetaData();
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Meta data retrieved successfully',
      data: result,
   });
});
const getOrdersByDate = catchAsync(async (req: Request, res: Response) => {
   const { startDate, endDate, groupBy } = req.query;

   const result = await MetaService.getOrdersByDate(
      startDate as string,
      endDate as string,
      groupBy as string
   );
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Meta data for orders retrieved successfully',
      data: result,
   });
});

export const MetaController = {
   getMetaData,
   getOrdersByDate,
};
