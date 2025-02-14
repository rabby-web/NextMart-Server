import { Router } from 'express';
import { MetaController } from './meta.controller';

const router = Router();

router.get('/', MetaController.getMetaData);
router.get('/orders', MetaController.getOrdersByDate);

export const MetaRoutes = router;
