import { Router } from 'express';
import { MetaController } from './meta.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';

const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.USER),
    MetaController.getMetaData
);

export const MetaRoutes = router;
