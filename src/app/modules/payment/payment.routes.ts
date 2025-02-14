import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

// Define routes
router.get('/', paymentController.getAll);

export default router;
