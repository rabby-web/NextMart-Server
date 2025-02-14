import { Request, Response } from 'express';
import { paymentService } from './payment.service';

export const paymentController = {
  async getAll(req: Request, res: Response) {
    const data = await paymentService.getAll();
    res.json(data);
  },
};
