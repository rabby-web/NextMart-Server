/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'API Not Found !!',
        error: '',
    });
};

export default notFound;