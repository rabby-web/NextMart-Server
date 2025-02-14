import { Router } from 'express';
import { FlashSaleController } from './flashSale.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';

const router = Router();

router.get('/', FlashSaleController.getActiveFlashSalesService)

router.post(
    '/',
    auth(UserRole.USER),
    FlashSaleController.createFlashSale
)

export const FlashSaleRoutes = router;
